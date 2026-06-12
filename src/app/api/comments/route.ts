import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { commentSchema } from "@/lib/utils/validation";

// ── GET /api/comments — List comments for a post ──
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const postType = searchParams.get("postType");
  const postId = searchParams.get("postId");

  if (!postType || !postId) {
    return NextResponse.json(
      { error: "postType and postId are required" },
      { status: 400 }
    );
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postType: postType as any,
        postId,
        status: "ACTIVE",
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        replies: {
          where: { status: "ACTIVE" },
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// ── POST /api/comments — Create comment ──
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = commentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        content: validated.content,
        postType: validated.postType as any,
        postId: validated.postId,
        parentId: validated.parentId,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 422 }
      );
    }
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
