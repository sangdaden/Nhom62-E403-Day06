import { prisma } from "@/lib/db/client";

const CACHE_TTL_MS = 60_000; // 60 seconds
const MAX_TOKENS_APPROX = 2000; // ~1500 chars per token estimate

let cache: { section: string; expiresAt: number } | null = null;

function truncateToTokenBudget(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n...(đã cắt ngắn để tiết kiệm context)";
}

export async function loadGoldenSection(): Promise<string> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.section;
  }

  try {
    const [positives, negatives] = await Promise.all([
      prisma.goldenExample.findMany({
        where: { enabled: true, sourceType: "positive" },
        orderBy: { sourceScore: "desc" },
        take: 5,
      }),
      prisma.goldenExample.findMany({
        where: { enabled: true, sourceType: "negative" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    if (positives.length === 0 && negatives.length === 0) {
      cache = { section: "", expiresAt: now + CACHE_TTL_MS };
      return "";
    }

    // Increment usage count for all loaded examples
    const allIds = [...positives, ...negatives].map((e) => e.id);
    prisma.goldenExample
      .updateMany({
        where: { id: { in: allIds } },
        data: { usageCount: { increment: 1 } },
      })
      .catch((e) => console.error("[golden-loader] usageCount update error:", e));

    let section = "";

    if (positives.length > 0) {
      section += "\n\n## VÍ DỤ TRẢ LỜI TỐT (tham khảo để giữ chất lượng)\n";
      for (const ex of positives) {
        const tools = ex.toolsUsed.length > 0 ? ` [tools: ${ex.toolsUsed.join(", ")}]` : "";
        section += `\nQ: ${ex.userQuery}${tools}\nA: ${ex.botResponse}\n`;
      }
    }

    if (negatives.length > 0) {
      section += "\n## TRÁNH TRẢ LỜI KIỂU NÀY (từ phản hồi tiêu cực)\n";
      for (const ex of negatives) {
        section += `\nQ: ${ex.userQuery}\nA kém: ${ex.botResponse}\n`;
      }
    }

    // Cap at ~2000 tokens (roughly 6000 chars assuming avg 3 chars/token)
    const maxChars = MAX_TOKENS_APPROX * 3;
    const finalSection = truncateToTokenBudget(section, maxChars);

    cache = { section: finalSection, expiresAt: now + CACHE_TTL_MS };
    return finalSection;
  } catch (err) {
    console.error("[golden-loader] load error:", err);
    return "";
  }
}

export function invalidateCache(): void {
  cache = null;
}
