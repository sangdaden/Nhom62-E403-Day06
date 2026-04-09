"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface PromoteButtonProps {
  adminKey: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function PromoteButton({ adminKey }: PromoteButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<string | null>(null);

  async function handlePromote() {
    setStatus("loading");
    setResult(null);

    try {
      const res = await fetch(
        `/api/admin/flywheel/promote?key=${adminKey}&force=true`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Promote failed");
      const data = await res.json();

      if (data.skipped) {
        setResult("Đã chạy gần đây, không cần chạy lại");
      } else {
        setResult(`+${data.promoted} positive, +${data.antiPatterns} anti-pattern`);
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setResult("Lỗi khi chạy promotion");
    } finally {
      setTimeout(() => {
        setStatus("idle");
        setResult(null);
      }, 5000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {result && (
        <span
          className={`text-xs px-2 py-1 rounded-lg ${
            status === "error"
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {result}
        </span>
      )}
      <button
        onClick={handlePromote}
        disabled={status === "loading"}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white text-xs font-medium rounded-xl transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        ) : status === "success" ? (
          <CheckCircle className="w-3.5 h-3.5" />
        ) : status === "error" ? (
          <AlertCircle className="w-3.5 h-3.5" />
        ) : (
          <RefreshCw className="w-3.5 h-3.5" />
        )}
        Re-run Promotion
      </button>
    </div>
  );
}
