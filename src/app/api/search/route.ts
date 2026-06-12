import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findJobsOrderedExpiredLast, findResultsOrderedExpiredLast, findAdmissionsOrderedExpiredLast, findScholarshipsOrderedExpiredLast } from "@/lib/db/order";

// ── GET /api/search — Full-text search across all pillars ──
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.trim();
  const type = searchParams.get("type"); // optional pillar filter
  const state = searchParams.get("state");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));

  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 }
    );
  }

  const skip = (page - 1) * limit;
  const searchFilter = {
    contains: q,
    mode: "insensitive" as const,
  };

  try {
    // Search across all content types in parallel
    const searchPromises: Promise<any>[] = [];

    if (!type || type === "JOB") {
      searchPromises.push(
        findJobsOrderedExpiredLast({
          status: "ACTIVE",
          ...(state ? { state: state as any } : {}),
          OR: [
            { titleEn: searchFilter },
            { titleAs: searchFilter },
            { department: searchFilter },
            { qualification: searchFilter },
            { summaryEn: searchFilter },
          ],
        }, skip, limit, { hashtags: { include: { hashtag: true } } })
          .then((results) => results.map((r) => ({ ...r, _type: "JOB" })))
      );
    }

    if (!type || type === "RESULT") {
      searchPromises.push(
        findResultsOrderedExpiredLast({
          status: "ACTIVE",
          ...(state ? { state: state as any } : {}),
          OR: [
            { titleEn: searchFilter },
            { titleAs: searchFilter },
            { examName: searchFilter },
          ],
        }, skip, limit)
          .then((results) => results.map((r) => ({ ...r, _type: "RESULT" })))
      );
    }

    if (!type || type === "ADMISSION") {
      searchPromises.push(
        findAdmissionsOrderedExpiredLast({
          status: "ACTIVE",
          ...(state ? { state: state as any } : {}),
          OR: [
            { titleEn: searchFilter },
            { titleAs: searchFilter },
            { institution: searchFilter },
            { course: searchFilter },
          ],
        }, skip, limit)
          .then((results) => results.map((r) => ({ ...r, _type: "ADMISSION" })))
      );
    }

    if (!type || type === "SCHOLARSHIP") {
      searchPromises.push(
        findScholarshipsOrderedExpiredLast({
          status: "ACTIVE",
          ...(state ? { state: state as any } : {}),
          OR: [
            { titleEn: searchFilter },
            { titleAs: searchFilter },
            { schemeName: searchFilter },
          ],
        }, skip, limit)
          .then((results) => results.map((r) => ({ ...r, _type: "SCHOLARSHIP" })))
      );
    }

    if (!type || type === "STUDY_MATERIAL") {
      searchPromises.push(
        prisma.studyMaterial.findMany({
          where: {
            status: "ACTIVE",
            OR: [
              { titleEn: searchFilter },
              { titleAs: searchFilter },
              { subject: searchFilter },
            ],
          },
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
        }).then((results) => results.map((r) => ({ ...r, _type: "STUDY_MATERIAL" })))
      );
    }

    const results = (await Promise.all(searchPromises)).flat();

    return NextResponse.json({
      query: q,
      results,
      total: results.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
