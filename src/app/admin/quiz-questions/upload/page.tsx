"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";

const SECTIONS = ["DAILY_QUIZ", "MOCK_TEST", "PRACTICE", "TOPIC_WISE"] as const;

interface RowPreview {
  row: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  pillar: string;
  difficulty: string;
  section: string;
  valid: boolean;
  duplicate: boolean;
  error?: string;
}

export default function UploadQuizQuestionsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<RowPreview[]>([]);
  const [fileName, setFileName] = useState("");
  const [targetSection, setTargetSection] = useState<string>("DAILY_QUIZ");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported?: number; duplicates?: { row: number; question: string }[]; errors?: { row: number; error: string }[] } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const parseFile = (file: File) => {
    setFileName(file.name);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });

        // Use first sheet (skip Instructions sheet)
        const sheetName = wb.SheetNames.find((n) => n !== "Instructions") || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<any>(ws);

        const PILLARS = ["GK", "AssamGK", "CurrentAffairs", "Science", "History", "Polity", "Mixed"];
        const DIFFICULTIES = ["Easy", "Medium", "Hard"];
        const VALID_SECTIONS = ["DAILY_QUIZ", "MOCK_TEST", "PRACTICE", "TOPIC_WISE"];

        const parsed: RowPreview[] = json.map((item: any, idx: number) => {
          const row = idx + 2; // header is row 1, data starts row 2
          const question = (item.question || "").trim();
          const optA = (item.option_a || "").trim();
          const optB = (item.option_b || "").trim();
          const optC = (item.option_c || "").trim();
          const optD = (item.option_d || "").trim();
          const correctIdx = parseInt(item.correct_index) ?? -1;
          const explanation = (item.explanation || "").trim();
          const pillar = (item.pillar || "GK").trim();
          const difficulty = (item.difficulty || "Medium").trim();
          // Section from file, fallback to the selected target section
          const section = (item.section || targetSection).trim().toUpperCase();

          const errors: string[] = [];
          if (!question || question.length < 5) errors.push("Question too short (min 5 chars)");
          if (!optA || !optB || !optC || !optD) errors.push("All 4 options required");
          if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) errors.push("correct_index must be 0-3");
          if (pillar && !PILLARS.includes(pillar)) errors.push(`Invalid pillar: ${pillar}`);
          if (difficulty && !DIFFICULTIES.includes(difficulty)) errors.push(`Invalid difficulty: ${difficulty}`);
          if (section && !VALID_SECTIONS.includes(section)) errors.push(`Invalid section: ${section} (use DAILY_QUIZ, MOCK_TEST, PRACTICE, or TOPIC_WISE)`);

          return {
            row,
            question,
            options: [optA, optB, optC, optD],
            correctIndex: correctIdx,
            explanation,
            pillar,
            difficulty,
            section,
            valid: errors.length === 0,
            duplicate: false,
            error: errors.join("; "),
          };
        });

        setRows(parsed);
      } catch {
        setRows([]);
        alert("Failed to parse the Excel file. Please use the template format.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload an .xlsx or .xls file");
      return;
    }
    parseFile(file);
  };

  const handleImport = async () => {
    const validRows = rows.filter((r) => r.valid);
    if (validRows.length === 0) {
      alert("No valid rows to import");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/quiz-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: targetSection,
          questions: validRows.map((r) => ({
            question: r.question,
            options: r.options,
            correctIndex: r.correctIndex,
            explanation: r.explanation || null,
            pillar: r.pillar,
            difficulty: r.difficulty,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ imported: data.imported, duplicates: data.duplicates });
        setRows([]);
      } else if (res.status === 422) {
        setResult({ imported: 0, errors: data.errors, duplicates: data.duplicates });
        // Mark errored rows + duplicates
        if (data.errors) {
          setRows((prev) =>
            prev.map((r) => {
              const match = data.errors.find((e: any) => e.row === r.row);
              return match ? { ...r, valid: false, error: match.error } : r;
            })
          );
        }
        if (data.duplicates) {
          setRows((prev) =>
            prev.map((r) => {
              const match = data.duplicates.find((d: any) => d.row === r.row);
              return match ? { ...r, duplicate: true, valid: false, error: "Duplicate question" } : r;
            })
          );
        }
      } else {
        alert(data.error || "Import failed");
      }
    } catch {
      alert("Import failed due to network error");
    } finally {
      setImporting(false);
    }
  };

  const validCount = rows.filter((r) => r.valid).length;
  const duplicateCount = rows.filter((r) => r.duplicate).length;
  const invalidCount = rows.filter((r) => !r.valid && !r.duplicate).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/quiz-questions" className="text-sm text-blue-600 hover:underline">
              ← Back to Questions
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Import Questions from Excel</h1>
          <p className="text-sm text-gray-500 mt-1">Upload an .xlsx file to bulk import quiz questions</p>
        </div>
        <a
          href="/api/quiz-questions/template"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
        >
          📄 Download Template
        </a>
      </div>

      {/* Section Selector */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Section</label>
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setTargetSection(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                targetSection === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {s === "DAILY_QUIZ" ? "📅 Daily Quiz" :
               s === "MOCK_TEST" ? "📝 Mock Test" :
               s === "PRACTICE" ? "✏️ Practice" :
               "📚 Topic Wise"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Questions imported to <strong>{targetSection}</strong> section. Only <strong>DAILY_QUIZ</strong> questions are used for daily quiz generation.
        </p>
      </div>

      {/* Upload Area */}
      {rows.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
          <div className="text-5xl mb-4">📤</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop your Excel file here
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            or click to browse. Supports .xlsx and .xls files.
          </p>
          <a
            href="/api/quiz-questions/template"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            📄 Download template first
          </a>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <span className="text-sm text-gray-600">
              File: <strong>{fileName}</strong>
            </span>
            <span className="text-sm text-green-600">{validCount} valid</span>
            {duplicateCount > 0 && <span className="text-sm text-orange-600">{duplicateCount} duplicates</span>}
            {invalidCount > 0 && <span className="text-sm text-red-600">{invalidCount} with errors</span>}
            <button
              onClick={() => { setRows([]); setResult(null); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear & re-upload
            </button>
          </div>

          {/* Preview Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-12">#</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Question</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-[120px]">Options</th>
                    <th className="text-center px-3 py-2 font-medium text-gray-600 w-16">Correct</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-24">Pillar</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-20">Diff.</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-28">Section</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600 w-48">Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.row} className={`border-b border-gray-100 ${
                      r.duplicate ? "bg-orange-50" : r.valid ? "" : "bg-red-50"
                    }`}>
                      <td className="px-3 py-2 text-gray-500">{r.row}</td>
                      <td className="px-3 py-2">
                        <div className="line-clamp-2">{r.question || <span className="text-red-400">(empty)</span>}</div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-xs text-gray-500">
                          A: {r.options[0] || "❌"}<br />
                          B: {r.options[1] || "❌"}<br />
                          C: {r.options[2] || "❌"}<br />
                          D: {r.options[3] || "❌"}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">{r.correctIndex}</td>
                      <td className="px-3 py-2">{r.pillar}</td>
                      <td className="px-3 py-2">{r.difficulty}</td>
                      <td className="px-3 py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          r.section === "DAILY_QUIZ" ? "bg-blue-100 text-blue-700" :
                          r.section === "MOCK_TEST" ? "bg-purple-100 text-purple-700" :
                          r.section === "PRACTICE" ? "bg-green-100 text-green-700" :
                          r.section === "TOPIC_WISE" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100"
                        }`}>{r.section}</span>
                      </td>
                      <td className="px-3 py-2">
                        {!r.valid && (
                          <span className={`text-xs ${r.duplicate ? "text-orange-600" : "text-red-600"}`}>
                            {r.duplicate ? "⚠️ Duplicate" : r.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {validCount} question{validCount !== 1 ? "s" : ""} ready to import
              {duplicateCount > 0 && ` (${duplicateCount} duplicate${duplicateCount !== 1 ? "s" : ""} will be skipped)`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setRows([]); setResult(null); }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {importing ? "Importing..." : `Import ${validCount} Valid Question${validCount !== 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Import Result */}
      {result && (
        <div className={`mt-6 rounded-xl p-4 border ${
          result.imported ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
        }`}>
          <h3 className="font-semibold text-gray-900 mb-2">
            {result.imported
              ? `✅ Successfully imported ${result.imported} questions`
              : "⚠️ Some rows had validation errors"}
          </h3>
          {result.duplicates && result.duplicates.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium text-orange-600 mb-1">
                ⚠️ {result.duplicates.length} duplicate{result.duplicates.length !== 1 ? "s" : ""} skipped (already exist in this section):
              </p>
              <ul className="text-xs text-orange-600 space-y-0.5 list-disc list-inside">
                {result.duplicates.slice(0, 5).map((d, i) => (
                  <li key={i}><strong>Row {d.row}:</strong> {d.question.substring(0, 60)}...</li>
                ))}
                {result.duplicates.length > 5 && (
                  <li className="text-gray-500">...and {result.duplicates.length - 5} more</li>
                )}
              </ul>
            </div>
          )}
          {result.errors && result.errors.length > 0 && (
            <ul className="text-sm text-red-600 space-y-1">
              {result.errors.map((e, i) => (
                <li key={i}><strong>Row {e.row}:</strong> {e.error}</li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/quiz-questions"
            className="inline-block mt-3 text-sm text-blue-600 hover:underline"
          >
            ← Back to Question Bank
          </Link>
        </div>
      )}
    </div>
  );
}
