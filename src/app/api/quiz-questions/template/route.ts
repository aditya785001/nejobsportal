import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import * as XLSX from "xlsx";

// ── GET /api/quiz-questions/template — Download Excel template (admin only) ──
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Build sample data
  const data = [
    {
      question: "Who is the current Chief Minister of Assam?",
      option_a: "Himanta Biswa Sarma",
      option_b: "Sarbananda Sonowal",
      option_c: "Tarun Gogoi",
      option_d: "Pijush Hazarika",
      correct_index: 0,
      explanation: "Himanta Biswa Sarma has been the Chief Minister of Assam since 10 May 2021.",
      pillar: "AssamGK",
      difficulty: "Easy",
      section: "DAILY_QUIZ",
    },
    {
      question: "Which is the largest district in Assam by area?",
      option_a: "Karbi Anglong",
      option_b: "Dibrugarh",
      option_c: "Sonitpur",
      option_d: "Tinsukia",
      correct_index: 0,
      explanation: "Karbi Anglong is the largest district in Assam covering 10,434 sq km.",
      pillar: "AssamGK",
      difficulty: "Medium",
      section: "DAILY_QUIZ",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 60 }, // question
    { wch: 35 }, // option_a
    { wch: 35 }, // option_b
    { wch: 35 }, // option_c
    { wch: 35 }, // option_d
    { wch: 14 }, // correct_index
    { wch: 50 }, // explanation
    { wch: 18 }, // pillar
    { wch: 12 }, // difficulty
    { wch: 14 }, // section
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Quiz Questions");

  // Add a second sheet with instructions
  const instructions = XLSX.utils.aoa_to_sheet([
    ["INSTRUCTIONS"],
    [""],
    ["Column", "Required", "Description"],
    ["question", "Yes", "The MCQ question text (min 10 characters)"],
    ["option_a", "Yes", "First option"],
    ["option_b", "Yes", "Second option"],
    ["option_c", "Yes", "Third option"],
    ["option_d", "Yes", "Fourth option"],
    ["correct_index", "Yes", "Index of correct option (0 for A, 1 for B, 2 for C, 3 for D)"],
    ["explanation", "No", "Explanation for the correct answer"],
    ["pillar", "No", "Category: GK, AssamGK, CurrentAffairs, Science, History, Polity, Mixed (default: GK)"],
    ["difficulty", "No", "Easy, Medium, or Hard (default: Medium)"],
    ["section", "No", "Section: DAILY_QUIZ, MOCK_TEST, PRACTICE, TOPIC_WISE (default: DAILY_QUIZ)"],
  ]);
  XLSX.utils.book_append_sheet(wb, instructions, "Instructions");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="quiz-questions-template.xlsx"',
    },
  });
}
