import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Clearing all posts...");

  // Hashtag join tables
  await prisma.jobPostHashtag.deleteMany();
  await prisma.resultPostHashtag.deleteMany();
  await prisma.admissionPostHashtag.deleteMany();
  await prisma.scholarshipPostHashtag.deleteMany();
  await prisma.studyMaterialHashtag.deleteMany();
  await prisma.examPrepHashtag.deleteMany();

  // Notification logs
  await prisma.notificationLog.deleteMany();

  // Application trackers
  await prisma.applicationTracker.deleteMany();

  // Main content tables
  await prisma.jobPost.deleteMany();
  await prisma.resultPost.deleteMany();
  await prisma.admissionPost.deleteMany();
  await prisma.scholarshipPost.deleteMany();
  await prisma.studyMaterial.deleteMany();
  await prisma.examPrepArticle.deleteMany();

  // Exam events
  await prisma.examEvent.deleteMany();

  // Reset hashtag counts
  await prisma.hashtag.updateMany({ data: { postCount: 0 } });

  console.log("✅ All posts cleared successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
