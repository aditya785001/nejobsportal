import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/share — Log a share event
 *
 * Body: { postType: "JOB" | "RESULT" | "ADMISSION" | "SCHOLARSHIP" | "STUDY_MATERIAL" | "EXAM_PREP", postId: string, platform: string }
 *
 * Platform values: whatsapp, telegram, facebook, twitter, linkedin, email, copy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postType, postId, platform } = body;

    if (!postType || !postId || !platform) {
      return NextResponse.json(
        { error: "Missing required fields: postType, postId, platform" },
        { status: 400 }
      );
    }

    const validTypes = ["JOB", "RESULT", "ADMISSION", "SCHOLARSHIP", "STUDY_MATERIAL", "EXAM_PREP"];
    if (!validTypes.includes(postType)) {
      return NextResponse.json(
        { error: `Invalid postType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    await prisma.shareEvent.create({
      data: {
        postType,
        postId,
        platform: platform.toUpperCase(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Share] Error logging share event:", error);
    return NextResponse.json(
      { error: "Failed to log share event" },
      { status: 500 }
    );
  }
}
