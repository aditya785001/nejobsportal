import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      pendingCount,
      activeCount,
      totalJobs,
      totalResults,
      totalAdmissions,
      totalScholarships,
      totalStudyMaterials,
      totalExamPrep,
      totalUsers,
    ] = await Promise.all([
      // Total pending across all types
      Promise.all([
        prisma.jobPost.count({ where: { status: "PENDING_REVIEW" } }),
        prisma.admissionPost.count({ where: { status: "PENDING_REVIEW" } }),
        prisma.resultPost.count({ where: { status: "PENDING_REVIEW" } }),
        prisma.scholarshipPost.count({ where: { status: "PENDING_REVIEW" } }),
        prisma.studyMaterial.count({ where: { status: "PENDING_REVIEW" } }),
        prisma.examPrepArticle.count({ where: { status: "PENDING_REVIEW" } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      // Total active across all types
      Promise.all([
        prisma.jobPost.count({ where: { status: "ACTIVE" } }),
        prisma.admissionPost.count({ where: { status: "ACTIVE" } }),
        prisma.resultPost.count({ where: { status: "ACTIVE" } }),
        prisma.scholarshipPost.count({ where: { status: "ACTIVE" } }),
        prisma.studyMaterial.count({ where: { status: "ACTIVE" } }),
        prisma.examPrepArticle.count({ where: { status: "ACTIVE" } }),
      ]).then((counts) => counts.reduce((a, b) => a + b, 0)),
      prisma.jobPost.count(),
      prisma.resultPost.count(),
      prisma.admissionPost.count(),
      prisma.scholarshipPost.count(),
      prisma.studyMaterial.count(),
      prisma.examPrepArticle.count(),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      pendingCount,
      activeCount,
      totalJobs,
      totalResults,
      totalAdmissions,
      totalScholarships,
      totalStudyMaterials,
      totalExamPrep,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
