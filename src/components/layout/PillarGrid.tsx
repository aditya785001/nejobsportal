"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";

const pillars = [
  {
    key: "nav.jobs",
    href: "/jobs",
    icon: "💼",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    count: "500+",
  },
  {
    key: "nav.results",
    href: "/results",
    icon: "📋",
    color: "bg-green-50 text-green-600 hover:bg-green-100",
    count: "Latest",
  },
  {
    key: "nav.admissions",
    href: "/admissions",
    icon: "🎓",
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    count: "Open",
  },
  {
    key: "nav.scholarships",
    href: "/scholarships",
    icon: "💰",
    color: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    count: "Apply",
  },
  {
    key: "nav.study-materials",
    href: "/study-materials",
    icon: "📚",
    color: "bg-red-50 text-red-600 hover:bg-red-100",
    count: "Free",
  },
  {
    key: "nav.exam-prep",
    href: "/exam-prep",
    icon: "🎯",
    color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
    count: "Guide",
  },
];

export function PillarGrid() {
  const language = useLanguageStore((s) => s.language);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {pillars.map((pillar) => (
        <Link
          key={pillar.href}
          href={pillar.href}
          className={`flex flex-col items-center justify-center p-4 rounded-xl ${pillar.color} transition-all no-underline`}
        >
          <span className="text-2xl mb-1">{pillar.icon}</span>
          <span className="text-sm font-semibold">{t(pillar.key, language)}</span>
          <span className="text-xs opacity-75 mt-0.5">{pillar.count}</span>
        </Link>
      ))}
    </div>
  );
}
