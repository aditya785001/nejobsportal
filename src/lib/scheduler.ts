let initialized = false;

/**
 * Starts the daily auto-digest AND job scraper scheduler.
 * - Runs immediately on server startup (jobs: daily mode, digest: if missing)
 * - Then runs daily at 6:00 AM IST (00:30 UTC).
 *
 * All Node.js-specific imports (prisma, node-cron) are lazy/dynamic to
 * prevent Turbopack from bundling them for Edge Runtime or browser.
 */
export async function startScheduler() {
  if (initialized) return;
  initialized = true;

  // Only run in Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === "edge") return;

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // Dynamic import: Prisma client (uses node:path — not available in Edge)
    const { prisma } = await import("@/lib/prisma");

    // Dynamic import: node-cron (uses node:crypto — not available in Edge)
    const { default: cron } = await import("node-cron");

    // ── Schedule: daily at 6:00 AM IST (00:30 UTC) ──────────────
    cron.schedule("30 0 * * *", () => {
      console.log("[Scheduler] Daily cron: starting daily tasks...");

      runDigestIfNeeded(prisma, BASE_URL).catch((err) =>
        console.error("[Scheduler] Cron digest check failed:", err)
      );
      scrapeJobsIfNeeded(BASE_URL).catch((err) =>
        console.error("[Scheduler] Cron job scrape failed:", err)
      );
      runDailyQuizIfNeeded(prisma).catch((err) =>
        console.error("[Scheduler] Cron quiz generation failed:", err)
      );
    });

    console.log("[Scheduler] Daily scheduler active (cron: 6:00 AM IST) — digest + job scraper + daily quiz");
  } catch (err) {
    console.error("[Scheduler] Failed to initialize:", err);
    return;
  }

  // ── Startup check: generate immediately if missing ──────────
  queueMicrotask(async () => {
    console.log("[Scheduler] Startup check: looking for today's digest and jobs...");
    const { prisma } = await import("@/lib/prisma");

    await Promise.allSettled([
      runDigestIfNeeded(prisma, BASE_URL),
      scrapeJobsIfNeeded(BASE_URL),
      runDailyQuizIfNeeded(prisma),
    ]);
  });
}

// ──────────────────────────────────────────────────────────────────

async function scrapeJobsIfNeeded(baseUrl: string) {
  try {
    console.log("[Scheduler] Running daily job scraper...");
    const res = await fetch(`${baseUrl}/api/jobs/scrape?mode=daily`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json() as { summary?: { found?: number; created?: number } };
      console.log(
        `[Scheduler] Job scraper: ${data.summary?.found || 0} found, ${data.summary?.created || 0} created`
      );
    } else {
      const errText = await res.text();
      console.error(`[Scheduler] Job scrape failed (${res.status}): ${errText.substring(0, 500)}`);
    }
  } catch (err) {
    console.error("[Scheduler] Error in job scraper:", err);
  }
}

// ──────────────────────────────────────────────────────────────────

async function runDigestIfNeeded(
  prisma: import("@prisma/client").PrismaClient,
  baseUrl: string
) {
  try {
    // 1. Check if any article exists for today's digest
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.currentAffair.findFirst({
      where: {
        digestDate: { gte: todayStart, lte: todayEnd },
      },
    });

    if (existing) {
      console.log("[Scheduler] Today's digest already exists. Skipping.");
      return;
    }

    // 2. Generate digest
    console.log("[Scheduler] No digest for today. Generating...");
    const res = await fetch(`${baseUrl}/api/gk/auto-digest`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json() as { summary?: { totalSelected?: number } };
      console.log(
        `[Scheduler] Digest generated: ${data.summary?.totalSelected || 0} articles`
      );
    } else if (res.status === 409) {
      console.log("[Scheduler] Digest already exists (409). Skipping.");
    } else {
      const errText = await res.text();
      console.error(
        `[Scheduler] Digest generation failed (${res.status}): ${errText}`
      );
    }
  } catch (err) {
    console.error("[Scheduler] Error in digest generation:", err);
  }
}

// ──────────────────────────────────────────────────────────────────
// Daily Quiz Generation
// ──────────────────────────────────────────────────────────────────

const QUIZ_PILLAR_DISTRIBUTION: { pillar: string; count: number }[] = [
  { pillar: "GK", count: 3 },
  { pillar: "AssamGK", count: 2 },
  { pillar: "CurrentAffairs", count: 2 },
  { pillar: "Science", count: 1 },
  { pillar: "History", count: 1 },
  { pillar: "Polity", count: 1 },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function runDailyQuizIfNeeded(
  prisma: import("@prisma/client").PrismaClient
) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 86400000);

    // Check if today's quiz already exists
    const existingQuiz = await prisma.dailyQuiz.findFirst({
      where: {
        date: { gte: today, lt: tomorrow },
        publishedAt: { not: null },
      },
    });

    if (existingQuiz) {
      console.log("[Scheduler] Today's quiz already exists. Skipping.");
      return;
    }

    // Count available questions per pillar
    const pillarCounts = await Promise.all(
      QUIZ_PILLAR_DISTRIBUTION.map((d) =>
        prisma.quizQuestion.count({
          where: { pillar: d.pillar, status: "ACTIVE", section: "DAILY_QUIZ" },
        })
      )
    );

    const insufficient = QUIZ_PILLAR_DISTRIBUTION.filter(
      (d, i) => pillarCounts[i] < d.count
    );
    if (insufficient.length > 0) {
      console.log(
        `[Scheduler] Cannot generate quiz — insufficient questions: ${insufficient
          .map((d) => `${d.pillar} (need ${d.count}, have ${pillarCounts[QUIZ_PILLAR_DISTRIBUTION.indexOf(d)]})`)
          .join(", ")}`
      );
      return;
    }

    // Pick least-used questions per pillar
    const selected: {
      id: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string | null;
    }[] = [];

    for (const { pillar, count } of QUIZ_PILLAR_DISTRIBUTION) {
      const pool = await prisma.quizQuestion.findMany({
        where: { pillar, status: "ACTIVE", section: "DAILY_QUIZ" },
        orderBy: { timesUsed: "asc" },
      });
      const picked = shuffle(pool).slice(0, count);
      selected.push(...picked);
    }

    const finalQuestions = shuffle(selected).map((q) => ({
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));

    // Create the daily quiz
    await prisma.dailyQuiz.create({
      data: {
        date: today,
        questions: finalQuestions,
        pillar: "Mixed",
        createdBy: "SYSTEM",
        publishedAt: new Date(),
      },
    });

    // Bump usage counter
    await prisma.quizQuestion.updateMany({
      where: { id: { in: selected.map((q) => q.id) } },
      data: { timesUsed: { increment: 1 } },
    });

    console.log(`[Scheduler] Daily quiz generated: ${finalQuestions.length} questions`);
  } catch (err) {
    console.error("[Scheduler] Error generating daily quiz:", err);
  }
}
