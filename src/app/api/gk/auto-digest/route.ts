import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  requestOptions: { timeout: 20000 },
});

// ─── RSS sources ──────────────────────────────────────────────

interface RssSource {
  name: string;
  url: string;
}

const RSS_SOURCES: RssSource[] = [
  { name: "The Hindu", url: "https://www.thehindu.com/feeder/default.rss" },
  { name: "Indian Express", url: "https://indianexpress.com/feed/" },
  { name: "PIB", url: "https://www.pib.gov.in/Rss/rss.aspx" },
];

// ─── Inshorts API fetcher ─────────────────────────────────────

interface InshortsArticle {
  title: string;
  content: string;
  author_name: string;
  source_name: string;
  source_url: string;
  image_url: string;
  created_at: number; // Unix ms
}

async function fetchInshortsArticles(max = 25): Promise<InshortsArticle[]> {
  const url = `https://inshorts.com/api/en/news?category=top_stories&max_limit=${max}&include_card_data=true`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://inshorts.com/en/read",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const newsList = data.data?.news_list || [];
    return newsList
      .filter((item: any) => item.news_obj?.title)
      .map((item: any) => {
        const obj = item.news_obj;
        return {
          title: obj.title,
          content: obj.content || "",
          author_name: obj.author_name || "",
          source_name: obj.source_name || "Inshorts",
          source_url: obj.source_url || "",
          image_url: obj.image_url || "",
          created_at: obj.created_at || 0,
        };
      }) as InshortsArticle[];
  } catch {
    return [];
  }
}

// ─── Category keyword mapping ──────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Current Affairs": [
    "breaking", "latest", "today", "update", "news", "report",
    "arrest", "accident", "clash", "kidnap", "crime",
    "protest", "violence", "detained", "investigation",
    "curfew", "section 144",
  ],
  History: [
    "history", "historical", "heritage", "ancient", "medieval",
    "modern india", "archaeology", "museum", "monument",
  ],
  Polity: [
    "polity", "constitution", "parliament", "supreme court", "election",
    "governance", "bill", "amendment", "judiciary", "legislation",
    "lok sabha", "rajya sabha", "commission", "ordinance",
    "fundamental rights", "directive principles",
    "party", "minister", "mp", "mla", "govt", "policy", "democracy",
  ],
  "Science & Tech": [
    "science", "technology", "isro", "nasa", "space", "innovation",
    "patent", "satellite", "ai", "artificial intelligence", "robotics",
    "quantum", "blockchain", "cyber", "cybersecurity", "algorithm",
    "machine learning", "deep learning", "semiconductor",
    "chip", "processor", "supercomputer",
    "biotechnology", "nano", "gene", "dna", "vaccine trial",
    "observatory", "telescope", "asteroid", "orbit",
  ],
  Geography: [
    "geography", "climate", "environment", "ecosystem", "biodiversity",
    "river", "mountain", "forest", "wildlife", "monsoon", "disaster",
    "earthquake", "flood", "drought", "pollution", "conservation",
    "national park", "wetland", "ramsar", "glacier", "sea", "ocean",
  ],
  Economy: [
    "economy", "gdp", "finance", "budget", "inflation", "rupee", "market",
    "trade", "investment", "banking", "rbi", "fiscal", "monetary", "tax",
    "gst", "stock", "nifty", "sensex", "revenue", "fdi", "export", "import",
    "fiscal deficit", "economic growth",
  ],
  "Government Schemes": [
    "scheme", "yojana", "mission", "program", "initiative", "policy",
    "pradhan mantri", "central government", "welfare", "subsidy", "pension",
    "insurance", "ayushman", "digital india", "make in india",
    "financial assistance", "free transport",
  ],
  Sports: [
    "sports", "olympics", "world cup", "championship", "medal", "tournament",
    "cricket", "football", "athlete", "tennis", "badminton", "hockey",
    "chess", "kabaddi", "asian games", "commonwealth", "player", "coach",
  ],
  "Awards & Honours": [
    "award", "honour", "padma", "national award", "nobel", "bharat ratna",
    "gallantry award", "president", "medal", "fellowship", "honorary",
    "recognised", "recognition",
  ],
  "International Relations": [
    "international", "global", "summit", "treaty", "g20", "brics",
    "united nations", "saarc", "foreign", "diplomatic", "bilateral",
    "multilateral", "ambassador", "embassy", "consulate",
    "world bank", "imf", "wto", "unsc", "eu",
    "european union", "china", "usa", "russia", "pakistan",
  ],
  "Defence & Security": [
    "defence", "army", "navy", "air force", "security", "missile",
    "exercise", "border", "terrorism", "counter", "intelligence",
    "cyber attack", "drone", "weapon", "military", "strategic",
    "insurgent", "militant", "hostage", "ambush", "crackdown", "smuggling",
  ],
};

