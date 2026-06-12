"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";

const CATEGORIES = [
  { id: "", label: "All", icon: "📰" },
  { id: "Current Affairs", label: "Current Affairs", icon: "📰" },
  { id: "History", label: "History", icon: "📜" },
  { id: "Polity", label: "Polity", icon: "⚖️" },
  { id: "Science & Tech", label: "Science & Tech", icon: "🔬" },
  { id: "Geography", label: "Geography", icon: "🌍" },
  { id: "Economy", label: "Economy", icon: "💰" },
  { id: "Government Schemes", label: "Government Schemes", icon: "📋" },
  { id: "Sports", label: "Sports", icon: "🏆" },
  { id: "Awards & Honours", label: "Awards & Honours", icon: "🏅" },
  { id: "International Relations", label: "International Relations", icon: "🌐" },
  { id: "Defence & Security", label: "Defence & Security", icon: "🛡️" },
  { id: "Miscellaneous", label: "Miscellaneous", icon: "📦" },
];

const CATEGORY_ICONS: Record<string, string> = {};
for (const c of CATEGORIES) {
  CATEGORY_ICONS[c.id] = c.icon;
}

interface GKArticle {
  id: string;
  title: string;
  excerpt: string | null;
  summary: string | null;
  category: string | null;
  source: string | null;
  sourceUrl: string | null;
  imageUrl: string | null;
  tags: string[];
  publishedAt: string | null;
  digestDate: string | null;
  displayOrder: number | null;
  isFeatured: boolean;
  createdAt: string;
}

interface DigestInfo {
  date: string;
  totalArticles: number;
  categories: { name: string; count: number }[];
  sources: { name: string; count: number }[];
}

