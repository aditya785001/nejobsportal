/**
 * Script: export-data.ts
 * Exports all data from local PostgreSQL to JSON files.
 * 
 * Usage: npx tsx scripts/export-data.ts
 * 
 * Requires DATABASE_URL in .env to point to your local database.
 */

import { PrismaClient } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";

import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires PrismaPg adapter + decoded connection string
const rawUrl = process.env.DATABASE_URL!;
const connectionString = decodeURIComponent(rawUrl);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const OUT_DIR = path.join(__dirname, "..", "data-export");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // List of models to export (in dependency order)
  const models = [
    // Standalone / no dependencies
    { name: "currentAffair", file: "current_affairs.json" },
    { name: "quizQuestion", file: "quiz_questions.json" },
    { name: "hashtag", file: "hashtags.json" },
    { name: "badge", file: "badges.json" },
    { name: "college", file: "colleges.json" },
    { name: "collegeImage", file: "college_images.json" },
    { name: "salaryEntry", file: "salary_entries.json" },
    { name: "governmentScheme", file: "government_schemes.json" },
    { name: "examEvent", file: "exam_events.json" },
    // User-dependent
    { name: "user", file: "users.json" },
    { name: "account", file: "accounts.json" },
    { name: "session", file: "sessions.json" },
    { name: "verificationToken", file: "verification_tokens.json" },
    { name: "savedItem", file: "saved_items.json" },
    { name: "applicationTracker", file: "application_trackers.json" },
    { name: "comment", file: "comments.json" },
    { name: "interviewExperience", file: "interview_experiences.json" },
    { name: "successStory", file: "success_stories.json" },
    { name: "collegeReview", file: "college_reviews.json" },
    { name: "quizAttempt", file: "quiz_attempts.json" },
    { name: "resume", file: "resumes.json" },
    { name: "documentLocker", file: "document_lockers.json" },
    { name: "notificationPreference", file: "notification_preferences.json" },
    { name: "notificationLog", file: "notification_logs.json" },
    { name: "flaggedContent", file: "flagged_contents.json" },
    { name: "userBadge", file: "user_badges.json" },
    { name: "userFollowedHashtag", file: "user_followed_hashtags.json" },
    { name: "shareEvent", file: "share_events.json" },
    { name: "aiLog", file: "ai_logs.json" },
    // Post types (depend on hashtags and users)
    { name: "jobPost", file: "job_posts.json" },
    { name: "jobPostHashtag", file: "job_post_hashtags.json" },
    { name: "resultPost", file: "result_posts.json" },
    { name: "resultPostHashtag", file: "result_post_hashtags.json" },
    { name: "admissionPost", file: "admission_posts.json" },
    { name: "admissionPostHashtag", file: "admission_post_hashtags.json" },
    { name: "scholarshipPost", file: "scholarship_posts.json" },
    { name: "scholarshipPostHashtag", file: "scholarship_post_hashtags.json" },
    { name: "studyMaterial", file: "study_materials.json" },
    { name: "studyMaterialHashtag", file: "study_material_hashtags.json" },
    { name: "examPrepArticle", file: "exam_prep_articles.json" },
    { name: "examPrepHashtag", file: "exam_prep_hashtags.json" },
    { name: "dailyQuiz", file: "daily_quizzes.json" },
  ];

  for (const model of models) {
    try {
      const data = await (prisma as any)[model.name].findMany();
      const filePath = path.join(OUT_DIR, model.file);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`✅ ${model.name}: ${data.length} records → ${model.file}`);
    } catch (err: any) {
      console.error(`❌ ${model.name}: ${err.message}`);
    }
  }

  console.log("\n📦 Export complete! Files are in:", OUT_DIR);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
