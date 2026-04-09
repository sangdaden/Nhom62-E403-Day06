-- CreateTable
CREATE TABLE "QualityScore" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "userQuery" TEXT NOT NULL,
    "botResponse" TEXT NOT NULL,
    "toolsUsed" TEXT[],
    "correctDepartment" INTEGER NOT NULL,
    "toolUsageComplete" INTEGER NOT NULL,
    "toneAppropriate" INTEGER NOT NULL,
    "concise" INTEGER NOT NULL,
    "followedWorkflow" INTEGER NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "judgeRationale" TEXT NOT NULL,
    "feedbackId" TEXT,

    CONSTRAINT "QualityScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoldenExample" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userQuery" TEXT NOT NULL,
    "botResponse" TEXT NOT NULL,
    "toolsUsed" TEXT[],
    "sourceType" TEXT NOT NULL,
    "sourceScore" DOUBLE PRECISION NOT NULL,
    "sourceFeedbackId" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GoldenExample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QualityScore_feedbackId_key" ON "QualityScore"("feedbackId");

-- CreateIndex
CREATE INDEX "QualityScore_createdAt_idx" ON "QualityScore"("createdAt");

-- CreateIndex
CREATE INDEX "QualityScore_overallScore_idx" ON "QualityScore"("overallScore");

-- CreateIndex
CREATE UNIQUE INDEX "GoldenExample_sourceFeedbackId_key" ON "GoldenExample"("sourceFeedbackId");

-- CreateIndex
CREATE INDEX "GoldenExample_enabled_sourceType_sourceScore_idx" ON "GoldenExample"("enabled", "sourceType", "sourceScore");

-- AddForeignKey
ALTER TABLE "QualityScore" ADD CONSTRAINT "QualityScore_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;
