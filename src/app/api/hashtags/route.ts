import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils/slugify";

// ── GET /api/hashtags — List all hashtags ──
export async function GET() {
  try {
    const hashtags = await prisma.hashtag.findMany({
      orderBy: { postCount: "desc" },
    });
    return NextResponse.json(hashtags);
  } catch (error) {
    console.error("Error fetching hashtags:", error);
    return NextResponse.json(
      { error: "Failed to fetch hashtags" },
      { status: 500 }
    );
  }
}

// ── POST /api/hashtags — Create hashtag (admin) ──
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Hashtag name is required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);
    const hashtag = await prisma.hashtag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });

    return NextResponse.json(hashtag, { status: 201 });
  } catch (error) {
    console.error("Error creating hashtag:", error);
    return NextResponse.json(
      { error: "Failed to create hashtag" },
      { status: 500 }
    );
  }
}
