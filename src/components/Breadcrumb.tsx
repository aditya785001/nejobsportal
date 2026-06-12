"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";

interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  /**
   * Optional override segments. If omitted, breadcrumbs are auto-generated
   * from the current pathname. Provide this for pages where the pathname
   * doesn't map cleanly to labels (e.g., dynamic slugs).
   */
  segments?: Crumb[];
  /** The label for the last (current) segment when auto-generating */
  currentLabel?: string;
}

/** Default label map for well-known paths */
const defaultLabels: Record<string, string> = {
  "/": "Home",
  "/jobs": "Jobs",
  "/results": "Results",
  "/admissions": "Admissions",
  "/scholarships": "Scholarships",
  "/study-materials": "Study Materials",
  "/exam-prep": "Exam Prep",
  "/daily-quiz": "Daily Quiz",
  "/tools": "Tools",
  "/tools/age-calculator": "Age Calculator",
  "/tools/upi-qr-generator": "UPI QR Generator",
  "/tools/pdf-tools": "PDF Tools",
  "/tools/image-tools": "Image Tools",
  "/tools/image-to-pdf": "Image to PDF",
  "/about": "About",
  "/contact": "Contact",
  "/privacy-policy": "Privacy Policy",
  "/terms": "Terms of Use",
  "/disclaimer": "Disclaimer",
  "/login": "Login",
  "/dashboard": "Dashboard",
  "/search": "Search",
  "/exam-calendar": "Exam Calendar",
  "/salary-comparison": "Salary Comparison",
  "/scheme-finder": "Scheme Finder",
  "/which-exam": "Which Exam",
  "/colleges": "Colleges",
  "/success-stories": "Success Stories",
  "/share-your-story": "Share Your Story",
  "/submit-interview": "Submit Interview",
  "/community-guidelines": "Community Guidelines",
  "/important-links": "Important Links",
  "/hashtag": "Hashtag",
  "/quiz": "Quiz",
  "/pwd-jobs": "PWD Jobs",
  "/pwd-resources": "PWD Resources",
  "/admit-cards": "Admit Cards",
};

export function Breadcrumb({ segments, currentLabel }: BreadcrumbProps) {
  const pathname = usePathname();
  const language = useLanguageStore((s) => s.language);

  // Generate crumbs from pathname
  const resolvedSegments: Crumb[] = segments ?? (() => {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs: Crumb[] = [{ label: "Home", href: "/" }];

    let accumulated = "";
    for (let i = 0; i < parts.length; i++) {
      accumulated += `/${parts[i]}`;
      const label =
        i === parts.length - 1 && currentLabel
          ? currentLabel
          : defaultLabels[accumulated] ?? decodeURIComponent(parts[i]).replace(/-/g, " ");
      crumbs.push({ label, href: accumulated });
    }
    return crumbs;
  })();

  if (resolvedSegments.length <= 1) return null; // Don't show on homepage

  return (
    <nav aria-label="Breadcrumb" className="container-main pt-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {resolvedSegments.map((crumb, i) => {
          const isLast = i === resolvedSegments.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1">
              {i > 0 && (
                <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast ? (
                <span className="text-gray-900 font-medium truncate max-w-[200px]" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-[#1a6b3c] transition-colors no-underline truncate max-w-[160px]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
