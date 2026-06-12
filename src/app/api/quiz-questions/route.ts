import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const VALID_SECTIONS = ["DAILY_QUIZ", "MOCK_TEST", "PRACTICE", "TOPIC_WISE"];

// ── GET /api/quiz-questions — List/search questions (admin only) ──
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "50"));
  const pillar = searchParams.get("pillar");
  const difficulty = searchParams.get("difficulty");
  const status = searchParams.get("status");
  const section = searchParams.get("section");
  const search = searchParams.get("q");

  const where: Record<string, unknown> = {};
  if (pillar) where.pillar = pillar;
  if (difficulty) where.difficulty = difficulty;
  if (status) where.status = status;
  if (section) where.section = section;
  if (search) {
    where.OR = [
      { question: { contains: search, mode: "insensitive" } },
      { explanation: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [questions, total] = await Promise.all([
      prisma.quizQuestion.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.quizQuestion.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

// ── POST /api/quiz-questions — Bulk import questions (admin only) ──
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { questions, section = "DAILY_QUIZ" } = body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "questions array is required" }, { status: 400 });
    }

    if (!VALID_SECTIONS.includes(section)) {
      return NextResponse.json({ error: `Invalid section. Must be one of: ${VALID_SECTIONS.join(", ")}` }, { status: 400 });
    }

    const validPillars = ["GK", "AssamGK", "CurrentAffairs", "Science", "History", "Polity", "Mixed"];
    const validDifficulties = ["Easy", "Medium", "Hard"];

    const errors: { row: number; error: string }[] = [];
    const duplicates: { row: number; question: string }[] = [];
    const valid: { question: string; options: string[]; correctIndex: number; explanation: string | null; pillar: string; difficulty: string; section: string; status: string }[] = [];

    // Fetch existing questions for this section to check duplicates
    const existingQuestions = await prisma.quizQuestion.findMany({
      where: { section },
      select: { question: true },
    });
    const existingTexts = new Set(existingQuestions.map((q) => q.question.toLowerCase().trim()));

    questions.forEach((q: any, idx: number) => {
      const row = idx + 1;
      const errs: string[] = [];

      const questionText = (q.question || "").trim();
      if (!questionText || questionText.length < 5) errs.push("Question must be at least 5 characters");
      if (!Array.isArray(q.options) || q.options.length !== 4) errs.push("Exactly 4 options required");
      if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3)
        errs.push("correctIndex must be 0-3");
      if (q.pillar && !validPillars.includes(q.pillar)) errs.push(`Invalid pillar: ${q.pillar}`);
      if (q.difficulty && !validDifficulties.includes(q.difficulty))
        errs.push(`Invalid difficulty: ${q.difficulty}`);

      // Duplicate check (case-insensitive, same section)
      if (questionText && existingTexts.has(questionText.toLowerCase())) {
        duplicates.push({ row, question: questionText.substring(0, 80) });
        errs.push("Duplicate question (already exists in this section)");
      }

      if (errs.length > 0) {
        errors.push({ row, error: errs.join("; ") });
      } else {
        valid.push({
          question: questionText,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation || null,
          pillar: q.pillar || "GK",
          difficulty: q.difficulty || "Medium",
          section,
          status: "ACTIVE",
        });
        // Add to existing set so duplicate within the same import batch is also caught
        existingTexts.add(questionText.toLowerCase());
      }
    });

    if (errors.length > 0) {
      return NextResponse.json({
        errors,
        duplicates,
        validCount: valid.length,
      }, { status: 422 });
    }

    const result = await prisma.quizQuestion.createMany({
      data: valid,
    });

    return NextResponse.json({
      imported: result.count,
      duplicates: duplicates.length > 0 ? duplicates : undefined,
      message: `Successfully imported ${result.count} questions${duplicates.length > 0 ? ` (${duplicates.length} duplicates skipped)` : ""}`,
    });
  } catch (error) {
    console.error("Error importing quiz questions:", error);
    return NextResponse.json({ error: "Failed to import questions" }, { status: 500 });
  }
}
