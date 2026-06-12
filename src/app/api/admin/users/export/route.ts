import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import ExcelJS from "exceljs";

export async function GET() {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        email: true,
        phone: true,
        targetExam: true,
        onboardingDone: true,
        createdAt: true,
      },
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "NEJobsPortal Admin";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Users");

    // Column headers
    sheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 35 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Target Exam", key: "targetExam", width: 40 },
      { header: "Onboarding Complete", key: "onboardingDone", width: 20 },
      { header: "Registered On", key: "createdAt", width: 20 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1A6B3C" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 25;

    // Add data rows
    users.forEach((user, idx) => {
      sheet.addRow({
        index: idx + 1,
        name: user.name || "-",
        email: user.email || "-",
        phone: user.phone || "-",
        targetExam: user.targetExam || "-",
        onboardingDone: user.onboardingDone ? "Yes" : "No",
        createdAt: user.createdAt
          ? user.createdAt.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
      });
    });

    // Style data rows
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: "middle" };
        row.getCell(6).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        // Alternate row colors
        if (rowNumber % 2 === 0) {
          row.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF0F7F0" },
            };
          });
        }
      }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Get current date for filename
    const dateStr = new Date().toISOString().split("T")[0];

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="nejobsportal-users-${dateStr}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json({ error: "Failed to export users" }, { status: 500 });
  }
}
