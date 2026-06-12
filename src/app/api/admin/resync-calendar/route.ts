import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resyncAllCalendar } from "@/lib/exam-calendar";

export async function POST() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await resyncAllCalendar();
    return NextResponse.json({
      message: "Calendar re-synced successfully",
      deleted: result.deleted,
      created: result.created,
    });
  } catch (error) {
    console.error("Error re-syncing calendar:", error);
    return NextResponse.json({ error: "Failed to re-sync calendar" }, { status: 500 });
  }
}
