import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const material = await prisma.studyMaterial.findUnique({
      where: { slug },
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    if (!material) {
      return NextResponse.json({ error: "Study material not found" }, { status: 404 });
    }

    prisma.studyMaterial.update({
      where: { id: material.id },
      data: { downloadCount: { increment: 1 } },
    }).catch(() => {});

    const related = await prisma.studyMaterial.findMany({
      where: {
        status: "ACTIVE",
        id: { not: material.id },
        OR: [
          { examTag: material.examTag },
          { subject: material.subject },
        ].filter((c) => c.examTag || c.subject),
      },
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      material: {
        ...material,
        hashtagList: material.hashtags.map((h) => h.hashtag),
      },
      related: related.map((r) => ({
        ...r,
        hashtagList: r.hashtags.map((h) => h.hashtag),
      })),
    });
  } catch (error) {
    console.error("Error fetching study material:", error);
    return NextResponse.json(
      { error: "Failed to fetch study material" },
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
    const material = await prisma.studyMaterial.update({
      where: { slug },
      data: body,
    });

    return NextResponse.json({ material });
  } catch (error) {
    console.error("Error updating study material:", error);
    return NextResponse.json(
      { error: "Failed to update study material" },
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
    await prisma.studyMaterial.update({
      where: { slug },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting study material:", error);
    return NextResponse.json(
      { error: "Failed to delete study material" },
      { status: 500 }
    );
  }
}
