import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/gk — List curated current affairs ──
// Query params:
//   ?date=2026-06-10   — articles for a specific date
//   ?latest=true       — most recent digest (default)
//   ?all=true          — ALL articles (admin, no digest filter)
//   ?category=Polity   — filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const dateParam = searchParams.get("date");
    const latest = searchParams.get("latest") !== "false";
    const showAll = searchParams.get("all") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");

    const where: any = {};

    // Category filter
    if (category && category !== "All") where.category = category;

    if (showAll) {
      // Admin view: no digestDate filter, show everything
      // (can still filter by category)
    } else if (dateParam) {
      // Specific date
      const dateStart = new Date(dateParam + "T00:00:00.000Z");
      const dateEnd = new Date(dateParam + "T23:59:59.999Z");
      where.digestDate = { gte: dateStart, lte: dateEnd };
    } else {
      // Latest digest: find the most recent digestDate
      const latestDigest = await prisma.currentAffair.findFirst({
        where: { digestDate: { not: null } },
        orderBy: { digestDate: "desc" },
        select: { digestDate: true },
      });

      if (latestDigest?.digestDate) {
        const dateStart = new Date(latestDigest.digestDate);
        dateStart.setHours(0, 0, 0, 0);
        const dateEnd = new Date(latestDigest.digestDate);
        dateEnd.setHours(23, 59, 59, 999);
        where.digestDate = { gte: dateStart, lte: dateEnd };
      } else {
        // No digest exists yet, return empty
        return NextResponse.json({
          articles: [],
          digestDate: null,
          pagination: { page: 1, limit, total: 0, totalPages: 0 },
        });
      }
    }

    const [articles, total] = await Promise.all([
      prisma.currentAffair.findMany({
        where,
        orderBy: showAll
          ? { publishedAt: "desc" }
          : { displayOrder: "asc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          summary: true,
          category: true,
          source: true,
          sourceUrl: true,
          imageUrl: true,
          tags: true,
          publishedAt: true,
          digestDate: true,
          displayOrder: true,
          isFeatured: true,
          createdAt: true,
        },
      }),
      prisma.currentAffair.count({ where }),
    ]);

    // Get digest metadata
    let digestInfo = null;
    if (!showAll && articles.length > 0) {
      const digestDate = articles[0].digestDate;
      if (digestDate) {
        // Count total articles in this digest
        const dStart = new Date(digestDate);
        dStart.setHours(0, 0, 0, 0);
        const dEnd = new Date(digestDate);
        dEnd.setHours(23, 59, 59, 999);
        const totalInDigest = await prisma.currentAffair.count({
          where: { digestDate: { gte: dStart, lte: dEnd } },
        });

        // Get category breakdown for this digest
        const categories = await prisma.currentAffair.groupBy({
          by: ["category"],
          where: { digestDate: { gte: dStart, lte: dEnd }, category: { not: null } },
          _count: true,
        });

        // Get source breakdown
        const sources = await prisma.currentAffair.groupBy({
          by: ["source"],
          where: { digestDate: { gte: dStart, lte: dEnd }, source: { not: null } },
          _count: true,
        });

        digestInfo = {
          date: digestDate.toISOString().split("T")[0],
          totalArticles: totalInDigest,
          categories: categories.map((c) => ({ name: c.category, count: c._count })),
          sources: sources.map((s) => ({ name: s.source, count: s._count })),
        };
      }
    }

    return NextResponse.json({
      digest: digestInfo,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching GK articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
