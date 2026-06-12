"use client";

import { useLanguageStore } from "@/store/language";

export function LanguageToggle() {
  const { language, toggle } = useLanguageStore();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 hover:border-[#1a6b3c] hover:text-[#1a6b3c] transition-colors"
      aria-label={`Switch to ${language === "en" ? "Assamese" : "English"}`}
    >
      <span className={language === "as" ? "text-[#1a6b3c] font-bold" : "text-gray-500"}>
        EN
      </span>
      <span className="hidden sm:inline text-gray-300">|</span>
      <span className={`hidden sm:inline ${language === "en" ? "text-[#1a6b3c] font-bold" : "text-gray-500"}`}>
        অসমীয়া
      </span>
    </button>
  );
}