// ─── Helpers ──────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function extractImageUrl(item: any): string | null {
  const content = item.content || item["content:encoded"] || item.description || "";
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = content.match(imgRegex);
  if (match) return match[1];
  if (item["media:content"]?.$) return item["media:content"].$.url;
  if (item["media:thumbnail"]?.$) return item["media:thumbnail"].$.url;
  if (item.enclosure?.url) return item.enclosure.url;
  return null;
}

function classifyCategory(title: string, content: string): string {
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();
  let bestCategory = "Current Affairs";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wordCount = kw.split(" ").length;
      const pattern = `\\b${escaped}\\b`;
      const regex = new RegExp(pattern, "gi");

      // Title keywords count DOUBLE
      const titleMatches = titleLower.match(regex);
      if (titleMatches) score += titleMatches.length * wordCount * 2;

      // Content keywords count normal
      const contentMatches = contentLower.match(regex);
      if (contentMatches) score += contentMatches.length * wordCount;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }
  return bestCategory;
}

function scoreExamRelevance(title: string, content: string): number {
  const examKeywords = [
    "polity", "constitution", "economy", "gdp", "budget", "scheme", "yojana",
    "supreme court", "election", "parliament", "bill", "amendment",
    "international", "summit", "brics", "g20", "defence", "army",
    "environment", "climate", "biodiversity", "ramsar", "national park",
    "science", "technology", "isro", "nobel", "award", "padma",
    "sports", "olympics", "world cup",
  ];
  const text = `${title} ${content}`.toLowerCase();
  let score = 0;
  for (const kw of examKeywords) {
    const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const matches = text.match(regex);
    if (matches) score += matches.length;
  }
  return score;
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[–\-—|•·,.:;!?"'()]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b(the|a|an|in|on|at|to|for|of|by|with|and|or|is|are|was|were|has|have|had|its|their|his|her)\b/g, "")
    .trim();
}

function titleSimilarity(a: string, b: string): number {
  const normA = normalizeTitle(a);
  const normB = normalizeTitle(b);
  const wordsA = new Set(normA.split(/\s+/).filter(Boolean));
  const wordsB = new Set(normB.split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let common = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) common++;
  }
  const union = new Set([...wordsA, ...wordsB]);
  return common / union.size;
}

function generateSummary(item: any): string {
  // Try full content first (strip HTML, take ~130 words → ~100 word summary)
  const rawContent = item.content || item["content:encoded"] || "";
  if (rawContent) {
    const text = stripHtml(rawContent);
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 20) {
      const summary = words.slice(0, 130).join(" ");
      return words.length > 130 ? summary + "..." : summary;
    }
  }

  // Try contentSnippet (RSS auto-extracted text)
  const snippet = item.contentSnippet || "";
  if (snippet) {
    const words = snippet.split(/\s+/).filter(Boolean);
    if (words.length > 20) {
      const summary = words.slice(0, 130).join(" ");
      return words.length > 130 ? summary + "..." : summary;
    }
  }

  // Fallback
  const desc = item.description || "";
  if (desc) {
    const text = stripHtml(desc);
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 10) {
      return words.slice(0, 100).join(" ") + (words.length > 100 ? "..." : "");
    }
  }

  return `${item.title || ""}. Read the full article at the source.`;
}

