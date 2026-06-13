/**
 * Imports quiz questions into Render production database.
 * Run: $env:PROD_DATABASE_URL="postgresql://..." ; npx tsx scripts/import-quiz-prod.ts
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const connectionString = process.env.PROD_DATABASE_URL;
if (!connectionString) {
  console.error("❌ Set PROD_DATABASE_URL environment variable");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const filePath = path.join(__dirname, "..", "data-export", "quiz_questions.json");
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const questions = JSON.parse(raw);

  if (!Array.isArray(questions) || questions.length === 0) {
    console.error("❌ No questions found in export file");
    process.exit(1);
  }

  console.log(`Found ${questions.length} questions to import`);

  let imported = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      // Check if question already exists by matching question text
      const existing = await prisma.quizQuestion.findFirst({
        where: { question: q.question },
      });
      if (existing) {
        skipped++;
        continue;
      }
      // Remove id and timestamps so Prisma auto-generates them
      const { id, createdAt, updatedAt, ...data } = q;
      await prisma.quizQuestion.create({ data });
      imported++;
    } catch (err: any) {
      console.error(`❌ Failed to import question: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n✅ Done: ${imported} imported, ${skipped} skipped`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Fatal:", e);
  prisma.$disconnect();
  process.exit(1);
});
