import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findJobsOrderedExpiredLast } from "@/lib/db/order";

// ── GET /api/jobs/[slug] — Single job detail ──
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const job = await prisma.jobPost.findUnique({
      where: { slug },
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Increment view count (fire and forget)
    prisma.jobPost.update({
      where: { id: job.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Get related jobs (same state or category, excluding current)
    // Ordered: non-expired first, expired last
    const related = await findJobsOrderedExpiredLast(
      {
        status: "ACTIVE",
        id: { not: job.id },
        OR: [
          { state: job.state },
          { category: job.category },
        ],
      },
      0,
      4,
      {
        hashtags: {
          include: { hashtag: true },
        },
      },
    );

    return NextResponse.json({
      job: {
        ...job,
        hashtagList: job.hashtags.map((h) => h.hashtag),
      },
      related: related.map((r) => ({
        ...r,
        hashtagList: r.hashtags.map((h) => h.hashtag),
      })),
    });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

// ── PATCH /api/jobs/[slug] — Update job (admin only) ──
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();

    // Extract relation / JSON fields that need special handling
    const { hashtags: hashtagNames, fee: rawFee, importantDates: rawDates, resources: rawResources, ...scalars } = body;

    // Build update data with proper types
    const updateData: any = {
      ...scalars,
      lastDate: scalars.lastDate ? new Date(scalars.lastDate) : undefined,
      notificationDate: scalars.notificationDate ? new Date(scalars.notificationDate) : undefined,
      fee: rawFee ?? {},
      importantDates: rawDates ?? [],
      resources: rawResources ?? [],
    };

    // Handle hashtag sync — replace all existing hashtags
    if (Array.isArray(hashtagNames)) {
      const tagSlugs = hashtagNames.filter(Boolean).map((n: string) => n.trim());
      // Disconnect all existing hashtags first
      const existing = await prisma.jobPost.findUnique({
        where: { slug },
        select: { hashtags: { select: { hashtagId: true } } },
      });
      const disconnectIds = existing?.hashtags.map(h => ({ hashtagId: h.hashtagId })) || [];

      // Upsert new hashtags
      const connectOrCreate = await Promise.all(
        tagSlugs.map(async (name: string) => {
          const tagSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          const hashtag = await prisma.hashtag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name, slug: tagSlug },
          });
          return { hashtagId: hashtag.id };
        })
      );

      updateData.hashtags = {
        deleteMany: {},
        create: connectOrCreate,
      };
    }

    const job = await prisma.jobPost.update({
      where: { slug },
      data: updateData,
      include: {
        hashtags: { include: { hashtag: true } },
      },
    });

    // Sync exam calendar — will add events if ACTIVE, remove if not
    syncExamEventsFromPost("job", job.id).catch(console.error);

    return NextResponse.json({
      job: {
        ...job,
        hashtagList: job.hashtags.map(h => h.hashtag),
      },
    });
  } catch (error) {
    console.error("Error updating job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/jobs/[slug] — Soft delete (admin only) ──
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await prisma.jobPost.update({
      where: { slug },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting job:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
