import { prisma } from "@/lib/prisma";
import type { State } from "@/generated/prisma/client";

type PostType = "job" | "result" | "admission" | "scholarship";

interface DateEvent {
  examName: string;
  conductingBody: string;
  eventDate: Date;
  examType: string;
  description: string;
  officialUrl: string;
  state: State;
  isTentative: boolean;
}

/**
 * Build a marker string we embed in the ExamEvent description so we can
 * find and replace events that came from the same source post.
 */
function sourceMarker(postType: PostType, postId: string, eventKey: string): string {
  return `[src:${postType}:${postId}:${eventKey}]`;
}

/**
 * Delete all ExamEvents that originated from a given source post,
 * then insert fresh ones only if the source post is ACTIVE.
 * This keeps the calendar in sync whenever a post is created, approved, or rejected.
 *
 * - ACTIVE posts   → old events deleted, fresh events created
 * - Non-ACTIVE     → old events deleted, no new events (post hidden from calendar)
 */
export async function syncExamEventsFromPost(
  postType: PostType,
  postId: string,
): Promise<void> {
  // Always remove stale events first (cleanup even for deactivated posts)
  const prefix = `[src:${postType}:${postId}:`;
  await prisma.examEvent.deleteMany({
    where: { description: { startsWith: prefix } },
  });

  // Gather events from the source post (returns [] if post is not ACTIVE)
  const events = await extractEvents(postType, postId);
  if (events.length > 0) {
    await prisma.examEvent.createMany({ data: events });
  }
}

/**
 * One-time full resync: delete ALL auto-generated events, then
 * re-create from every currently ACTIVE post across all 4 types.
 * Use this after deploying the "ACTIVE-only" fix to clear stale data.
 */
export async function resyncAllCalendar(): Promise<{ deleted: number; created: number }> {
  // Step 1: delete ALL events that carry the [src: marker (auto-generated)
  const deleted = await prisma.examEvent.deleteMany({
    where: { description: { startsWith: "[src:" } },
  });

  // Step 2: re-sync every ACTIVE post
  let created = 0;
  const postTypes: PostType[] = ["job", "result", "admission", "scholarship"];

  for (const postType of postTypes) {
    let posts: { id: string }[] = [];

    switch (postType) {
      case "job":
        posts = await prisma.jobPost.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
        break;
      case "result":
        posts = await prisma.resultPost.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
        break;
      case "admission":
        posts = await prisma.admissionPost.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
        break;
      case "scholarship":
        posts = await prisma.scholarshipPost.findMany({ where: { status: "ACTIVE" }, select: { id: true } });
        break;
    }

    for (const post of posts) {
      const events = await extractEvents(postType, post.id);
      if (events.length > 0) {
        await prisma.examEvent.createMany({ data: events });
        created += events.length;
      }
    }
  }

  return { deleted: deleted.count, created };
}

// ── Extractors ───────────────────────────────────────────────────────

async function extractEvents(postType: PostType, postId: string): Promise<DateEvent[]> {
  switch (postType) {
    case "job":
      return extractJobEvents(postId);
    case "result":
      return extractResultEvents(postId);
    case "admission":
      return extractAdmissionEvents(postId);
    case "scholarship":
      return extractScholarshipEvents(postId);
    default:
      return [];
  }
}

