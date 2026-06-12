"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { formatDate, formatRemainingDays, getUrgencyClass } from "@/lib/utils/date";
import { siteConfig } from "@/lib/config/site";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { ShareButtons } from "@/components/ShareButtons";

interface JobDetail {
  id: string;
  titleEn: string;
  titleAs: string;
  slug: string;
  department: string;
  state: string;
  category: string;
  jobType: string;
  selectionType: string;
  totalVacancies: number | null;
  payScale: string | null;
  qualification: string;
  ageLimit: string | null;
  lastDate: string;
  applicationUrl: string;
  fee: Record<string, number>;
  howToApplyEn: string;
  howToApplyAs: string;
  importantDates: { label: string; date: string }[] | null;
  disclaimer: string;
  resources: { label: string; url: string }[] | null;
  notificationPdfUrl: string | null;
  notificationDate: string | null;
  summaryEn: string;
  summaryAs: string;
  contentEn: string | null;
  contentAs: string | null;
  viewCount: number;
  pwdFriendly: boolean;
  pwdDetails: string | null;
  hashtagList: { id: string; name: string; slug: string }[];
}

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const language = useLanguageStore((s) => s.language);

  const [data, setData] = useState<{ job: JobDetail; related: JobDetail[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${slug}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
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

  if (!data?.job) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h1>
        <Link href="/jobs" className="text-[#1a6b3c] hover:underline">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  const job = data.job;
  const title = language === "as" ? job.titleAs : job.titleEn;
  const howToApply = language === "as" ? job.howToApplyAs : job.howToApplyEn;
  const summary = language === "as" ? job.summaryAs : job.summaryEn;
  const content = language === "as" ? job.contentAs : job.contentEn;

  return (
    <div>
      <Breadcrumb segments={[
        { label: "Home", href: "/" },
        { label: "Jobs", href: "/jobs" },
        { label: title, href: `/jobs/${job.slug}` },
      ]} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: job.titleEn,
        description: job.summaryEn || undefined,
        datePosted: job.notificationDate || undefined,
        validThrough: job.lastDate || undefined,
        hiringOrganization: {
          "@type": "Organization",
          name: job.department,
        },
        ...(job.totalVacancies ? { totalVacancies: job.totalVacancies } : {}),
        ...(job.payScale ? { salary: job.payScale } : {}),
        ...(job.qualification
          ? { qualifications: job.qualification }
          : {}),
        url: `https://nejobsportal.in/jobs/${job.slug}`,
      }} />
      <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {job.state.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="text-sm px-3 py-1 bg-green-50 text-green-700 rounded-full">
              {job.category.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="text-sm px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
              {job.selectionType.replace(/([A-Z])/g, " $1").trim()}
            </span>
            {job.pwdFriendly && (
              <span className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                ♿ PWD Friendly
              </span>
            )}
          </div>

          {/* Hashtags */}
          {job.hashtagList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.hashtagList.map((tag) => (
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

          {/* Summary */}
          {summary && <p className="text-gray-600 mb-4">{summary}</p>}

          {/* Deadline */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getUrgencyClass(job.lastDate)} bg-gray-50`}>
            <span>⏰</span>
            <span>Last Date: {formatDate(job.lastDate)}</span>
            <span className="font-bold">({formatRemainingDays(job.lastDate)})</span>
          </div>
        </div>

        {/* Key Details Grid */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Key Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Department" value={job.department} />
            <DetailItem label="Total Vacancies" value={job.totalVacancies?.toString() || "Not specified"} />
            <DetailItem label="Pay Scale" value={job.payScale || "Not specified"} />
            <DetailItem label="Qualification" value={job.qualification} />
            <DetailItem label="Age Limit" value={job.ageLimit || "Not specified"} />
            <DetailItem label="Job Type" value={job.jobType?.replace(/([A-Z])/g, " $1").trim() || ""} />
            <DetailItem label="Views" value={job.viewCount.toString()} />
          </div>
        </div>

        {/* Application Fee */}
        {job.fee && Object.keys(job.fee).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Application Fee</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(job.fee).map(([category, amount]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-900 capitalize">{category}</div>
                  <div className="text-lg font-bold text-[#1a6b3c]">₹{amount}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Apply */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How to Apply</h2>
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: howToApply }} />
        </div>

        {/* Full Content */}
        {content && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Full Notification Details</h2>
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
        {job.importantDates && job.importantDates.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Important Dates</h2>
            <div className="space-y-2">
              {job.importantDates.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium text-gray-900">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources / Attachments */}
        {job.resources && job.resources.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Resources</h2>
            <div className="space-y-2">
              {job.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#1a6b3c] hover:underline"
                >
                  <span>📄</span>
                  {resource.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Notification PDF */}
        {job.notificationPdfUrl && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Official Notification</h2>
            <a
              href={job.notificationPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] transition-colors"
            >
              <span>📄</span> Download PDF
            </a>
          </div>
        )}

        {/* Apply Button */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-8 py-3 bg-[#e07b00] text-white font-medium rounded-lg hover:bg-[#c96e00] transition-colors"
            >
              Apply Online
            </a>

            <ShareButtons
              title={`${job.titleEn} - Apply by ${formatDate(job.lastDate)}`}
              postId={job.id}
              postType="JOB"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800">{job.disclaimer}</p>
        </div>

        {/* Related Jobs */}
        {data.related && data.related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Related Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.related.map((related) => (
                <Link
                  key={related.id}
                  href={`/jobs/${related.slug}`}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all no-underline"
                >
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                    {language === "as" ? related.titleAs : related.titleEn}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{related.department}</span>
                    <span>·</span>
                    <span className={getUrgencyClass(related.lastDate)}>
                      {formatRemainingDays(related.lastDate)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
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
