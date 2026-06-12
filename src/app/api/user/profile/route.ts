import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { phone, targetExam } = body;

    const updateData: Record<string, unknown> = { onboardingDone: true };

    if (typeof phone === "string" && phone.trim()) {
      updateData.phone = phone.trim();
    }
    if (typeof targetExam === "string" && targetExam.trim()) {
      updateData.targetExam = targetExam.trim();
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, targetExam: true, onboardingDone: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
