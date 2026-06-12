"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  pendingCount: number;
  activeCount: number;
  totalJobs: number;
  totalResults: number;
  totalAdmissions: number;
  totalScholarships: number;
  totalStudyMaterials: number;
  totalExamPrep: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your platform</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] no-underline text-sm font-medium transition-colors"
        >
          + Create Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Review" value={loading ? "..." : String(stats?.pendingCount ?? 0)} color="from-yellow-500 to-orange-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Active Posts" value={loading ? "..." : String(stats?.activeCount ?? 0)} color="from-green-500 to-emerald-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Total Jobs" value={loading ? "..." : String(stats?.totalJobs ?? 0)} color="from-blue-500 to-indigo-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
        <StatCard label="Admissions" value={loading ? "..." : String(stats?.totalAdmissions ?? 0)} color="from-purple-500 to-pink-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
        <StatCard label="Results" value={loading ? "..." : String(stats?.totalResults ?? 0)} color="from-orange-500 to-red-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
        <StatCard label="Scholarships" value={loading ? "..." : String(stats?.totalScholarships ?? 0)} color="from-teal-500 to-cyan-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="Study Materials" value={loading ? "..." : String(stats?.totalStudyMaterials ?? 0)} color="from-indigo-500 to-purple-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
        <StatCard label="Exam Prep" value={loading ? "..." : String(stats?.totalExamPrep ?? 0)} color="from-pink-500 to-rose-600" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard title="Review Queue" description="Approve, edit, or reject pending posts" href="/admin/posts?status=PENDING_REVIEW" icon="📋" gradient="from-yellow-50 to-orange-50" borderColor="border-yellow-200" />
        <QuickActionCard title="Create Post" description="Manually create a new job or content post" href="/admin/posts/new" icon="✏️" gradient="from-blue-50 to-indigo-50" borderColor="border-blue-200" />
        <QuickActionCard title="Manage Active Posts" description="Edit, preview, or unpublish live content" href="/admin/posts?status=ACTIVE" icon="📄" gradient="from-green-50 to-emerald-50" borderColor="border-green-200" />
        <QuickActionCard title="Exam Calendar" description="View upcoming exam events synced from posts" href="/exam-calendar" icon="📅" gradient="from-purple-50 to-pink-50" borderColor="border-purple-200" />
        <QuickActionCard title="News Search" description="Search and import job notifications from news" href="/admin/news-search" icon="📰" gradient="from-teal-50 to-cyan-50" borderColor="border-teal-200" />
        <QuickActionCard title="Main Site" description="View the public-facing portal" href="/" icon="🌐" gradient="from-gray-50 to-slate-50" borderColor="border-gray-200" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-br ${color} opacity-10`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-400">{icon}</div>
          <span className="text-3xl font-bold text-gray-900">{value}</span>
        </div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, href, icon, gradient, borderColor }: {
  title: string; description: string; href: string; icon: string; gradient: string; borderColor: string;
}) {
  return (
    <Link
      href={href}
      className={`bg-gradient-to-br ${gradient} rounded-xl p-5 border ${borderColor} hover:shadow-md transition-all no-underline group`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#1a6b3c] transition-colors">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
