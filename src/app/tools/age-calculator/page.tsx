"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language";
import { t } from "@/lib/utils/translations";
import { Breadcrumb } from "@/components/Breadcrumb";

function calculateAge(dob: Date, asOf: Date) {
  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days, totalDays: Math.floor((asOf.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24)) };
}

const GOVT_AGE_LIMITS = [
  { label: "APSC CCE (General)", min: 21, max: 38, note: "Upper age relaxable for SC/ST/OBC per govt norms" },
  { label: "APSC CCE (SC/ST)", min: 21, max: 43, note: "5 years relaxation" },
  { label: "APSC CCE (OBC)", min: 21, max: 41, note: "3 years relaxation" },
  { label: "ADRE Grade 3 & 4 (General)", min: 18, max: 40, note: "As per Assam Direct Recruitment rules" },
  { label: "ADRE Grade 3 & 4 (SC/ST)", min: 18, max: 45, note: "5 years relaxation" },
  { label: "UPSC CSE (General)", min: 21, max: 32, note: "Upper age varies by category and number of attempts" },
  { label: "SSC CGL (General)", min: 18, max: 32, note: "Age limit varies by post" },
  { label: "RRB NTPC (General)", min: 18, max: 33, note: "Age limit varies by post level" },
];

export default function AgeCalculatorPage() {
  const language = useLanguageStore((s) => s.language);

  const today = useMemo(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  }, []);

  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState(today);
  const [calculated, setCalculated] = useState(false);

  const age = useMemo(() => {
    if (!dob || !asOf) return null;
    const dobDate = new Date(dob);
    const asOfDate = new Date(asOf);
    if (isNaN(dobDate.getTime()) || isNaN(asOfDate.getTime())) return null;
    if (dobDate > asOfDate) return null;
    return calculateAge(dobDate, asOfDate);
  }, [dob, asOf]);

  const handleCalculate = () => {
    if (age) setCalculated(true);
  };

  return (
    <div>
      <Breadcrumb />
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white">
        <div className="container-main py-8 md:py-12">
          <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white no-underline mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Tools
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">🎂 {t("tools.age-calculator", language)}</h1>
          <p className="text-rose-100 mt-1 max-w-2xl">
            {t("tools.age-calculator.desc", language)}
          </p>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="max-w-3xl mx-auto">
          {/* Input Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => { setDob(e.target.value); setCalculated(false); }}
                  max={today}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">As of Date</label>
                <input
                  type="date"
                  value={asOf}
                  onChange={(e) => { setAsOf(e.target.value); setCalculated(false); }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>
            </div>
            <button
              onClick={handleCalculate}
              disabled={!dob || !asOf || !age}
              className="mt-4 px-6 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Calculate Age
            </button>

            {dob && asOf && age === null && (
              <p className="mt-2 text-sm text-red-500">Date of birth must be before the &ldquo;As of&rdquo; date.</p>
            )}
          </div>

          {/* Result */}
          {calculated && age && (
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Age</h2>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="text-3xl font-bold text-rose-600">{age.years}</div>
                  <div className="text-xs text-gray-500 mt-1">Years</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="text-3xl font-bold text-rose-600">{age.months}</div>
                  <div className="text-xs text-gray-500 mt-1">Months</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="text-3xl font-bold text-rose-600">{age.days}</div>
                  <div className="text-xs text-gray-500 mt-1">Days</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="text-3xl font-bold text-rose-600">{age.totalDays.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1">Total Days</div>
                </div>
              </div>
            </div>
          )}

          {/* Govt Job Age Eligibility */}
          {calculated && age && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Government Exam Age Eligibility</h2>
              <p className="text-sm text-gray-500 mb-4">
                Your age as of the selected date is <strong className="text-gray-800">{age.years} years, {age.months} months, {age.days} days</strong>.
                Here&apos;s how you fare against common Northeast India exam age limits:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Exam / Category</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Min Age</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Max Age</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Your Age</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GOVT_AGE_LIMITS.map((limit, i) => {
                      const eligible = age.years >= limit.min && age.years <= limit.max;
                      return (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-gray-900">{limit.label}</div>
                            <div className="text-xs text-gray-400">{limit.note}</div>
                          </td>
                          <td className="text-center py-2.5 px-3 text-gray-600">{limit.min}</td>
                          <td className="text-center py-2.5 px-3 text-gray-600">{limit.max}</td>
                          <td className="text-center py-2.5 px-3 font-medium">{age.years}</td>
                          <td className="text-center py-2.5 px-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                              eligible ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                            }`}>
                              {eligible ? "✅ Eligible" : "❌ Not Eligible"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                * Age eligibility rules may vary by specific notification. Always verify with the official recruitment advertisement.
              </p>
            </div>
          )}

          {/* How to Use */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h2 className="text-sm font-bold text-gray-900 mb-2">How to Use</h2>
            <ul className="text-sm text-gray-600 space-y-1.5">
              <li>1. Enter your <strong>Date of Birth</strong> using the date picker.</li>
              <li>2. Set the <strong>As of Date</strong> (defaults to today). For govt jobs, use the application deadline date.</li>
              <li>3. Click <strong>Calculate Age</strong> to see your exact age in years, months, days, and total days.</li>
              <li>4. Check your eligibility against common Northeast India government exam age limits.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
