"use client";

import { useState } from "react";

interface Props {
  text: string;
  onTranslated: (assamese: string) => void;
}

export function TranslateButton({ text, onTranslated }: Props) {
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 1500) }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translation) {
          onTranslated(data.translation);
        }
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleTranslate}
      disabled={loading || !text.trim()}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      title="Translate English to Assamese"
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m0 0a9.988 9.988 0 00-4.5 8.5M9 5a9.988 9.988 0 004.5 8.5m-8.5 0h6" />
        </svg>
      )}
      Translate to অসমীয়া
    </button>
  );
}
