"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { formatDate } from "@/lib/utils/date";
import { ShareButtons } from "@/components/ShareButtons";

interface FeeStructure {
  tuition?: number;
  admission?: number;
  exam?: number;
  total?: number;
  [key: string]: number | undefined;
}

interface ImportantDate {
  label: string;
  date: string;
}

interface AdmissionDetail {
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  institution: string;
  course: string;
  duration: string | null;
  seats: number | null;
  feeStructure: FeeStructure | null;
  eligibility: string;
  process: string | null;
  contentEn: string | null;
  contentAs: string | null;
  importantDates: ImportantDate[] | null;
  portalUrl: string | null;
  state: string;
  viewCount: number;
  hashtagList: { id: string; name: string; slug: string }[];
}

export default function AdmissionDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const language = useLanguageStore((s) => s.language);

  const [data, setData] = useState<{ admission: AdmissionDetail; related: AdmissionDetail[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmission() {
      try {
        const res = await fetch(`/api/admissions/${slug}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch admission:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmission();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-3/4 skeleton mb-4"></div>
          <div className="h-4 w-1/2 skeleton mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-full skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.admission) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {language === "as" ? "ভৰ্তি পোৱা নগ'ল" : "Admission not found"}
        </h1>
        <Link href="/admissions" className="text-[#1a6b3c] hover:underline">
          ← {language === "as" ? "ভৰ্তিলৈ উভতি যাওক" : "Back to Admissions"}
        </Link>
      </div>
    );
  }

  const admission = data.admission;
  const title = language === "as" ? admission.titleAs : admission.titleEn;
  const content = language === "as" ? admission.contentAs : admission.contentEn;

  return (
    <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admissions" className="text-sm text-gray-500 hover:text-[#1a6b3c] no-underline mb-4 inline-block">
          ← {language === "as" ? "ভৰ্তিলৈ উভতি যাওক" : "Back to Admissions"}
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {admission.state.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full">
              {admission.course}
            </span>
            <span className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
              {admission.institution}
            </span>
          </div>

          {admission.hashtagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {admission.hashtagList.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/hashtag/${tag.slug}`}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-[#1a6b3c] hover:text-white transition-colors no-underline"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {language === "as" ? "মুখ্য তথ্য" : "Key Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Institution" value={admission.institution} />
            <DetailItem label="Course" value={admission.course} />
            <DetailItem label="Duration" value={admission.duration || "Not specified"} />
            <DetailItem label="Seats" value={admission.seats?.toString() || "Not specified"} />
            <DetailItem label="Views" value={admission.viewCount.toString()} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {language === "as" ? "যোগ্যতা" : "Eligibility"}
          </h2>
          <div className="prose-custom whitespace-pre-wrap text-gray-700">{admission.eligibility}</div>
        </div>

        {admission.feeStructure && Object.keys(admission.feeStructure).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "ফিৰ গঠন" : "Fee Structure"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(admission.feeStructure).map(([key, amount]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-900 capitalize">{key}</div>
                  <div className="text-lg font-bold text-[#1a6b3c]">₹{amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {admission.process && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "প্ৰক্ৰিয়া" : "Admission Process"}
            </h2>
            <div className="prose-custom whitespace-pre-wrap text-gray-700">{admission.process}</div>
          </div>
        )}

          {/* Full Content */}
          {content && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === "as" ? "সম্পূৰ্ণ বিৱৰণ" : "Full Details"}
              </h2>
              <div className="prose-custom whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {content.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <br key={i} />;
                  if (/^\d+[\.\)]\s/.test(trimmed)) {
                    return <p key={i} className="ml-4 mb-1 text-gray-700">{trimmed}</p>;
                  }
                  if (/^[-*]\s/.test(trimmed)) {
                    return <p key={i} className="ml-4 mb-1 text-gray-700">• {trimmed.replace(/^[-*]\s*/, "")}</p>;
                  }
                  if (/^[A-Z][A-Za-z\s]+:$/.test(trimmed)) {
                    return <p key={i} className="font-semibold text-gray-900 mt-3 mb-1">{trimmed}</p>;
                  }
                  return <p key={i} className="mb-1 text-gray-700">{trimmed}</p>;
                })}
              </div>
            </div>
          )}

          {admission.importantDates && admission.importantDates.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "গুৰুত্বপূৰ্ণ তাৰিখসমূহ" : "Important Dates"}
            </h2>
            <div className="space-y-2">
              {admission.importantDates.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {admission.portalUrl ? (
              <a
                href={admission.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-8 py-3 bg-[#e07b00] text-white font-medium rounded-lg hover:bg-[#c96e00] transition-colors"
              >
                {language === "as" ? "আবেদন প'ৰ্টেল" : "Application Portal"}
              </a>
            ) : (
              <span className="text-sm text-gray-500 italic">
                {language === "as" ? "কোনো আবেদন লিংক উপলব্ধ নাই" : "No application link available"}
              </span>
            )}

            <ShareButtons
              title={`${admission.titleEn} at ${admission.institution}`}
              postId={admission.id}
              postType="ADMISSION"
            />
          </div>
        </div>

        {data.related && data.related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "সম্পৰ্কিত ভৰ্তি" : "Related Admissions"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.related.map((related) => (
                <Link
                  key={related.id}
                  href={`/admissions/${related.slug}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all no-underline"
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {language === "as" ? related.titleAs : related.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{related.institution}</span>
                    <span>·</span>
                    <span>{related.course}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value}</div>
    </div>
  );
}
