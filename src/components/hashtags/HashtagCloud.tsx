"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Hashtag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export function HashtagCloud() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHashtags() {
      try {
        const res = await fetch("/api/hashtags");
        if (res.ok) {
          const data = await res.json();
          setHashtags(data.slice(0, 20));
        }
      } catch {
        // Silent fail - show empty state
      } finally {
        setLoading(false);
      }
    }
    fetchHashtags();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 skeleton rounded-full"></div>
        ))}
      </div>
    );
  }

  if (hashtags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No trending topics yet. Posts with hashtags will appear here.</p>
      </div>
    );
  }

  // Calculate sizes based on postCount
  const maxCount = Math.max(...hashtags.map((h) => h.postCount));
  const minCount = Math.min(...hashtags.map((h) => h.postCount));
  const range = maxCount - minCount || 1;

  return (
    <div className="flex flex-wrap gap-2">
      {hashtags.map((tag) => {
        const ratio = (tag.postCount - minCount) / range;
        const size = 0.75 + ratio * 0.75; // 0.75rem to 1.5rem
        const opacity = 0.5 + ratio * 0.5;

        return (
          <Link
            key={tag.id}
            href={`/hashtag/${tag.slug}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#1a6b3c] hover:text-white transition-all no-underline text-gray-700"
            style={{
              fontSize: `${size}rem`,
              opacity,
            }}
          >
            <span>#{tag.name}</span>
            <span className="text-xs opacity-60">({tag.postCount})</span>
          </Link>
        );
      })}
    </div>
  );
}
