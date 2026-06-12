"use client";

import { ReactNode, useEffect } from "react";
import { useLanguageStore } from "@/store/language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useLanguageStore((s) => s.language);

  useEffect(() => {
    // Set the lang attribute on the HTML element
    document.documentElement.lang = language;
    // Set a data attribute for CSS targeting
    document.documentElement.setAttribute("data-lang", language);
    // Store language preference in cookie for middleware
    document.cookie = `lang=${language};path=/;max-age=31536000`;
  }, [language]);

  return <>{children}</>;
}
