import "dotenv/config";
import { PrismaClient, ResourceType, PostStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DOWNLOAD_DIR = path.resolve(__dirname, "..", "public", "downloads", "apsc-papers");

interface PaperMapping {
  filename: string;
  year: number;
  subjectEn: string;
  subjectAs: string;
  label: string;       // short label for slug
}

const PAPERS: PaperMapping[] = [
  // ── Prelims ──
  { filename: "APSC Prelims Paper I 2024.pdf",  year: 2024, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper II 2024.pdf", year: 2024, subjectEn: "General Studies Paper II (CSAT)", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ II (CSAT)", label: "prelims-paper-ii" },
  { filename: "APSC Prelims Paper I 2023.pdf",  year: 2023, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper II 2023.pdf", year: 2023, subjectEn: "General Studies Paper II (CSAT)", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ II (CSAT)", label: "prelims-paper-ii" },
  { filename: "APSC Prelims Paper I 2022.pdf",  year: 2022, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper II 2022.pdf", year: 2022, subjectEn: "General Studies Paper II (CSAT)", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ II (CSAT)", label: "prelims-paper-ii" },
  { filename: "APSC Prelims Paper I 2020.pdf",  year: 2020, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper II 2020.pdf", year: 2020, subjectEn: "General Studies Paper II (CSAT)", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ II (CSAT)", label: "prelims-paper-ii" },
  { filename: "APSC Prelims Paper I 2018.pdf",  year: 2018, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2016.pdf",  year: 2016, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2015.pdf",  year: 2015, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2014.pdf",  year: 2014, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2013.pdf",  year: 2013, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2011.pdf",  year: 2011, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2006.pdf",  year: 2006, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 2001.pdf",  year: 2001, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },
  { filename: "APSC Prelims Paper I 1998.pdf",  year: 1998, subjectEn: "General Studies Paper I", subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ I", label: "prelims-paper-i" },

  // ── Mains 2020 ──
  { filename: "APSC Mains Essay 2020.pdf",       year: 2020, subjectEn: "Essay",                    subjectAs: "প্ৰবন্ধ", label: "mains-essay" },
  { filename: "APSC Mains GS Paper 1 2020.pdf",  year: 2020, subjectEn: "General Studies Paper 1",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ১", label: "mains-gs-paper-1" },
  { filename: "APSC Mains GS Paper 2 2020.pdf",  year: 2020, subjectEn: "General Studies Paper 2",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ২", label: "mains-gs-paper-2" },
  { filename: "APSC Mains GS Paper 3 2020.pdf",  year: 2020, subjectEn: "General Studies Paper 3",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৩", label: "mains-gs-paper-3" },
  { filename: "APSC Mains GS Paper 4 2020.pdf",  year: 2020, subjectEn: "General Studies Paper 4",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৪", label: "mains-gs-paper-4" },
  { filename: "APSC Mains GS Paper 5 2020.pdf",  year: 2020, subjectEn: "General Studies Paper 5",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৫", label: "mains-gs-paper-5" },

  // ── Mains 2022 ──
  { filename: "APSC Mains Essay 2022.pdf",       year: 2022, subjectEn: "Essay",                    subjectAs: "প্ৰবন্ধ", label: "mains-essay" },
  { filename: "APSC Mains GS Paper 1 2022.pdf",  year: 2022, subjectEn: "General Studies Paper 1",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ১", label: "mains-gs-paper-1" },
  { filename: "APSC Mains GS Paper 2 2022.pdf",  year: 2022, subjectEn: "General Studies Paper 2",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ২", label: "mains-gs-paper-2" },
  { filename: "APSC Mains GS Paper 3 2022.pdf",  year: 2022, subjectEn: "General Studies Paper 3",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৩", label: "mains-gs-paper-3" },
  { filename: "APSC Mains GS Paper 4 2022.pdf",  year: 2022, subjectEn: "General Studies Paper 4",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৪", label: "mains-gs-paper-4" },
  { filename: "APSC Mains GS Paper 5 2022.pdf",  year: 2022, subjectEn: "General Studies Paper 5",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৫", label: "mains-gs-paper-5" },

  // ── Mains 2023 ──
  { filename: "APSC Mains Essay 2023.pdf",       year: 2023, subjectEn: "Essay",                    subjectAs: "প্ৰবন্ধ", label: "mains-essay" },
  { filename: "APSC Mains GS Paper 1 2023.pdf",  year: 2023, subjectEn: "General Studies Paper 1",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ১", label: "mains-gs-paper-1" },
  { filename: "APSC Mains GS Paper 2 2023.pdf",  year: 2023, subjectEn: "General Studies Paper 2",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ২", label: "mains-gs-paper-2" },
  { filename: "APSC Mains GS Paper 3 2023.pdf",  year: 2023, subjectEn: "General Studies Paper 3",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৩", label: "mains-gs-paper-3" },
  { filename: "APSC Mains GS Paper 4 2023.pdf",  year: 2023, subjectEn: "General Studies Paper 4",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৪", label: "mains-gs-paper-4" },
  { filename: "APSC Mains GS Paper 5 2023.pdf",  year: 2023, subjectEn: "General Studies Paper 5",  subjectAs: "সাধাৰণ অধ্যয়ন পত্ৰ ৫", label: "mains-gs-paper-5" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function generateDescription(p: PaperMapping): string {
  const year = p.year;
  const subject = p.subjectEn;
  const isPrelims = p.label.startsWith("prelims");
  const examType = isPrelims ? "APSC Combined Competitive Examination (CCE) Preliminary" : "APSC CCE Main";
  return `Download ${examType} Examination ${year} ${subject} question paper PDF. This is an official APSC question paper for the Assam Public Service Commission ${examType} exam conducted in ${year}. Perfect for practicing and understanding the exam pattern, question types, and marking scheme.`;
}

async function main() {
  console.log(`Seeding ${PAPERS.length} APSC question papers into the database...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < PAPERS.length; i++) {
    const p = PAPERS[i];
    const filePath = path.join(DOWNLOAD_DIR, p.filename);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      console.log(`[${i + 1}/${PAPERS.length}] ✗ File not found: ${p.filename}`);
      errors++;
      continue;
    }

    // Generate slug (remove year from base to avoid double-year)
    const baseNoYear = p.filename.replace(".pdf", "").replace(/\s+\d{4}$/, "");
    const slugBase = slugify(baseNoYear);
    const slug = `${slugBase}-${p.year}`;

    // Title
    const titleEn = p.filename.replace(".pdf", "");
    const titleAs = `${titleEn} - ${p.subjectAs}`;

    // File size
    const stats = fs.statSync(filePath);
    const fileSizeKB = Math.round(stats.size / 1024);

    // File URL
    const fileUrl = `/downloads/apsc-papers/${encodeURIComponent(p.filename)}`;

    // Check if already exists
    const existing = await prisma.studyMaterial.findUnique({ where: { slug } });
    if (existing) {
      console.log(`[${i + 1}/${PAPERS.length}] ∼ Skipped (exists): ${titleEn}`);
      skipped++;
      continue;
    }

    try {
      await prisma.studyMaterial.create({
        data: {
          titleEn,
          titleAs,
          slug,
          examTag: "APSC",
          subject: p.subjectEn,
          year: p.year,
          resourceType: "QUESTION_PAPER" as ResourceType,
          fileUrl,
          fileSize: fileSizeKB,
          description: generateDescription(p),
          source: "assamcareer.com",
          status: "ACTIVE" as PostStatus,
          publishedAt: new Date(),
        },
      });
      console.log(`[${i + 1}/${PAPERS.length}] ✓ Created: ${titleEn} (${fileSizeKB} KB)`);
      created++;
    } catch (e) {
      console.log(`[${i + 1}/${PAPERS.length}] ✗ Error creating ${titleEn}: ${e}`);
      errors++;
    }
  }

  console.log(`\n--- Complete ---`);
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors:  ${errors}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
