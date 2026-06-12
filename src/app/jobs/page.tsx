"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { formatRemainingDays, getUrgencyClass } from "@/lib/utils/date";

interface Job {
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  department: string;
  state: string;
  category: string;
  selectionType: string;
  lastDate: string;
  totalVacancies: number | null;
  qualification: string;
  viewCount: number;
  hashtagList: { id: string; name: string; slug: string }[];
}

const STATES = ["All", "Assam", "ArunachalPradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"];
const CATEGORIES = ["All", "StateGovt", "CentralGovt", "Private", "PublicSector", "Banking", "Defense"];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const state = searchParams.get("state") || "";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("q") || "";

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (state) params.set("state", state);
      if (category) params.set("category", category);
      if (search) params.set("q", search);

      const res = await fetch(`/api/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [page, state, category, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/jobs?${params}`);
    setPage(1);
  };

  const stateDisplayNames: Record<string, string> = {
    Assam: "Assam",
    ArunachalPradesh: "Arunachal Pradesh",
    Manipur: "Manipur",
    Meghalaya: "Meghalaya",
    Mizoram: "Mizoram",
    Nagaland: "Nagaland",
    Sikkim: "Sikkim",
    Tripura: "Tripura",
  };
  const stateFlags: Record<string, string> = {
    Assam: "🇮🇳", ArunachalPradesh: "🏔️", Manipur: "🏯", Meghalaya: "⛰️",
    Mizoram: "🌄", Nagaland: "🏹", Sikkim: "❄️", Tripura: "🛕",
  };

  return (
    <div className="container-main py-8">
      {/* State-specific banner */}
      {state && state !== "All" && (
        <div className="bg-gradient-to-r from-[#1a6b3c] to-[#145230] text-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{stateFlags[state] || "📍"}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {stateDisplayNames[state] || state} {t("jobs.title", language)}
                </h1>
                <p className="text-green-100 text-sm">
                  {t("jobs.subtitle", language)}
                </p>
              </div>
            </div>
            <Link
              href="/jobs"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors no-underline text-white"
            >
              ✕ {t("jobs.clear-filter", language)}
            </Link>
          </div>
        </div>
      )}

      {/* Default header when no state selected */}
      {(!state || state === "All") && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("jobs.title", language)}
          </h1>
          <p className="text-gray-600">
            {t("jobs.subtitle", language)}
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* State Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">{t("jobs.state-filter", language)}</label>
            <select
              value={state || "All"}
              onChange={(e) => updateFilter("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
            >
              {STATES.map((s) => (
                <option key={s} value={s === "All" ? "" : s}>
                  {s === "All" ? t("jobs.all-states", language) : s.replace(/([A-Z])/g, " $1").trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">{t("jobs.category-filter", language)}</label>
            <select
              value={category || "All"}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c === "All" ? "" : c}>
                  {c === "All" ? t("jobs.all-categories", language) : c.replace(/([A-Z])/g, " $1").trim()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="h-5 w-40 skeleton mb-3"></div>
              <div className="h-4 w-24 skeleton mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full skeleton"></div>
                <div className="h-3 w-3/4 skeleton"></div>
              </div>
              <div className="h-4 w-28 skeleton"></div>
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t("jobs.no-results", language)}</h3>
          <p className="text-gray-600">{t("jobs.no-results.hint", language)}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const title = language === "as" ? job.titleAs : job.titleEn;
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.slug}`}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-[#1a6b3c]/30 transition-all no-underline group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#1a6b3c] transition-colors line-clamp-2">
                      {title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                      {job.state.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-full">
                      {job.selectionType.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <div className="flex items-center gap-1">
                      <span>🏢</span> {job.department}
                    </div>
                    {job.totalVacancies && (
                      <div className="flex items-center gap-1">
                        <span>👥</span> {job.totalVacancies} vacancies
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>🎓</span> {job.qualification.substring(0, 60)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className={`text-xs font-medium ${getUrgencyClass(job.lastDate)}`}>
                      {formatRemainingDays(job.lastDate)}
                    </span>
                    <div className="flex gap-1">
                      {job.hashtagList.slice(0, 2).map((tag) => (
                        <span key={tag.id} className="text-xs text-[#1a6b3c]">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                ← {t("jobs.previous", language)}
              </button>
              <span className="text-sm text-gray-600">
                {t("jobs.page", language)} {page} {t("jobs.of", language)} {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                {t("jobs.next", language)} →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
