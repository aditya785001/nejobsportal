/**
 * Script: import-data.ts
 * Imports data from JSON files into a PostgreSQL database.
 * 
 * Usage (on Render Shell):
 *   npx tsx scripts/import-data.ts
 * 
 * DATABASE_URL will be picked up from Render environment variables.
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DATA_DIR = path.join(__dirname, "..", "data-export");

// Files in order (dependencies first, then dependents)
const FILES = [
  // Standalone
  "current_affairs.json",
  "quiz_questions.json",
  "hashtags.json",
  "badges.json",
  "colleges.json",
  "college_images.json",
  "salary_entries.json",
  "government_schemes.json",
  "exam_events.json",
  // Users and auth
  "users.json",
  "accounts.json",
  "sessions.json",
  "verification_tokens.json",
  // User-sub data
  "saved_items.json",
  "application_trackers.json",
  "comments.json",
  "interview_experiences.json",
  "success_stories.json",
  "college_reviews.json",
  "quiz_attempts.json",
  "resumes.json",
  "document_lockers.json",
  "notification_preferences.json",
  "notification_logs.json",
  "flagged_contents.json",
  "user_badges.json",
  "user_followed_hashtags.json",
  "share_events.json",
  "ai_logs.json",
  // Content posts (depend on hashtags)
  "job_posts.json",
  "job_post_hashtags.json",
  "result_posts.json",
  "result_post_hashtags.json",
  "admission_posts.json",
  "admission_post_hashtags.json",
  "scholarship_posts.json",
  "scholarship_post_hashtags.json",
  "study_materials.json",
  "study_material_hashtags.json",
  "exam_prep_articles.json",
  "exam_prep_hashtags.json",
  "daily_quizzes.json",
];

// Map file names to Prisma model names (plural form for createMany)
const FILE_TO_MODEL: Record<string, string> = {
  "current_affairs.json": "currentAffair",
  "quiz_questions.json": "quizQuestion",
  "hashtags.json": "hashtag",
  "badges.json": "badge",
  "colleges.json": "college",
  "college_images.json": "collegeImage",
  "salary_entries.json": "salaryEntry",
  "government_schemes.json": "governmentScheme",
  "exam_events.json": "examEvent",
  "users.json": "user",
  "accounts.json": "account",
  "sessions.json": "session",
  "verification_tokens.json": "verificationToken",
  "saved_items.json": "savedItem",
  "application_trackers.json": "applicationTracker",
  "comments.json": "comment",
  "interview_experiences.json": "interviewExperience",
  "success_stories.json": "successStory",
  "college_reviews.json": "collegeReview",
  "quiz_attempts.json": "quizAttempt",
  "resumes.json": "resume",
  "document_lockers.json": "documentLocker",
  "notification_preferences.json": "notificationPreference",
  "notification_logs.json": "notificationLog",
  "flagged_contents.json": "flaggedContent",
  "user_badges.json": "userBadge",
  "user_followed_hashtags.json": "userFollowedHashtag",
  "share_events.json": "shareEvent",
  "ai_logs.json": "aiLog",
  "job_posts.json": "jobPost",
  "job_post_hashtags.json": "jobPostHashtag",
  "result_posts.json": "resultPost",
  "result_post_hashtags.json": "resultPostHashtag",
  "admission_posts.json": "admissionPost",
  "admission_post_hashtags.json": "admissionPostHashtag",
  "scholarship_posts.json": "scholarshipPost",
  "scholarship_post_hashtags.json": "scholarshipPostHashtag",
  "study_materials.json": "studyMaterial",
  "study_material_hashtags.json": "studyMaterialHashtag",
  "exam_prep_articles.json": "examPrepArticle",
  "exam_prep_hashtags.json": "examPrepHashtag",
  "daily_quizzes.json": "dailyQuiz",
};

async function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    console.error("   Run 'npx tsx scripts/export-data.ts' first on your local machine.");
    process.exit(1);
  }

  // Check if data already exists (safety check)
  const existingCount = await (prisma as any).jobPost.count().catch(() => -1);
  if (existingCount > 0) {
    console.log(`⚠️  Database already has ${existingCount} job posts. Skipping import.`);
    console.log("   To re-import, first clear the database.");
    process.exit(0);
  }

  for (const file of FILES) {
    const filePath = path.join(DATA_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.log(`⏭️  ${file} not found — skipping`);
      continue;
    }

    const modelName = FILE_TO_MODEL[file];
    if (!modelName) {
      console.log(`⏭️  No model mapping for ${file} — skipping`);
      continue;
    }

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const records = JSON.parse(raw);
      if (!Array.isArray(records) || records.length === 0) {
        console.log(`⏭️  ${file} — empty`);
        continue;
      }

      // Insert in batches to avoid issues
      const BATCH_SIZE = 100;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);
        await (prisma as any)[modelName].createMany({ data: batch, skipDuplicates: true });
      }
      console.log(`✅ ${file}: ${records.length} records imported`);
    } catch (err: any) {
      console.error(`❌ ${file}: ${err.message}`);
    }
  }

  console.log("\n🎉 Import complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
