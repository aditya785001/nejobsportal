"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/posts", label: "Posts", icon: "📋" },
  { href: "/admin/posts/new", label: "Create Post", icon: "✏️" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/news-search", label: "News Search", icon: "📰" },
  { href: "/admin/quiz-questions", label: "Quiz Questions", icon: "❓" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden lg:flex lg:flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="text-lg font-bold text-white no-underline flex items-center gap-2">
            <span className="w-8 h-8 bg-[#1a6b3c] rounded-lg flex items-center justify-center text-sm">NE</span>
            Admin
          </Link>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors no-underline ${
                pathname === item.href
                  ? "bg-[#1a6b3c] text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors w-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors no-underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around py-2 z-50">
        {adminNav.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] no-underline ${
              pathname === item.href ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-gray-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </nav>

      {/* Content */}
      <div className="flex-1 bg-gray-50 pb-16 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
