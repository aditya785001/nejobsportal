import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ── POST /api/comments/[id]/vote — Upvote/downvote ──
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body; // "upvote" or "downvote"

  if (!["upvote", "downvote"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: {
        ...(action === "upvote"
          ? { upvotes: { increment: 1 } }
          : { downvotes: { increment: 1 } }),
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error voting on comment:", error);
    return NextResponse.json(
      { error: "Failed to vote on comment" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/comments/[id] — Delete own comment ──
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    if (comment.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await prisma.comment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
