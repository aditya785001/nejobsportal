import * as cheerio from "cheerio";
import { JOB_SOURCES, INITIAL_MAX_AGE_DAYS, DAILY_WINDOW_HOURS } from "./config";
import { slugify } from "@/lib/utils/slugify";

// ─── Types ─────────────────────────────────────────────────────

export interface ScrapedPost {
  title: string;
  sourceUrl: string;
  postedDate: Date;
  content: string;
  description: string;
  imageUrl: string | null;
  /** Parsed structured fields */
  lastDate: Date | null;
  totalVacancies: number | null;
  qualification: string;
  applicationUrl: string;
  department: string;
  category: JobCategoryGuess;
  state: string;
  selectionType: string;
  howToApply: string;
  payScale: string | null;
  ageLimit: string | null;
}

type JobCategoryGuess =
  | "StateGovt"
  | "CentralGovt"
  | "Private"
  | "NGO"
  | "PublicSector"
  | "Defense"
  | "Banking"
  | "Teaching"
  | "Research";

type ScrapeMode = "initial" | "daily";

// ─── Main scrape function ──────────────────────────────────────

export async function scrapeJobAssam(
  mode: ScrapeMode = "daily"
): Promise<ScrapedPost[]> {
  const source = JOB_SOURCES.find((s) => s.id === "jobassam");
  if (!source || !source.enabled) {
    console.log("[scraper] JobAssam source disabled or not found");
    return [];
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(
    cutoffDate.getDate() - (mode === "initial" ? INITIAL_MAX_AGE_DAYS : 0)
  );
  const dailyWindowStart = new Date(
    Date.now() - DAILY_WINDOW_HOURS * 60 * 60 * 1000
  );

  const allPosts: ScrapedPost[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    console.log(
      `[scraper] Fetching JobAssam page ${page}...`
    );
    const listingHtml = await fetchPage(
      source.listingUrl.replace("{page}", String(page))
    );
    if (!listingHtml) break;

    const $ = cheerio.load(listingHtml);
    const posts = extractListingPosts($, source.baseUrl);

    if (posts.length === 0) {
      hasMore = false;
      break;
    }

    for (const post of posts) {
      // Date filtering
      if (post.postedDate < cutoffDate) {
        // If initial mode and we hit old posts, stop entirely
        if (mode === "initial") {
          hasMore = false;
          break;
        }
        continue; // skip old posts in daily mode
      }

      // In daily mode, only take posts from the last 24h
      if (mode === "daily" && post.postedDate < dailyWindowStart) {
        continue;
      }

      // Fetch detail page
      const detail = await fetchPage(post.url);
      if (!detail) continue;

      const parsed = parseDetailPage(detail, post, source.name, mode);
      allPosts.push(parsed);
    }

    // If we broke out due to old posts, stop
    if (!hasMore) break;

    // Check pagination.
    // JobAssam uses GenerateBlocks pagination structure:
    //   <div class="pagination gb-query-loop-pagination">
    //     <nav class="pagination-number">
    //       <span class="page-numbers current">1</span>
    //       <a class="page-numbers" href=".../page/2/">2</a>
    //       ...
    //       <span class="page-numbers dots">…</span>
    //       <a class="page-numbers" href=".../page/8/">8</a>
    //     </nav>
    //     <a class="pagination-btn" href=".../page/2/">→</a>
    //   </div>
    const currentSpan = $("span.page-numbers.current").first();
    const currentPageNum = currentSpan.length ? parseInt(currentSpan.text().trim()) : page;

    // Find the highest page number among <a class="page-numbers">
    let maxPage = 0;
    $("a.page-numbers").each((_i, el) => {
      const match = $(el).attr("href")?.match(/\/page\/(\d+)\//);
      if (match) {
        const p = parseInt(match[1]);
        if (p > maxPage) maxPage = p;
      }
    });

    // Also check the pagination-btn next link
    const nextBtn = $("a.pagination-btn").attr("href");

    if (nextBtn || maxPage > currentPageNum) {
      // There are more pages
      page++;
    } else {
      hasMore = false;
    }

    // Safety limit — don't scrape more than 20 pages
    if (page > 20) break;
  }

  console.log(`[scraper] JobAssam: found ${allPosts.length} eligible posts`);
  return allPosts;
}

// ─── Listing page extraction ──────────────────────────────────

function extractListingPosts(
  $: cheerio.CheerioAPI,
  baseUrl: string
): { title: string; url: string; postedDate: Date }[] {
  const posts: { title: string; url: string; postedDate: Date }[] = [];

  // JobAssam.in uses GenerateBlocks (Gutenberg blocks) with a custom post grid.
  // Each listing post is an <a> with class "gb-loop-item post-grid-item".
  // Inside: <img> + <div class="post-grid-detail"> containing:
  //   <div class="gb-text post-grid-title"> — title text
  //   <div class="post-grid-meta">
  //     <div class="post-grid-meta-item"> — source (first)
  //     <div class="post-grid-meta-item"> — date  (second)
  $("a.gb-loop-item.post-grid-item").each((_i, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href || href === "#" || href === baseUrl) return;

    // Resolve relative URLs
    const fullUrl = href.startsWith("http")
      ? href
      : `${baseUrl}${href.startsWith("/") ? "" : "/"}${href}`;

    // Title from .post-grid-title
    const title = $el.find(".post-grid-title").text().trim();
    if (!title || title.length < 5) return;

    // Date from the second .post-grid-meta-item .gb-text (the calendar icon one)
    // Structure: two meta items — first has source name, second has date
    const metaItems = $el.find(".post-grid-meta-item .gb-text");
    let dateText = "";
    metaItems.each((_j, metaEl) => {
      const text = $(metaEl).text().trim();
      // The date meta item contains a date-like string (e.g. "9 June 2026")
      if (/\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i.test(text)) {
        dateText = text;
      }
    });

    // Fallback: just take the second meta item text
    if (!dateText && metaItems.length >= 2) {
      dateText = $(metaItems[1]).text().trim();
    }

    const postedDate = parseDate(dateText) || new Date();

    // Avoid duplicates by URL
    if (!posts.some((p) => p.url === fullUrl)) {
      posts.push({ title, url: fullUrl, postedDate });
    }
  });

  // Fallback: look for all links that look like post URLs
  if (posts.length === 0) {
    $("a[href*='/2026/'], a[href*='/2025/']").each((_i, el) => {
      const $el = $(el);
      const href = $el.attr("href");
      const title = $el.text().trim();
      if (!href || !title || title.length < 5) return;
      if (posts.some((p) => p.url === href)) return;

      const fullUrl = href.startsWith("http") ? href : `${baseUrl}${href}`;
      const dateText =
        $el.closest("article, .post, li, div").find("time, .date, .entry-date, .posted-on").text().trim();
      const postedDate = parseDate(dateText) || new Date();
      posts.push({ title, url: fullUrl, postedDate });
    });
  }

  return posts;
}

// ─── Detail page parsing ──────────────────────────────────────

function parseDetailPage(
  html: string,
  listing: { title: string; url: string; postedDate: Date },
  sourceName: string,
  mode: ScrapeMode
): ScrapedPost {
  const $ = cheerio.load(html);

  // 1. Extract meta info
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("h1.entry-title").text().trim() ||
    $("h1.gb-text").first().text().trim() ||
    $("h1").first().text().trim() ||
    listing.title;

  const description =
    $("meta[property='og:description']").attr("content") ||
    $("meta[name='description']").attr("content") ||
    "";

  const imageUrl =
    $("meta[property='og:image']").attr("content") || null;

  // Use published_time from article meta for a more accurate postedDate
  const publishedTime = $("meta[property='article:published_time']").attr("content");
  const detailPostedDate = publishedTime ? new Date(publishedTime) : null;
  if (detailPostedDate && !isNaN(detailPostedDate.getTime())) {
    listing.postedDate = detailPostedDate;
  }

  // Content area: JobAssam uses GenerateBlocks with dynamic-entry-content class
  const articleBody = $(".dynamic-entry-content, article, .entry-content, .post-content, .single-content").first() || $("main").first();
  const content = articleBody.length
    ? cleanContent(articleBody.text())
    : cleanContent($("body").text());

  // 2. Parse structured fields from FAQ, tables, and content
  const faq = extractFAQ($);
  const tables = extractTables($);

  const lastDate =
    parseLastDate(faq, tables, content) || null;
  const totalVacancies =
    parseVacancies(faq, tables, content) || null;
  const qualification =
    parseQualification(faq, tables, content) || "As per notification";
  const applicationUrl =
    parseApplicationUrl($, content) || listing.url;
  const department = guessDepartment(title, content) || sourceName;
  const category = guessCategory(title, content);
  const state = guessState(title, content);
  const selectionType = guessSelectionType(content);
  const howToApply = parseHowToApply($, content, applicationUrl);
  const payScale = parsePayScale(faq, tables, content);
  const ageLimit = parseAgeLimit(faq, tables, content);

  return {
    title,
    sourceUrl: listing.url,
    postedDate: listing.postedDate,
    content,
    description,
    imageUrl,
    lastDate,
    totalVacancies,
    qualification,
    applicationUrl,
    department,
    category,
    state,
    selectionType,
    howToApply,
    payScale,
    ageLimit,
  };
}

// ─── FAQ extraction from Rank Math JSON-LD ────────────────────

function extractFAQ($: cheerio.CheerioAPI): Record<string, string> {
  const faq: Record<string, string> = {};

  // Parse JSON-LD for FAQ data (Rank Math plugin)
  $('script[type="application/ld+json"]').each((_i, el) => {
    try {
      const json = JSON.parse($(el).html() || "{}");
      const graph = json["@graph"] || [json];
      for (const item of graph) {
        if (item.mainEntity && Array.isArray(item.mainEntity)) {
          for (const q of item.mainEntity) {
            if (q["@type"] === "Question" && q.name && q.acceptedAnswer) {
              const answer =
                typeof q.acceptedAnswer === "string"
                  ? q.acceptedAnswer
                  : q.acceptedAnswer.text || "";
              faq[q.name.toLowerCase()] = answer;
            }
          }
        }
      }
    } catch {
      // Not JSON or not FAQ data
    }
  });

  // Also check for visible FAQ on the page
  $(".rank-math-faq, .schema-faq").each((_i, el) => {
    $(el)
      .find(".rank-math-question, .schema-faq-question")
      .each((j, qEl) => {
        const question = $(qEl).text().trim().toLowerCase();
        const answer = $(qEl)
          .next(".rank-math-answer, .schema-faq-answer")
          .text()
          .trim();
        if (question && answer) {
          faq[question] = answer;
        }
      });
  });

  return faq;
}

// ─── Table extraction ─────────────────────────────────────────

function extractTables(
  $: cheerio.CheerioAPI
): { headers: string[]; rows: string[][] }[] {
  const tables: { headers: string[]; rows: string[][] }[] = [];

  $("table").each((_i, el) => {
    const $table = $(el);
    const headers: string[] = [];
    $table.find("th").each((_j, th) => {
      headers.push($(th).text().trim().toLowerCase());
    });

    const rows: string[][] = [];
    $table.find("tr").each((_j, tr) => {
      const cells: string[] = [];
      $(tr)
        .find("td, th")
        .each((_k, td) => {
          cells.push($(td).text().trim());
        });
      if (cells.length > 0) rows.push(cells);
    });

    if (headers.length > 0 || rows.length > 0) {
      tables.push({ headers, rows });
    }
  });

  return tables;
}

// ─── Field parsers ────────────────────────────────────────────

function parseLastDate(
  faq: Record<string, string>,
  tables: { headers: string[]; rows: string[][] }[],
  content: string
): Date | null {
  // Check FAQ
  for (const [q, a] of Object.entries(faq)) {
    if (
      q.includes("last date") ||
      q.includes("last day") ||
      q.includes("apply before") ||
      q.includes("deadline")
    ) {
      const d = parseDate(a);
      if (d) return d;
      // Also look for dates in the answer text
      const dateMatch = a.match(
        /(\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i
      );
      if (dateMatch) {
        const d = parseDate(dateMatch[0]);
        if (d) return d;
      }
    }
  }

  // Check tables
  for (const table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j].toLowerCase();
        if (
          cell.includes("last date") ||
          cell.includes("last day") ||
          cell.includes("deadline") ||
          cell.includes("apply date")
        ) {
          // Look at the next cell or same cell for date
          const dateStr = row[j + 1] || row[j];
          const d = parseDate(dateStr);
          if (d) return d;
        }
      }
    }
  }

  // Check content for "last date" patterns
  const lastDateRegex =
    /last\s*date\s*(?::|is|will be)?\s*(\d{1,2}\s+[A-Za-z]+\s+\d{4})/gi;
  const match = lastDateRegex.exec(content);
  if (match) {
    const d = parseDate(match[1]);
    if (d) return d;
  }

  return null;
}

