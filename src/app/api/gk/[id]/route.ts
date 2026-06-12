import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── GET /api/gk/[id] — Get single current affairs article ──
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const article = await prisma.currentAffair.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Error fetching GK article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
