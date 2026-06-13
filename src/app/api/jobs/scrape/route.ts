import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JOB_SOURCES } from "@/lib/scrapers/config";
import { scrapeSource } from "@/lib/scrapers/jobassam";
import { slugify } from "@/lib/utils/slugify";
import { syncExamEventsFromPost } from "@/lib/exam-calendar";

// ─── POST /api/jobs/scrape — Trigger job scraper ──────────────

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") === "initial" ? "initial" : "daily";

    console.log(`[jobs/scrape] Starting scrape in ${mode} mode...`);

    // 1. Scrape all enabled sources
    const enabledSources = JOB_SOURCES.filter((s) => s.enabled);
    const allSourcePosts = await Promise.all(
      enabledSources.map((s) => scrapeSource(s.id, mode))
    );
    // Deduplicate across sources by URL (same post may appear on multiple sites)
    const seenUrls = new Set<string>();
    const scrapedPosts = allSourcePosts.flat().filter((p) => {
      if (seenUrls.has(p.sourceUrl)) return false;
      seenUrls.add(p.sourceUrl);
      return true;
    });

    if (scrapedPosts.length === 0) {
      return NextResponse.json({
        success: true,
        summary: {
          mode,
          found: 0,
          created: 0,
          skipped: 0,
          message: "No eligible posts found.",
        },
      });
    }

    // 2. Deduplicate against existing JobPost records
    const deduped = await deduplicate(scrapedPosts);

    // 3. Store as PENDING_REVIEW
    const created: { title: string; slug: string; id: string }[] = [];
    const skipped: { title: string; reason: string }[] = [];

    for (const post of deduped) {
      try {
        const slug = slugify(post.title);
        const lastDate = post.lastDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // Check slug conflict again (safety)
        const existingSlug = await prisma.jobPost.findUnique({
          where: { slug },
          select: { id: true },
        });
        if (existingSlug) {
          skipped.push({
            title: post.title,
            reason: "Slug conflict with existing post",
          });
          continue;
        }

        const job = await prisma.jobPost.create({
          data: {
            titleEn: post.title.slice(0, 500),
            titleAs: "",
            slug,
            department: post.department.slice(0, 100),
            state: post.state as any,
            category: post.category,
            jobType: "FullTime",
            selectionType: post.selectionType as any,
            totalVacancies: post.totalVacancies,
            payScale: post.payScale,
            qualification: post.qualification.slice(0, 500),
            ageLimit: post.ageLimit,
            lastDate,
            applicationUrl: post.applicationUrl || "",
            fee: {},
            howToApplyEn: post.howToApply.slice(0, 5000),
            howToApplyAs: "",
            importantDates: [],
            disclaimer:
              "All details are sourced from official notifications. Verify on the official portal before applying.",
            resources: [],
            notificationPdfUrl: post.imageUrl,
            summaryEn: post.description.slice(0, 2000) || post.title,
            summaryAs: "",
            contentEn: post.content.slice(0, 50000),
            status: "PENDING_REVIEW",
            publishedAt: post.postedDate,
            scrapeSource: post.scrapeSource,
            scrapeTimestamp: new Date(),
          },
        });

        created.push({ title: post.title, slug, id: job.id });

        // Sync exam calendar in background
        syncExamEventsFromPost("job", job.id).catch(() => {});
      } catch (err: any) {
        if (err?.code === "P2002") {
          skipped.push({ title: post.title, reason: "Unique constraint violation (duplicate)" });
        } else {
          console.error(`[jobs/scrape] Error creating post "${post.title}":`, err.message);
          skipped.push({ title: post.title, reason: err.message });
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        mode,
        found: scrapedPosts.length,
        created: created.length,
        skipped: skipped.length,
        createdPosts: created,
        skippedPosts: skipped,
      },
    });
  } catch (error: any) {
    console.error("[jobs/scrape] Fatal error:", error);
    return NextResponse.json(
      { error: "Scraping failed", detail: error.message },
      { status: 500 }
    );
  }
}

// ─── GET /api/jobs/scrape — Check status ──────────────────────

export async function GET() {
  return NextResponse.json({
    status: "ready",
    lastRun: null,
    sources: JOB_SOURCES.filter(s => s.enabled).map(s => ({
      id: s.id,
      name: s.name,
      enabled: s.enabled,
    })),
  });
}

// ─── Deduplication ────────────────────────────────────────────

async function deduplicate<T extends { title: string; sourceUrl: string; lastDate: Date | null }>(posts: T[]): Promise<T[]> {
  const results: T[] = [];
  const existingPosts = await prisma.jobPost.findMany({
    where: {
      status: { in: ["ACTIVE", "PENDING_REVIEW"] },
    },
    select: { titleEn: true, applicationUrl: true, lastDate: true },
  });

  for (const post of posts) {
    let isDuplicate = false;

    for (const existing of existingPosts) {
      // Check by application URL
      if (post.lastDate && existing.applicationUrl && post.sourceUrl.includes(existing.applicationUrl)) {
        isDuplicate = true;
        break;
      }

      // Check by title similarity (if same last date)
      if (post.lastDate && existing.lastDate) {
        const diffMs = Math.abs(post.lastDate.getTime() - existing.lastDate.getTime());
        if (diffMs < 24 * 60 * 60 * 1000) {
          // Same day — check title overlap
          const titleWords = post.title.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          const existingWords = existing.titleEn.toLowerCase().split(/\s+/).filter(w => w.length > 4);
          const common = titleWords.filter(w => existingWords.includes(w));
          if (common.length >= 3 || (titleWords.length > 0 && common.length / titleWords.length > 0.4)) {
            isDuplicate = true;
            break;
          }
        }
      }
    }

    if (!isDuplicate) {
      results.push(post);
    }
  }

  return results;
}
