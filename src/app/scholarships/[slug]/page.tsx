"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { formatDate } from "@/lib/utils/date";
import { siteConfig } from "@/lib/config/site";
import { ShareButtons } from "@/components/ShareButtons";

interface ScholarshipDetail {
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  schemeName: string;
  provider: string;
  amount: string;
  duration: string | null;
  eligibility: string;
  incomeLimit: string | null;
  category: string | null;
  applicationProcess: string | null;
  contentEn: string | null;
  contentAs: string | null;
  importantDates: { label: string; date: string }[] | null;
  portalUrl: string | null;
  state: string;
  viewCount: number;
  hashtagList: { id: string; name: string; slug: string }[];
}

export default function ScholarshipDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const language = useLanguageStore((s) => s.language);

  const [data, setData] = useState<{ scholarship: ScholarshipDetail; related: ScholarshipDetail[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScholarship() {
      try {
        const res = await fetch(`/api/scholarships/${slug}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch scholarship:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchScholarship();
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

  if (!data?.scholarship) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Scholarship not found</h1>
        <Link href="/scholarships" className="text-[#1a6b3c] hover:underline">
          ← Back to Scholarships
        </Link>
      </div>
    );
  }

  const scholarship = data.scholarship;
  const title = language === "as" ? scholarship.titleAs : scholarship.titleEn;
  const content = language === "as" ? scholarship.contentAs : scholarship.contentEn;

  return (
    <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link href="/scholarships" className="text-sm text-gray-500 hover:text-[#1a6b3c] no-underline mb-4 inline-block">
          ← Back to Scholarships
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {scholarship.state.replace(/([A-Z])/g, " $1").trim()}
            </span>
            {scholarship.category && (
              <span className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full">
                {scholarship.category}
              </span>
            )}
          </div>

          {/* Hashtags */}
          {scholarship.hashtagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {scholarship.hashtagList.map((tag) => (
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

          {/* Amount Highlight */}
          <div className="bg-gradient-to-r from-[#1a6b3c] to-[#145230] text-white rounded-xl p-5 mb-4">
            <div className="text-sm text-green-100 mb-1">{language === "as" ? "ছাত্ৰবৃত্তিৰ পৰিমাণ" : "Scholarship Amount"}</div>
            <div className="text-3xl md:text-4xl font-bold">{scholarship.amount}</div>
          </div>

          {/* Scheme & Provider */}
          <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
            <div><span className="font-medium text-gray-900">Scheme:</span> {scholarship.schemeName}</div>
            <div><span className="font-medium text-gray-900">Provider:</span> {scholarship.provider}</div>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Key Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Eligibility" value={scholarship.eligibility} />
            <DetailItem label="Income Limit" value={scholarship.incomeLimit || "Not specified"} />
            <DetailItem label="Category" value={scholarship.category || "Not specified"} />
            <DetailItem label="Duration" value={scholarship.duration || "Not specified"} />
            <DetailItem label="Views" value={scholarship.viewCount.toString()} />
          </div>
        </div>

        {/* Application Process */}
        {scholarship.applicationProcess && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Application Process</h2>
            <div className="prose-custom" dangerouslySetInnerHTML={{ __html: scholarship.applicationProcess }} />
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

        {/* Important Dates */}
        {scholarship.importantDates && scholarship.importantDates.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Important Dates</h2>
            <div className="space-y-2">
              {scholarship.importantDates.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portal Link & Share */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {scholarship.portalUrl ? (
              <a
                href={scholarship.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-8 py-3 bg-[#e07b00] text-white font-medium rounded-lg hover:bg-[#c96e00] transition-colors"
              >
                Apply Online
              </a>
            ) : (
              <span className="text-sm text-gray-400 italic">No external portal link available</span>
            )}

            <ShareButtons
              title={`Check out this scholarship: ${scholarship.titleEn} - ${scholarship.amount}`}
              postId={scholarship.id}
              postType="SCHOLARSHIP"
            />
          </div>
        </div>

        {/* Related Scholarships */}
        {data.related && data.related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related Scholarships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.related.map((related) => (
                <Link
                  key={related.id}
                  href={`/scholarships/${related.slug}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all no-underline"
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {language === "as" ? related.titleAs : related.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{related.schemeName}</span>
                    <span>·</span>
                    <span className="text-[#1a6b3c] font-medium">{related.amount}</span>
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
