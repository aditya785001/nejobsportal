"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
  pillar: string;
  difficulty: string;
  section: string;
  status: string;
  timesUsed: number;
  createdAt: string;
}

const PILLARS = ["GK", "AssamGK", "CurrentAffairs", "Science", "History", "Polity", "Mixed"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const SECTIONS = ["DAILY_QUIZ", "MOCK_TEST", "PRACTICE", "TOPIC_WISE"];

const PILLAR_COLORS: Record<string, string> = {
  GK: "bg-blue-100 text-blue-700",
  AssamGK: "bg-green-100 text-green-700",
  CurrentAffairs: "bg-orange-100 text-orange-700",
  Science: "bg-purple-100 text-purple-700",
  History: "bg-amber-100 text-amber-700",
  Polity: "bg-red-100 text-red-700",
  Mixed: "bg-gray-100 text-gray-700",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

const SECTION_COLORS: Record<string, string> = {
  DAILY_QUIZ: "bg-blue-100 text-blue-700",
  MOCK_TEST: "bg-purple-100 text-purple-700",
  PRACTICE: "bg-green-100 text-green-700",
  TOPIC_WISE: "bg-amber-100 text-amber-700",
};

export default function AdminQuizQuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pillarFilter, setPillarFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: "",
    pillar: "GK",
    difficulty: "Medium",
    section: "DAILY_QUIZ",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "20");
      if (pillarFilter) params.set("pillar", pillarFilter);
      if (difficultyFilter) params.set("difficulty", difficultyFilter);
      if (sectionFilter) params.set("section", sectionFilter);
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("q", search);

      const res = await fetch(`/api/quiz-questions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [page, pillarFilter, difficultyFilter, sectionFilter, statusFilter, search]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const openNew = () => {
    setEditing(null);
    setForm({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "", pillar: "GK", difficulty: "Medium", section: "DAILY_QUIZ" });
    setShowModal(true);
  };

  const openEdit = (q: QuizQuestion) => {
    setEditing(q);
    setForm({
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation || "",
      pillar: q.pillar,
      difficulty: q.difficulty,
      section: q.section,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || form.question.length < 5) {
      setMessage("Question must be at least 5 characters");
      return;
    }
    if (form.options.some((o) => !o.trim())) {
      setMessage("All 4 options are required");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const body = {
        ...form,
        explanation: form.explanation || null,
      };

      const url = editing
        ? `/api/quiz-questions/${editing.id}`
        : "/api/quiz-questions";

      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? body : { questions: [body] }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchQuestions();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save");
      }
    } catch {
      setMessage("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      const res = await fetch(`/api/quiz-questions/${id}`, { method: "DELETE" });
      if (res.ok) fetchQuestions();
    } catch {
      // silent
    }
  };

  const handleGenerate = async () => {
    if (!confirm("Generate today's quiz from the question bank?")) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/quiz/generate", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message}`);
      } else {
        setMessage(`❌ ${data.error}${data.details ? ": " + data.details.join(", ") : ""}`);
      }
    } catch {
      setMessage("❌ Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quiz Question Bank</h1>
          <p className="text-sm text-gray-500 mt-1">Manage questions, import from Excel, and generate daily quizzes</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/quiz-questions/upload"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            📥 Import Excel
          </Link>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
          >
            {generating ? "Generating..." : "🎲 Generate Today's Quiz"}
          </button>
          <button
            onClick={openNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Add Question
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${message.startsWith("✅") ? "bg-green-50 text-green-700 border border-green-200" : message.startsWith("❌") ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search questions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Pillar</label>
            <select
              value={pillarFilter}
              onChange={(e) => { setPillarFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Pillars</option>
              {PILLARS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => { setDifficultyFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Section</label>
            <select
              value={sectionFilter}
              onChange={(e) => { setSectionFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All Sections</option>
              {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-[150px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="text-sm text-gray-500 pb-2">
            {total} question{total !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 skeleton rounded-lg" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500 mb-4">Add questions manually or import from Excel.</p>
          <div className="flex justify-center gap-3">
            <button onClick={openNew} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">+ Add Question</button>
            <Link href="/admin/quiz-questions/upload" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">📥 Import Excel</Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Question</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">Pillar</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">Diff.</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">Section</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 w-16">Used</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 w-20">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="line-clamp-2 text-gray-900">{q.question}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${PILLAR_COLORS[q.pillar] || "bg-gray-100"}`}>
                        {q.pillar}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[q.difficulty]}`}>
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${SECTION_COLORS[q.section] || "bg-gray-100 text-gray-700"}`}>
                        {q.section === "DAILY_QUIZ" ? "📅" : q.section === "MOCK_TEST" ? "📝" : q.section === "PRACTICE" ? "✏️" : "📚"} {q.section}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">{q.timesUsed}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${q.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(q)} className="text-blue-600 hover:text-blue-800 mr-2 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editing ? "Edit Question" : "Add New Question"}
            </h2>

            {message && (
              <div className="mb-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">{message}</div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <textarea
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Enter the MCQ question"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {form.options.map((opt, idx) => (
                  <div key={idx}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Option {String.fromCharCode(65 + idx)} *
                      {form.correctIndex === idx && <span className="text-green-600 ml-1">(Correct)</span>}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const opts = [...form.options];
                          opts[idx] = e.target.value;
                          setForm({ ...form, options: opts });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <button
                        onClick={() => setForm({ ...form, correctIndex: idx })}
                        className={`px-2 py-1 rounded text-xs font-medium border ${form.correctIndex === idx ? "bg-green-50 border-green-400 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                        title="Mark as correct"
                      >
                        ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (optional)</label>
                <textarea
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  placeholder="Explain why this answer is correct"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pillar</label>
                  <select
                    value={form.pillar}
                    onChange={(e) => setForm({ ...form, pillar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {PILLARS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SECTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, section: s })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                        form.section === s
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
                <p className="text-xs text-gray-400 mt-1">
                  Only <strong>DAILY_QUIZ</strong> questions are used for daily quiz generation.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : (editing ? "Update" : "Add Question")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
