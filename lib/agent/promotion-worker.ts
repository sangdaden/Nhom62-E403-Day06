import { prisma } from "@/lib/db/client";
import { invalidateCache } from "./golden-loader";

const MIN_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
let lastRunAt = 0;

export interface PromotionResult {
  promoted: number;
  antiPatterns: number;
  skipped: boolean;
  ranAt: string;
}

export async function runPromotion(force = false): Promise<PromotionResult> {
  const now = Date.now();

  if (!force && now - lastRunAt < MIN_INTERVAL_MS) {
    return {
      promoted: 0,
      antiPatterns: 0,
      skipped: true,
      ranAt: new Date(lastRunAt).toISOString(),
    };
  }

  lastRunAt = now;

  // ── Positive: rating=up, overallScore >= 4.0, not yet promoted ──
  const positiveCandidates = await prisma.feedback.findMany({
    where: {
      rating: "up",
      qualityScore: {
        overallScore: { gte: 4.0 },
      },
    },
    include: {
      qualityScore: true,
    },
    orderBy: {
      qualityScore: { overallScore: "desc" },
    },
    take: 10,
  });

  let promoted = 0;
  for (const fb of positiveCandidates) {
    if (!fb.qualityScore) continue;

    // Check if already promoted (idempotent)
    const existing = await prisma.goldenExample.findUnique({
      where: { sourceFeedbackId: fb.id },
    });
    if (existing) continue;

    const toolsUsed = Array.isArray(fb.toolsUsed)
      ? (fb.toolsUsed as string[])
      : [];

    await prisma.goldenExample.create({
      data: {
        userQuery: fb.query,
        botResponse: fb.response,
        toolsUsed,
        sourceType: "positive",
        sourceScore: fb.qualityScore.overallScore,
        sourceFeedbackId: fb.id,
        enabled: true,
      },
    });

    promoted++;
  }

  // ── Negative: rating=down, reason != null, top 5 recent ──
  const negativeCandidates = await prisma.feedback.findMany({
    where: {
      rating: "down",
      reason: { not: null },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  let antiPatterns = 0;
  for (const fb of negativeCandidates) {
    const existing = await prisma.goldenExample.findUnique({
      where: { sourceFeedbackId: fb.id },
    });
    if (existing) continue;

    const toolsUsed = Array.isArray(fb.toolsUsed)
      ? (fb.toolsUsed as string[])
      : [];

    await prisma.goldenExample.create({
      data: {
        userQuery: fb.query,
        botResponse: fb.response,
        toolsUsed,
        sourceType: "negative",
        sourceScore: 0,
        sourceFeedbackId: fb.id,
        enabled: true,
      },
    });

    antiPatterns++;
  }

  // Invalidate golden section cache so next chat uses updated examples
  if (promoted > 0 || antiPatterns > 0) {
    invalidateCache();
  }

  console.log(
    `[promotion-worker] done: +${promoted} positives, +${antiPatterns} anti-patterns`
  );

  return {
    promoted,
    antiPatterns,
    skipped: false,
    ranAt: new Date(now).toISOString(),
  };
}