function parseVacancies(
  faq: Record<string, string>,
  tables: { headers: string[]; rows: string[][] }[],
  content: string
): number | null {
  // Check FAQ
  for (const [q, a] of Object.entries(faq)) {
    if (q.includes("vacanc") || q.includes("post") || q.includes("how many")) {
      const nums = a.match(/\b(\d[\d,]*)\b/g);
      if (nums) {
        const largest = Math.max(...nums.map((n) => parseInt(n.replace(/,/g, ""))));
        if (largest > 0 && largest < 100000) return largest;
      }
    }
  }

  // Check tables
  for (const table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j].toLowerCase();
        if (
          cell.includes("vacanc") ||
          cell.includes("total post") ||
          cell.includes("no. of post") ||
          cell.includes("number of post")
        ) {
          const val = row[j + 1] || row[j];
          const nums = val.match(/\b(\d[\d,]*)\b/g);
          if (nums) {
            const num = parseInt(nums[0].replace(/,/g, ""));
            if (num > 0 && num < 100000) return num;
          }
        }
      }
    }
  }

  // Content fallback
  const vacRegex =
    /(?:total|number of|no\.?\s*of)\s*vacanc(?:y|ies)\s*(?::|is|are)?\s*(\d[\d,]*)/i;
  const match = vacRegex.exec(content);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ""));
    if (num > 0 && num < 100000) return num;
  }

  // Title fallback (e.g., "12,256 Posts")
  const titleVacRegex = /(\d[\d,]*)\s*posts?\b/i;
  const titleMatch = titleVacRegex.exec(content.slice(0, 200));
  if (titleMatch) {
    const num = parseInt(titleMatch[1].replace(/,/g, ""));
    if (num > 0 && num < 100000) return num;
  }

  return null;
}

