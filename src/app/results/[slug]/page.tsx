"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { formatDate } from "@/lib/utils/date";
import { ShareButtons } from "@/components/ShareButtons";

interface ResultDetail {
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  examName: string;
  resultType: string;
  declaringBody: string;
  state: string;
  declarationDate: string;
  pdfUrl: string | null;
  cutOffMarks: { category: string; marks: number }[] | null;
  recheckInfo: string | null;
  whatsNext: string | null;
  summaryEn: string | null;
  summaryAs: string | null;
  contentEn: string | null;
  contentAs: string | null;
  status: string;
  viewCount: number;
  hashtagList: { id: string; name: string; slug: string }[];
}

export default function ResultDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const language = useLanguageStore((s) => s.language);

  const [data, setData] = useState<{ result: ResultDetail; related: ResultDetail[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`/api/results/${slug}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch result:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [slug]);

  const resultTypeColors: Record<string, string> = {
    EXAM: "bg-purple-50 text-purple-700",
    RECRUITMENT: "bg-blue-50 text-blue-700",
    ADMIT_CARD: "bg-amber-50 text-amber-700",
    ANSWER_KEY: "bg-green-50 text-green-700",
    CUTOFF: "bg-red-50 text-red-700",
    MERIT_LIST: "bg-teal-50 text-teal-700",
  };

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

  if (!data?.result) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {language === "as" ? "ফলাফল পোৱা নগ'ল" : "Result not found"}
        </h1>
        <Link href="/results" className="text-[#1a6b3c] hover:underline">
          ← {language === "as" ? "ফলাফললৈ উভতি যাওক" : "Back to Results"}
        </Link>
      </div>
    );
  }

  const result = data.result;
  const title = language === "as" ? result.titleAs : result.titleEn;
  const summary = language === "as" ? result.summaryAs : result.summaryEn;
  const content = language === "as" ? result.contentAs : result.contentEn;

  return (
    <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/results" className="text-sm text-gray-500 hover:text-[#1a6b3c] no-underline mb-4 inline-block">
          ← {language === "as" ? "ফলাফললৈ উভতি যাওক" : "Back to Results"}
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {result.state.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${resultTypeColors[result.resultType] || "bg-gray-50 text-gray-700"}`}>
              {result.resultType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          </div>

          {result.hashtagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {result.hashtagList.map((tag) => (
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

          {summary && <p className="text-gray-600 mb-4">{summary}</p>}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>📋</span> {result.examName}
            </div>
            <div className="flex items-center gap-1">
              <span>🏛️</span> {result.declaringBody}
            </div>
            <div className="flex items-center gap-1">
              <span>👁️</span> {result.viewCount} {language === "as" ? "দৰ্শন" : "views"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {language === "as" ? "মুখ্য তথ্য" : "Key Details"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              label={language === "as" ? "ঘোষণা তাৰিখ" : "Declaration Date"}
              value={formatDate(result.declarationDate)}
            />
            <DetailItem
              label={language === "as" ? "স্থিতি" : "Status"}
              value={result.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            />
            <DetailItem
              label={language === "as" ? "পৰীক্ষাৰ নাম" : "Exam Name"}
              value={result.examName}
            />
            <DetailItem
              label={language === "as" ? "ঘোষণাকাৰী সংস্থা" : "Declaring Body"}
              value={result.declaringBody}
            />
          </div>
        </div>

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

        {result.cutOffMarks && result.cutOffMarks.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "কাট-অফ নম্বৰ" : "Cut-off Marks"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">
                      {language === "as" ? "শ্ৰেণী" : "Category"}
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-gray-500">
                      {language === "as" ? "নম্বৰ" : "Marks"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.cutOffMarks.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 px-3 text-gray-900">{item.category}</td>
                      <td className="py-2 px-3 text-right font-medium text-gray-900">{item.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result.recheckInfo && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "পুনৰীক্ষণ" : "Rechecking Info"}
            </h2>
            <div className="prose-custom text-gray-700 whitespace-pre-wrap">{result.recheckInfo}</div>
          </div>
        )}

        {result.whatsNext && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "পৰৱৰ্তী পদক্ষেপ" : "What's Next"}
            </h2>
            <div className="prose-custom text-gray-700 whitespace-pre-wrap">{result.whatsNext}</div>
          </div>
        )}

        {result.pdfUrl && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "আধিকাৰিক PDF" : "Official PDF"}
            </h2>
            <a
              href={result.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] transition-colors"
            >
              <span>📄</span> {language === "as" ? "PDF ডাউনলোড কৰক" : "Download PDF"}
            </a>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <ShareButtons
              title={`Check out this result: ${result.titleEn}`}
              postId={result.id}
              postType="RESULT"
            />
          </div>
        </div>

        {data.related && data.related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {language === "as" ? "সম্পৰ্কীয় ফলাফল" : "Related Results"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.related.map((related) => (
                <Link
                  key={related.id}
                  href={`/results/${related.slug}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all no-underline"
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {language === "as" ? related.titleAs : related.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{related.examName}</span>
                    <span>·</span>
                    <span>{formatDate(related.declarationDate)}</span>
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
