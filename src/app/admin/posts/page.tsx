"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Post {
  id: string;
  titleEn: string;
  slug: string;
  postType: string;
  subtitle: string;
  state: string;
  status: string;
  viewCount?: number;
  lastDate?: string;
  createdAt: string;
  extra?: string;
}

const POST_TYPES = [
  { value: "ALL", label: "All Types" },
  { value: "JOB", label: "Jobs" },
  { value: "ADMISSION", label: "Admissions" },
  { value: "RESULT", label: "Results" },
  { value: "SCHOLARSHIP", label: "Scholarships" },
  { value: "STUDY_MATERIAL", label: "Study Materials" },
];

const STATUS_TABS = [
  { value: "PENDING_REVIEW", label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "ACTIVE", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "DRAFT", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const TYPE_LABELS: Record<string, string> = {
  JOB: "Job",
  ADMISSION: "Admission",
  RESULT: "Result",
  SCHOLARSHIP: "Scholarship",
  STUDY_MATERIAL: "Study Material",
};

const TYPE_COLORS: Record<string, string> = {
  JOB: "bg-blue-100 text-blue-700",
  ADMISSION: "bg-purple-100 text-purple-700",
  RESULT: "bg-green-100 text-green-700",
  SCHOLARSHIP: "bg-orange-100 text-orange-700",
  STUDY_MATERIAL: "bg-teal-100 text-teal-700",
};

const EDIT_ROUTES: Record<string, string> = {
  JOB: "/admin/posts",
  ADMISSION: "/admin/posts",
  RESULT: "/admin/posts",
  SCHOLARSHIP: "/admin/posts",
  STUDY_MATERIAL: "/admin/posts",
};

const PREVIEW_ROUTES: Record<string, string> = {
  JOB: "/jobs/",
  ADMISSION: "/admissions/",
  RESULT: "/results/",
  SCHOLARSHIP: "/scholarships/",
  STUDY_MATERIAL: "/study-materials/",
};

export default function AdminPostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "PENDING_REVIEW");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, typeFilter]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      if (searchQuery) params.set("q", searchQuery);
      params.set("limit", "100");

      const res = await fetch(`/api/admin/posts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setCounts(data.counts || {});
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchPosts();
  }

  async function handleAction(slug: string, postType: string, action: "APPROVE" | "REJECT") {
    const apiMap: Record<string, string> = {
      JOB: "/api/jobs/",
      ADMISSION: "/api/admissions/",
      RESULT: "/api/results/",
      SCHOLARSHIP: "/api/scholarships/",
      STUDY_MATERIAL: "/api/study-materials/",
    };
    try {
      const res = await fetch(apiMap[postType] + slug, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "APPROVE" ? "ACTIVE" : "CANCELLED",
          ...(action === "APPROVE" ? { publishedAt: new Date().toISOString() } : {}),
        }),
      });
      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  }

  async function handleDelete(slug: string, postType: string) {
    const apiMap: Record<string, string> = {
      JOB: "/api/jobs/",
      ADMISSION: "/api/admissions/",
      RESULT: "/api/results/",
      SCHOLARSHIP: "/api/scholarships/",
      STUDY_MATERIAL: "/api/study-materials/",
    };
    try {
      const res = await fetch(apiMap[postType] + slug, { method: "DELETE" });
      if (res.ok) {
        setConfirmDelete(null);
        fetchPosts();
      }
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review, approve, edit, or delete posts across all content types
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="px-4 py-2 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] no-underline text-sm font-medium transition-colors"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3c] focus:border-transparent"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">
            Search
          </button>
        </form>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {POST_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                typeFilter === t.value
                  ? "bg-[#1a6b3c] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label}
              {counts[t.value.toLowerCase()] > 0 && typeFilter === t.value && (
                <span className="ml-1.5 px-1 py-0.5 text-xs bg-white/20 rounded-full">
                  {counts[t.value.toLowerCase()]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
              statusFilter === "ALL"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-[#1a6b3c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {statusFilter === tab.value && posts.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                  {posts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Details</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">State</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Views</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5 text-[#1a6b3c]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading posts...
                    </div>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-500 mb-2 font-medium">No posts found</p>
                    <p className="text-gray-400 text-sm mb-4">
                      {statusFilter !== "ALL"
                        ? `No ${statusFilter.replace(/_/g, " ").toLowerCase()} posts`
                        : "No posts match your filters"}
                    </p>
                    <Link href="/admin/posts/new" className="text-[#1a6b3c] hover:underline text-sm font-medium">
                      Create your first post
                    </Link>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={`${post.postType}-${post.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <Link
                        href={`/admin/posts/${post.slug}/edit?type=${post.postType}`}
                        className="text-[#1a6b3c] hover:underline font-medium line-clamp-2 block"
                      >
                        {post.titleEn}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${TYPE_COLORS[post.postType] || "bg-gray-100 text-gray-700"}`}>
                        {TYPE_LABELS[post.postType] || post.postType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate">
                      {post.subtitle}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">
                        {post.state?.replace(/([A-Z])/g, " $1").trim() || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                        STATUS_TABS.find((t) => t.value === post.status)?.color || "bg-gray-100 text-gray-700"
                      }`}>
                        {post.status?.replace(/_/g, " ") || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{post.viewCount ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Preview */}
                        <Link
                          href={`${PREVIEW_ROUTES[post.postType] || "/"}${post.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/posts/${post.slug}/edit?type=${post.postType}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>

                        {/* Approve/Reject for pending */}
                        {statusFilter === "PENDING_REVIEW" && (
                          <>
                            <button
                              onClick={() => handleAction(post.slug, post.postType, "APPROVE")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleAction(post.slug, post.postType, "REJECT")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}

                        {/* Delete */}
                        {confirmDelete === `${post.postType}-${post.id}` ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(post.slug, post.postType)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(`${post.postType}-${post.id}`)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
