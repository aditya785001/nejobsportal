import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobPostSchema } from "@/lib/utils/validation";
import { slugify } from "@/lib/utils/slugify";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findJobsOrderedExpiredLast } from "@/lib/db/order";

// ── GET /api/jobs — List jobs with filters ──
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const state = searchParams.get("state");
  const category = searchParams.get("category");
  const hashtag = searchParams.get("hashtag");
  const status = searchParams.get("status") || "ACTIVE";
  const search = searchParams.get("q");

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = { status };

  if (state) where.state = state;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { titleEn: { contains: search, mode: "insensitive" } },
      { titleAs: { contains: search, mode: "insensitive" } },
      { department: { contains: search, mode: "insensitive" } },
      { qualification: { contains: search, mode: "insensitive" } },
    ];
  }
  if (hashtag) {
    where.hashtags = {
      some: {
        hashtag: { slug: hashtag },
      },
    };
  }

  try {
    const [jobs, total] = await Promise.all([
      findJobsOrderedExpiredLast(where, skip, limit, {
        hashtags: {
          include: { hashtag: true },
        },
      }),
      prisma.jobPost.count({ where }),
    ]);

    // Transform response to include hashtag names
    const transformed = jobs.map((job) => ({
      ...job,
      hashtagList: job.hashtags.map((h) => h.hashtag),
      hashtags: undefined, // Remove raw relation data
    }));

    return NextResponse.json({
      jobs: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// ── POST /api/jobs — Create job (from admin) ──
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = jobPostSchema.parse(body);

    // Generate slug if not provided
    const slug = validated.slug || slugify(validated.titleEn);

    // ── Multi-layer deduplication ──

    // Layer 1: Exact slug match — if a non-active record exists, re-activate it instead of creating
    const existingBySlug = await prisma.jobPost.findUnique({ where: { slug } });
    if (existingBySlug) {
      if (existingBySlug.status === "ACTIVE" || existingBySlug.status === "PENDING_REVIEW") {
        return NextResponse.json(
          { error: "A job with this slug already exists", existingId: existingBySlug.id },
          { status: 409 }
        );
      }
      // Found a CANCELLED/DRAFT record — revive it by updating fields
      const { hashtags: _, ...rest } = validated as any;
      const updated = await prisma.jobPost.update({
        where: { slug },
        data: {
          ...rest,
      status: "ACTIVE",
          publishedAt: new Date(),
          lastDate: validated.lastDate ? new Date(validated.lastDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          fee: (rest as any).fee || {},
          importantDates: (rest as any).importantDates || [],
          resources: (rest as any).resources || [],
          viewCount: 0,
        },
      });
      // Sync exam calendar
      syncExamEventsFromPost("job", updated.id).catch(console.error);

      return NextResponse.json(
        { id: updated.id, slug: updated.slug, url: `/jobs/${updated.slug}`, status: updated.status, revived: true },
        { status: 200 }
      );
    }

    // Layer 2: Same department + same lastDate + overlapping title keywords
    // This catches the same job posted from different sources with slightly different titles
    const normalizedTitle = validated.titleEn
      .toLowerCase()
      .replace(/[–—−-]+/g, " ")
      .replace(/[^\w\s]/g, "")
      .replace(/\b(recruitment|notification|vacancy|posts|apply|online|2026|2025)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    const titleWords = normalizedTitle.split(" ").filter((w) => w.length > 3);
    const keyWords = titleWords.slice(0, 5); // Use top 5 significant words

    if (keyWords.length >= 2 && validated.lastDate) {
      const fuzzyDup = await prisma.jobPost.findFirst({
        where: {
          department: validated.department,
          lastDate: new Date(validated.lastDate),
          AND: keyWords.map((word) => ({
            titleEn: { contains: word, mode: "insensitive" as const },
          })),
          status: { in: ["ACTIVE", "PENDING_REVIEW"] },
        },
        select: { id: true, titleEn: true, slug: true },
      });

      if (fuzzyDup) {
        return NextResponse.json(
          {
            error: "A similar job already exists (same department + last date + matching title)",
            existingId: fuzzyDup.id,
            existingTitle: fuzzyDup.titleEn,
            existingSlug: fuzzyDup.slug,
          },
          { status: 409 }
        );
      }
    }

    // Layer 3: Same application URL (skip CANCELLED records)
    if (validated.applicationUrl) {
      const urlDup = await prisma.jobPost.findFirst({
        where: {
          applicationUrl: validated.applicationUrl,
          status: { in: ["ACTIVE", "PENDING_REVIEW"] },
        },
        select: { id: true, titleEn: true },
      });
      if (urlDup) {
        return NextResponse.json(
          {
            error: "A job with this application URL already exists",
            existingId: urlDup.id,
            existingTitle: urlDup.titleEn,
          },
          { status: 409 }
        );
      }
    }

    // Extract hashtags from request
    const hashtagNames = validated.hashtags || [];

    // Build create data manually to handle JSON fields correctly
    const { hashtags: _, fee: rawFee, importantDates: rawDates, resources: rawResources, ...rest } = validated as any;

    const createData: any = {
      ...rest,
      slug,
      // If lastDate is empty, default to 30 days from now so the post stays visible
      lastDate: validated.lastDate ? new Date(validated.lastDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notificationDate: validated.notificationDate ? new Date(validated.notificationDate) : undefined,
      expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : undefined,
      status: (validated as any).status || "PENDING_REVIEW",
      publishedAt: new Date(),
      fee: rawFee || {},
      importantDates: rawDates || [],
      resources: rawResources || [],
      hashtags: {
        create: await Promise.all(
          hashtagNames.map(async (name: string) => {
            const tagSlug = slugify(name);
            const hashtag = await prisma.hashtag.upsert({
              where: { slug: tagSlug },
              update: { postCount: { increment: 1 } },
              create: { name, slug: tagSlug, postCount: 1 },
            });
            return { hashtagId: hashtag.id };
          })
        ),
      },
    };

    const job = await prisma.jobPost.create({ data: createData,
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    // Sync exam calendar
    syncExamEventsFromPost("job", job.id).catch(console.error);

    return NextResponse.json(
      {
        id: job.id,
        slug: job.slug,
        url: `/jobs/${job.slug}`,
        status: job.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 422 }
      );
    }
    console.error("Error creating job:", error instanceof Error ? error.message : error, error instanceof Error ? error.stack : "");
    return NextResponse.json(
      { error: "Failed to create job", detail: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.message : String(error)) : undefined },
      { status: 500 }
    );
  }
}
