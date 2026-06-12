import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/exam-calendar — List exam events with filters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "100")));
  const state = searchParams.get("state");
  const examType = searchParams.get("examType");
  const month = searchParams.get("month"); // "2026-06"
  const search = searchParams.get("q");
  const upcoming = searchParams.get("upcoming") === "true";

  const skip = (page - 1) * limit;
  const where: any = {};

  if (state) where.state = state;
  if (examType) where.examType = examType;

  if (search) {
    where.OR = [
      { examName: { contains: search, mode: "insensitive" } },
      { conductingBody: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // Filter by month: "2026-06"
  if (month) {
    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr);
    const mon = parseInt(monthStr) - 1; // JS months are 0-based
    const startOfMonth = new Date(year, mon, 1);
    const endOfMonth = new Date(year, mon + 1, 0, 23, 59, 59, 999);
    where.eventDate = { gte: startOfMonth, lte: endOfMonth };
  }

  // Only upcoming events
  if (upcoming) {
    where.eventDate = { ...(where.eventDate || {}), gte: new Date() };
  }

  try {
    const [events, total] = await Promise.all([
      prisma.examEvent.findMany({
        where,
        orderBy: { eventDate: "asc" },
        skip,
        take: limit,
      }),
      prisma.examEvent.count({ where }),
    ]);

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching exam calendar:", error);
    return NextResponse.json(
      { error: "Failed to fetch exam calendar events" },
      { status: 500 }
    );
  }
}