function parseQualification(
  faq: Record<string, string>,
  tables: { headers: string[]; rows: string[][] }[],
  content: string
): string {
  // Check FAQ
  for (const [q, a] of Object.entries(faq)) {
    if (
      q.includes("qualification") ||
      q.includes("eligibility") ||
      q.includes("education")
    ) {
      return a.trim().slice(0, 500);
    }
  }

  // Check tables
  for (const table of tables) {
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j].toLowerCase();
        if (
          cell.includes("qualification") ||
          cell.includes("eligibility") ||
          cell.includes("education")
        ) {
          return (row[j + 1] || row[j]).trim().slice(0, 500);
        }
      }
    }
  }

  // Content fallback — look for qualification mentions
  const qualRegex =
    /(?:educational\s*)?qualification\s*(?::|–|—|-)?\s*([^.\n]+)/i;
  const match = qualRegex.exec(content);
  if (match) return match[1].trim().slice(0, 500);

  return "As per notification";
}

function parseApplicationUrl(
  $: cheerio.CheerioAPI,
  content: string
): string {
  // Look for "Apply Online" or "Apply Now" links
  const applyLinks = $(
    'a:contains("Apply"), a[href*="apply"], a[href*="online"]'
  );
  for (const el of applyLinks) {
    const href = $(el).attr("href");
    if (href && href !== "#" && !href.includes("jobassam.in")) {
      return href;
    }
  }

  // Look for obvious application URLs in content
  const urlRegex =
    /(https?:\/\/(?:www\.)?(?:ssc\b|upsc\b|rrb\b|ibps\b|bank\b|assam\b|[a-z]+\.gov\.in|apply\.\w+)\S*)/gi;
  const match = urlRegex.exec(content);
  if (match) return match[1];

  return "";
}

