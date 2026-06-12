"use client";

import Link from "next/link";
import { PillarGrid } from "@/components/layout/PillarGrid";
import { SearchBar } from "@/components/layout/SearchBar";
import { HashtagCloud } from "@/components/hashtags/HashtagCloud";
import { StateGrid } from "@/components/layout/StateGrid";
import { LatestJobs } from "@/components/jobs/LatestJobs";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";

const features = [
  { icon: "🔍", key: "feature.smart-search", descKey: "feature.smart-search.desc", href: "/jobs" },
  { icon: "📱", key: "feature.instant-alerts", descKey: "feature.instant-alerts.desc", href: "/dashboard" },
  { icon: "📚", key: "feature.study-resources", descKey: "feature.study-resources.desc", href: "/study-materials" },
  { icon: "🤖", key: "feature.ai-assistant", descKey: "feature.ai-assistant.desc", href: "/dashboard" },
  { icon: "📄", key: "feature.resume-builder", descKey: "feature.resume-builder.desc", href: "/dashboard" },
  { icon: "🏆", key: "feature.daily-quiz", descKey: "feature.daily-quiz.desc", href: "/quiz" },
  { icon: "🗺️", key: "feature.college-explorer", descKey: "feature.college-explorer.desc", href: "/colleges" },
  { icon: "💬", key: "feature.community", descKey: "feature.community.desc", href: "/dashboard" },
  { icon: "♿", key: "feature.pwd-friendly", descKey: "feature.pwd-friendly.desc", href: "/jobs?pwd=true" },
];

export default function HomePage() {
  const language = useLanguageStore((s) => s.language);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white">
        <div className="container-main py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {t("home.hero.title", language)}
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8">
              {t("home.hero.subtitle", language)}
            </p>

            {/* Search */}
            <SearchBar />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">500+</div>
                <div className="text-xs md:text-sm text-green-200">{t("home.hero.stats.jobs", language)}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">10K+</div>
                <div className="text-xs md:text-sm text-green-200">{t("home.hero.stats.visitors", language)}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold">8</div>
                <div className="text-xs md:text-sm text-green-200">{t("home.hero.stats.states", language)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All 8 Northeast States */}
      <section className="container-main py-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("home.section.states", language)}</h2>
          <p className="text-gray-600 mt-1">{t("home.section.states.sub", language)}</p>
        </div>
        <StateGrid />
      </section>

      {/* Pillar Tabs / Quick Access */}
      <section className="container-main pb-8">
        <PillarGrid />
      </section>

      {/* Featured Jobs */}
      <section className="bg-white py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t("home.section.latest-jobs", language)}</h2>
            <Link
              href="/jobs"
              className="text-sm font-medium text-[#1a6b3c] hover:text-[#145230] no-underline"
            >
              {t("home.section.view-all", language)} &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LatestJobs />
          </div>
        </div>
      </section>

      {/* Hashtag Cloud */}
      <section className="container-main py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("home.section.trending", language)}</h2>
        <HashtagCloud />
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-12">
        <div className="container-main">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            {t("home.section.features", language)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.key}
                href={feature.href}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow no-underline block"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{t(feature.key, language)}</h3>
                <p className="text-sm text-gray-600">{t(feature.descKey, language)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


