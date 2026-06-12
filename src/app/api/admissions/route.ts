import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { admissionPostSchema } from "@/lib/utils/validation";
import { slugify } from "@/lib/utils/slugify";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findAdmissionsOrderedExpiredLast } from "@/lib/db/order";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const state = searchParams.get("state");
  const status = searchParams.get("status") || "ACTIVE";
  const search = searchParams.get("q");

  const skip = (page - 1) * limit;

  const where: any = { status };

  if (state) where.state = state;
  if (search) {
    where.OR = [
      { titleEn: { contains: search, mode: "insensitive" } },
      { titleAs: { contains: search, mode: "insensitive" } },
      { institution: { contains: search, mode: "insensitive" } },
      { course: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [admissions, total] = await Promise.all([
      findAdmissionsOrderedExpiredLast(where, skip, limit, {
        hashtags: {
          include: { hashtag: true },
        },
      }),
      prisma.admissionPost.count({ where }),
    ]);

    const transformed = admissions.map((admission) => ({
      ...admission,
      hashtagList: admission.hashtags.map((h) => h.hashtag),
      hashtags: undefined,
    }));

    return NextResponse.json({
      admissions: transformed,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch admissions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = admissionPostSchema.parse(body);

    const slug = validated.slug || slugify(validated.titleEn);

    // Check for existing post with same slug
    const existing = await prisma.admissionPost.findUnique({ where: { slug } });
    if (existing) {
      if (existing.status === "ACTIVE" || existing.status === "PENDING_REVIEW") {
        return NextResponse.json(
          { error: "An admission with this slug already exists", existingId: existing.id },
          { status: 409 }
        );
      }
      // Revive CANCELLED/DRAFT record
      const { hashtags: _, ...rest } = validated as any;
      const updated = await prisma.admissionPost.update({
        where: { slug },
        data: {
          ...rest,
          status: (validated as any).status || "PENDING_REVIEW",
          publishedAt: new Date(),
          feeStructure: (rest as any).feeStructure || {},
          importantDates: (rest as any).importantDates || [],
          hashtags: {
            deleteMany: {},
            create: await Promise.all(
              (_ || []).map(async (name: string) => {
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
        },
      });
      // Sync exam calendar
      syncExamEventsFromPost("admission", updated.id).catch(console.error);

      return NextResponse.json(
        { id: updated.id, slug: updated.slug, url: `/admissions/${updated.slug}`, status: updated.status, revived: true },
        { status: 200 }
      );
    }

    const hashtagNames = validated.hashtags || [];
    const { hashtags: _, feeStructure: rawFee, importantDates: rawDates, ...rest } = validated as any;

    const createData: any = {
      ...rest,
      slug,
      status: (validated as any).status || "PENDING_REVIEW",
      publishedAt: new Date(),
      feeStructure: rawFee || {},
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

    const admission = await prisma.admissionPost.create({
      data: createData,
      include: {
        hashtags: {
          include: { hashtag: true },
        },
      },
    });

    // Sync exam calendar
    syncExamEventsFromPost("admission", admission.id).catch(console.error);

    return NextResponse.json(
      {
        id: admission.id,
        slug: admission.slug,
        url: `/admissions/${admission.slug}`,
        status: admission.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Caught error:", error.name, error.message, error.stack?.substring(0, 500));
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create admission", message: error.message },
      { status: 500 }
    );
  }
}