function guessDepartment(title: string, content: string): string {
  // Try to extract the organization/department from the title
  const orgPatterns = [
    /(?:by|of|at|–|—|-|–)\s*([A-Z][A-Za-z\s.]+(?:Commission|Board|Authority|Department|Institute|University|Corporation|Bank|Ministry|Office|Organisation|Organization|Cell|Directorate))/,
    /^([A-Z][A-Za-z\s.]+(?:Recruitment|Notification|Exam))/,
  ];

  for (const pattern of orgPatterns) {
    const match = pattern.exec(title);
    if (match) return match[1].trim().slice(0, 100);
  }

  // Fallback to the part before "Recruitment" or "Notification"
  const recMatch = title.match(
    /^(.+?)\s+(?:Recruitment|Notification|Exam|Admission|Result)/i
  );
  if (recMatch) return recMatch[1].trim().slice(0, 100);

  return title.split(/[–—\-|]/)[0]?.trim()?.slice(0, 100) || "Not specified";
}

function guessCategory(title: string, content: string): JobCategoryGuess {
  const text = `${title} ${content}`.toLowerCase();

  if (/\b(defence|army|navy|air\s*force|soldier|agniveer|crpf|bsf|itbp|assam\s*riffles)\b/.test(text))
    return "Defense";
  if (/\b(bank|sbi|rbi|ibps|banking\s*service)\b/.test(text))
    return "Banking";
  if (/\b(teacher|professor|lecturer|faculty|education|school|college|university)\b/.test(text))
    return "Teaching";
  if (/\b(research|scientist|research\s*fellow|jr\s?f)\b/.test(text))
    return "Research";
  if (/\b(central|india|all\s*india|union|ministry|department|commission|board)\b/i.test(text))
    return "CentralGovt";
  if (/\b(assam|state|apsc|public\s*service|directorate)\b/i.test(text))
    return "StateGovt";
  if (/\b(psu|public\s*sector|corporation|board|authority)\b/i.test(text))
    return "PublicSector";
  if (/\b(private|company|pvt|limited|ltd|corp)\b/i.test(text))
    return "Private";
  if (/\b(ngo|society|trust|foundation|non\s*profit)\b/i.test(text))
    return "NGO";

  return "StateGovt"; // Default for Assam-focused job sites
}

