"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";

// ── Resource type slug → enum mapping ──
const TYPE_MAP: Record<string, string> = {
  syllabus: "SYLLABUS",
  books: "BOOK",
  "past-papers": "QUESTION_PAPER",
  notes: "NOTES",
  "mock-tests": "MOCK_TEST",
  videos: "VIDEO",
  other: "OTHER",
};

const TYPE_LABELS: Record<string, string> = {
  syllabus: "Syllabus",
  books: "Books",
  "past-papers": "Past Papers",
  notes: "Notes",
  "mock-tests": "Mock Tests",
  videos: "Videos",
  other: "Other",
};

const TYPE_ICONS: Record<string, string> = {
  syllabus: "📋",
  books: "📚",
  "past-papers": "📝",
  notes: "📓",
  "mock-tests": "🧪",
  videos: "🎥",
  other: "📦",
};

const TYPE_COLORS: Record<string, string> = {
  syllabus: "bg-green-50 text-green-700 border-green-200",
  books: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "past-papers": "bg-blue-50 text-blue-700 border-blue-200",
  notes: "bg-purple-50 text-purple-700 border-purple-200",
  "mock-tests": "bg-orange-50 text-orange-700 border-orange-200",
  videos: "bg-rose-50 text-rose-700 border-rose-200",
  other: "bg-gray-50 text-gray-700 border-gray-200",
};

const EXAM_CATEGORIES: Record<string, { label: string; tag: string; icon: string }> = {
  apsc:    { label: "APSC",       tag: "APSC",    icon: "🎯" },
  adre:    { label: "ADRE",       tag: "ADRE",    icon: "📋" },
  upsc:    { label: "UPSC",       tag: "UPSC",    icon: "🌟" },
  ssc:     { label: "SSC",        tag: "SSC",     icon: "📋" },
  railway: { label: "Railway",    tag: "RAILWAY", icon: "🚂" },
  ibps:    { label: "IBPS",       tag: "IBPS",    icon: "🏦" },
  tet:     { label: "TET Assam",  tag: "TET",     icon: "📚" },
  police:  { label: "Police Exams", tag: "POLICE", icon: "🛡️" },
  other:   { label: "Other Exams", tag: "",        icon: "📖" },
};

interface StudyMaterial {
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  examTag: string | null;
  subject: string | null;
  year: number | null;
  resourceType: string;
  fileUrl: string;
  fileSize: number | null;
  downloadCount: number;
  description: string | null;
}

export default function ExamTypePage() {
  const params = useParams();
  const exam = params.exam as string;
  const typeSlug = params.type as string;
  const language = useLanguageStore((s) => s.language);

  const resourceType = TYPE_MAP[typeSlug];
  const typeLabel = TYPE_LABELS[typeSlug] || typeSlug;
  const typeIcon = TYPE_ICONS[typeSlug] || "📄";
  const typeColor = TYPE_COLORS[typeSlug] || "bg-gray-50 text-gray-700 border-gray-200";
  const category = EXAM_CATEGORIES[exam];

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchMaterials() {
      setLoading(true);
      try {
        const sp = new URLSearchParams();
        sp.set("page", page.toString());
        sp.set("limit", "20");
        sp.set("status", "ACTIVE");
        if (category?.tag) sp.set("examTag", category.tag);
        if (resourceType) sp.set("resourceType", resourceType);

        const res = await fetch(`/api/study-materials?${sp}`);
        if (res.ok) {
          const data = await res.json();
          setMaterials(data.materials);
          setTotalPages(data.pagination.totalPages);
        }
      } catch (err) {
        console.error("Failed to fetch:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, [page, category, resourceType]);

  const formatFileSize = (kb: number | null) => {
    if (!kb) return "";
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  // Unknown type
  if (!resourceType) {
    return (
      <div className="container-main py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {language === "as" ? "শাখা পোৱা নগ'ল" : "Section not found"}
        </h1>
        <p className="text-gray-600 mb-6">
          {language === "as" ? `"${typeSlug}" নামৰ কোনো শাখা নাই।` : `We don't have a "${typeSlug}" section.`}
        </p>
        <Link href={`/study-materials/exam/${exam}`} className="text-[#1a6b3c] hover:underline font-medium">
          ← {language === "as" ? "পৰীক্ষালৈ উভতি যাওক" : `Back to ${category?.label || exam}`}
        </Link>
      </div>
    );
  }

  // Unknown exam
  if (!category) {
    return (
      <div className="container-main py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Exam not found</h1>
        <Link href="/study-materials" className="text-[#1a6b3c] hover:underline font-medium">
          ← Back to Study Materials
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/study-materials" className="hover:text-[#1a6b3c] no-underline">
          {language === "as" ? "অধ্যয়ন সামগ্ৰী" : "Study Materials"}
        </Link>
        <span>/</span>
        <Link href={`/study-materials/exam/${exam}`} className="hover:text-[#1a6b3c] no-underline">
          {category.label}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{typeLabel}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${typeColor} border`}>
          {typeIcon}
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {category.icon} {category.label} — {typeLabel}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {language === "as" ? "সকলো" : "All"} {typeLabel.toLowerCase()} {language === "as" ? "সামগ্ৰী" : "materials"} {language === "as" ? "ৰ বাবে" : "for"} {category.label}
          </p>
        </div>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="h-5 w-40 skeleton mb-3" />
              <div className="h-4 w-24 skeleton mb-4" />
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full skeleton" />
                <div className="h-3 w-3/4 skeleton" />
              </div>
              <div className="h-4 w-28 skeleton" />
            </div>
          ))}
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">{typeIcon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === "as" ? "এতিয়ালৈকে কোনো সামগ্ৰী নাই" : "No materials yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === "as"
              ? `${category.label} ৰ ${typeLabel} শাখাত এতিয়ালৈকে কোনো সামগ্ৰী যোগ কৰা হোৱা নাই।`
              : `No ${typeLabel.toLowerCase()} materials for ${category.label} yet. Check back soon!`}
          </p>
          <Link
            href={`/study-materials/exam/${exam}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1a6b3c] hover:underline"
          >
            ← {language === "as" ? `${category.label}লৈ উভতি যাওক` : `Back to ${category.label}`}
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material) => {
              const title = language === "as" ? material.titleAs : material.titleEn;
              return (
                <Link
                  key={material.id}
                  href={`/study-materials/${material.slug}`}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-[#1a6b3c]/30 transition-all no-underline group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#1a6b3c] transition-colors line-clamp-2">
                      {title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>
                      {typeLabel}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    {material.description && (
                      <p className="line-clamp-2">
                        {material.description.replace(/<[^>]*>/g, '').length > 150
                          ? material.description.replace(/<[^>]*>/g, '').slice(0, 150) + "..."
                          : material.description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}
                    {material.subject && (
                      <div className="flex items-center gap-1"><span>📖</span> {material.subject}</div>
                    )}
                    {material.year && (
                      <div className="flex items-center gap-1"><span>📅</span> {material.year}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {resourceType === "BOOK" ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                        </svg>
                        Buy on Amazon
                      </span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {material.downloadCount}
                        </div>
                        {formatFileSize(material.fileSize) && (
                          <span className="text-xs text-gray-400">{formatFileSize(material.fileSize)}</span>
                        )}
                      </>
                    )}
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
                ← Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
