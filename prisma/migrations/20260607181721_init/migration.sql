-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CONTRIBUTOR', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'CLOSED', 'CANCELLED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "JobCategory" AS ENUM ('StateGovt', 'CentralGovt', 'Private', 'NGO', 'PublicSector', 'Defense', 'Banking', 'Teaching', 'Research');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FullTime', 'PartTime', 'Contract', 'WalkIn', 'Internship', 'Remote');

-- CreateEnum
CREATE TYPE "SelectionType" AS ENUM ('WrittenExam', 'Interview', 'Merit', 'WalkInInterview', 'PhysicalTest', 'TradeTest', 'SkillTest', 'DocumentVerification', 'Combined');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('Assam', 'ArunachalPradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura', 'AllIndia');

-- CreateEnum
CREATE TYPE "PillarType" AS ENUM ('JOB', 'RESULT', 'ADMISSION', 'SCHOLARSHIP', 'STUDY_MATERIAL', 'EXAM_PREP');

-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('EXAM', 'RECRUITMENT', 'ADMIT_CARD', 'ANSWER_KEY', 'CUTOFF', 'MERIT_LIST');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('QUESTION_PAPER', 'SYLLABUS', 'NOTES', 'MOCK_TEST', 'BOOK', 'VIDEO', 'OTHER');

-- CreateEnum
CREATE TYPE "CollegeType" AS ENUM ('Government', 'GovernmentAided', 'Private', 'CentralUniversity', 'StateUniversity', 'Institute', 'Polytechnic', 'ITI');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'TELEGRAM', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotificationFrequency" AS ENUM ('IMMEDIATE', 'DAILY_DIGEST', 'WEEKLY_DIGEST', 'NONE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PHOTO', 'SIGNATURE', 'CERTIFICATE', 'ID_PROOF', 'CASTE_CERTIFICATE', 'INCOME_CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('STREAK_7', 'STREAK_30', 'FIRST_SAVE', 'FIRST_SHARE', 'FIRST_COMMENT', 'QUIZ_MASTER', 'TOP_CONTRIBUTOR', 'EARLY_ADOPTER', 'APPLICATION_TRACKER_10', 'COLLEGE_REVIEWER', 'INTERVIEW_SHARER');

-- CreateEnum
CREATE TYPE "CompetitorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ERROR');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "phone" TEXT,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPost" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAs" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "category" "JobCategory" NOT NULL,
    "jobType" "JobType" NOT NULL DEFAULT 'FullTime',
    "selectionType" "SelectionType" NOT NULL,
    "totalVacancies" INTEGER,
    "payScale" TEXT,
    "qualification" TEXT NOT NULL,
    "ageLimit" TEXT,
    "lastDate" TIMESTAMP(3) NOT NULL,
    "applicationUrl" TEXT NOT NULL,
    "fee" JSONB NOT NULL,
    "howToApplyEn" TEXT NOT NULL,
    "howToApplyAs" TEXT NOT NULL,
    "importantDates" JSONB,
    "disclaimer" TEXT NOT NULL DEFAULT 'All details are sourced from official notifications. Verify on the official portal before applying.',
    "resources" JSONB,
    "notificationPdfUrl" TEXT,
    "notificationDate" TIMESTAMP(3),
    "summaryEn" TEXT NOT NULL,
    "summaryAs" TEXT NOT NULL,
    "aiConfidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "scrapeSource" TEXT,
    "scrapeTimestamp" TIMESTAMP(3),
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "pwdFriendly" BOOLEAN NOT NULL DEFAULT false,
    "pwdDetails" TEXT,
    "expiresAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultPost" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAs" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "resultType" "ResultType" NOT NULL,
    "declaringBody" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "declarationDate" TIMESTAMP(3) NOT NULL,
    "pdfUrl" TEXT,
    "cutOffMarks" JSONB,
    "recheckInfo" TEXT,
    "whatsNext" TEXT,
    "summaryEn" TEXT,
    "summaryAs" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "scrapeSource" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdmissionPost" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAs" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "duration" TEXT,
    "seats" INTEGER,
    "feeStructure" JSONB,
    "eligibility" TEXT NOT NULL,
    "process" TEXT,
    "importantDates" JSONB,
    "portalUrl" TEXT,
    "state" "State" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "scrapeSource" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdmissionPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScholarshipPost" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAs" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "schemeName" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "duration" TEXT,
    "eligibility" TEXT NOT NULL,
    "incomeLimit" TEXT,
    "category" TEXT,
    "applicationProcess" TEXT,
    "importantDates" JSONB,
    "portalUrl" TEXT,
    "state" "State" NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "scrapeSource" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScholarshipPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyMaterial" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAs" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "examTag" TEXT,
    "subject" TEXT,
    "year" INTEGER,
    "resourceType" "ResourceType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "source" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPrepArticle" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAs" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "category" TEXT,
    "contentEn" TEXT NOT NULL,
    "contentAs" TEXT NOT NULL,
    "excerptEn" TEXT,
    "excerptAs" TEXT,
    "author" TEXT DEFAULT 'NEJobsPortal Team',
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamPrepArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQuiz" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "questions" JSONB NOT NULL,
    "pillar" TEXT,
    "createdBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hashtag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "postCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobPostHashtag" (
    "jobPostId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,

    CONSTRAINT "JobPostHashtag_pkey" PRIMARY KEY ("jobPostId","hashtagId")
);

