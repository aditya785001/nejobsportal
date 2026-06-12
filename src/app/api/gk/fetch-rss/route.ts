import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Parser from "rss-parser";

const parser = new Parser({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  requestOptions: {
    timeout: 15000,
  },
});

// ── RSS feed configuration ──
interface RssSource {
  name: string;
  url: string;
  description: string;
  category: string | null; // null = auto-classify
}

const RSS_SOURCES: RssSource[] = [
  {
    name: "Google News India",
    url: "https://news.google.com/rss/search?q=India&hl=en-IN&gl=IN&ceid=IN:en",
    description: "Aggregated from 50+ Indian news sources — NDTV, India Today, Hindustan Times, ThePrint, Reuters, ANI & more",
    category: null,
  },
  {
    name: "The Hindu",
    url: "https://www.thehindu.com/feeder/default.rss",
    description: "Quality journalism — polity, economy, environment, opinion",
    category: null,
  },
  {
    name: "Indian Express",
    url: "https://indianexpress.com/feed/",
    description: "Politics, governance, current affairs, explainers",
    category: null,
  },
  {
    name: "Times of India",
    url: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
    description: "Broad coverage — national, world, sports, entertainment, tech",
    category: null,
  },
  {
    name: "BBC News India",
    url: "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml",
    description: "International perspective on India — unbiased reporting",
    category: "International",
  },
];

// ── Category keyword mapping ──
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Current Affairs": ["breaking", "latest", "today", "update", "news"],
  History: ["history", "historical", "heritage", "ancient", "medieval", "modern india", "archaeology", "museum"],
  Polity: [
    "polity", "constitution", "parliament", "supreme court", "election", "governance",
    "bill", "amendment", "judiciary", "legislation", "lok sabha", "rajya sabha",
    "commission", " ordinance", "fundamental rights", "directive principles",
  ],
  "Science & Tech": [
    "science", "technology", "isro", "nasa", "space", "research", "innovation",
    "patent", "launch", "satellite", "ai", "artificial intelligence", "robotics",
    "quantum", "blockchain", "cyber", "digital", "startup", "app", "software",
    "computer", "internet", "data", "algorithm", "machine learning",
  ],
  Geography: [
    "geography", "climate", "environment", "ecosystem", "biodiversity", "river",
    "mountain", "forest", "wildlife", "monsoon", "disaster", "earthquake",
    "flood", "drought", "pollution", "conservation", "national park",
  ],
  Economy: [
    "economy", "gdp", "finance", "budget", "inflation", "rupee", "market",
    "trade", "investment", "banking", "rbi", "fiscal", "monetary", "tax",
    "gst", "stock", "nifty", "sensex", "revenue", "fdi", "export", "import",
  ],
  Schemes: [
    "scheme", "yojana", "mission", "program", "initiative", "policy",
    "pradhan mantri", "central government", "welfare", "subsidy", "pension",
    "insurance", "ayushman", "digital india", "make in india",
  ],
  Sports: [
    "sports", "olympics", "world cup", "championship", "medal", "tournament",
    "cricket", "football", "athlete", "tennis", "badminton", "hockey",
    "chess", "kabaddi", "asian games", "commonwealth",
  ],
  "Awards & Honours": [
    "award", "honour", "padma", "national award", "nobel", "bharat ratna",
    "gallantry", "president", "medal", "fellowship", "honorary",
  ],
  "International Relations": [
    "international", "global", "summit", "treaty", "g-20", "brics", "united nations",
    "saarc", "foreign", "diplomatic", "bilateral", "multilateral", "ambassador",
    "embassy", "consulate", "world bank", "imf", "wto", "unsc",
  ],
  "Defence & Security": [
    "defence", "army", "navy", "air force", "security", "missile", "exercise",
    "border", "terrorism", "counter", "intelligence", "cyber attack",
    "drone", "weapon", "military", "strategic",
  ],
};

function classifyCategory(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  let bestCategory = "Current Affairs";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      // Count each occurrence in the text
      const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      const matches = text.match(regex);
      if (matches) {
        score += matches.length * kw.split(" ").length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

function extractImageUrl(item: any): string | null {
  // Try multiple RSS content fields for image
  const content = item.content || item["content:encoded"] || item.description || "";
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const match = content.match(imgRegex);
  if (match) return match[1];

  // Try media:content
  if (item["media:content"]?.$) return item["media:content"].$.url;
  if (item["media:thumbnail"]?.$) return item["media:thumbnail"].$.url;
  if (item.enclosure?.url) return item.enclosure.url;

  return null;
}

// ── POST /api/gk/fetch-rss — Fetch and store RSS articles ──
export async function POST() {
  try {
    const results: {
      source: string;
      description: string;
      fetched: number;
      stored: number;
      errors: string[];
    }[] = [];

    for (const source of RSS_SOURCES) {
      const result = {
        source: source.name,
        description: source.description,
        fetched: 0,
        stored: 0,
        errors: [] as string[],
      };

      try {
        const feed = await parser.parseURL(source.url);
        result.fetched = feed.items.length;

        for (const item of feed.items) {
          const title = item.title?.trim();
          if (!title) continue;

          // Clean Google News titles (remove source suffix like " - The Hindu")
          let cleanTitle = title;
          cleanTitle = cleanTitle.replace(/\s*[–\-—|]\s*[A-Za-z\s]+$/g, "").trim();
          if (!cleanTitle) continue;

          // Check if already exists (by title)
          const existing = await prisma.currentAffair.findFirst({
            where: { title: cleanTitle },
          });
          if (existing) continue;

          const content = item.content || item["content:encoded"] || item.contentSnippet || "";
          const snippet = item.contentSnippet?.slice(0, 500) || cleanTitle;
          const category = source.category || classifyCategory(cleanTitle, snippet);
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
          const imageUrl = extractImageUrl(item);

          await prisma.currentAffair.create({
            data: {
              title: cleanTitle,
              excerpt: snippet,
              content: content.slice(0, 5000) || null, // limit content size
              category,
              source: source.name,
              sourceUrl: item.link || null,
              imageUrl,
              tags: item.categories || [],
              publishedAt: pubDate,
            },
          });

          result.stored++;
        }
      } catch (err: any) {
        result.errors.push(err.message?.slice(0, 200) || "Unknown error");
      }

      results.push(result);
    }

    const totalFetched = results.reduce((s, r) => s + r.fetched, 0);
    const totalStored = results.reduce((s, r) => s + r.stored, 0);
    const totalErrors = results.reduce((s, r) => s + r.errors.length, 0);

    return NextResponse.json({
      success: true,
      summary: {
        totalFetched,
        totalStored,
        totalErrors,
        sources: results,
      },
    });
  } catch (error) {
    console.error("Error fetching RSS:", error);
    return NextResponse.json({ error: "Failed to fetch RSS feeds" }, { status: 500 });
  }
}
