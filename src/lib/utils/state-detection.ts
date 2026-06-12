"use client";

import { useState, useEffect } from "react";

/**
 * Client-side hook to detect the active state from URL params or cookies.
 * Returns null if no state is active.
 */
export function useActiveState(): string | null {
  const [activeState, setActiveState] = useState<string | null>(null);

  useEffect(() => {
    // Check URL params first
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get("state");
    if (stateParam) {
      setActiveState(stateParam);
      return;
    }

    // Fall back to cookie
    const cookies = document.cookie.split(";").map((c) => c.trim());
    const stateCookie = cookies.find((c) => c.startsWith("activeState="));
    if (stateCookie) {
      setActiveState(stateCookie.split("=")[1]);
    }
  }, []);

  return activeState;
}

/**
 * Convert state enum value to display name
 */
export function getStateDisplayName(state: string): string {
  const names: Record<string, string> = {
    Assam: "Assam",
    ArunachalPradesh: "Arunachal Pradesh",
    Manipur: "Manipur",
    Meghalaya: "Meghalaya",
    Mizoram: "Mizoram",
    Nagaland: "Nagaland",
    Sikkim: "Sikkim",
    Tripura: "Tripura",
    AllIndia: "All India",
  };
  return names[state] || state;
}

/**
 * Get state-to-emoji mapping
 */
export function getStateEmoji(state: string): string {
  const emojis: Record<string, string> = {
    Assam: "🇮🇳",
    ArunachalPradesh: "🏔️",
    Manipur: "🏯",
    Meghalaya: "⛰️",
    Mizoram: "🌄",
    Nagaland: "🏹",
    Sikkim: "❄️",
    Tripura: "🛕",
  };
  return emojis[state] || "📍";
}

/**
 * List of all NE state enum values
 */
export const NE_STATES = [
  "Assam",
  "ArunachalPradesh",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
] as const;
