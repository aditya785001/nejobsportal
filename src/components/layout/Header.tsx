"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useState } from "react";

const navItems = [
  { href: "/", key: "nav.home" },
  { href: "/jobs", key: "nav.jobs" },
  { href: "/results", key: "nav.results" },
  { href: "/admissions", key: "nav.admissions" },
  { href: "/scholarships", key: "nav.scholarships" },
  { href: "/study-materials", key: "nav.study-materials" },
  { href: "/exam-prep", key: "nav.exam-prep" },
  { href: "/quiz", key: "nav.daily-quiz" },
  { href: "/tools", key: "nav.tools" },
];

export function Header() {
  const language = useLanguageStore((s) => s.language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-2xl font-bold text-[#1a6b3c]">
              NE<span className="text-[#e07b00]">Jobs</span>Portal
            </span>
            <span className="hidden sm:inline text-xs text-gray-400">.in</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-[#1a6b3c] transition-colors no-underline"
              >
                {t(item.key, language)}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1a6b3c] rounded-lg hover:bg-[#145230] transition-colors no-underline"
            >
              {t("nav.login", language)}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-100 pt-2">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-2 py-2 text-sm font-medium text-gray-600 hover:text-[#1a6b3c] hover:bg-gray-50 rounded no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.key, language)}
                </Link>
              ))}
              <Link
                href="/login"
                className="px-2 py-2 text-sm font-medium text-white bg-[#1a6b3c] rounded text-center no-underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.login", language)}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