async function extractJobEvents(postId: string): Promise<DateEvent[]> {
  const post = await prisma.jobPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      titleEn: true,
      department: true,
      state: true,
      lastDate: true,
      notificationDate: true,
      importantDates: true,
      applicationUrl: true,
      slug: true,
      status: true,
    },
  });
  if (!post) return [];
  // Only generate calendar events for ACTIVE posts
  if (post.status !== "ACTIVE") return [];

  const events: DateEvent[] = [];
  const baseUrl = `/jobs/${post.slug}`;

  // 1. Last application date
  events.push({
    examName: `${post.titleEn} — Last Date`,
    conductingBody: post.department,
    eventDate: post.lastDate,
    examType: "Last Date",
    description: `${sourceMarker("job", post.id, "lastDate")} Last date to apply for ${post.titleEn}. Apply at ${post.applicationUrl}`,
    officialUrl: post.applicationUrl,
    state: post.state,
    isTentative: false,
  });

  // 2. Notification date if available
  if (post.notificationDate) {
    events.push({
      examName: `${post.titleEn} — Notification`,
      conductingBody: post.department,
      eventDate: post.notificationDate,
      examType: "Notification",
      description: `${sourceMarker("job", post.id, "notification")} Notification released for ${post.titleEn}`,
      officialUrl: post.applicationUrl,
      state: post.state,
      isTentative: false,
    });
  }

  // 3. Important dates from JSON array
  if (Array.isArray(post.importantDates)) {
    for (let i = 0; i < post.importantDates.length; i++) {
      const entry = post.importantDates[i] as { label?: string; date?: string };
      if (entry?.date) {
        events.push({
          examName: `${post.titleEn} — ${entry.label || "Important Date"}`,
          conductingBody: post.department,
          eventDate: new Date(entry.date),
          examType: entry.label || "Important Date",
          description: `${sourceMarker("job", post.id, `importantDate_${i}`)} ${entry.label || "Important date"} for ${post.titleEn}`,
          officialUrl: post.applicationUrl,
          state: post.state,
          isTentative: true,
        });
      }
    }
  }

  return events;
}

async function extractResultEvents(postId: string): Promise<DateEvent[]> {
  const post = await prisma.resultPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      titleEn: true,
      examName: true,
      declaringBody: true,
      state: true,
      declarationDate: true,
      slug: true,
      status: true,
    },
  });
  if (!post) return [];
  if (post.status !== "ACTIVE") return [];

  const baseUrl = `/results/${post.slug}`;

  return [
    {
      examName: `${post.examName} — Result`,
      conductingBody: post.declaringBody,
      eventDate: post.declarationDate,
      examType: "Result",
      description: `${sourceMarker("result", post.id, "declaration")} Result declared for ${post.examName}: ${post.titleEn}`,
      officialUrl: baseUrl,
      state: post.state,
      isTentative: false,
    },
  ];
}

async function extractAdmissionEvents(postId: string): Promise<DateEvent[]> {
  const post = await prisma.admissionPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      titleEn: true,
      institution: true,
      state: true,
      importantDates: true,
      portalUrl: true,
      slug: true,
      status: true,
    },
  });
  if (!post) return [];
  if (post.status !== "ACTIVE") return [];

  const events: DateEvent[] = [];
  const baseUrl = `/admissions/${post.slug}`;

  if (Array.isArray(post.importantDates)) {
    for (let i = 0; i < post.importantDates.length; i++) {
      const entry = post.importantDates[i] as { label?: string; date?: string };
      if (entry?.date) {
        events.push({
          examName: `${post.titleEn} — ${entry.label || "Date"}`,
          conductingBody: post.institution,
          eventDate: new Date(entry.date),
          examType: entry.label || "Admission Date",
          description: `${sourceMarker("admission", post.id, `date_${i}`)} ${entry.label || "Important date"} for ${post.titleEn} admission at ${post.institution}`,
          officialUrl: post.portalUrl || baseUrl,
          state: post.state,
          isTentative: true,
        });
      }
    }
  }

  return events;
}

async function extractScholarshipEvents(postId: string): Promise<DateEvent[]> {
  const post = await prisma.scholarshipPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      titleEn: true,
      schemeName: true,
      provider: true,
      state: true,
      importantDates: true,
      portalUrl: true,
      slug: true,
      status: true,
    },
  });
  if (!post) return [];
  if (post.status !== "ACTIVE") return [];

  const events: DateEvent[] = [];
  const baseUrl = `/scholarships/${post.slug}`;

  if (Array.isArray(post.importantDates)) {
    for (let i = 0; i < post.importantDates.length; i++) {
      const entry = post.importantDates[i] as { label?: string; date?: string };
      if (entry?.date) {
        events.push({
          examName: `${post.schemeName || post.titleEn} — ${entry.label || "Date"}`,
          conductingBody: post.provider,
          eventDate: new Date(entry.date),
          examType: entry.label || "Scholarship Date",
          description: `${sourceMarker("scholarship", post.id, `date_${i}`)} ${entry.label || "Important date"} for ${post.schemeName || post.titleEn} scholarship by ${post.provider}`,
          officialUrl: post.portalUrl || baseUrl,
          state: post.state,
          isTentative: true,
        });
      }
    }
  }

  return events;
}
