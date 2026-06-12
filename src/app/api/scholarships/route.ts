import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scholarshipPostSchema } from "@/lib/utils/validation";
import { slugify } from "@/lib/utils/slugify";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findScholarshipsOrderedExpiredLast } from "@/lib/db/order";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const state = searchParams.get("state");
  const category = searchParams.get("category");
  const status = searchParams.get("status") || "ACTIVE";
  const search = searchParams.get("q");

  const skip = (page - 1) * limit;

  const where: any = { status };

  if (state) where.state = state;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { titleEn: { contains: search, mode: "insensitive" } },
      { titleAs: { contains: search, mode: "insensitive" } },
      { schemeName: { contains: search, mode: "insensitive" } },
      { provider: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [scholarships, total] = await Promise.all([
      findScholarshipsOrderedExpiredLast(where, skip, limit, {
        hashtags: {
          include: { hashtag: true },
        },
      }),
      prisma.scholarshipPost.count({ where }),
    ]);

    const transformed = scholarships.map((s) => ({
      ...s,
      hashtagList: s.hashtags.map((h) => h.hashtag),
      hashtags: undefined,
    }));

    return NextResponse.json({
      scholarships: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    return NextResponse.json(
      { error: "Failed to fetch scholarships" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = scholarshipPostSchema.parse(body);

    const slug = validated.slug || slugify(validated.titleEn);

    const existing = await prisma.scholarshipPost.findFirst({
      where: { slug, status: { in: ["ACTIVE", "PENDING_REVIEW"] } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A scholarship with this slug already exists", existingId: existing.id },
        { status: 409 }
      );
    }

    const hashtagNames = validated.hashtags || [];

    const { hashtags: _, importantDates: rawDates, ...rest } = validated as any;

    const createData: any = {
      ...rest,
      slug,
      status: (validated as any).status || "PENDING_REVIEW",
      publishedAt: new Date(),
      importantDates: rawDates || [],
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

    const scholarship = await prisma.scholarshipPost.create({
      data: createData,
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    // Sync exam calendar
    syncExamEventsFromPost("scholarship", scholarship.id).catch(console.error);

    return NextResponse.json(
      {
        id: scholarship.id,
        slug: scholarship.slug,
        url: `/scholarships/${scholarship.slug}`,
        status: scholarship.status,
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
    console.error("Error creating scholarship:", error);
    return NextResponse.json(
      { error: "Failed to create scholarship" },
      { status: 500 }
    );
  }
}
