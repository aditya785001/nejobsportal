import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── GET /api/quiz — Get today's quiz ──
export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quiz = await prisma.dailyQuiz.findFirst({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 86400000),
        },
        publishedAt: { not: null },
      },
      orderBy: { date: "desc" },
    });

    if (!quiz) {
      return NextResponse.json({ quiz: null, message: "No quiz available today" });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

// ── POST /api/quiz — Create a quiz (admin/editor only) ──
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const quiz = await prisma.dailyQuiz.create({
      data: {
        date: new Date(body.date),
        questions: body.questions || [],
        pillar: body.pillar || "GK",
        createdBy: body.createdBy || "ADMIN",
        publishedAt: body.publish ? new Date() : null,
      },
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
