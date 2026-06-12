import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/quiz/history — List all past published quizzes ──
export async function GET() {
  try {
    const quizzes = await prisma.dailyQuiz.findMany({
      where: {
        publishedAt: { not: null },
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        pillar: true,
        createdBy: true,
        publishedAt: true,
        createdAt: true,
        questions: true,
        _count: {
          select: { attempts: true },
        },
      },
    });

    const list = quizzes.map((q) => ({
      id: q.id,
      date: q.date,
      pillar: q.pillar,
      createdBy: q.createdBy,
      publishedAt: q.publishedAt,
      createdAt: q.createdAt,
      questionCount: (q.questions as any[]).length,
      totalAttempts: q._count.attempts,
    }));

    return NextResponse.json({ quizzes: list });
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return NextResponse.json({ error: "Failed to fetch quiz history" }, { status: 500 });
  }
}
