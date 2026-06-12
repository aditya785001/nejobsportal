import { z } from "zod";

// ── Job Validation ──
export const jobPostSchema = z.object({
  titleEn: z.string().min(5, "English title is required"),
  titleAs: z.string().optional().default(""),
  slug: z.string().optional(),
  department: z.string().min(2),
  state: z.enum(["Assam", "ArunachalPradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "AllIndia"]),
  category: z.enum(["StateGovt", "CentralGovt", "Private", "NGO", "PublicSector", "Defense", "Banking", "Teaching", "Research"]),
  jobType: z.enum(["FullTime", "PartTime", "Contract", "WalkIn", "Internship", "Remote"]).default("FullTime"),
  selectionType: z.enum(["WrittenExam", "Interview", "Merit", "WalkInInterview", "PhysicalTest", "TradeTest", "SkillTest", "DocumentVerification", "Combined"]),
  totalVacancies: z.number().int().positive().nullable().optional(),
  payScale: z.string().optional().nullable(),
  qualification: z.string().min(2),
  ageLimit: z.string().optional().nullable(),
  lastDate: z.string(),
  applicationUrl: z.string().url(),
  fee: z.any().optional(),
  howToApplyEn: z.string().min(10),
  howToApplyAs: z.string().optional().default(""),
  importantDates: z.any().optional(),
  disclaimer: z.string().optional(),
  resources: z.any().optional(),
  notificationPdfUrl: z.string().optional().nullable(),
  notificationDate: z.string().optional().nullable(),
  summaryEn: z.string().min(10),
  summaryAs: z.string().optional().default(""),
  contentEn: z.string().optional().nullable(),
  contentAs: z.string().optional().nullable(),
  aiConfidence: z.number().min(0).max(1).default(1.0).optional(),
  pwdFriendly: z.boolean().default(false).optional(),
  pwdDetails: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  hashtags: z.array(z.string()).default([]).optional(),
});

// ── Result Validation ──
export const resultPostSchema = z.object({
  titleEn: z.string().min(5),
  titleAs: z.string().optional().default(""),
  slug: z.string().optional(),
  examName: z.string().min(2),
  resultType: z.enum(["EXAM", "RECRUITMENT", "ADMIT_CARD", "ANSWER_KEY", "CUTOFF", "MERIT_LIST"]),
  declaringBody: z.string().min(2),
  state: z.enum(["Assam", "ArunachalPradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "AllIndia"]),
  declarationDate: z.string(),
  pdfUrl: z.string().optional().nullable(),
  cutOffMarks: z.any().optional(),
  recheckInfo: z.string().optional().nullable(),
  whatsNext: z.string().optional().nullable(),
  summaryEn: z.string().optional().nullable(),
  summaryAs: z.string().optional().nullable(),
  contentEn: z.string().optional().nullable(),
  contentAs: z.string().optional().nullable(),
  hashtags: z.array(z.string()).default([]).optional(),
});

// ── Admission Validation ──
export const admissionPostSchema = z.object({
  titleEn: z.string().min(5),
  titleAs: z.string().optional().default(""),
  slug: z.string().optional(),
  institution: z.string().min(2),
  course: z.string().min(2),
  duration: z.string().optional().nullable(),
  seats: z.number().int().positive().nullable().optional(),
  feeStructure: z.any().optional(),
  eligibility: z.string().min(10),
  process: z.string().optional().nullable(),
  importantDates: z.any().optional(),
  portalUrl: z.string().optional().nullable(),
  state: z.enum(["Assam", "ArunachalPradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "AllIndia"]),
  contentEn: z.string().optional().nullable(),
  contentAs: z.string().optional().nullable(),
  hashtags: z.array(z.string()).default([]).optional(),
});

// ── Scholarship Validation ──
export const scholarshipPostSchema = z.object({
  titleEn: z.string().min(5),
  titleAs: z.string().optional().default(""),
  slug: z.string().optional(),
  schemeName: z.string().min(2),
  provider: z.string().min(2),
  amount: z.string().min(1),
  duration: z.string().optional().nullable(),
  eligibility: z.string().min(10),
  incomeLimit: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  applicationProcess: z.string().optional().nullable(),
  importantDates: z.any().optional(),
  portalUrl: z.string().optional().nullable(),
  state: z.enum(["Assam", "ArunachalPradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "AllIndia"]),
  contentEn: z.string().optional().nullable(),
  contentAs: z.string().optional().nullable(),
  hashtags: z.array(z.string()).default([]).optional(),
});

// ── Study Material Validation ──
export const studyMaterialSchema = z.object({
  titleEn: z.string().min(3),
  titleAs: z.string().min(3),
  slug: z.string().optional(),
  examTag: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  year: z.number().int().nullable().optional(),
  resourceType: z.enum(["QUESTION_PAPER", "SYLLABUS", "NOTES", "MOCK_TEST", "BOOK", "VIDEO", "OTHER"]),
  fileUrl: z.string(),
  fileSize: z.number().int().nullable().optional(),
  description: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  hashtags: z.array(z.string()).default([]).optional(),
});

// ── Comment Validation ──
export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000),
  postType: z.enum(["JOB", "RESULT", "ADMISSION", "SCHOLARSHIP", "STUDY_MATERIAL", "EXAM_PREP"]),
  postId: z.string().min(1),
  parentId: z.string().optional().nullable(),
});

export const examPrepArticleSchema = z.object({
  titleEn: z.string().min(5),
  titleAs: z.string().optional().default(""),
  slug: z.string().optional(),
  exam: z.string().min(2),
  category: z.string().optional().nullable(),
  contentEn: z.string().min(20),
  contentAs: z.string().optional().default(""),
  excerptEn: z.string().optional().nullable(),
  excerptAs: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  hashtags: z.array(z.string()).default([]).optional(),
});
