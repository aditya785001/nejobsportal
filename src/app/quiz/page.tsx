"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguageStore } from "@/store/language";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";

export const dynamic = "force-dynamic";

interface QuizData {
  id: string;
  date: string;
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  pillar: string | null;
}

interface PastQuiz {
  id: string;
  date: string;
  pillar: string | null;
  createdBy: string | null;
  publishedAt: string;
  createdAt: string;
  questionCount: number;
  totalAttempts: number;
}

function QuizContent() {
  const language = useLanguageStore((s) => s.language);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [pastQuizzes, setPastQuizzes] = useState<PastQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    answers: { questionIndex: number; selectedOption: number; correct: boolean }[];
  } | null>(null);
  const [error, setError] = useState("");
  const [timeSpent, setTimeSpent] = useState(0);
  const [started, setStarted] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || result) return;
    const interval = setInterval(() => {
      setTimeSpent((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started, result]);

  // Fetch today's quiz + history
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [todayRes, historyRes] = await Promise.all([
        fetch("/api/quiz"),
        fetch("/api/quiz/history"),
      ]);
      const todayData = await todayRes.json();
      const historyData = await historyRes.json();

      if (todayData.quiz) {
        setQuiz(todayData.quiz);
      }
      if (historyData.quizzes) {
        setPastQuizzes(historyData.quizzes);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz || submitting) return;

    if (Object.keys(answers).length < quiz.questions.length) {
      setError(
        language === "as"
          ? "অনুগ্ৰহ কৰি সকলো প্ৰশ্নৰ উত্তৰ দিয়ক"
          : "Please answer all questions"
      );
      return;
    }

    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/quiz");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/quiz/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz.id, answers, timeSpent }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      const data = await res.json();
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">
        {/* ── Today's Quiz ── */}
        {quiz && !started && !result ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === "as" ? "আজিৰ কুইজ" : "Today's Quiz"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(quiz.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {quiz.pillar && ` · ${quiz.pillar}`}
                </p>
              </div>
            </div>

            <div className="text-center py-12 bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white rounded-xl">
              <div className="text-6xl mb-4">🧠</div>
              <h2 className="text-2xl font-bold mb-2">
                {language === "as" ? "আজিৰ কুইজ" : "Today's Quiz"}
              </h2>
              <p className="text-green-100 mb-2">
                {quiz.questions.length} {language === "as" ? "টা প্ৰশ্ন" : "questions"}
              </p>
              <p className="text-green-200 text-sm mb-6">
                {language === "as"
                  ? "প্ৰতিটো প্ৰশ্নৰ চাৰিটা বিকল্প আছে"
                  : "Each question has 4 options. Choose the best answer."}
              </p>
              <button
                onClick={() => setStarted(true)}
                className="px-8 py-3 bg-white text-[#1a6b3c] font-semibold rounded-lg hover:bg-green-50 transition-colors"
              >
                {language === "as" ? "আৰম্ভ কৰক" : "Start Quiz"}
              </button>
            </div>
          </div>
        ) : null}

        {/* ── Active Quiz ── */}
        {quiz && started && !result ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {language === "as" ? "আজিৰ কুইজ" : "Today's Quiz"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(quiz.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {quiz.pillar && ` · ${quiz.pillar}`}
                </p>
              </div>
              <div className="text-lg font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                {formatTime(timeSpent)}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>
                {Object.keys(answers).length}/{quiz.questions.length}{" "}
                {language === "as" ? "উত্তৰ দিয়া হৈছে" : "answered"}
              </span>
              <span className="text-gray-300">·</span>
              <span>
                {language === "as" ? "সময়" : "Time"}: {formatTime(timeSpent)}
              </span>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <p className="font-medium text-gray-900 mb-3">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => {
                      const selected = answers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(qIdx, oIdx)}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                            selected
                              ? "border-[#1a6b3c] bg-green-50 text-[#1a6b3c] font-medium"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <span className="inline-block w-6 font-mono text-sm opacity-50">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-6 py-3 bg-[#1a6b3c] text-white font-semibold rounded-lg hover:bg-[#145230] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting
                ? (language === "as" ? "জমা দিয়াটো হৈ আছে..." : "Submitting...")
                : (language === "as" ? "উত্তৰ জমা দিয়ক" : "Submit Answers")}
            </button>
          </div>
        ) : null}

        {/* ── Quiz Result ── */}
        {quiz && result ? (
          <div className="mb-12 max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-[#1a6b3c] to-[#145230] text-white rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">
                {result.percentage >= 80 ? "🏆" : result.percentage >= 50 ? "👍" : "💪"}
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {result.score}/{result.total}
              </h2>
              <p className="text-green-100 text-lg">{result.percentage}%</p>
              <p className="text-green-200 text-sm mt-1">
                {language === "as"
                  ? `সময়: ${formatTime(timeSpent)}`
                  : `Time: ${formatTime(timeSpent)}`}
              </p>
              <p className="text-green-300 text-xs mt-2">
                {new Date(quiz.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {quiz.pillar && ` · ${quiz.pillar}`}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === "as" ? "উত্তৰসমূহ পৰ্যালোচনা কৰক" : "Review Your Answers"}
              </h3>
              {quiz.questions.map((q, qIdx) => {
                const userAnswer = result.answers.find((a) => a.questionIndex === qIdx);
                const isCorrect = userAnswer?.correct;
                return (
                  <div
                    key={qIdx}
                    className={`border rounded-lg p-4 ${
                      isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                    }`}
                  >
                    <p className="font-medium text-gray-900 mb-2">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-1 mb-3">
                      {q.options.map((opt, oIdx) => {
                        let className = "px-3 py-1.5 rounded text-sm border ";
                        if (oIdx === q.correctIndex) {
                          className += "border-green-400 bg-green-100 text-green-800";
                        } else if (oIdx === userAnswer?.selectedOption && !isCorrect) {
                          className += "border-red-400 bg-red-100 text-red-800";
                        } else {
                          className += "border-gray-200 text-gray-600";
                        }
                        return (
                          <div key={oIdx} className={className}>
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <p className="text-sm text-gray-600 mt-2">
                        <span className="font-semibold">
                          {language === "as" ? "ব্যাখ্যা: " : "Explanation: "}
                        </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Try another quiz prompt ── */}
            {pastQuizzes.length > 1 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                  🎯 {language === "as" ? "আন এটা কুইজ দিব বিচাৰেনে?" : "Want to try another quiz?"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pastQuizzes
                    .filter((pq) => pq.id !== quiz.id)
                    .slice(0, 3)
                    .map((pq) => (
                      <div
                        key={pq.id}
                        onClick={() => router.push(`/quiz/${pq.id}`)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#1a6b3c] hover:shadow-sm transition-all cursor-pointer text-center"
                      >
                        <div className="text-2xl mb-1">
                          {pq.pillar === "GK" ? "📚" : pq.pillar === "CurrentAffairs" ? "📰" : pq.pillar === "Science" ? "🔬" : pq.pillar === "History" ? "📜" : pq.pillar === "Polity" ? "⚖️" : "🧩"}
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {new Date(pq.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {pq.pillar || "GK"} · {pq.questionCount} questions
                        </p>
                        <p className="mt-2 text-sm text-[#1a6b3c] font-medium">
                          {language === "as" ? "এতিয়া কুইজ দিয়ক" : "Take This Quiz"} &rarr;
                        </p>
                      </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setStarted(false);
                      setAnswers({});
                      setResult(null);
                      setTimeSpent(0);
                      fetchData();
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    {language === "as" ? "একেটি কুইজ পুনৰ চেষ্টা কৰক" : "Retry this quiz instead"}
                  </button>
                </div>
              </div>
            )}

            {/* Try Again button (only shown when no past quizzes) */}
            {pastQuizzes.length <= 1 && (
              <button
                onClick={() => {
                  setStarted(false);
                  setAnswers({});
                  setResult(null);
                  setTimeSpent(0);
                  fetchData();
                }}
                className="w-full py-3 bg-[#1a6b3c] text-white font-semibold rounded-lg hover:bg-[#145230] transition-colors"
              >
                {language === "as" ? "পুনৰ চেষ্টা কৰক" : "Try Again"}
              </button>
            )}
          </div>
        ) : null}

        {/* ── No Quiz Today ── */}
        {!quiz && !result && (
          <div className="mb-12 text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "as" ? "আজিৰ কুইজ" : "Today's Quiz"}
            </h1>
            <p className="text-gray-500">
              {language === "as"
                ? "আজি কোনো কুইজ নাই। নতুন কুইজৰ বাবে কাইলৈ চাওক!"
                : "No quiz available today. Check back tomorrow!"}
            </p>
          </div>
        )}

        {/* ── Past Quizzes ── */}
        {pastQuizzes.length > 0 && (
          <div className={result ? "max-w-3xl mx-auto" : ""}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🏛️ {language === "as" ? "পূৰ্বৰ কুইজসমূহ" : "Past Quizzes"}
              </h2>
              <span className="text-sm text-gray-400">
                {pastQuizzes.length} {language === "as" ? "টা কুইজ" : "quizzes"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Current quiz card (if exists) */}
              {quiz && (
                <div className="border-2 border-[#1a6b3c] rounded-xl p-5 bg-green-50 relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-[#1a6b3c] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {language === "as" ? "আজি" : "Today"}
                  </div>
                  <div className="text-3xl mb-2">🧠</div>
                  <p className="text-sm font-semibold text-[#1a6b3c]">
                    {new Date(quiz.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {quiz.pillar || "GK"}
                    <span className="mx-1">·</span>
                    {quiz.questions.length} questions
                  </p>
                  <button
                    onClick={() => {
                      setStarted(true);
                      setAnswers({});
                      setResult(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-3 text-sm text-[#1a6b3c] font-medium hover:underline"
                  >
                    {language === "as" ? "আৰম্ভ কৰক" : "Start Now"}
                  </button>
                </div>
              )}

              {/* Past quiz cards */}
              {pastQuizzes
                .filter((pq) => (quiz ? pq.id !== quiz.id : true))
                .map((pq) => (
                  <div
                    key={pq.id}
                    onClick={() => router.push(`/quiz/${pq.id}`)}
                    className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="text-3xl mb-2">
                      {pq.pillar === "GK" ? "📚" : pq.pillar === "CurrentAffairs" ? "📰" : pq.pillar === "Science" ? "🔬" : pq.pillar === "History" ? "📜" : pq.pillar === "Polity" ? "⚖️" : "🧩"}
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(pq.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{pq.pillar || "GK"}</span>
                      <span>·</span>
                      <span>{pq.questionCount} questions</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>👥 {pq.totalAttempts} attempts</span>
                    </div>
                    <p className="mt-3 text-sm text-[#1a6b3c] font-medium">
                      {language === "as" ? "কুইজ দিয়ক" : "Take Quiz"} &rarr;
                    </p>
                  </div>
                ))}
            </div>

            {pastQuizzes.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">
                {language === "as"
                  ? "এতিয়ালৈকে কোনো পুৰণি কুইজ নাই"
                  : "No past quizzes available yet"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <SessionProvider>
      <QuizContent />
    </SessionProvider>
  );
}
