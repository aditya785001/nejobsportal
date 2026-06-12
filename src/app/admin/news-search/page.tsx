"use client";

import { useState } from "react";

interface NewsResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  date: string;
}

export default function AdminNewsSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/admin/news-search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">News Search</h1>
        <p className="text-sm text-gray-500 mt-1">
          Search for government job notifications from news sources and import them
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "Assam government jobs June 2026"'
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] text-sm font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1a6b3c] hover:underline font-semibold text-sm leading-tight"
                    >
                      {item.title}
                    </a>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{item.snippet}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{new Date(item.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="shrink-0 px-3 py-1.5 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] text-xs font-medium"
                  >
                    Import as Job
                  </button>
                </div>

                {/* Expandable import form */}
                {expandedIndex === index && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ImportForm item={item} onClose={() => setExpandedIndex(null)} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportForm({ item, onClose }: { item: NewsResult; onClose: () => void }) {
  const [titleEn, setTitleEn] = useState(item.title);
  const [department, setDepartment] = useState("");
  const [state, setState] = useState("Assam");
  const [category, setCategory] = useState("StateGovt");
  const [lastDate, setLastDate] = useState("");
  const [summaryEn, setSummaryEn] = useState(item.snippet);
  const [applicationUrl, setApplicationUrl] = useState(item.url);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const STATES = [
    "Assam", "ArunachalPradesh", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Sikkim", "Tripura", "AllIndia",
  ];
  const CATEGORIES = ["StateGovt", "CentralGovt", "Private", "NGO", "PublicSector", "Defense", "Banking", "Teaching", "Research"];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleEn,
          titleAs: titleEn,
          department,
          state,
          category,
          jobType: "FullTime",
          selectionType: "Combined",
          lastDate: lastDate ? new Date(lastDate).toISOString() : null,
          applicationUrl,
          qualification: "",
          howToApplyEn: "",
          howToApplyAs: "",
          summaryEn,
          summaryAs: summaryEn,

          status: "PENDING_REVIEW",
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      console.error("Failed to import job:", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Job imported successfully!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
        <input
          type="text"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
        <input
          type="text"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          placeholder="e.g. Assam Police"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
        >
          {STATES.map((s) => (
            <option key={s} value={s}>{s.replace(/([A-Z])/g, " $1").trim()}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.replace(/([A-Z])/g, " $1").trim()}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Last Date</label>
        <input
          type="date"
          value={lastDate}
          onChange={(e) => setLastDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
        <textarea
          value={summaryEn}
          onChange={(e) => setSummaryEn(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">Application URL</label>
        <input
          type="url"
          value={applicationUrl}
          onChange={(e) => setApplicationUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c]/20 focus:border-[#1a6b3c]"
          required
        />
      </div>
      <div className="md:col-span-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "Importing..." : "Confirm Import"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