-- CreateTable
CREATE TABLE "ResultPostHashtag" (
    "resultPostId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,

    CONSTRAINT "ResultPostHashtag_pkey" PRIMARY KEY ("resultPostId","hashtagId")
);

-- CreateTable
CREATE TABLE "AdmissionPostHashtag" (
    "admissionPostId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,

    CONSTRAINT "AdmissionPostHashtag_pkey" PRIMARY KEY ("admissionPostId","hashtagId")
);

-- CreateTable
CREATE TABLE "ScholarshipPostHashtag" (
    "scholarshipPostId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,

    CONSTRAINT "ScholarshipPostHashtag_pkey" PRIMARY KEY ("scholarshipPostId","hashtagId")
);

-- CreateTable
CREATE TABLE "StudyMaterialHashtag" (
    "studyMaterialId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,

    CONSTRAINT "StudyMaterialHashtag_pkey" PRIMARY KEY ("studyMaterialId","hashtagId")
);

-- CreateTable
CREATE TABLE "ExamPrepHashtag" (
    "examPrepArticleId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,

    CONSTRAINT "ExamPrepHashtag_pkey" PRIMARY KEY ("examPrepArticleId","hashtagId")
);

-- CreateTable
CREATE TABLE "UserFollowedHashtag" (
    "userId" TEXT NOT NULL,
    "hashtagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollowedHashtag_pkey" PRIMARY KEY ("userId","hashtagId")
);

