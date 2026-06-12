import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findScholarshipsOrderedExpiredLast } from "@/lib/db/order";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const scholarship = await prisma.scholarshipPost.findUnique({
      where: { slug },
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    if (!scholarship) {
      return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
    }

    prisma.scholarshipPost.update({
      where: { id: scholarship.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    const related = await findScholarshipsOrderedExpiredLast(
      {
        status: "ACTIVE",
        id: { not: scholarship.id },
        OR: [
          { state: scholarship.state },
          { provider: scholarship.provider },
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
      scholarship: {
        ...scholarship,
        hashtagList: scholarship.hashtags.map((h) => h.hashtag),
      },
      related: related.map((r) => ({
        ...r,
        hashtagList: r.hashtags.map((h) => h.hashtag),
      })),
    });
  } catch (error) {
    console.error("Error fetching scholarship:", error);
    return NextResponse.json(
      { error: "Failed to fetch scholarship" },
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
    const scholarship = await prisma.scholarshipPost.update({
      where: { slug },
      data: body,
    });

    // Sync exam calendar — add events if ACTIVE, remove if not
    syncExamEventsFromPost("scholarship", scholarship.id).catch(console.error);

    return NextResponse.json({ scholarship });
  } catch (error) {
    console.error("Error updating scholarship:", error);
    return NextResponse.json(
      { error: "Failed to update scholarship" },
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
    await prisma.scholarshipPost.update({
      where: { slug },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting scholarship:", error);
    return NextResponse.json(
      { error: "Failed to delete scholarship" },
      { status: 500 }
    );
  }
}
