"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language";

const allStates = [
  { id: "Assam", name: "Assam", nameAs: "অসম", capital: "Dispur", flag: "🇮🇳", bg: "#1a6b3c", jobCount: "120+" },
  { id: "ArunachalPradesh", name: "Arunachal Pradesh", nameAs: "অৰুণাচল প্ৰদেশ", capital: "Itanagar", flag: "🏔️", bg: "#b91c1c", jobCount: "45+" },
  { id: "Manipur", name: "Manipur", nameAs: "মণিপুৰ", capital: "Imphal", flag: "🏯", bg: "#1d4ed8", jobCount: "60+" },
  { id: "Meghalaya", name: "Meghalaya", nameAs: "মেঘালয়", capital: "Shillong", flag: "⛰️", bg: "#6b21a8", jobCount: "50+" },
  { id: "Mizoram", name: "Mizoram", nameAs: "মিজোৰাম", capital: "Aizawl", flag: "🌄", bg: "#a16207", jobCount: "35+" },
  { id: "Nagaland", name: "Nagaland", nameAs: "নাগালেণ্ড", capital: "Kohima", flag: "🏹", bg: "#4338ca", jobCount: "40+" },
  { id: "Sikkim", name: "Sikkim", nameAs: "ছিক্কিম", capital: "Gangtok", flag: "❄️", bg: "#c2410c", jobCount: "30+" },
  { id: "Tripura", name: "Tripura", nameAs: "ত্ৰিপুৰা", capital: "Agartala", flag: "🛕", bg: "#0d9488", jobCount: "55+" },
];

export function StateGrid() {
  const language = useLanguageStore((s) => s.language);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allStates.map((state) => (
          <Link
            key={state.id}
            href={`/jobs?state=${state.id}`}
            className="group relative overflow-hidden rounded-xl p-4 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all no-underline"
            style={{ background: `linear-gradient(135deg, ${state.bg}, ${state.bg}dd)` }}
          >
            <div className="relative z-10">
              <div className="text-2xl mb-1">{state.flag}</div>
              <h3 className="font-bold text-sm md:text-base leading-tight">
                {language === "as" ? state.nameAs : state.name}
              </h3>
              <p className="text-xs opacity-75 mt-0.5">{state.capital}</p>
              <p className="text-xs opacity-60 mt-1">{state.jobCount} jobs</p>
            </div>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
