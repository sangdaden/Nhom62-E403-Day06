import { prisma } from "@/lib/db/client";
import { ShieldAlert, Zap, Star, BookOpen, TrendingUp } from "lucide-react";
import { QualityTrendChart } from "@/components/admin/QualityTrendChart";
import { GoldenExampleTable } from "@/components/admin/GoldenExampleTable";
import { PromoteButton } from "@/components/admin/PromoteButton";
import type { TrendPoint } from "@/components/admin/QualityTrendChart";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "vinmec-demo-2026";

interface PageProps {
  searchParams: Promise<{ key?: string }>;
}

export default async function FlywheelPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = params.key;

  if (key !== ADMIN_KEY) {
    return (
      <div className="min-h-screen bg-[#F7F9FA] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-[#E5E9ED] shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-[#1A2B3C] mb-2">Truy cập bị từ chối</h1>
          <p className="text-[#6B7885] text-sm">
            Thêm{" "}
            <code className="bg-[#E6F7F6] text-[#00918A] px-1.5 py-0.5 rounded text-xs">
              ?key=your-admin-key
            </code>{" "}
            vào URL.
          </p>
        </div>
      </div>
    );
  }

  // ── Fetch data server-side ──────────────────────────────────────
  const since14d = new Date(Date.now() - 14 * 24 * 3600 * 1000);
  since14d.setHours(0, 0, 0, 0);

  const [scores, examples, activeCount, feedbackCount7d, promotedCount7d] =
    await Promise.all([
      prisma.qualityScore.findMany({
        where: { createdAt: { gte: since14d } },
        select: { createdAt: true, overallScore: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.goldenExample.findMany({
        orderBy: [{ enabled: "desc" }, { sourceScore: "desc" }],
        take: 10,
      }),
      prisma.goldenExample.count({ where: { enabled: true } }),
      prisma.feedback.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } },
      }),
      prisma.goldenExample.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 3600 * 1000) } },
      }),
    ]);

  // Build trend data grouped by VN date
  const byDate = new Map<string, { sum: number; count: number }>();
  for (const s of scores) {
    const vnDate = new Date(s.createdAt.getTime() + 7 * 3600 * 1000)
      .toISOString()
      .slice(0, 10);
    const existing = byDate.get(vnDate) ?? { sum: 0, count: 0 };
    existing.sum += s.overallScore;
    existing.count += 1;
    byDate.set(vnDate, existing);
  }

  const trendData: TrendPoint[] = Array.from(byDate.entries())
    .map(([date, { sum, count }]) => ({
      date,
      avgScore: parseFloat((sum / count).toFixed(2)),
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Today's avg
  const todayVN = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
  const todayData = byDate.get(todayVN);
  const todayAvg = todayData
    ? parseFloat((todayData.sum / todayData.count).toFixed(2))
    : null;

  const promotionRate =
    feedbackCount7d > 0
      ? parseFloat(((promotedCount7d / feedbackCount7d) * 100).toFixed(1))
      : 0;

  const goldenForTable = examples.map((e) => ({
    ...e,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-[#F7F9FA]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E9ED] sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-md shadow-[#6366F1]/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#1A2B3C] leading-tight">
                Flywheel Dashboard
              </h1>
              <p className="text-xs text-[#9AA5B1]">
                Vinmec AI Agent — LLM-as-Judge · Golden Examples · Auto Promotion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/admin/feedback?key=${key}`}
              className="text-xs text-[#6B7885] hover:text-[#1A2B3C] transition-colors px-3 py-2"
            >
              ← Feedback
            </a>
            <PromoteButton adminKey={key} />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* ── Section 1: Metric Cards ───────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-4">
            Tổng quan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              icon={<Star className="w-5 h-5 text-amber-500" />}
              label="Quality Score hôm nay"
              value={todayAvg !== null ? `${todayAvg}/5` : "—"}
              sub={
                todayData
                  ? `${todayData.count} tin nhắn được chấm`
                  : "Chưa có dữ liệu hôm nay"
              }
              color="amber"
            />
            <MetricCard
              icon={<BookOpen className="w-5 h-5 text-[#00B5AD]" />}
              label="Golden examples đang bật"
              value={String(activeCount)}
              sub={`${examples.length} examples trong top 10`}
              color="teal"
            />
            <MetricCard
              icon={<TrendingUp className="w-5 h-5 text-[#6366F1]" />}
              label="Tỉ lệ promotion (7 ngày)"
              value={`${promotionRate}%`}
              sub={`${promotedCount7d} promoted / ${feedbackCount7d} feedbacks`}
              color="indigo"
            />
          </div>
        </section>

        {/* ── Section 2: Trend Chart ─────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Trend chất lượng 14 ngày
          </h2>
          <div className="bg-white rounded-2xl border border-[#E5E9ED] p-6">
            <QualityTrendChart data={trendData} />
          </div>
        </section>

        {/* ── Section 3: Golden Examples Table ──────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Golden examples (top 10)
            </h2>
            <span className="text-xs text-[#9AA5B1]">
              Toggle để enable/disable inject vào system prompt
            </span>
          </div>
          <GoldenExampleTable examples={goldenForTable} adminKey={key} />
        </section>

        <div className="text-center text-xs text-[#CED4DA] pb-4">
          Flywheel Dashboard · Vinmec AI Agent Demo ·{" "}
          <span className="font-mono">key=••••</span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: "amber" | "teal" | "indigo";
}) {
  const bg = {
    amber: "bg-amber-50",
    teal: "bg-[#E6F7F6]",
    indigo: "bg-indigo-50",
  }[color];

  return (
    <div className="bg-white rounded-2xl border border-[#E5E9ED] p-5 flex items-start gap-4">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#9AA5B1] mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-[#1A2B3C] leading-none">{value}</p>
        <p className="text-xs text-[#6B7885] mt-1">{sub}</p>
      </div>
    </div>
  );
}
