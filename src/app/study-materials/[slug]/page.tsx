"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";

interface StudyMaterialDetail {
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
  source: string | null;
  hashtagList: { id: string; name: string; slug: string }[];
}

const resourceTypeLabels: Record<string, string> = {
  QUESTION_PAPER: "Question Paper",
  SYLLABUS: "Syllabus",
  NOTES: "Notes",
  MOCK_TEST: "Mock Test",
  BOOK: "Book",
  VIDEO: "Video",
  OTHER: "Other",
};

const resourceTypeColors: Record<string, string> = {
  QUESTION_PAPER: "bg-blue-50 text-blue-700",
  SYLLABUS: "bg-green-50 text-green-700",
  NOTES: "bg-purple-50 text-purple-700",
  MOCK_TEST: "bg-orange-50 text-orange-700",
  BOOK: "bg-cyan-50 text-cyan-700",
  VIDEO: "bg-rose-50 text-rose-700",
  OTHER: "bg-gray-50 text-gray-700",
};

export default function StudyMaterialDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const language = useLanguageStore((s) => s.language);

  const [data, setData] = useState<{ material: StudyMaterialDetail; related: StudyMaterialDetail[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        const res = await fetch(`/api/study-materials/${slug}`);
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch study material:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterial();
  }, [slug]);

  const formatFileSize = (kb: number | null) => {
    if (!kb) return "Unknown";
    if (kb < 1024) return `${kb} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this book: ${data?.material.titleEn}`;

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
  };

  const isBook = data?.material?.resourceType === "BOOK";

  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 w-3/4 skeleton mb-4" />
          <div className="h-4 w-1/2 skeleton mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-full skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data?.material) {
    return (
      <div className="container-main py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Study material not found</h1>
        <Link href="/study-materials" className="text-[#1a6b3c] hover:underline">
          ← Back to Study Materials
        </Link>
      </div>
    );
  }

  const material = data.material;
  const title = language === "as" ? material.titleAs : material.titleEn;

  return (
    <div>
      <Breadcrumb segments={[
        { label: "Home", href: "/" },
        { label: "Study Materials", href: "/study-materials" },
        { label: title, href: `/study-materials/${material.slug}` },
      ]} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": isBook ? "Book" : "LearningResource",
        name: title,
        description: material.description ?? undefined,
        url: `https://nejobsportal.in/study-materials/${material.slug}`,
      }} />
      <div className="container-main py-8">
        <div className={isBook ? "max-w-4xl mx-auto space-y-6" : "max-w-3xl mx-auto space-y-6"}>

          {/* ── Header Card ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {material.examTag && (
                <span className="text-sm px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">
                  {material.examTag}
                </span>
              )}
              <span className={`text-sm px-3 py-1 rounded-full ${resourceTypeColors[material.resourceType]}`}>
                {resourceTypeLabels[material.resourceType] || material.resourceType.replace(/_/g, " ")}
              </span>
            </div>

            {material.hashtagList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {material.hashtagList.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/hashtag/${tag.slug}`}
                    className="no-underline text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full hover:bg-[#1a6b3c] hover:text-white transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {material.source && (
              <p className="text-xs text-gray-400">Source: {material.source}</p>
            )}
          </div>

          {/* ── Description ──
               BOOK → render rich HTML (book analysis, images, affiliate links, tables)
               Other → plain text
          */}
          {material.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {isBook ? "📚 Book Analysis & Recommendations" : "Description"}
              </h2>
              {isBook ? (
                <div
                  className="book-content text-gray-700 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: material.description }}
                />
              ) : (
                <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                  {material.description}
                </div>
              )}
            </div>
          )}

          {/* ── Details Grid (non-book) ── */}
          {!isBook && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {material.subject && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Subject</div>
                    <div className="text-sm font-medium text-gray-900">{material.subject}</div>
                  </div>
                )}
                {material.year && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Year</div>
                    <div className="text-sm font-medium text-gray-900">{material.year}</div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">File Size</div>
                  <div className="text-sm font-medium text-gray-900">{formatFileSize(material.fileSize)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Downloads</div>
                  <div className="text-sm font-medium text-gray-900">{material.downloadCount.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Action Button + Share ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {material.fileUrl && (
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:w-auto text-center px-8 py-3 font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2 ${
                    isBook
                      ? "bg-[#ff9900] text-black hover:bg-[#e88e00]"
                      : "bg-[#1a6b3c] text-white hover:bg-[#145230]"
                  }`}
                >
                  {isBook ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      Buy on Amazon
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </>
                  )}
                </a>
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Share:</span>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare("telegram")}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Share on Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy link"
                >
                  {copied ? (
                    <span className="text-xs font-medium text-green-600">Copied!</span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ── Book-specific styling ── */}
          {isBook && (
            <style>{`
              .book-content img {
                max-width: 180px;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                object-fit: contain;
              }
              .book-content .book-card {
                display: flex;
                gap: 24px;
                align-items: flex-start;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 20px;
                margin: 16px 0;
              }
              .book-content .book-info { flex: 1; }
              .book-content .book-info h3 {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 8px;
              }
              .book-content .book-info p { margin-bottom: 4px; }
              .book-content .buy-btn {
                display: inline-block;
                margin-top: 10px;
                padding: 8px 20px;
                background: #ff9900;
                color: #000;
                font-weight: 600;
                border-radius: 8px;
                text-decoration: none;
                font-size: 0.9rem;
                transition: background 0.2s;
              }
              .book-content .buy-btn:hover { background: #e88e00; }
              .book-content .summary-box {
                background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                border-left: 4px solid #16a34a;
                border-radius: 8px;
                padding: 20px;
                margin: 16px 0;
              }
              .book-content .summary-box h3 { margin-top: 0; color: #166534; }
              .book-content .verdict {
                background: #fffbeb;
                border: 1px solid #fde68a;
                border-radius: 8px;
                padding: 14px 18px;
                margin: 16px 0;
                font-size: 0.95rem;
              }
              .book-content .strength { color: #16a34a; font-weight: bold; }
              .book-content .weakness { color: #dc2626; font-weight: bold; }
              .book-content h2 {
                font-size: 1.3rem;
                font-weight: 700;
                color: #1a202c;
                margin-top: 32px;
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e2e8f0;
              }
              .book-content h3 {
                font-size: 1.05rem;
                font-weight: 600;
                color: #2d3748;
                margin-top: 24px;
                margin-bottom: 8px;
              }
              .book-content ul { padding-left: 20px; margin: 8px 0; }
              .book-content ul li { margin-bottom: 6px; line-height: 1.5; }
              .book-content table {
                width: 100%;
                border-collapse: collapse;
                margin: 16px 0;
                font-size: 0.85rem;
              }
              .book-content th {
                background: #1a6b3c;
                color: white;
                padding: 10px;
                text-align: left;
              }
              .book-content td {
                padding: 10px;
                border: 1px solid #e2e8f0;
              }
              .book-content ol { padding-left: 20px; margin: 8px 0; }
              .book-content ol li { margin-bottom: 8px; line-height: 1.6; }
              @media (max-width: 640px) {
                .book-content .book-card {
                  flex-direction: column;
                  align-items: center;
                  text-align: center;
                }
                .book-content img { max-width: 140px; }
              }
            `}</style>
          )}

          {/* ── Related Materials ── */}
          {data.related && data.related.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Related Materials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.related.map((related) => (
                  <Link
                    key={related.id}
                    href={`/study-materials/${related.slug}`}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all no-underline"
                  >
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                      {language === "as" ? related.titleAs : related.titleEn}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {related.examTag && <span className="font-medium text-amber-700">{related.examTag}</span>}
                      {related.examTag && <span>·</span>}
                      <span>{resourceTypeLabels[related.resourceType] || related.resourceType.replace(/_/g, " ")}</span>
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