// ─── POST /api/gk/auto-digest ─────────────────────────────────

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    // 1. Check if today's digest already exists
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingDigest = await prisma.currentAffair.findFirst({
      where: {
        digestDate: { gte: todayStart, lte: todayEnd },
      },
    });

    if (existingDigest) {
      if (force) {
        await prisma.currentAffair.deleteMany({
          where: { digestDate: { gte: todayStart, lte: todayEnd } },
        });
        console.log("Force mode: deleted existing digest, regenerating...");
      } else {
        return NextResponse.json(
          { error: "Today's digest already exists. Delete it first or wait until tomorrow." },
          { status: 409 }
        );
      }
    }

    // 2. Fetch from both RSS sources
    const allItems: {
      title: string;
      content: string;
      contentSnippet: string;
      sourceName: string;
      sourceUrl: string;
      imageUrl: string | null;
      pubDate: Date;
      rawItem: any;
    }[] = [];

    const fetchErrors: { source: string; error: string }[] = [];

    for (const source of RSS_SOURCES) {
      try {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items) {
          const title = item.title?.trim();
          if (!title) continue;

          let cleanTitle = title;
          // Remove trailing source attribution like " - The Hindu"
          cleanTitle = cleanTitle.replace(/\s*[–\-—|]\s*[A-Za-z\s]+$/g, "").trim();
          if (!cleanTitle || cleanTitle.length < 10) continue;

          allItems.push({
            title: cleanTitle,
            content: item.content || item["content:encoded"] || "",
            contentSnippet: item.contentSnippet || "",
            sourceName: source.name,
            sourceUrl: item.link || "",
            imageUrl: extractImageUrl(item),
            pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            rawItem: item,
          });
        }
      } catch (err: any) {
        fetchErrors.push({ source: source.name, error: err.message?.slice(0, 200) || "Unknown" });
      }
    }

    // 2.5 Fetch from Inshorts API
    try {
      const inshortsArticles = await fetchInshortsArticles(25);
      for (const a of inshortsArticles) {
        allItems.push({
          title: a.title,
          content: a.content,
          contentSnippet: a.content,
          sourceName: a.source_name || "Inshorts",
          sourceUrl: a.source_url,
          imageUrl: a.image_url,
          pubDate: a.created_at ? new Date(a.created_at) : new Date(),
          rawItem: { content: a.content, title: a.title, description: a.content, link: a.source_url, pubDate: a.created_at ? new Date(a.created_at).toUTCString() : new Date().toUTCString() },
        });
      }
    } catch {
      // Non-critical
    }

    // 3. Deduplicate by title similarity
    const unique: typeof allItems = [];
    const SIMILARITY_THRESHOLD = 0.6;

    for (const item of allItems) {
      let isDuplicate = false;
      for (const existing of unique) {
        if (titleSimilarity(item.title, existing.title) >= SIMILARITY_THRESHOLD) {
          isDuplicate = true;
          if (item.content.length > existing.content.length) {
            Object.assign(existing, item);
          }
          break;
        }
      }
      if (!isDuplicate) {
        unique.push(item);
      }
    }

    // 4. Score each article for exam relevance
    const scored = unique.map((item) => {
      const examScore = scoreExamRelevance(item.title, item.contentSnippet);
      const contentBonus = item.content.length > 200 ? 5 : item.contentSnippet.length > 100 ? 3 : 0;
      const recencyBonus = item.pubDate > new Date(Date.now() - 48 * 60 * 60 * 1000) ? 3 : 0;
      const totalScore = examScore * 2 + contentBonus + recencyBonus;

      return { item, score: totalScore, examScore };
    });

    // 5. Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // 6. Pick top 25 with category diversity
    const MAX_PER_CATEGORY = 6;
    const selected: typeof scored = [];
    const categoryCounts: Record<string, number> = {};

    const addEntry = (
      entry: (typeof scored)[number]
    ): void => {
      const cat = classifyCategory(entry.item.title, entry.item.contentSnippet);
      selected.push(entry);
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    };

    for (const entry of scored) {
      if (selected.length >= 25) break;
      if (selected.includes(entry)) continue;
      const cat = classifyCategory(entry.item.title, entry.item.contentSnippet);
      if ((categoryCounts[cat] || 0) >= MAX_PER_CATEGORY) continue;
      addEntry(entry);
    }

    // If still under 25 after category caps, fill remaining ignoring caps
    if (selected.length < 25) {
      for (const entry of scored) {
        if (selected.length >= 25) break;
        if (selected.includes(entry)) continue;
        addEntry(entry);
      }
    }

    const finalSelection = selected.slice(0, 25);

    // 7. Store in database
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let stored = 0;
    const articles: any[] = [];

    for (let i = 0; i < finalSelection.length; i++) {
      const entry = finalSelection[i];
      const item = entry.item;
      const category = classifyCategory(item.title, item.contentSnippet);
      const summary = generateSummary(item.rawItem);

      try {
        await prisma.currentAffair.create({
          data: {
            title: item.title,
            excerpt: item.contentSnippet.slice(0, 500),
            content: item.content.slice(0, 10000),
            summary,
            category,
            source: item.sourceName,
            sourceUrl: item.sourceUrl,
            imageUrl: item.imageUrl,
            tags: [],
            publishedAt: item.pubDate,
            digestDate: today,
            displayOrder: i + 1,
            isFeatured: i === 0,
          },
        });
        stored++;
        articles.push({
          title: item.title,
          category,
          source: item.sourceName,
          displayOrder: i + 1,
          summaryLength: summary.split(/\s+/).length,
        });
      } catch (createErr: any) {
        if (createErr.code === "P2002") continue; // skip dupes
      }
    }

    // 8. Return results
    return NextResponse.json({
      success: true,
      summary: {
        date: today.toISOString().split("T")[0],
        sourcesConsulted: RSS_SOURCES.length,
        fetchErrors: fetchErrors.length,
        totalFetched: allItems.length,
        totalUnique: unique.length,
        totalScored: scored.length,
        totalSelected: finalSelection.length,
        stored,
        categoryBreakdown: categoryCounts,
        articles,
      },
    });
  } catch (error) {
    console.error("Error in auto-digest:", error);
    return NextResponse.json({ error: "Failed to generate daily digest" }, { status: 500 });
  }
}
