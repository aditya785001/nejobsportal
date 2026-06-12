"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container-main py-12">
        <div className="h-8 w-48 skeleton mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 skeleton rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("dashboard.welcome", language)}, {session.user?.name || "User"}
        </h1>
        <p className="text-gray-600 mt-1">Manage your saved jobs, applications, and preferences.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <DashboardCard icon="💼" label="Saved Jobs" value="0" href="/dashboard/saved" />
        <DashboardCard icon="📋" label="Applications" value="0" href="/dashboard/applications" />
        <DashboardCard icon="🏆" label="Quiz Streak" value="0 days" href="/dashboard/quiz-history" />
        <DashboardCard icon="📄" label="Resumes" value="0" href="/dashboard/resume-builder" />
      </div>

      {/* Quick Links */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLink
          icon="💼"
          title={t("dashboard.saved-items", language)}
          href="/dashboard/saved"
          desc="View all your saved jobs and posts"
        />
        <QuickLink
          icon="📋"
          title={t("dashboard.applications", language)}
          href="/dashboard/applications"
          desc="Track your job applications"
        />
        <QuickLink
          icon="📄"
          title={t("dashboard.resume", language)}
          href="/dashboard/resume-builder"
          desc="Create and download resumes"
        />
        <QuickLink
          icon="🔐"
          title={t("dashboard.documents", language)}
          href="/dashboard/document-locker"
          desc="Upload and manage documents"
        />
        <QuickLink
          icon="🏆"
          title={t("dashboard.quiz-history", language)}
          href="/dashboard/quiz-history"
          desc="View quiz scores and streaks"
        />
        <QuickLink
          icon="🔔"
          title={t("dashboard.notifications", language)}
          href="/dashboard/notifications"
          desc="Manage notification preferences"
        />
      </div>
    </div>
  );
}

function DashboardCard({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all no-underline"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </Link>
  );
}

function QuickLink({ icon, title, href, desc }: { icon: string; title: string; href: string; desc: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md hover:border-[#1a6b3c]/30 transition-all no-underline group"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-medium text-gray-900 group-hover:text-[#1a6b3c] transition-colors">{title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
        </div>
      </div>
    </Link>
  );
}
