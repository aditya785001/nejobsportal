import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

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
main().catch(e => { console.error('ERROR:', e.message, e.stack); process.exit(1); });
