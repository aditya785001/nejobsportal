import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
  const status = searchParams.get("status") || "ALL";
  const type = searchParams.get("type") || "ALL";
  const search = searchParams.get("q") || "";
  const skip = (page - 1) * limit;

  // Build a type-safe where clause without union spreads
  const whereClause = (fields: string[]) => {
    const clause: Record<string, unknown> = {};
    if (status !== "ALL") clause.status = status;
    if (search && fields.length > 0) {
      clause.OR = fields.map(f => ({ [f]: { contains: search, mode: "insensitive" } }));
    }
    return clause;
  };

  try {
    // Fetch from all post types in parallel
    const [
      jobs, jobsTotal,
      admissions, admissionsTotal,
      results, resultsTotal,
      scholarships, scholarshipsTotal,
      studyMaterials, studyMaterialsTotal,
    ] = await Promise.all([
      // Jobs
      type === "ALL" || type === "JOB"
        ? prisma.jobPost.findMany({
            where: whereClause(["titleEn", "department"]),
            orderBy: { createdAt: "desc" },
            skip, take: limit,
            select: { id: true, titleEn: true, slug: true, department: true, state: true, status: true, lastDate: true, viewCount: true, createdAt: true, category: true },
          })
        : Promise.resolve([]),
      type === "ALL" || type === "JOB"
        ? prisma.jobPost.count({ where: whereClause(["titleEn", "department"]) })
        : Promise.resolve(0),

      // Admissions
      type === "ALL" || type === "ADMISSION"
        ? prisma.admissionPost.findMany({
            where: whereClause(["titleEn", "institution"]),
            orderBy: { createdAt: "desc" },
            skip, take: limit,
            select: { id: true, titleEn: true, slug: true, institution: true, state: true, status: true, createdAt: true },
          })
        : Promise.resolve([]),
      type === "ALL" || type === "ADMISSION"
        ? prisma.admissionPost.count({ where: whereClause(["titleEn", "institution"]) })
        : Promise.resolve(0),

      // Results
      type === "ALL" || type === "RESULT"
        ? prisma.resultPost.findMany({
            where: whereClause(["titleEn", "examName"]),
            orderBy: { createdAt: "desc" },
            skip, take: limit,
            select: { id: true, titleEn: true, slug: true, examName: true, state: true, status: true, createdAt: true },
          })
        : Promise.resolve([]),
      type === "ALL" || type === "RESULT"
        ? prisma.resultPost.count({ where: whereClause(["titleEn", "examName"]) })
        : Promise.resolve(0),

      // Scholarships
      type === "ALL" || type === "SCHOLARSHIP"
        ? prisma.scholarshipPost.findMany({
            where: whereClause(["titleEn", "schemeName"]),
            orderBy: { createdAt: "desc" },
            skip, take: limit,
            select: { id: true, titleEn: true, slug: true, schemeName: true, state: true, status: true, createdAt: true },
          })
        : Promise.resolve([]),
      type === "ALL" || type === "SCHOLARSHIP"
        ? prisma.scholarshipPost.count({ where: whereClause(["titleEn", "schemeName"]) })
        : Promise.resolve(0),

      // Study Materials
      type === "ALL" || type === "STUDY_MATERIAL"
        ? prisma.studyMaterial.findMany({
            where: whereClause(["titleEn", "subject"]),
            orderBy: { createdAt: "desc" },
            skip, take: limit,
            select: { id: true, titleEn: true, slug: true, subject: true, status: true, createdAt: true },
          })
        : Promise.resolve([]),
      type === "ALL" || type === "STUDY_MATERIAL"
        ? prisma.studyMaterial.count({ where: whereClause(["titleEn", "subject"]) })
        : Promise.resolve(0),
    ]);

    // Combine and normalize
    const allPosts = [
      ...jobs.map((p) => ({ ...p, postType: "JOB", subtitle: p.department, extra: p.category })),
      ...admissions.map((p) => ({ ...p, postType: "ADMISSION", subtitle: p.institution })),
      ...results.map((p) => ({ ...p, postType: "RESULT", subtitle: p.examName })),
      ...scholarships.map((p) => ({ ...p, postType: "SCHOLARSHIP", subtitle: p.schemeName })),
      ...studyMaterials.map((p) => ({ ...p, postType: "STUDY_MATERIAL", subtitle: p.subject || "" })),
    ];

    const total = jobsTotal + admissionsTotal + resultsTotal + scholarshipsTotal + studyMaterialsTotal;

    return NextResponse.json({
      posts: allPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      counts: {
        jobs: jobsTotal,
        admissions: admissionsTotal,
        results: resultsTotal,
        scholarships: scholarshipsTotal,
        studyMaterials: studyMaterialsTotal,
      },
    });
  } catch (error) {
    console.error("Error fetching admin posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
