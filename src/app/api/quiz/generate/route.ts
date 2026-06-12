import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Pillar distribution for a balanced daily quiz (10 questions total)
const PILLAR_DISTRIBUTION: { pillar: string; count: number }[] = [
  { pillar: "GK", count: 3 },
  { pillar: "AssamGK", count: 2 },
  { pillar: "CurrentAffairs", count: 2 },
  { pillar: "Science", count: 1 },
  { pillar: "History", count: 1 },
  { pillar: "Polity", count: 1 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── POST /api/quiz/generate — Generate today's quiz (admin only) ──
export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if today's quiz already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    const existingQuiz = await prisma.dailyQuiz.findFirst({
      where: {
        date: { gte: today, lt: tomorrow },
        publishedAt: { not: null },
      },
    });

    if (existingQuiz) {
      return NextResponse.json(
        { error: "Today's quiz already exists", quizId: existingQuiz.id },
        { status: 409 }
      );
    }

    // Count available active questions per pillar (DAILY_QUIZ section only)
    const pillarCounts = await Promise.all(
      PILLAR_DISTRIBUTION.map((d) =>
        prisma.quizQuestion.count({
          where: { pillar: d.pillar, status: "ACTIVE", section: "DAILY_QUIZ" },
        })
      )
    );

    const insufficient = PILLAR_DISTRIBUTION.filter(
      (d, i) => pillarCounts[i] < d.count
    );
    if (insufficient.length > 0) {
      return NextResponse.json(
        {
          error: "Insufficient questions in question bank",
          details: insufficient.map(
            (d) => `${d.pillar}: need ${d.count}, have ${pillarCounts[PILLAR_DISTRIBUTION.indexOf(d)]}`
          ),
        },
        { status: 400 }
      );
    }

    // Pick questions: favor least-used ones
    const selected: { id: string; question: string; options: string[]; correctIndex: number; explanation: string | null }[] = [];

    for (const { pillar, count } of PILLAR_DISTRIBUTION) {
      const pool = await prisma.quizQuestion.findMany({
        where: { pillar, status: "ACTIVE", section: "DAILY_QUIZ" },
        orderBy: { timesUsed: "asc" },
      });
      const picked = shuffle(pool).slice(0, count);
      selected.push(...picked);
    }

    const finalQuestions = shuffle(selected).map((q) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));

    // Create the daily quiz
    const quiz = await prisma.dailyQuiz.create({
      data: {
        date: today,
        questions: finalQuestions,
        pillar: "Mixed",
        createdBy: "SYSTEM",
        publishedAt: new Date(),
      },
    });

    // Bump usage counter
    await prisma.quizQuestion.updateMany({
      where: { id: { in: selected.map((q) => q.id) } },
      data: { timesUsed: { increment: 1 } },
    });

    return NextResponse.json({
      quiz,
      message: "Today's quiz generated successfully",
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
