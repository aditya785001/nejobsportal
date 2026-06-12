import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findResultsOrderedExpiredLast } from "@/lib/db/order";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const result = await prisma.resultPost.findUnique({
      where: { slug },
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    prisma.resultPost.update({
      where: { id: result.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    const related = await findResultsOrderedExpiredLast(
      {
        status: "ACTIVE",
        id: { not: result.id },
        OR: [
          { state: result.state },
          { resultType: result.resultType },
        ],
      },
      0,
      4,
      {
        hashtags: {
          include: { hashtag: true },
        },
      },
    );

    return NextResponse.json({
      result: {
        ...result,
        hashtagList: result.hashtags.map((h) => h.hashtag),
        hashtags: undefined,
      },
      related: related.map((r) => ({
        ...r,
        hashtagList: r.hashtags.map((h) => h.hashtag),
        hashtags: undefined,
      })),
    });
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const result = await prisma.resultPost.update({
      where: { slug },
      data: body,
    });

    // Sync exam calendar — add events if ACTIVE, remove if not
    syncExamEventsFromPost("result", result.id).catch(console.error);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error updating result:", error);
    return NextResponse.json(
      { error: "Failed to update result" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await prisma.resultPost.update({
      where: { slug },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting result:", error);
    return NextResponse.json(
      { error: "Failed to delete result" },
      { status: 500 }
    );
  }
}
