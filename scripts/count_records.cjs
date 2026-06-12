const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const [jobs, admissions, results, scholarships, study, exam] = await Promise.all([
    prisma.jobPost.count(),
    prisma.admissionPost.count(),
    prisma.resultPost.count(),
    prisma.scholarshipPost.count(),
    prisma.studyMaterial.count(),
    prisma.examPrepArticle.count(),
  ]);
  console.log({jobs, admissions, results, scholarships, study, exam});
  await prisma.$disconnect();
}
main().catch(e => { console.error(e.message); process.exit(1); });