function guessState(
  title: string,
  content: string
): string {
  const text = `${title} ${content}`.toLowerCase();
  if (/\bassam\b/.test(text)) return "Assam";
  if (/\barunachal\b/.test(text)) return "ArunachalPradesh";
  if (/\bmanipur\b/.test(text)) return "Manipur";
  if (/\bmeghalaya\b/.test(text)) return "Meghalaya";
  if (/\bmizoram\b/.test(text)) return "Mizoram";
  if (/\bnagaland\b/.test(text)) return "Nagaland";
  if (/\bsikkim\b/.test(text)) return "Sikkim";
  if (/\btripura\b/.test(text)) return "Tripura";
  if (/\b(all india|national|india|central)\b/i.test(text))
    return "AllIndia";
  return "Assam";
}

function guessSelectionType(content: string): string {
  const text = content.toLowerCase();
  if (/\b(written\s*exam|computer.based|cbt|tier[\s-]?i)\b/.test(text))
    return "WrittenExam";
  if (/\binterview\b/.test(text) && !/\bwalk.in\b/.test(text))
    return "Interview";
  if (/\bmerit\b/.test(text) && !/\bexam\b/.test(text))
    return "Merit";
  if (/\bwalk.in\b/.test(text))
    return "WalkInInterview";
  if (/\bphysical\b/.test(text))
    return "PhysicalTest";
  if (/\btrade\s*test|skill\s*test|practical\b/.test(text))
    return "TradeTest";
  if (/\bdocument\s*verification\b/.test(text))
    return "DocumentVerification";
  return "WrittenExam";
}

function parseHowToApply(
  $: cheerio.CheerioAPI,
  content: string,
  applicationUrl: string
): string {
  // Look for "How to Apply" section
  const howToSection = $(
    'h2:contains("How to Apply"), h3:contains("How to Apply"), h2:contains("Application"), h3:contains("Application"), strong:contains("How to Apply")'
  );
  if (howToSection.length) {
    let text = "";
    let el = howToSection.next();
    for (let i = 0; i < 5 && el.length; i++) {
      if (el.is("h2, h3, h4, table, script, style")) break;
      text += el.text().trim() + " ";
      el = el.next();
    }
    if (text.trim()) return text.trim().slice(0, 1000);
  }

  // Content fallback
  const howToRegex =
    /how\s*to\s*apply\s*(?::|–|—|-)?\s*([^]+?)(?:\n\n|\n[A-Z]|$)/i;
  const match = howToRegex.exec(content);
  if (match) return match[1].trim().slice(0, 1000);

  return applicationUrl
    ? `Apply online through the official website: ${applicationUrl}`
    : "Refer to the official notification for application details.";
}