-- CreateTable
CREATE TABLE "SavedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" "PillarType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationTracker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobPostId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SAVED',
    "deadline" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "postType" "PillarType" NOT NULL,
    "postId" TEXT NOT NULL,
    "status" "PostStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewExperience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "post" TEXT,
    "year" INTEGER NOT NULL,
    "questions" JSONB,
    "difficulty" TEXT,
    "tips" TEXT,
    "cleared" BOOLEAN,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuccessStory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "background" TEXT,
    "strategy" TEXT,
    "challenges" TEXT,
    "message" TEXT,
    "photoUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuccessStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "type" "CollegeType" NOT NULL,
    "accreditation" TEXT,
    "naacGrade" TEXT,
    "courses" JSONB,
    "feeRange" TEXT,
    "placementAvg" TEXT,
    "placementTopRecruiters" JSONB,
    "website" TEXT,
    "mapUrl" TEXT,
    "imageUrls" TEXT[],
    "contact" TEXT,
    "establishedYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeImage" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CollegeImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "facultyRating" INTEGER,
    "infrastructureRating" INTEGER,
    "placementRating" INTEGER,
    "campusLifeRating" INTEGER,
    "review" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "badgeType" "BadgeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("userId","badgeId")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "answers" JSONB,
    "timeSpent" INTEGER,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'modern',
    "data" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentLocker" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "docType" "DocumentType" NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "resizedUrl" TEXT,
    "fileSize" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "DocumentLocker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channels" "NotificationChannel"[],
    "states" "State"[],
    "pillars" "PillarType"[],
    "categories" "JobCategory"[],
    "exams" TEXT[],
    "hashtags" TEXT[],
    "frequency" "NotificationFrequency" NOT NULL DEFAULT 'IMMEDIATE',
    "deadlineAlerts" BOOLEAN NOT NULL DEFAULT true,
    "quizReminders" BOOLEAN NOT NULL DEFAULT true,
    "digestTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PillarType",
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openedAt" TIMESTAMP(3),
    "jobPostId" TEXT,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "postType" "PillarType" NOT NULL,
    "postId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapeLog" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "pillar" "PillarType" NOT NULL,
    "sourceName" TEXT,
    "status" TEXT NOT NULL,
    "itemsFound" INTEGER NOT NULL DEFAULT 0,
    "itemsCreated" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "duration" INTEGER,
    "runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AILog" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptType" TEXT NOT NULL,
    "tokensUsed" INTEGER,
    "confidence" DOUBLE PRECISION,
    "duration" INTEGER,
    "successful" BOOLEAN NOT NULL DEFAULT true,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AILog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlaggedContent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postType" "PillarType" NOT NULL,
    "postId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "comment" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlaggedContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorPost" (
    "id" TEXT NOT NULL,
    "competitorName" TEXT NOT NULL,
    "portalUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT,
    "pillartype" "PillarType",
    "postedAt" TIMESTAMP(3),
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "status" "CompetitorStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "CompetitorPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryEntry" (
    "id" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "department" TEXT,
    "state" "State" NOT NULL,
    "payLevel" TEXT,
    "payBand" TEXT,
    "basicPay" TEXT,
    "grossSalary" TEXT,
    "inHandSalary" TEXT,
    "allowances" JSONB,
    "source" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GovernmentScheme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "eligibility" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "documents" TEXT[],
    "applicationProcess" TEXT,
    "portalUrl" TEXT,
    "state" "State" NOT NULL,
    "ministry" TEXT,
    "budget" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GovernmentScheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamEvent" (
    "id" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "conductingBody" TEXT,
    "state" "State" NOT NULL,
    "examType" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "officialUrl" TEXT,
    "isTentative" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "JobPost_slug_key" ON "JobPost"("slug");

-- CreateIndex
CREATE INDEX "JobPost_status_state_category_idx" ON "JobPost"("status", "state", "category");

-- CreateIndex
CREATE INDEX "JobPost_slug_idx" ON "JobPost"("slug");

-- CreateIndex
CREATE INDEX "JobPost_lastDate_idx" ON "JobPost"("lastDate");

-- CreateIndex
CREATE INDEX "JobPost_scrapeSource_idx" ON "JobPost"("scrapeSource");

-- CreateIndex
CREATE INDEX "JobPost_publishedAt_idx" ON "JobPost"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ResultPost_slug_key" ON "ResultPost"("slug");

-- CreateIndex
CREATE INDEX "ResultPost_status_state_resultType_idx" ON "ResultPost"("status", "state", "resultType");

-- CreateIndex
CREATE INDEX "ResultPost_slug_idx" ON "ResultPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionPost_slug_key" ON "AdmissionPost"("slug");

-- CreateIndex
CREATE INDEX "AdmissionPost_status_state_idx" ON "AdmissionPost"("status", "state");

-- CreateIndex
CREATE INDEX "AdmissionPost_slug_idx" ON "AdmissionPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ScholarshipPost_slug_key" ON "ScholarshipPost"("slug");

-- CreateIndex
CREATE INDEX "ScholarshipPost_status_state_idx" ON "ScholarshipPost"("status", "state");

-- CreateIndex
CREATE INDEX "ScholarshipPost_slug_idx" ON "ScholarshipPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StudyMaterial_slug_key" ON "StudyMaterial"("slug");

-- CreateIndex
CREATE INDEX "StudyMaterial_status_examTag_resourceType_idx" ON "StudyMaterial"("status", "examTag", "resourceType");

-- CreateIndex
CREATE INDEX "StudyMaterial_slug_idx" ON "StudyMaterial"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ExamPrepArticle_slug_key" ON "ExamPrepArticle"("slug");

-- CreateIndex
CREATE INDEX "ExamPrepArticle_status_exam_idx" ON "ExamPrepArticle"("status", "exam");

-- CreateIndex
CREATE INDEX "ExamPrepArticle_slug_idx" ON "ExamPrepArticle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQuiz_date_key" ON "DailyQuiz"("date");

-- CreateIndex
CREATE INDEX "DailyQuiz_date_idx" ON "DailyQuiz"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_name_key" ON "Hashtag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_slug_key" ON "Hashtag"("slug");

-- CreateIndex
CREATE INDEX "Hashtag_slug_idx" ON "Hashtag"("slug");

-- CreateIndex
CREATE INDEX "Hashtag_postCount_idx" ON "Hashtag"("postCount");

-- CreateIndex
CREATE INDEX "JobPostHashtag_hashtagId_idx" ON "JobPostHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "ResultPostHashtag_hashtagId_idx" ON "ResultPostHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "AdmissionPostHashtag_hashtagId_idx" ON "AdmissionPostHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "ScholarshipPostHashtag_hashtagId_idx" ON "ScholarshipPostHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "StudyMaterialHashtag_hashtagId_idx" ON "StudyMaterialHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "ExamPrepHashtag_hashtagId_idx" ON "ExamPrepHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "UserFollowedHashtag_hashtagId_idx" ON "UserFollowedHashtag"("hashtagId");

-- CreateIndex
CREATE INDEX "SavedItem_userId_idx" ON "SavedItem"("userId");

-- CreateIndex
CREATE INDEX "SavedItem_itemType_itemId_idx" ON "SavedItem"("itemType", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedItem_userId_itemType_itemId_key" ON "SavedItem"("userId", "itemType", "itemId");

-- CreateIndex
CREATE INDEX "ApplicationTracker_userId_status_idx" ON "ApplicationTracker"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationTracker_userId_jobPostId_key" ON "ApplicationTracker"("userId", "jobPostId");

-- CreateIndex
CREATE INDEX "Comment_postType_postId_status_idx" ON "Comment"("postType", "postId", "status");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "InterviewExperience_examName_status_idx" ON "InterviewExperience"("examName", "status");

-- CreateIndex
CREATE INDEX "InterviewExperience_userId_idx" ON "InterviewExperience"("userId");

-- CreateIndex
CREATE INDEX "SuccessStory_isFeatured_status_idx" ON "SuccessStory"("isFeatured", "status");

-- CreateIndex
CREATE INDEX "SuccessStory_exam_idx" ON "SuccessStory"("exam");

-- CreateIndex
CREATE INDEX "College_state_type_idx" ON "College"("state", "type");

-- CreateIndex
CREATE INDEX "College_name_idx" ON "College"("name");

-- CreateIndex
CREATE INDEX "CollegeImage_collegeId_idx" ON "CollegeImage"("collegeId");

-- CreateIndex
CREATE INDEX "CollegeReview_collegeId_idx" ON "CollegeReview"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeReview_userId_collegeId_key" ON "CollegeReview"("userId", "collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_slug_key" ON "Badge"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_badgeType_key" ON "Badge"("badgeType");

-- CreateIndex
CREATE INDEX "UserBadge_badgeId_idx" ON "UserBadge"("badgeId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "QuizAttempt"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_userId_quizId_key" ON "QuizAttempt"("userId", "quizId");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- CreateIndex
CREATE INDEX "DocumentLocker_userId_docType_idx" ON "DocumentLocker"("userId", "docType");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_sentAt_idx" ON "NotificationLog"("userId", "sentAt");

-- CreateIndex
CREATE INDEX "NotificationLog_sentAt_idx" ON "NotificationLog"("sentAt");

-- CreateIndex
CREATE INDEX "ShareEvent_postType_postId_idx" ON "ShareEvent"("postType", "postId");

-- CreateIndex
CREATE INDEX "ShareEvent_platform_idx" ON "ShareEvent"("platform");

-- CreateIndex
CREATE INDEX "ShareEvent_sharedAt_idx" ON "ShareEvent"("sharedAt");

-- CreateIndex
CREATE INDEX "ScrapeLog_runAt_idx" ON "ScrapeLog"("runAt");

-- CreateIndex
CREATE INDEX "ScrapeLog_pillar_status_idx" ON "ScrapeLog"("pillar", "status");

-- CreateIndex
CREATE INDEX "AILog_createdAt_idx" ON "AILog"("createdAt");

-- CreateIndex
CREATE INDEX "AILog_promptType_idx" ON "AILog"("promptType");

-- CreateIndex
CREATE INDEX "FlaggedContent_postType_postId_idx" ON "FlaggedContent"("postType", "postId");

-- CreateIndex
CREATE INDEX "FlaggedContent_status_idx" ON "FlaggedContent"("status");

-- CreateIndex
CREATE INDEX "CompetitorPost_competitorName_detectedAt_idx" ON "CompetitorPost"("competitorName", "detectedAt");

-- CreateIndex
CREATE INDEX "CompetitorPost_isNew_idx" ON "CompetitorPost"("isNew");

-- CreateIndex
CREATE INDEX "SalaryEntry_state_position_idx" ON "SalaryEntry"("state", "position");

-- CreateIndex
CREATE INDEX "GovernmentScheme_state_category_idx" ON "GovernmentScheme"("state", "category");

-- CreateIndex
CREATE INDEX "GovernmentScheme_category_idx" ON "GovernmentScheme"("category");

-- CreateIndex
CREATE INDEX "ExamEvent_eventDate_idx" ON "ExamEvent"("eventDate");

-- CreateIndex
CREATE INDEX "ExamEvent_state_examType_idx" ON "ExamEvent"("state", "examType");

-- CreateIndex
CREATE INDEX "ExamEvent_examName_idx" ON "ExamEvent"("examName");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPostHashtag" ADD CONSTRAINT "JobPostHashtag_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPostHashtag" ADD CONSTRAINT "JobPostHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultPostHashtag" ADD CONSTRAINT "ResultPostHashtag_resultPostId_fkey" FOREIGN KEY ("resultPostId") REFERENCES "ResultPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultPostHashtag" ADD CONSTRAINT "ResultPostHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionPostHashtag" ADD CONSTRAINT "AdmissionPostHashtag_admissionPostId_fkey" FOREIGN KEY ("admissionPostId") REFERENCES "AdmissionPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdmissionPostHashtag" ADD CONSTRAINT "AdmissionPostHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipPostHashtag" ADD CONSTRAINT "ScholarshipPostHashtag_scholarshipPostId_fkey" FOREIGN KEY ("scholarshipPostId") REFERENCES "ScholarshipPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScholarshipPostHashtag" ADD CONSTRAINT "ScholarshipPostHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMaterialHashtag" ADD CONSTRAINT "StudyMaterialHashtag_studyMaterialId_fkey" FOREIGN KEY ("studyMaterialId") REFERENCES "StudyMaterial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyMaterialHashtag" ADD CONSTRAINT "StudyMaterialHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPrepHashtag" ADD CONSTRAINT "ExamPrepHashtag_examPrepArticleId_fkey" FOREIGN KEY ("examPrepArticleId") REFERENCES "ExamPrepArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPrepHashtag" ADD CONSTRAINT "ExamPrepHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowedHashtag" ADD CONSTRAINT "UserFollowedHashtag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowedHashtag" ADD CONSTRAINT "UserFollowedHashtag_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedItem" ADD CONSTRAINT "SavedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTracker" ADD CONSTRAINT "ApplicationTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationTracker" ADD CONSTRAINT "ApplicationTracker_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewExperience" ADD CONSTRAINT "InterviewExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuccessStory" ADD CONSTRAINT "SuccessStory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeImage" ADD CONSTRAINT "CollegeImage_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeReview" ADD CONSTRAINT "CollegeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeReview" ADD CONSTRAINT "CollegeReview_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "DailyQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentLocker" ADD CONSTRAINT "DocumentLocker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_jobPostId_fkey" FOREIGN KEY ("jobPostId") REFERENCES "JobPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareEvent" ADD CONSTRAINT "ShareEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlaggedContent" ADD CONSTRAINT "FlaggedContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
