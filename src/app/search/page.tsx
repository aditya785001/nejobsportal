"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { formatRemainingDays, getUrgencyClass } from "@/lib/utils/date";

// ── Shared result type ──
type ResultType = "JOB" | "RESULT" | "ADMISSION" | "SCHOLARSHIP" | "STUDY_MATERIAL";

interface SearchResult {
  _type: ResultType;
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  state?: string;
  // Job fields
  department?: string;
  totalVacancies?: number | null;
  qualification?: string;
  lastDate?: string;
  selectionType?: string;
  // Result fields
  examName?: string;
  declaringBody?: string;
  resultType?: string;
  // Admission fields
  institution?: string;
  course?: string;
  // Scholarship fields
  schemeName?: string;
  provider?: string;
  amount?: string;
  // Study Material fields
  subject?: string;
  examTag?: string;
  resourceType?: string;
  description?: string;
  // Common
  hashtagList?: { id: string; name: string; slug: string }[];
  publishedAt?: string;
}

const TYPE_FILTERS: { key: string; label: string }[] = [
  { key: "", label: "search.filter-all" },
  { key: "JOB", label: "search.filter-jobs" },
  { key: "RESULT", label: "search.filter-results" },
  { key: "ADMISSION", label: "search.filter-admissions" },
  { key: "SCHOLARSHIP", label: "search.filter-scholarships" },
  { key: "STUDY_MATERIAL", label: "search.filter-study-materials" },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  const query = searchParams.get("q") || "";
  const typeFilter = searchParams.get("type") || "";

  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  const fetchResults = useCallback(async () => {
    if (!query || query.length < 2) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("q", query);
      if (typeFilter) params.set("type", typeFilter);
      params.set("limit", "50");

      const res = await fetch(`/api/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setTotal(data.total);
      } else {
        setResults([]);
        setTotal(0);
      }
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query, typeFilter]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const updateFilter = (type: string) => {
    const params = new URLSearchParams();
    params.set("q", query);
    if (type) params.set("type", type);
    router.push(`/search?${params}`);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchInput.trim());
      if (typeFilter) params.set("type", typeFilter);
      router.push(`/search?${params}`);
    }
  };

  const typeColors: Record<ResultType, string> = {
    JOB: "bg-blue-100 text-blue-700",
    RESULT: "bg-green-100 text-green-700",
    ADMISSION: "bg-purple-100 text-purple-700",
    SCHOLARSHIP: "bg-amber-100 text-amber-700",
    STUDY_MATERIAL: "bg-teal-100 text-teal-700",
  };

  const typeLabels: Record<ResultType, string> = {
    JOB: "Job",
    RESULT: "Result",
    ADMISSION: "Admission",
    SCHOLARSHIP: "Scholarship",
    STUDY_MATERIAL: "Study Material",
  };

  return (
    <div className="container-main py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("search.title", language)}
        </h1>
        <p className="text-gray-600">
          {query ? t("search.subtitle", language).replace("{q}", query) : ""}
        </p>
      </div>

      {/* Search Form (for re-searching) */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-xl">
          <svg
            className="ml-4 w-5 h-5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("common.search", language)}
            className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-[#e07b00] text-white font-medium text-sm hover:bg-[#c96e00] transition-colors"
          >
            {t("common.search", language).split(" ")[0] || "Search"}
          </button>
        </div>
      </form>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TYPE_FILTERS.map((f) => {
          const isActive = typeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => updateFilter(f.key)}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
                isActive
                  ? "bg-[#1a6b3c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:border-[#1a6b3c] hover:text-[#1a6b3c]"
              }`}
            >
              {t(f.label, language)}
            </button>
          );
        })}
      </div>

      {/* Result count */}
      {!loading && query && (
        <p className="text-sm text-gray-500 mb-4">
          {t("search.result-count", language).replace("{count}", String(total))}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="h-5 w-3/4 skeleton mb-3"></div>
              <div className="h-4 w-1/2 skeleton mb-2"></div>
              <div className="h-3 w-full skeleton"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && query && results.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("search.no-results", language)} &quot;{query}&quot;
          </h3>
          <p className="text-gray-600 mb-6">
            {t("search.no-results.hint", language)}
          </p>
        </div>
      )}

      {/* No query yet */}
      {!query && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("common.search", language)}
          </h3>
          <p className="text-gray-600">
            {t("search.no-results.hint", language)}
          </p>
        </div>
      )}

      {/* Results list */}
      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((item) => {
            const title = language === "as" ? item.titleAs : item.titleEn;
            return (
              <Link
                key={`${item._type}-${item.id}`}
                href={getDetailUrl(item)}
                className="block bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-[#1a6b3c]/30 transition-all no-underline"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 hover:text-[#1a6b3c] transition-colors line-clamp-2">
                    {title}
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      typeColors[item._type]
                    }`}
                  >
                    {typeLabels[item._type]}
                  </span>
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  {item._type === "JOB" && (
                    <>
                      <div>🏢 {item.department}</div>
                      {item.totalVacancies && <div>👥 {item.totalVacancies} vacancies</div>}
                      <div className="flex items-center gap-2 mt-2">
                        {item.state && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {item.state.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        )}
                        {item.lastDate && (
                          <span className={`text-xs font-medium ${getUrgencyClass(item.lastDate)}`}>
                            {formatRemainingDays(item.lastDate)}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {item._type === "RESULT" && (
                    <>
                      <div>📋 {item.examName}</div>
                      {item.declaringBody && <div>🏛️ {item.declaringBody}</div>}
                    </>
                  )}

                  {item._type === "ADMISSION" && (
                    <>
                      <div>🏛️ {item.institution}</div>
                      {item.course && <div>📚 {item.course}</div>}
                    </>
                  )}

                  {item._type === "SCHOLARSHIP" && (
                    <>
                      <div>💰 {item.schemeName || item.titleEn}</div>
                      {item.provider && <div>🏢 {item.provider}</div>}
                      {item.amount && <div>💵 {item.amount}</div>}
                    </>
                  )}

                  {item._type === "STUDY_MATERIAL" && (
                    <>
                      {item.subject && <div>📖 {item.subject}</div>}
                      {item.examTag && (
                        <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">
                          {item.examTag}
                        </span>
                      )}
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Hashtags */}
                {item.hashtagList && item.hashtagList.length > 0 && (
                  <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                    {item.hashtagList.slice(0, 3).map((tag) => (
                      <span key={tag.id} className="text-xs text-[#1a6b3c]">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getDetailUrl(item: SearchResult): string {
  switch (item._type) {
    case "JOB":
      return `/jobs/${item.slug}`;
    case "RESULT":
      return `/results/${item.slug}`;
    case "ADMISSION":
      return `/admissions/${item.slug}`;
    case "SCHOLARSHIP":
      return `/scholarships/${item.slug}`;
    case "STUDY_MATERIAL":
      return `/study-materials/${item.slug}`;
  }
}
