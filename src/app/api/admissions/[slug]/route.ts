import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findAdmissionsOrderedExpiredLast } from "@/lib/db/order";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const admission = await prisma.admissionPost.findUnique({
      where: { slug },
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    if (!admission) {
      return NextResponse.json({ error: "Admission not found" }, { status: 404 });
    }

    prisma.admissionPost.update({
      where: { id: admission.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    const related = await findAdmissionsOrderedExpiredLast(
      {
        status: "ACTIVE",
        id: { not: admission.id },
        OR: [
          { state: admission.state },
          { institution: admission.institution },
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
      admission: {
        ...admission,
        hashtagList: admission.hashtags.map((h) => h.hashtag),
      },
      related: related.map((r) => ({
        ...r,
        hashtagList: r.hashtags.map((h) => h.hashtag),
      })),
    });
  } catch (error) {
    console.error("Error fetching admission:", error);
    return NextResponse.json(
      { error: "Failed to fetch admission" },
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
    const admission = await prisma.admissionPost.update({
      where: { slug },
      data: body,
    });

    // Sync exam calendar — add events if ACTIVE, remove if not
    syncExamEventsFromPost("admission", admission.id).catch(console.error);

    return NextResponse.json({ admission });
  } catch (error) {
    console.error("Error updating admission:", error);
    return NextResponse.json(
      { error: "Failed to update admission" },
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
    await prisma.admissionPost.update({
      where: { slug },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting admission:", error);
    return NextResponse.json(
      { error: "Failed to delete admission" },
      { status: 500 }
    );
  }
}
