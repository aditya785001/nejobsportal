/**
 * Exports ONLY quiz questions from local DB to a JSON file.
 * Run: npx tsx scripts/export-quiz-questions.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const rawUrl = process.env.DATABASE_URL!;
const connectionString = decodeURIComponent(rawUrl);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const questions = await prisma.quizQuestion.findMany();
  const outDir = path.join(__dirname, "..", "data-export");
  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, "quiz_questions.json");
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  console.log(`✅ Exported ${questions.length} quiz questions to ${filePath}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
