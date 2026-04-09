"use client";

import { useState, useTransition } from "react";
import { ThumbsUp, ThumbsDown, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from "lucide-react";

export interface GoldenExample {
  id: string;
  createdAt: string;
  userQuery: string;
  botResponse: string;
  toolsUsed: string[];
  sourceType: string;
  sourceScore: number;
  enabled: boolean;
  usageCount: number;
}

interface GoldenExampleTableProps {
  examples: GoldenExample[];
  adminKey: string;
}

export function GoldenExampleTable({ examples: initial, adminKey }: GoldenExampleTableProps) {
  const [examples, setExamples] = useState<GoldenExample[]>(initial);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  function handleToggle(id: string, currentEnabled: boolean) {
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/flywheel/golden?key=${adminKey}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, enabled: !currentEnabled }),
          }
        );
        if (!res.ok) throw new Error("Failed to toggle");
        const { example } = await res.json();
        setExamples((prev) =>
          prev.map((e) => (e.id === id ? { ...e, enabled: example.enabled } : e))
        );
      } catch (err) {
        console.error("[golden-table] toggle error:", err);
      }
    });
  }

  if (examples.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E9ED] p-8 text-center text-[#9AA5B1] text-sm">
        Chưa có golden examples. Upvote tin nhắn chất lượng cao rồi chạy promotion để tạo.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E5E9ED] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E5E9ED] bg-[#F7F9FA]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider w-8">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider">Query</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider w-20">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider w-16">Score</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider">Tools</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider w-20">Usage</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider w-20">Status</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F3F5]">
            {examples.map((ex, i) => (
              <>
                <tr
                  key={ex.id}
                  className={`hover:bg-[#F7F9FA] transition-colors ${!ex.enabled ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3 text-[#9AA5B1] text-xs">{i + 1}</td>
                  <td className="px-4 py-3 text-[#1A2B3C] max-w-xs">
                    <span className="line-clamp-2 text-xs leading-relaxed">
                      {ex.userQuery}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {ex.sourceType === "positive" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        <ThumbsUp className="w-3 h-3" />
                        tốt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-1 rounded-full">
                        <ThumbsDown className="w-3 h-3" />
                        kém
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold ${
                        ex.sourceScore >= 4
                          ? "text-emerald-600"
                          : ex.sourceScore >= 2.5
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {ex.sourceScore > 0 ? ex.sourceScore.toFixed(1) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {ex.toolsUsed.length > 0 ? (
                        ex.toolsUsed.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-xs bg-[#EEF2FF] text-[#4F46E5] px-2 py-0.5 rounded-full font-mono"
                          >
                            {t.replace(/_/g, "_")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#9AA5B1]">—</span>
                      )}
                      {ex.toolsUsed.length > 2 && (
                        <span className="text-xs text-[#9AA5B1]">+{ex.toolsUsed.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B7885]">
                    {ex.usageCount}x
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(ex.id, ex.enabled)}
                      disabled={isPending}
                      className="flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50"
                      title={ex.enabled ? "Đang bật — click để tắt" : "Đang tắt — click để bật"}
                    >
                      {ex.enabled ? (
                        <ToggleRight className="w-5 h-5 text-[#00B5AD]" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-[#9AA5B1]" />
                      )}
                    </button>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      onClick={() => toggleExpand(ex.id)}
                      className="text-[#9AA5B1] hover:text-[#1A2B3C] transition-colors"
                    >
                      {expandedId === ex.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedId === ex.id && (
                  <tr key={`${ex.id}-expanded`} className="bg-[#F7F9FA]">
                    <td colSpan={8} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-2">
                            User Query
                          </p>
                          <p className="text-sm text-[#1A2B3C] bg-white rounded-xl p-3 border border-[#E5E9ED]">
                            {ex.userQuery}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#9AA5B1] uppercase tracking-wider mb-2">
                            Bot Response
                          </p>
                          <p className="text-sm text-[#1A2B3C] bg-white rounded-xl p-3 border border-[#E5E9ED] max-h-40 overflow-y-auto">
                            {ex.botResponse}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#9AA5B1] mt-3">
                        Promoted:{" "}
                        {new Date(ex.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
