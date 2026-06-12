"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { Breadcrumb } from "@/components/Breadcrumb";

const toolList = [
  {
    slug: "age-calculator",
    icon: "🎂",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
    textColor: "text-rose-600",
  },
  {
    slug: "upi-qr-generator",
    icon: "💳",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    slug: "pdf-tools",
    icon: "📄",
    color: "from-red-500 to-orange-600",
    bg: "bg-red-50",
    textColor: "text-red-600",
  },
  {
    slug: "image-tools",
    icon: "🖼️",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    slug: "image-to-pdf",
    icon: "📸",
    color: "from-teal-500 to-emerald-600",
    bg: "bg-teal-50",
    textColor: "text-teal-600",
  },
  {
    slug: "background-remover",
    icon: "🧹",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
];

export default function ToolsPage() {
  const language = useLanguageStore((s) => s.language);

  return (
    <div>
      <Breadcrumb />
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="container-main py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold">🔧 {t("tools.title", language)}</h1>
          <p className="text-gray-300 mt-2 max-w-2xl">
            {t("tools.subtitle", language)}
          </p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolList.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
            >
              <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center text-2xl mb-4`}>
                {tool.icon}
              </div>
              <h2 className={`text-lg font-bold text-gray-900 group-hover:${tool.textColor} transition-colors`}>
                {t(`tools.${tool.slug.replace(/-/g, "-")}`, language)}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t(`tools.${tool.slug}.desc`, language)}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#1a6b3c] group-hover:gap-2 transition-all">
                Open Tool
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-10">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-sm font-medium text-amber-800">All tools run in your browser</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your files and data never leave your device. No uploads to any server — everything is processed locally using your browser&apos;s capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
