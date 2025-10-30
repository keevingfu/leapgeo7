-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'ANALYST', 'VIEWER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "PLevel" AS ENUM ('P0', 'P1', 'P2', 'P3');

-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('YOUTUBE', 'REDDIT', 'QUORA', 'MEDIUM', 'BLOG', 'AMAZON', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CitationStrength" AS ENUM ('DIRECT', 'REFERENCED', 'MENTIONED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "pLevel" "PLevel" NOT NULL,
    "enhancedGeoScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quickWinIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "searchVolume" INTEGER NOT NULL DEFAULT 0,
    "competition" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trendingStatus" TEXT NOT NULL DEFAULT 'stable',
    "estimatedTraffic" INTEGER NOT NULL DEFAULT 0,
    "difficulty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channel" "Channel" NOT NULL,
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishDate" TIMESTAMP(3),
    "contentUrl" TEXT,
    "coveredPrompts" TEXT[],
    "kpiCtr" DOUBLE PRECISION,
    "kpiViews" INTEGER,
    "kpiGmv" DOUBLE PRECISION,
    "kpiEngagement" DOUBLE PRECISION,
    "kpiConversion" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "roadmapId" TEXT,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Citation" (
    "id" TEXT NOT NULL,
    "citationUrl" TEXT NOT NULL,
    "platform" "Channel" NOT NULL,
    "citationStrength" "CitationStrength" NOT NULL,
    "aiIndexed" BOOLEAN NOT NULL DEFAULT false,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "citationContext" TEXT,
    "sentiment" DOUBLE PRECISION,
    "visibility" DOUBLE PRECISION,
    "roadmapId" TEXT,
    "contentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Citation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sentiment" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "actionTaken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "taskType" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "PLevel" NOT NULL DEFAULT 'P2',
    "assignedTo" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Roadmap_pLevel_month_idx" ON "Roadmap"("pLevel", "month");

-- CreateIndex
CREATE INDEX "Roadmap_enhancedGeoScore_idx" ON "Roadmap"("enhancedGeoScore" DESC);

-- CreateIndex
CREATE INDEX "Roadmap_quickWinIndex_idx" ON "Roadmap"("quickWinIndex" DESC);

-- CreateIndex
CREATE INDEX "Roadmap_month_pLevel_idx" ON "Roadmap"("month", "pLevel");

-- CreateIndex
CREATE INDEX "Content_channel_publishStatus_idx" ON "Content"("channel", "publishStatus");

-- CreateIndex
CREATE INDEX "Content_publishDate_idx" ON "Content"("publishDate" DESC);

-- CreateIndex
CREATE INDEX "Content_roadmapId_idx" ON "Content"("roadmapId");

-- CreateIndex
CREATE INDEX "Citation_platform_citationStrength_idx" ON "Citation"("platform", "citationStrength");

-- CreateIndex
CREATE INDEX "Citation_aiIndexed_isActive_idx" ON "Citation"("aiIndexed", "isActive");

-- CreateIndex
CREATE INDEX "Citation_detectedAt_idx" ON "Citation"("detectedAt" DESC);

-- CreateIndex
CREATE INDEX "Citation_roadmapId_idx" ON "Citation"("roadmapId");

-- CreateIndex
CREATE INDEX "Citation_contentId_idx" ON "Citation"("contentId");

-- CreateIndex
CREATE INDEX "Feedback_sentiment_processed_idx" ON "Feedback"("sentiment", "processed");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "Feedback"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Feedback_category_idx" ON "Feedback"("category");

-- CreateIndex
CREATE INDEX "WorkflowTask_status_priority_idx" ON "WorkflowTask"("status", "priority");

-- CreateIndex
CREATE INDEX "WorkflowTask_dueDate_idx" ON "WorkflowTask"("dueDate" ASC);

-- CreateIndex
CREATE INDEX "WorkflowTask_assignedTo_idx" ON "WorkflowTask"("assignedTo");

-- CreateIndex
CREATE UNIQUE INDEX "SystemConfig_key_key" ON "SystemConfig"("key");

-- CreateIndex
CREATE INDEX "SystemConfig_category_idx" ON "SystemConfig"("category");

-- CreateIndex
CREATE INDEX "SystemConfig_key_idx" ON "SystemConfig"("key");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Citation" ADD CONSTRAINT "Citation_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
