import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── GET /api/quiz/attempts — Get current user's attempts ──
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId: session.user.id },
      include: {
        quiz: {
          select: { date: true, pillar: true, questions: true },
        },
      },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json({ error: "Failed to fetch attempts" }, { status: 500 });
  }
}

// ── POST /api/quiz/attempts — Submit a quiz attempt ──
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { quizId, answers, timeSpent } = body;

    if (!quizId || !answers) {
      return NextResponse.json({ error: "quizId and answers are required" }, { status: 400 });
    }

    // Get the quiz to validate answers
    const quiz = await prisma.dailyQuiz.findUnique({
      where: { id: quizId },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = quiz.questions as any[];
    let score = 0;

    const gradedAnswers = questions.map((q: any, index: number) => {
      const selected = answers[index] ?? -1;
      const correct = selected === q.correctIndex;
      if (correct) score++;
      return {
        questionIndex: index,
        selectedOption: selected,
        correct,
      };
    });

    // Check if user already attempted this quiz
    const existing = await prisma.quizAttempt.findUnique({
      where: {
        userId_quizId: {
          userId: session.user.id,
          quizId,
        },
      },
    });

    let attempt;
    if (existing) {
      // Update existing attempt (allow retake)
      attempt = await prisma.quizAttempt.update({
        where: { id: existing.id },
        data: {
          score,
          totalQuestions: questions.length,
          answers: gradedAnswers,
          timeSpent: timeSpent || existing.timeSpent,
          completedAt: new Date(),
        },
      });
    } else {
      attempt = await prisma.quizAttempt.create({
        data: {
          userId: session.user.id,
          quizId,
          score,
          totalQuestions: questions.length,
          answers: gradedAnswers,
          timeSpent: timeSpent || null,
        },
      });
    }

    return NextResponse.json({
      attempt,
      result: {
        score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        answers: gradedAnswers,
      },
    });
  } catch (error) {
    console.error("Error submitting quiz attempt:", error);
    return NextResponse.json({ error: "Failed to submit attempt" }, { status: 500 });
  }
}
