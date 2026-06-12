"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";

// ── Exam category definitions ──
interface ExamCategory {
  id: string;
  label: string;
  tag: string;
  description: string;
  icon: string;
  gradient: string;
  sections: { type: string; label: string; icon: string }[];
}

const EXAM_CATEGORIES: ExamCategory[] = [
  {
    id: "apsc", label: "APSC", tag: "APSC", description: "Assam Public Service Commission",
    icon: "🎯", gradient: "from-emerald-500 to-teal-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "adre", label: "ADRE", tag: "ADRE", description: "Assam Direct Recruitment Exam",
    icon: "📋", gradient: "from-rose-500 to-pink-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "upsc", label: "UPSC", tag: "UPSC", description: "Union Public Service Commission",
    icon: "🌟", gradient: "from-amber-500 to-orange-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "ssc", label: "SSC", tag: "SSC", description: "Staff Selection Commission",
    icon: "📋", gradient: "from-cyan-500 to-blue-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "railway", label: "Railway", tag: "RAILWAY", description: "Railway Recruitment Board exams",
    icon: "🚂", gradient: "from-sky-500 to-indigo-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "ibps", label: "IBPS", tag: "IBPS", description: "Banking exam preparation",
    icon: "🏦", gradient: "from-purple-500 to-violet-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "tet", label: "TET Assam", tag: "TET", description: "Teacher Eligibility Test",
    icon: "📚", gradient: "from-blue-500 to-indigo-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "police", label: "Police Exams", tag: "POLICE", description: "Police recruitment exams",
    icon: "🛡️", gradient: "from-orange-500 to-red-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
  {
    id: "other", label: "Other Exams", tag: "", description: "Other competitive exams",
    icon: "📖", gradient: "from-gray-500 to-slate-600",
    sections: [
      { type: "SYLLABUS", label: "Syllabus", icon: "📋" },
      { type: "BOOK", label: "Books", icon: "📚" },
      { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝" },
      { type: "NOTES", label: "Notes", icon: "📓" },
    ],
  },
];

// ── GK categories ──
const GK_CATEGORIES = [
  { label: "Current Affairs", icon: "📰", color: "bg-amber-100 text-amber-800" },
  { label: "History", icon: "📜", color: "bg-orange-100 text-orange-800" },
  { label: "Polity", icon: "⚖️", color: "bg-blue-100 text-blue-800" },
  { label: "Science", icon: "🔬", color: "bg-green-100 text-green-800" },
  { label: "Geography", icon: "🌍", color: "bg-teal-100 text-teal-800" },
  { label: "Economy", icon: "💰", color: "bg-purple-100 text-purple-800" },
];

export default function StudyMaterialsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const params = new URLSearchParams();
      params.set("q", searchValue.trim());
      router.push(`/study-materials?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <div className="container-main py-8">
      {/* ════════════════════════════════════════════════ */}
      {/* HERO (full width) */}
      {/* ════════════════════════════════════════════════ */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0d5e2e] via-[#1a6b3c] to-[#2d8a4e] mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 text-7xl">📚</div>
          <div className="absolute bottom-4 right-8 text-6xl">📖</div>
          <div className="absolute top-1/2 right-1/4 text-4xl">✏️</div>
        </div>
        <div className="relative z-10 px-6 md:px-10 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {t("study-materials.title", language)}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-6">
            {t("study-materials.subtitle", language)}
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search materials, subjects, exams..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/60 backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-[#1a6b3c] font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* STICKY GK BAR — always visible on scroll        */}
      {/* ════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-0 mb-8">
        <Link
          href="/study-materials/gk"
          className="group block rounded-xl bg-gradient-to-r from-amber-50 via-amber-50/95 to-orange-50 border border-amber-200 hover:shadow-md hover:border-amber-300 transition-all no-underline overflow-hidden"
        >
          <div className="flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-5">
            {/* Icon */}
            <span className="text-3xl shrink-0">🧠</span>

            {/* Title + subtitle */}
            <div className="shrink-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                {language === "as" ? "সাধাৰণ জ্ঞান" : "GK & Current Affairs"}
              </h3>
              <p className="text-xs text-gray-500">
                {language === "as" ? "প্ৰতিদিনে আপডেট" : "Daily updated — common across all exams"}
              </p>
            </div>

            {/* Category pills — scrollable on mobile */}
            <div className="hidden sm:flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
              {GK_CATEGORIES.map((cat) => (
                <span
                  key={cat.label}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${cat.color}`}
                >
                  {cat.icon} {cat.label}
                </span>
              ))}
            </div>

            {/* Mobile: just show first few pills */}
            <div className="flex sm:hidden items-center gap-1 flex-1 min-w-0 overflow-hidden">
              {GK_CATEGORIES.slice(0, 3).map((cat) => (
                <span
                  key={cat.label}
                  className={`text-[11px] px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap ${cat.color}`}
                >
                  {cat.icon} {cat.label}
                </span>
              ))}
              <span className="text-[11px] text-gray-400 whitespace-nowrap">+{GK_CATEGORIES.length - 3} more</span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1.5 shrink-0 text-amber-700 group-hover:underline">
              <span className="text-sm font-medium hidden sm:inline">
                {language === "as" ? "চাওক" : "Explore"}
              </span>
              <span className="text-base">&rarr;</span>
            </div>
          </div>
        </Link>
      </div>

      {/* ════════════════════════════════════════════════ */}
      {/* EXAM CARDS GRID (full width)                    */}
      {/* ════════════════════════════════════════════════ */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {language === "as" ? "পৰীক্ষাৰ মাধ্যমত অধ্যয়ন কৰক" : "Browse by Exam"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAM_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/study-materials/exam/${cat.id}`}
            className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:shadow-lg hover:border-[#1a6b3c]/30 transition-all no-underline"
          >
            {/* Gradient top bar */}
            <div className={`h-2 bg-gradient-to-r ${cat.gradient}`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-4xl">{cat.icon}</span>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-[#1a6b3c]/10 group-hover:text-[#1a6b3c] transition-colors">
                  {language === "as" ? "চাওক" : "Browse"} &rarr;
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.label}</h3>
              <p className="text-sm text-gray-500 mb-3">{cat.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.sections.map((s) => (
                  <span
                    key={s.type}
                    className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-100"
                  >
                    {s.icon} {s.label}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
