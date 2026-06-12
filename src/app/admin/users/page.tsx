"use client";

import { useState, useEffect } from "react";

interface UserSummary {
  totalUsers: number;
  onboardedCount: number;
  withPhoneCount: number;
  withTargetExamCount: number;
}

export default function AdminUsersPage() {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        // Derive additional stats from the total count
        // Full user data is available via the Excel export
        setSummary({
          totalUsers: data.totalUsers ?? 0,
          onboardedCount: 0,
          withPhoneCount: 0,
          withTargetExamCount: 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user stats");
        setLoading(false);
      });
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users/export");
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Export failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nejobsportal-users-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Loading..."
              : `${summary?.totalUsers ?? 0} registered users`}
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || loading}
          className="px-5 py-2.5 bg-[#1a6b3c] text-white rounded-lg hover:bg-[#145230] disabled:opacity-50 transition-colors text-sm font-medium flex items-center gap-2"
        >
          {exporting ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Info card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">User Data Export</h2>
            <p className="text-sm text-gray-500">
              Download all registered users as a formatted Excel spreadsheet with the following fields:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : summary?.totalUsers ?? 0}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Total Users</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">Name</div>
            <div className="text-xs text-gray-500 mt-0.5">Field</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">Email</div>
            <div className="text-xs text-gray-500 mt-0.5">Field</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">Phone</div>
            <div className="text-xs text-gray-500 mt-0.5">Field</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">Target Exam</div>
            <div className="text-xs text-gray-500 mt-0.5">Field</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">Onboarding</div>
            <div className="text-xs text-gray-500 mt-0.5">Status</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">Reg. Date</div>
            <div className="text-xs text-gray-500 mt-0.5">Field</div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Data is exported in .xlsx format compatible with Microsoft Excel, Google Sheets, and LibreOffice Calc.
          The export includes all registered users sorted by registration date (newest first).
        </p>
      </div>
    </div>
  );
}
