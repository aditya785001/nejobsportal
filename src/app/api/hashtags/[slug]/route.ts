import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findJobsOrderedExpiredLast, findResultsOrderedExpiredLast, findAdmissionsOrderedExpiredLast, findScholarshipsOrderedExpiredLast } from "@/lib/db/order";

// ── GET /api/hashtags/[slug] — All posts with this hashtag (cross-pillar) ──
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const hashtag = await prisma.hashtag.findUnique({
      where: { slug },
    });

    if (!hashtag) {
      return NextResponse.json({ error: "Hashtag not found" }, { status: 404 });
    }

    // Query all content types that have this hashtag
    // Each pillar ordered with active/recent first, expired/old last
    const [jobs, results, admissions, scholarships, studyMaterials] =
      await Promise.all([
        findJobsOrderedExpiredLast(
          { hashtags: { some: { hashtagId: hashtag.id } }, status: "ACTIVE" },
          0, 20,
          { hashtags: { include: { hashtag: true } } }
        ),
        findResultsOrderedExpiredLast(
          { hashtags: { some: { hashtagId: hashtag.id } }, status: "ACTIVE" },
          0, 20,
          { hashtags: { include: { hashtag: true } } }
        ),
        findAdmissionsOrderedExpiredLast(
          { hashtags: { some: { hashtagId: hashtag.id } }, status: "ACTIVE" },
          0, 20,
          { hashtags: { include: { hashtag: true } } }
        ),
        findScholarshipsOrderedExpiredLast(
          { hashtags: { some: { hashtagId: hashtag.id } }, status: "ACTIVE" },
          0, 20,
          { hashtags: { include: { hashtag: true } } }
        ),
        prisma.studyMaterial.findMany({
          where: { hashtags: { some: { hashtagId: hashtag.id } }, status: "ACTIVE" },
          include: { hashtags: { include: { hashtag: true } } },
          take: 20,
          orderBy: { createdAt: "desc" },
        }),
      ]);

    return NextResponse.json({
      hashtag,
      posts: {
        jobs: jobs.map((j) => ({ ...j, type: "JOB" })),
        results: results.map((r) => ({ ...r, type: "RESULT" })),
        admissions: admissions.map((a) => ({ ...a, type: "ADMISSION" })),
        scholarships: scholarships.map((s) => ({ ...s, type: "SCHOLARSHIP" })),
        studyMaterials: studyMaterials.map((s) => ({ ...s, type: "STUDY_MATERIAL" })),
      },
      totalCount:
        jobs.length +
        results.length +
        admissions.length +
        scholarships.length +
        studyMaterials.length,
    });
  } catch (error) {
    console.error("Error fetching hashtag posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch hashtag posts" },
      { status: 500 }
    );
  }
}
