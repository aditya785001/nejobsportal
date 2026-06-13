import * as cheerio from "cheerio";
import { JOB_SOURCES, type ScrapeSource, INITIAL_MAX_AGE_DAYS, DAILY_WINDOW_HOURS } from "./config";
import { slugify } from "@/lib/utils/slugify";

// ─── Types ─────────────────────────────────────────────────────

export interface ScrapedPost {
  title: string;
  sourceUrl: string;
  postedDate: Date;
  content: string;
  description: string;
  imageUrl: string | null;
  /** Source display name */
  scrapeSource: string;
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

/**
 * Scrape a single source by ID (from JOB_SOURCES config).
 * Supports "wordpress-generic" and "blogger-generic" strategies.
 */
export async function scrapeSource(
  sourceId: string,
  mode: ScrapeMode = "daily"
): Promise<ScrapedPost[]> {
  const source = JOB_SOURCES.find((s) => s.id === sourceId);
  if (!source || !source.enabled) {
    console.log(`[scraper] Source "${sourceId}" disabled or not found`);
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

  if (source.strategy === "blogger-generic") {
    // Blogger uses a cursor-based pagination with "Older Posts" links
    let nextPageUrl: string | null = source.listingUrl;
    let page = 1;

    while (nextPageUrl && page <= 20) {
      console.log(`[scraper] Fetching ${source.name} page ${page}...`);
      const listingHtml = await fetchPage(nextPageUrl);
      if (!listingHtml) break;

      const $ = cheerio.load(listingHtml);
      const posts = extractBloggerListingPosts($, source.baseUrl);

      if (posts.length === 0) break;

      for (const post of posts) {
        // Date filtering
        if (post.postedDate < cutoffDate) {
          if (mode === "initial") {
            nextPageUrl = null;
            break;
          }
          continue;
        }

        if (mode === "daily" && post.postedDate < dailyWindowStart) {
          continue;
        }

        // Fetch detail page
        const detail = await fetchPage(post.url);
        if (!detail) continue;

        const parsed = parseDetailPage(detail, post, source, mode);
        allPosts.push(parsed);
      }

      if (!nextPageUrl) break;

      // Find "Older Posts" link for next page
      nextPageUrl = getBloggerNextPageUrl($, source.baseUrl);
      page++;
    }
  } else {
    // WordPress-style numeric pagination
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      console.log(`[scraper] Fetching ${source.name} page ${page}...`);
      const listingHtml = await fetchPage(
        source.listingUrl.replace("{page}", String(page))
      );
      if (!listingHtml) break;

      const $ = cheerio.load(listingHtml);
      const posts = extractWordPressListingPosts($, source.baseUrl);

      if (posts.length === 0) {
        hasMore = false;
        break;
      }

      for (const post of posts) {
        if (post.postedDate < cutoffDate) {
          if (mode === "initial") {
            hasMore = false;
            break;
          }
          continue;
        }

        if (mode === "daily" && post.postedDate < dailyWindowStart) {
          continue;
        }

        const detail = await fetchPage(post.url);
        if (!detail) continue;

        const parsed = parseDetailPage(detail, post, source, mode);
        allPosts.push(parsed);
      }

      if (!hasMore) break;

      // WordPress pagination detection
      hasMore = detectWordPressNextPage($, page);
      page++;

      if (page > 20) break;
    }
  }

  console.log(`[scraper] ${source.name}: found ${allPosts.length} eligible posts`);
  return allPosts;
}

// Keep the old name as an alias for backward compatibility
export async function scrapeJobAssam(
  mode: ScrapeMode = "daily"
): Promise<ScrapedPost[]> {
  return scrapeSource("jobassam", mode);
}

// ─── Blogger listing extraction ────────────────────────────────

function extractBloggerListingPosts(
  $: cheerio.CheerioAPI,
  baseUrl: string
): { title: string; url: string; postedDate: Date }[] {
  const posts: { title: string; url: string; postedDate: Date }[] = [];

  // Blogger homepage/search pages have posts with <h1> headings containing links,
  // and dates in <abbr> tags inside time elements or link elements.
  $("h1, h2").each((_i, el) => {
    const $heading = $(el);
    const $link = $heading.find("a");
    const href = $link.attr("href");
    const title = $link.text().trim() || $heading.text().trim();

    if (!href || !title || title.length < 5) return;

    // Skip non-post links
    if (href === baseUrl || href === "#" || href.includes("/search/label/") || href.includes("/p/")) return;

    const fullUrl = href.startsWith("http") ? href : `${baseUrl}${href}`;

    // Try to find date from the abbr tag in the surrounding context
    let dateText = "";
    const $section = $link.closest(".post, article, div, li, .blog-posts");
    if ($section.length) {
      const $abbr = $section.find("abbr");
      if ($abbr.length) {
        // Use the title attribute (ISO date) if available, else text
        dateText = $abbr.attr("title") || $abbr.text().trim();
      }
    }

    if (!dateText) {
      // Fallback: look for <abbr> anywhere in the same parent container
      const $abbr = $heading.parent().find("abbr");
      if ($abbr.length) {
        dateText = $abbr.attr("title") || $abbr.text().trim();
      }
    }

    const postedDate = parseDate(dateText) || new Date();

    if (!posts.some((p) => p.url === fullUrl)) {
      posts.push({ title, url: fullUrl, postedDate });
    }
  });

  // Fallback: look for all links that contain blogspot year/month patterns
  if (posts.length === 0) {
    $("a[href*='assamcareer.com/20']").each((_i, el) => {
      const $el = $(el);
      const href = $el.attr("href");
      const title = $el.text().trim();
      if (!href || !title || title.length < 5) return;
      if (posts.some((p) => p.url === href)) return;
      // Skip label, page, and search links
      if (href.includes("/search/") || href.includes("/p/")) return;

      const fullUrl = href.startsWith("http") ? href : `${baseUrl}${href}`;
      const $abbr = $el.closest(".post, article, div, li").find("abbr").first();
      const dateText = $abbr.attr("title") || $abbr.text().trim() || "";
      const postedDate = parseDate(dateText) || new Date();
      posts.push({ title, url: fullUrl, postedDate });
    });
  }

  return posts;
}

function getBloggerNextPageUrl(
  $: cheerio.CheerioAPI,
  baseUrl: string
): string | null {
  // Blogger "Older Posts" link is usually an anchor with class blog-pager-older-link
  const olderLink =
    $("a.blog-pager-older-link").attr("href") ||
    $("a#blog-pager-older-link").attr("href") ||
    $('.blog-pager a:contains("Older Posts")').attr("href");

  // Also check for the "Home" link or nav with rel=next
  const nextLink =
    olderLink ||
    $('link[rel="next"]').attr("href") ||
    $("a[rel='next']").attr("href");

  if (nextLink) {
    // Ensure full URL
    return nextLink.startsWith("http") ? nextLink : `${baseUrl}${nextLink}`;
  }

  return null;
}

// ─── WordPress listing extraction (existing) ───────────────────

function extractWordPressListingPosts(
  $: cheerio.CheerioAPI,
  baseUrl: string
): { title: string; url: string; postedDate: Date }[] {
  const posts: { title: string; url: string; postedDate: Date }[] = [];

  // JobAssam.in uses GenerateBlocks (Gutenberg blocks) with a custom post grid.
  $("a.gb-loop-item.post-grid-item").each((_i, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href || href === "#" || href === baseUrl) return;

    const fullUrl = href.startsWith("http")
      ? href
      : `${baseUrl}${href.startsWith("/") ? "" : "/"}${href}`;

    const title = $el.find(".post-grid-title").text().trim();
    if (!title || title.length < 5) return;

    const metaItems = $el.find(".post-grid-meta-item .gb-text");
    let dateText = "";
    metaItems.each((_j, metaEl) => {
      const text = $(metaEl).text().trim();
      if (/\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i.test(text)) {
        dateText = text;
      }
    });

    if (!dateText && metaItems.length >= 2) {
      dateText = $(metaItems[1]).text().trim();
    }

    const postedDate = parseDate(dateText) || new Date();

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

function detectWordPressNextPage($: cheerio.CheerioAPI, currentPage: number): boolean {
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

  return !!(nextBtn || maxPage > currentPage);
}

// ─── Detail page parsing ──────────────────────────────────────

function parseDetailPage(
  html: string,
  listing: { title: string; url: string; postedDate: Date },
  source: ScrapeSource,
  mode: ScrapeMode
): ScrapedPost {
  const $ = cheerio.load(html);

  // 1. Extract meta info
  const title =
    $("meta[property='og:title']").attr("content") ||
    $("h1.entry-title").text().trim() ||
    $("h1.post-title").text().trim() ||
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

  // Content area: try multiple selectors depending on CMS
  const articleBody = $(
    ".dynamic-entry-content, .post-body, .entry-content, article, .post-content, .single-content, main"
  ).first();
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
  const department = guessDepartment(title, content) || source.name;
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
    scrapeSource: source.name,
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

// ─── FAQ extraction from JSON-LD ───────────────────────────────

function extractFAQ($: cheerio.CheerioAPI): Record<string, string> {
  const faq: Record<string, string> = {};

  // Parse JSON-LD for FAQ data (Rank Math plugin or any schema)
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
  for (const [q, a] of Object.entries(faq)) {
    if (q.includes("vacanc") || q.includes("post") || q.includes("how many")) {
      const nums = a.match(/\b(\d[\d,]*)\b/g);
      if (nums) {
        const largest = Math.max(...nums.map((n) => parseInt(n.replace(/,/g, ""))));
        if (largest > 0 && largest < 100000) return largest;
      }
    }
  }

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

  const vacRegex =
    /(?:total|number of|no\.?\s*of)\s*vacanc(?:y|ies)\s*(?::|is|are)?\s*(\d[\d,]*)/i;
  const match = vacRegex.exec(content);
  if (match) {
    const num = parseInt(match[1].replace(/,/g, ""));
    if (num > 0 && num < 100000) return num;
  }

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
  for (const [q, a] of Object.entries(faq)) {
    if (
      q.includes("qualification") ||
      q.includes("eligibility") ||
      q.includes("education")
    ) {
      return a.trim().slice(0, 500);
    }
  }

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
    if (href && href !== "#" && !href.includes("assamcareer.com") && !href.includes("jobassam.in")) {
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
  const orgPatterns = [
    /(?:by|of|at|–|—|-|–)\s*([A-Z][A-Za-z\s.]+(?:Commission|Board|Authority|Department|Institute|University|Corporation|Bank|Ministry|Office|Organisation|Organization|Cell|Directorate))/,
    /^([A-Z][A-Za-z\s.]+(?:Recruitment|Notification|Exam))/,
  ];

  for (const pattern of orgPatterns) {
    const match = pattern.exec(title);
    if (match) return match[1].trim().slice(0, 100);
  }

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

  return "StateGovt";
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
  for (const [q, a] of Object.entries(faq)) {
    if (q.includes("age") || q.includes("age limit") || q.includes("age criteria")) {
      const ageMatch = a.match(/\b(\d+)\s*(?:to|–|-)\s*(\d+)\s*years?\b/i);
      if (ageMatch) return `${ageMatch[1]}-${ageMatch[2]} years`;
      const singleAge = a.match(/\b(\d+)\s*years?\b/i);
      if (singleAge) return singleAge[0];
    }
  }

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

  const ageRegex =
    /age\s*limit\s*(?::|–|—|-)?\s*(\d+\s*(?:to|–|-)\s*\d+\s*years?)/i;
  const match = ageRegex.exec(content);
  if (match) return match[1].trim();

  return null;
}

// ─── Helpers ──────────────────────────────────────────────────

async function fetchPage(url: string): Promise<string | null> {
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

  const cleaned = text.trim().replace(/\s+/g, " ");

  // Try ISO date string first (common in Blogger <abbr title="...">)
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (isoMatch) {
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d;
  }

  const formats = [
    /^(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i,
    /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s*(\d{4})/i,
    /^(\d{4})-(\d{2})-(\d{2})/,
    /^(\d{2})\/(\d{2})\/(\d{4})/,
  ];

  for (const fmt of formats) {
    const match = cleaned.match(fmt);
    if (match) {
      if (fmt === formats[0]) {
        const d = new Date(`${match[2]} ${match[1]}, ${match[3]}`);
        if (!isNaN(d.getTime())) return d;
      } else if (fmt === formats[1]) {
        const d = new Date(`${match[1]} ${match[2]}, ${match[3]}`);
        if (!isNaN(d.getTime())) return d;
      } else if (fmt === formats[2]) {
        const d = new Date(cleaned);
        if (!isNaN(d.getTime())) return d;
      } else if (fmt === formats[3]) {
        let d = new Date(`${match[3]}-${match[2]}-${match[1]}`);
        if (!isNaN(d.getTime())) return d;
        d = new Date(`${match[3]}-${match[1]}-${match[2]}`);
        if (!isNaN(d.getTime())) return d;
      }
    }
  }

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
