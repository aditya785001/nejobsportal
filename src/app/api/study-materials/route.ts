import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { studyMaterialSchema } from "@/lib/utils/validation";
import { slugify } from "@/lib/utils/slugify";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const examTag = searchParams.get("examTag");
  const resourceType = searchParams.get("resourceType");
  const status = searchParams.get("status") || "ACTIVE";
  const search = searchParams.get("q");

  const skip = (page - 1) * limit;

  const where: any = { status };

  if (examTag) where.examTag = examTag;
  if (resourceType) where.resourceType = resourceType;
  if (search) {
    where.OR = [
      { titleEn: { contains: search, mode: "insensitive" } },
      { titleAs: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [materials, total] = await Promise.all([
      prisma.studyMaterial.findMany({
        where,
        include: {
          hashtags: {
            include: { hashtag: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.studyMaterial.count({ where }),
    ]);

    const transformed = materials.map((m) => ({
      ...m,
      hashtagList: m.hashtags.map((h) => h.hashtag),
      hashtags: undefined,
    }));

    return NextResponse.json({
      materials: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    return NextResponse.json(
      { error: "Failed to fetch study materials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = studyMaterialSchema.parse(body);

    const slug = validated.slug || slugify(validated.titleEn);

    const existing = await prisma.studyMaterial.findFirst({
      where: { slug, status: { in: ["ACTIVE", "PENDING_REVIEW"] } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A study material with this slug already exists", existingId: existing.id },
        { status: 409 }
      );
    }

    const hashtagNames = validated.hashtags || [];
    const { hashtags: _, ...rest } = validated as any;

    const createData: any = {
      ...rest,
      slug,
      status: "ACTIVE",
      publishedAt: new Date(),
      hashtags: {
        create: await Promise.all(
          hashtagNames.map(async (name: string) => {
            const tagSlug = slugify(name);
            const hashtag = await prisma.hashtag.upsert({
              where: { slug: tagSlug },
              update: { postCount: { increment: 1 } },
              create: { name, slug: tagSlug, postCount: 1 },
            });
            return { hashtagId: hashtag.id };
          })
        ),
      },
    };

    const material = await prisma.studyMaterial.create({
      data: createData,
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    return NextResponse.json(
      {
        id: material.id,
        slug: material.slug,
        url: `/study-materials/${material.slug}`,
        status: material.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 422 }
      );
    }
    console.error("Error creating study material:", error);
    return NextResponse.json(
      { error: "Failed to create study material" },
      { status: 500 }
    );
  }
}
