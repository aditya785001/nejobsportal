"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
        <svg
          className="ml-4 w-5 h-5 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("common.search", language)}
          className="flex-1 px-4 py-3.5 text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-[#e07b00] text-white font-medium text-sm hover:bg-[#c96e00] transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
