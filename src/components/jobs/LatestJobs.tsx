"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
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
  hashtagList: { id: string; name: string; slug: string }[];
}

export function LatestJobs() {
  const language = useLanguageStore((s) => s.language);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const res = await fetch("/api/jobs?limit=3&page=1");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs);
        }
      } catch (error) {
        console.error("Failed to fetch latest jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="h-5 w-32 skeleton mb-2"></div>
                <div className="h-4 w-24 skeleton"></div>
              </div>
              <div className="h-6 w-16 skeleton rounded-full"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 w-full skeleton"></div>
              <div className="h-4 w-3/4 skeleton"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 skeleton"></div>
              <div className="h-4 w-24 skeleton"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        No jobs available right now. Check back soon!
      </div>
    );
  }

  return (
    <>
      {jobs.map((job) => {
        const title = language === "as" ? job.titleAs : job.titleEn;
        return (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-[#1a6b3c]/30 transition-all no-underline group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#1a6b3c] transition-colors line-clamp-2 text-sm">
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
    </>
  );
}