function parsePayScale(
  faq: Record<string, string>,
  tables: { headers: string[]; rows: string[][] }[],
  content: string
): string | null {
  // FAQ
  for (const [, a] of Object.entries(faq)) {
    if (
      a.includes("₹") ||
      a.includes("Rs") ||
      a.includes("salary") ||
      a.includes("pay scale") ||
      a.includes("remuneration")
    ) {
      const payMatch = a.match(/(?:₹|Rs\.?\s*)[\d,]+\s*(?:–|to|-)\s*(?:₹|Rs\.?\s*)?[\d,]+/i);
      if (payMatch) return payMatch[0];
    }
  }

  // Tables
  for (const table of tables) {
    for (const row of table.rows) {
      for (const cell of row) {
        const payMatch = cell.match(
          /(?:₹|Rs\.?\s*)[\d,]+\s*(?:–|to|-)\s*(?:₹|Rs\.?\s*)?[\d,]+/i
        );
        if (payMatch) return payMatch[0];
      }
    }
  }

  // Content
  const payRegex =
    /(?:pay\s*(?:scale|band|package)|salary|remuneration)\s*(?::|–|—|-)?\s*((?:₹|Rs\.?\s*)[\d,]+(?:\s*(?:–|to|-)\s*(?:₹|Rs\.?\s*)?[\d,]+)?)/i;
  const match = payRegex.exec(content);
  if (match) return match[1].trim();

  return null;
}

function parseAgeLimit(
  faq: Record<string, string>,
  tables: { headers: string[]; rows: string[][] }[],
  content: string
): string | null {
  // FAQ
  for (const [q, a] of Object.entries(faq)) {
    if (q.includes("age") || q.includes("age limit") || q.includes("age criteria")) {
      const ageMatch = a.match(/\b(\d+)\s*(?:to|–|-)\s*(\d+)\s*years?\b/i);
      if (ageMatch) return `${ageMatch[1]}-${ageMatch[2]} years`;
      const singleAge = a.match(/\b(\d+)\s*years?\b/i);
      if (singleAge) return singleAge[0];
    }
  }

  // Tables
  for (const table of tables) {
    for (const row of table.rows) {
      for (let j = 0; j < row.length; j++) {
        if (row[j].toLowerCase().includes("age")) {
          const val = row[j + 1] || row[j];
          const ageMatch = val.match(/\b(\d+)\s*(?:to|–|-)\s*(\d+)/);
          if (ageMatch) return `${ageMatch[1]}-${ageMatch[2]} years`;
        }
      }
    }
  }

  // Content
  const ageRegex =
    /age\s*limit\s*(?::|–|—|-)?\s*(\d+\s*(?:to|–|-)\s*\d+\s*years?)/i;
  const match = ageRegex.exec(content);
  if (match) return match[1].trim();

  return null;
}

// ─── Helpers ──────────────────────────────────────────────────

function fetchPage(url: string): Promise<string | null> {
  return fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  })
    .then((res) => {
      if (!res.ok) {
        console.warn(`[scraper] HTTP ${res.status} for ${url}`);
        return null;
      }
      return res.text();
    })
    .catch((err) => {
      console.warn(`[scraper] Fetch error for ${url}: ${err.message}`);
      return null;
    });
}

function parseDate(text: string): Date | null {
  if (!text || text.length < 5) return null;

  // Clean the text
  const cleaned = text.trim().replace(/\s+/g, " ");

  // Try common Indian date formats
  const formats = [
    // "9 June 2026"
    /^(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
    // "June 9, 2026" or "June 9 2026"
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s*(\d{4})/i,
    // "2026-06-09" (ISO)
    /^(\d{4})-(\d{2})-(\d{2})/,
    // "09/06/2026" or "06/09/2026"
    /^(\d{2})\/(\d{2})\/(\d{4})/,
  ];

  for (const fmt of formats) {
    const match = cleaned.match(fmt);
    if (match) {
      if (fmt === formats[0]) {
        // DD Month YYYY
        const d = new Date(`${match[2]} ${match[1]}, ${match[3]}`);
        if (!isNaN(d.getTime())) return d;
      } else if (fmt === formats[1]) {
        // Month DD, YYYY
        const d = new Date(`${match[1]} ${match[2]}, ${match[3]}`);
        if (!isNaN(d.getTime())) return d;
      } else if (fmt === formats[2]) {
        // ISO
        const d = new Date(cleaned);
        if (!isNaN(d.getTime())) return d;
      } else if (fmt === formats[3]) {
        // DD/MM/YYYY or MM/DD/YYYY — try both
        let d = new Date(`${match[3]}-${match[2]}-${match[1]}`);
        if (!isNaN(d.getTime())) return d;
        d = new Date(`${match[3]}-${match[1]}-${match[2]}`);
        if (!isNaN(d.getTime())) return d;
      }
    }
  }

  // Try native Date parsing as last resort
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;

  return null;
}

function cleanContent(text: string): string {
  return text
    .replace(/\t/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/ +/g, " ")
    .trim();
}
