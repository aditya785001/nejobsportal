"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { Breadcrumb } from "@/components/Breadcrumb";

interface Product {
  id: string;
  icon: string;
  gradient: string;
  titleKey: string;
  descKey: string;
  features: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "practice-tests",
    icon: "📝",
    gradient: "from-blue-500 to-indigo-600",
    titleKey: "exam-prep.product.practice-tests",
    descKey: "exam-prep.product.practice-tests.desc",
    features: ["exam-prep.feature.real-exam", "exam-prep.feature.instant-scoring", "exam-prep.feature.detailed-analytics"],
  },
  {
    id: "study-materials",
    icon: "📚",
    gradient: "from-emerald-500 to-teal-600",
    titleKey: "exam-prep.product.study-materials",
    descKey: "exam-prep.product.study-materials.desc",
    features: ["exam-prep.feature.expert-curated", "exam-prep.feature.syllabus-covered", "exam-prep.feature.regular-updates"],
  },
  {
    id: "daily-gk",
    icon: "📰",
    gradient: "from-orange-500 to-red-600",
    titleKey: "exam-prep.product.daily-gk",
    descKey: "exam-prep.product.daily-gk.desc",
    features: ["exam-prep.feature.expert-curated", "exam-prep.feature.regular-updates", "exam-prep.feature.quiz-revision"],
  },
  {
    id: "newspaper",
    icon: "📄",
    gradient: "from-purple-500 to-pink-600",
    titleKey: "exam-prep.product.newspaper",
    descKey: "exam-prep.product.newspaper.desc",
    features: ["exam-prep.feature.expert-curated", "exam-prep.feature.time-saving", "exam-prep.feature.regular-updates"],
  },
  {
    id: "notes",
    icon: "📖",
    gradient: "from-amber-500 to-orange-600",
    titleKey: "exam-prep.product.notes",
    descKey: "exam-prep.product.notes.desc",
    features: ["exam-prep.feature.quick-revision", "exam-prep.feature.expert-curated", "exam-prep.feature.time-saving"],
  },
];

const FAQS = [
  { qKey: "exam-prep.faq.q1", aKey: "exam-prep.faq.a1" },
  { qKey: "exam-prep.faq.q2", aKey: "exam-prep.faq.a2" },
  { qKey: "exam-prep.faq.q3", aKey: "exam-prep.faq.a3" },
  { qKey: "exam-prep.faq.q4", aKey: "exam-prep.faq.a4" },
];

export default function ExamPrepPage() {
  const language = useLanguageStore((s) => s.language);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      <Breadcrumb />

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container-main py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full mb-4">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {t("exam-prep.premium-badge", language)}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {t("exam-prep.title", language)}
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
              {t("exam-prep.hero-desc", language)}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
              >
                {t("exam-prep.our-products", language)}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Premium Products Grid ── */}
      <section id="products" className="bg-gray-50 py-12 md:py-16">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t("exam-prep.our-products", language)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("exam-prep.products-desc", language)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Top gradient bar */}
                <div className={`h-2 bg-gradient-to-r ${product.gradient}`} />

                <div className="p-6 flex flex-col flex-1">
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {product.icon}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md">
                      {t("exam-prep.premium-badge", language)}
                    </span>
                  </div>

                  {/* Title + Desc */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {t(product.titleKey, language)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {t(product.descKey, language)}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {product.features.map((featKey) => (
                      <li key={featKey} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {t(featKey, language)}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    disabled
                    className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("exam-prep.cta-coming-soon", language)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 py-12 md:py-16">
        <div className="container-main text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {t("exam-prep.cta-title", language)}
          </h2>
          <p className="text-yellow-100 max-w-xl mx-auto mb-6">
            {t("exam-prep.cta-desc", language)}
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl opacity-70 cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t("exam-prep.cta-coming-soon", language)}
          </button>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="container-main max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            {t("exam-prep.faq-title", language)}
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-sm md:text-base pr-4">
                    {t(faq.qKey, language)}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {t(faq.aKey, language)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
