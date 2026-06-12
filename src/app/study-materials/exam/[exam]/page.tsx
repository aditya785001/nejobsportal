"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";

// ── Exam category definitions ──
interface ExamCategory {
  label: string;
  tag: string;
  description: string;
  icon: string;
}

const EXAM_CATEGORIES: Record<string, ExamCategory> = {
  apsc:      { label: "APSC",       tag: "APSC",    description: "Assam Public Service Commission",                                          icon: "🎯" },
  adre:      { label: "ADRE",       tag: "ADRE",    description: "Assam Direct Recruitment Exam",                                            icon: "📋" },
  upsc:      { label: "UPSC",       tag: "UPSC",    description: "Union Public Service Commission",                                         icon: "🌟" },
  ssc:       { label: "SSC",        tag: "SSC",     description: "Staff Selection Commission",                                              icon: "📋" },
  railway:   { label: "Railway",    tag: "RAILWAY", description: "Railway Recruitment Board exams",                                        icon: "🚂" },
  ibps:      { label: "IBPS",       tag: "IBPS",    description: "Banking exam preparation",                                                icon: "🏦" },
  tet:       { label: "TET Assam",  tag: "TET",     description: "Teacher Eligibility Test",                                                icon: "📚" },
  police:    { label: "Police Exams",tag: "POLICE",  description: "Police recruitment exams",                                                icon: "🛡️" },
  other:     { label: "Other Exams", tag: "",        description: "Study materials for other competitive exams",                             icon: "📖" },
};

const EXAM_GRADIENTS: Record<string, string> = {
  apsc:   "from-emerald-600 to-teal-700",
  adre:   "from-rose-600 to-pink-700",
  upsc:   "from-amber-600 to-orange-700",
  ssc:    "from-cyan-600 to-blue-700",
  railway:"from-sky-600 to-indigo-700",
  ibps:   "from-purple-600 to-violet-700",
  tet:    "from-blue-600 to-indigo-700",
  police: "from-orange-600 to-red-700",
  other:  "from-gray-600 to-slate-700",
};

// ── Resource type → URL slug mapping (mirrors TYPE_MAP in [type]/page.tsx) ──
const TYPE_TO_SLUG: Record<string, string> = {
  SYLLABUS: "syllabus",
  BOOK: "books",
  QUESTION_PAPER: "past-papers",
  NOTES: "notes",
  MOCK_TEST: "mock-tests",
  VIDEO: "videos",
  OTHER: "other",
};

interface SectionDef {
  type: string;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const EXAM_SECTIONS: SectionDef[] = [
  { type: "SYLLABUS", label: "Syllabus", icon: "📋", description: "Official syllabus, subject lists, and exam patterns", color: "border-l-green-400 bg-green-50/50" },
  { type: "BOOK", label: "Books", icon: "📚", description: "Recommended books, guides, and reference materials", color: "border-l-cyan-400 bg-cyan-50/50" },
  { type: "QUESTION_PAPER", label: "Past Papers", icon: "📝", description: "Previous year question papers with solutions", color: "border-l-blue-400 bg-blue-50/50" },
  { type: "NOTES", label: "Notes", icon: "📓", description: "Study notes, summaries, and revision guides", color: "border-l-purple-400 bg-purple-50/50" },
  { type: "MOCK_TEST", label: "Mock Tests", icon: "🧪", description: "Practice tests and online mock exams", color: "border-l-orange-400 bg-orange-50/50" },
  { type: "VIDEO", label: "Videos", icon: "🎥", description: "Video lectures and tutorial playlists", color: "border-l-rose-400 bg-rose-50/50" },
];

export default function ExamCategoryPage() {
  const params = useParams();
  const exam = params.exam as string;
  const language = useLanguageStore((s) => s.language);

  const category = EXAM_CATEGORIES[exam];

  // Unknown exam
  if (!category) {
    return (
      <div className="container-main py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {language === "as" ? "পৰীক্ষাৰ শাখা পোৱা নগ'ল" : "Exam category not found"}
        </h1>
        <p className="text-gray-600 mb-6">
          {language === "as"
            ? `আমাৰ ওচৰত "${exam}" নামৰ কোনো শাখা নাই।`
            : `We don't have a section for "${exam}" yet.`}
        </p>
        <Link href="/study-materials" className="text-[#1a6b3c] hover:underline font-medium">
          ← {language === "as" ? "অধ্যয়ন সামগ্ৰীলৈ উভতি যাওক" : "Back to Study Materials"}
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      {/* Back link */}
      <Link
        href="/study-materials"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1a6b3c] no-underline mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {language === "as" ? "সকলো অধ্যয়ন সামগ্ৰী" : "All Study Materials"}
      </Link>

      {/* Category Hero */}
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${EXAM_GRADIENTS[exam] || "from-gray-600 to-slate-700"} mb-10`}>
        <div className="relative z-10 px-8 py-10 md:py-14">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{category.label}</h1>
              <p className="text-white/80 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Section Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXAM_SECTIONS.map((section) => (
          <Link
            key={section.type}
            href={`/study-materials/exam/${exam}/${TYPE_TO_SLUG[section.type] || section.type.toLowerCase()}`}
            className={`block rounded-xl border border-gray-200 border-l-4 ${section.color} p-5 hover:shadow-md hover:border-gray-300 transition-all no-underline group`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{section.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1a6b3c] transition-colors">
                  {section.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                <p className="mt-3 text-sm font-medium text-[#1a6b3c] group-hover:underline">
                  {language === "as" ? "চাওক" : "Browse"} &rarr;
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
