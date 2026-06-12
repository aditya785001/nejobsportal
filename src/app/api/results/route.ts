import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resultPostSchema } from "@/lib/utils/validation";
import { slugify } from "@/lib/utils/slugify";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";
import { findResultsOrderedExpiredLast } from "@/lib/db/order";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const state = searchParams.get("state");
  const resultType = searchParams.get("resultType");
  const status = searchParams.get("status") || "ACTIVE";
  const search = searchParams.get("q");

  const skip = (page - 1) * limit;
  const where: any = { status };

  if (state) where.state = state;
  if (resultType) where.resultType = resultType;
  if (search) {
    where.OR = [
      { titleEn: { contains: search, mode: "insensitive" } },
      { titleAs: { contains: search, mode: "insensitive" } },
      { examName: { contains: search, mode: "insensitive" } },
      { declaringBody: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const [results, total] = await Promise.all([
      findResultsOrderedExpiredLast(where, skip, limit, {
        hashtags: { include: { hashtag: true } },
      }),
      prisma.resultPost.count({ where }),
    ]);

    const transformed = results.map((r) => ({
      ...r,
      hashtagList: r.hashtags.map((h) => h.hashtag),
      hashtags: undefined,
    }));

    return NextResponse.json({
      results: transformed,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: page * limit < total },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = resultPostSchema.parse(body);
    const slug = validated.slug || slugify(validated.titleEn);

    const existing = await prisma.resultPost.findUnique({ where: { slug } });
    if (existing) {
      if (existing.status === "ACTIVE" || existing.status === "PENDING_REVIEW") {
        return NextResponse.json({ error: "A result with this slug already exists", existingId: existing.id }, { status: 409 });
      }
      // Revive CANCELLED/DRAFT record
      const { hashtags: _, ...rest } = validated as any;
      const updated = await prisma.resultPost.update({
        where: { slug },
        data: {
          ...rest,
          declarationDate: validated.declarationDate ? new Date(validated.declarationDate) : new Date(),
      status: (validated as any).status || "PENDING_REVIEW",
          publishedAt: new Date(),
          cutOffMarks: (rest as any).cutOffMarks || [],
          viewCount: 0,
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
      syncExamEventsFromPost("result", updated.id).catch(console.error);

      return NextResponse.json({ id: updated.id, slug: updated.slug, status: updated.status, revived: true }, { status: 200 });
    }

    const hashtagNames = validated.hashtags || [];
    const { hashtags: _, cutOffMarks: rawCutOff, ...rest } = validated as any;

    const createData: any = {
      ...rest,
      slug,
      declarationDate: validated.declarationDate ? new Date(validated.declarationDate) : new Date(),
      status: (validated as any).status || "PENDING_REVIEW",
      publishedAt: new Date(),
      cutOffMarks: rawCutOff || [],
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

    const result = await prisma.resultPost.create({
      data: createData,
      include: { hashtags: { include: { hashtag: true } } },
    });

    // Sync exam calendar
    syncExamEventsFromPost("result", result.id).catch(console.error);

    return NextResponse.json({ id: result.id, slug: result.slug, status: result.status }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 422 });
    }
    console.error("Error creating result:", error);
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 });
  }
}
