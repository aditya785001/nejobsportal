import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/quiz/[id] — Get a specific quiz ──
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const quiz = await prisma.dailyQuiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}

// ── PATCH /api/quiz/[id] — Update quiz (admin/editor only) ──
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const quiz = await prisma.dailyQuiz.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  }
}

// ── DELETE /api/quiz/[id] — Delete quiz (admin only) ──
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await prisma.dailyQuiz.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  }
}
