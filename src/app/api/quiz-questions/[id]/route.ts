import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── PATCH /api/quiz-questions/[id] — Update a question (admin only) ──
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const allowed = ["question", "options", "correctIndex", "explanation", "pillar", "difficulty", "section", "status"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const question = await prisma.quizQuestion.update({
      where: { id },
      data,
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error updating quiz question:", error);
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
  }
}

// ── DELETE /api/quiz-questions/[id] — Delete a question (admin only) ──
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.quizQuestion.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quiz question:", error);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
