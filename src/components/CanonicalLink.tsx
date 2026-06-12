"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Renders a <link rel="canonical"> tag in <head> for "use client" pages.
 * Uses the current pathname + a fixed base URL.
 */
export function CanonicalLink() {
  const pathname = usePathname();

  useEffect(() => {
    // Remove any existing canonical link
    const existing = document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.remove();
    }

    // Add the new canonical link
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `https://nejobsportal.in${pathname}`;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [pathname]);

  // This component doesn't render anything visible
  return null;
}
