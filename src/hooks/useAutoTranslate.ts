"use client";

import { useRef, useCallback } from "react";

/**
 * Auto-translates English text to Assamese after `delay` ms of inactivity.
 * Returns a trigger function to call with the English text.
 * Only translates if the corresponding Assamese field is currently empty.
 *
 * Uses refs internally so the returned trigger function is stable and never
 * goes stale, while always reading the latest assameseValue / onTranslated.
 */
export function useAutoTranslate(
  assameseValue: string,
  onTranslated: (text: string) => void,
  delay = 800,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assameseRef = useRef(assameseValue);
  const onTranslatedRef = useRef(onTranslated);

  // Keep refs in sync with latest values (stable, no re-render needed)
  assameseRef.current = assameseValue;
  onTranslatedRef.current = onTranslated;

  const trigger = useCallback(
    (englishText: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Only auto-translate if there's English text AND Assamese is empty
      if (!englishText.trim() || assameseRef.current.trim()) return;

      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: englishText.slice(0, 1500) }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.translation) {
              onTranslatedRef.current(data.translation);
            }
          }
        } catch {
          // fail silently
        }
      }, delay);
    },
    [delay], // trigger is stable — only changes if delay changes
  );

  return trigger;
}