export default function GKPage() {
  const language = useLanguageStore((s) => s.language);
  const t = (en: string, as: string) => (language === "as" ? as : en);

  const [articles, setArticles] = useState<GKArticle[]>([]);
  const [digestInfo, setDigestInfo] = useState<DigestInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("latest");
  const [error, setError] = useState<string | null>(null);

  // Compute available dates from fetched digest info
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set("category", activeCategory);
        if (selectedDate === "latest") {
          params.set("latest", "true");
        } else {
          params.set("date", selectedDate);
        }

        const res = await fetch(`/api/gk?${params}`);
        if (!res.ok) {
          if (res.status === 404) {
            setArticles([]);
            setDigestInfo(null);
            return;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setArticles(data.articles || []);
        setDigestInfo(data.digest || null);
      } catch (err) {
        console.error("Failed to fetch GK articles:", err);
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [activeCategory, selectedDate]);

  // Load available dates for navigation (on mount)
  useEffect(() => {
    async function loadAvailableDates() {
      try {
        const res = await fetch("/api/gk/available-dates");
        if (res.ok) {
          const data = await res.json();
          setAvailableDates(data.dates || []);
        }
      } catch {
        // Non-critical
      }
    }
    loadAvailableDates();
  }, []);

  const isTodaySelected =
    selectedDate === "latest" ||
    (digestInfo?.date === new Date().toISOString().split("T")[0]);

  const prevDate = () => {
    if (!digestInfo?.date) return;
    const current = new Date(digestInfo.date + "T00:00:00");
    const prev = new Date(current);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev.toISOString().split("T")[0]);
  };

  const nextDate = () => {
    if (!digestInfo?.date) return;
    const current = new Date(digestInfo.date + "T00:00:00");
    const next = new Date(current);
    next.setDate(next.getDate() + 1);
    const today = new Date().toISOString().split("T")[0];
    const nextStr = next.toISOString().split("T")[0];
    if (nextStr > today) {
      setSelectedDate("latest");
    } else {
      setSelectedDate(nextStr);
    }
  };

  const goToToday = () => {
    setSelectedDate("latest");
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split("T")[0]) return t("Today", "আজি");
    if (dateStr === yesterday.toISOString().split("T")[0]) return t("Yesterday", "কালি");

    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const featured = articles.find((a) => a.isFeatured);
  const regular = articles.filter((a) => !a.isFeatured);

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/study-materials" className="hover:text-[#1a6b3c] no-underline">
          {t("Study Materials", "অধ্যয়ন সামগ্ৰী")}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {t("GK & Current Affairs", "সাধাৰণ জ্ঞান")}
        </span>
      </nav>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 mb-6">
        <div className="relative z-10 px-8 py-10 md:py-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">🧠</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {t("Daily GK & Current Affairs", "দৈনিক সাধাৰণ জ্ঞান আৰু বৰ্তমান ঘটনা")}
              </h1>
              <p className="text-white/80 mt-1">
                {t(
                  "25 curated news every day — Assam + National — for all competitive exams",
                  "প্ৰতিদিনে ২৫টা নিৰ্বাচিত বাতৰি — অসম + ৰাষ্ট্ৰীয় — সকলো প্ৰতিযোগিতামূলক পৰীক্ষাৰ বাবে"
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Digest Info Bar & Date Navigation */}
      {digestInfo && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Date navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevDate}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                title={t("Previous day", "পূৰ্বৱৰ্তী দিন")}
              >
                ←
              </button>
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  {formatDate(digestInfo.date)}
                </div>
                {isTodaySelected && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {t("Today's Digest", "আজিৰ ডাইজেষ্ট")}
                  </span>
                )}
              </div>
              <button
                onClick={nextDate}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                title={t("Next day", "পৰৱৰ্তী দিন")}
              >
                →
              </button>
              {!isTodaySelected && (
                <button
                  onClick={goToToday}
                  className="text-xs text-[#1a6b3c] hover:underline ml-2"
                >
                  {t("Go to Today", "আজিলৈ যাওক")}
                </button>
              )}
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                📰 {digestInfo.totalArticles} {t("articles", "বাতৰি")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                🗺️ {digestInfo.sources.length} {t("sources", "উৎস")}
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                📊 {digestInfo.categories.length} {t("categories", "শ্ৰেণী")}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => {
          const count = digestInfo?.categories?.find((c) => c.name === cat.id)?.count;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {count !== undefined && count > 0 && (
                <span className="text-[10px] opacity-60">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {/* Featured skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-6 w-1/3 skeleton mb-3" />
            <div className="h-8 w-3/4 skeleton mb-4" />
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-2/3 skeleton" />
            </div>
          </div>
          {/* Grid skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="h-4 w-1/4 skeleton mb-3" />
                <div className="h-5 w-3/4 skeleton mb-3" />
                <div className="space-y-2">
                  <div className="h-3 w-full skeleton" />
                  <div className="h-3 w-5/6 skeleton" />
                  <div className="h-3 w-4/6 skeleton" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        /* Error state */
        <div className="text-center py-16">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("Something went wrong", "কিবা এটা সমস্যা হৈছে")}
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100"
          >
            {t("Retry", "পুনৰ চেষ্টা কৰক")}
          </button>
        </div>
      ) : articles.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🧠</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedDate === "latest"
              ? t("No digest for today yet", "আজিৰ বাবে এতিয়াও ডাইজেষ্ট প্ৰস্তুত হোৱা নাই")
              : t("No articles found", "কোনো বাতৰি পোৱা নগ'ল")}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {selectedDate === "latest"
              ? t(
                  "Today's curated GK digest hasn't been generated yet. It is usually ready by morning.",
                  "আজিৰ নিৰ্বাচিত জি.কে. ডাইজেষ্ট এতিয়াও প্ৰস্তুত হোৱা নাই। সাধাৰণতে পুৱালৈ প্ৰস্তুত হয়।"
                )
              : t(
                  "No curated articles for this date. Try a different date.",
                  "এই তাৰিখৰ বাবে কোনো নিৰ্বাচিত বাতৰি নাই। বেলেগ তাৰিখ চাওক।"
                )}
          </p>
          {selectedDate !== "latest" && (
            <button
              onClick={goToToday}
              className="mt-4 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100"
            >
              {t("View Today's Digest", "আজিৰ ডাইজেষ্ট চাওক")}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {featured && activeCategory === "" && (
            <div className="mb-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-amber-200 text-amber-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {t("Top Story", "আজিৰ মুখ্য বাতৰি")}
                  </span>
                  <span className="text-xs font-medium bg-white text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                    {CATEGORY_ICONS[featured.category || ""] || "📰"} {featured.category || "Current Affairs"}
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">{featured.source}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {featured.title}
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {featured.summary || featured.excerpt || ""}
                </p>
                {featured.sourceUrl && (
                  <a
                    href={featured.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a6b3c] hover:underline"
                  >
                    {t("Read Full Article →", "সম্পূৰ্ণ প্ৰবন্ধ পঢ়ক →")}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regular.map((article, idx) => (
              <div
                key={article.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-amber-200 hover:shadow-sm transition-all"
              >
                {/* Header row: number + category + source */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-400 w-5">
                    #{article.displayOrder || idx + 1}
                  </span>
                  <span className="text-xs font-medium bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    {CATEGORY_ICONS[article.category || ""] || "📰"} {article.category || "General"}
                  </span>
                  {article.source && (
                    <span className="text-[10px] text-gray-400 ml-auto truncate max-w-[120px]">
                      {article.source}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>

                {/* Summary ~100 words */}
                <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-4">
                  {article.summary || article.excerpt || ""}
                </p>

                {/* Read more link */}
                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#1a6b3c] hover:underline"
                  >
                    {t("Read Full Article →", "সম্পূৰ্ণ পঢ়ক →")}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400">
            {t(
              `Showing ${articles.length} curated article(s) for ${formatDate(digestInfo?.date || "")}. Sources: ${digestInfo?.sources?.map((s) => s.name).join(", ") || ""}`,
              `${articles.length}টা নিৰ্বাচিত বাতৰি দেখুওৱা হৈছে ${formatDate(digestInfo?.date || "")} তাৰিখৰ বাবে। উৎস: ${digestInfo?.sources?.map((s) => s.name).join(", ") || ""}`
            )}
          </div>
        </>
      )}
    </div>
  );
}
