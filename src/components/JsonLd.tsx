"use client";

import { useEffect } from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Injects a JSON-LD structured data <script> tag into <head>.
 * Safe for "use client" pages — renders via a script element.
 */
export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    // XSS-safe: JSON.stringify doesn't produce executable JS, but we still
    // escape </script> sequences to avoid breaking the HTML parser.
    script.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [data]);

  return null;
}
