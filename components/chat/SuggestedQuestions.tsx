"use client";

import { MessageCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyStateIllustration } from "./EmptyStateIllustration";

interface SuggestedQuestionsProps {
  questions: string[];
  onPick: (q: string) => void;
  variant?: "empty" | "inline";
  title?: string;
}

export function SuggestedQuestions({
  questions,
  onPick,
  variant = "inline",
  title,
}: SuggestedQuestionsProps) {
  if (variant === "empty") {
    return (
      <div className="flex flex-col items-center w-full gap-5 px-2 py-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <EmptyStateIllustration />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-vinmec-text">
              {title ?? "Bạn muốn hỏi gì hôm nay?"}
            </p>
            <p className="text-xs text-vinmec-text-muted">
              Em sẵn sàng hỗ trợ anh/chị 24/7
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          {questions.map((q, i) => (
            <button
              key={q}
              onClick={() => onPick(q)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "w-full text-left flex items-center gap-3 px-4 py-3",
                "bg-white border border-vinmec-border rounded-2xl",
                "shadow-card-soft hover:shadow-chat-bubble",
                "hover:-translate-y-0.5 transition-all duration-200",
                "animate-fade-in-up",
                "group"
              )}
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-vinmec-primary/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-vinmec-primary" />
              </div>
              <span className="flex-1 text-sm text-vinmec-text leading-snug">
                {q}
              </span>
              <ChevronRight className="shrink-0 w-4 h-4 text-vinmec-text-subtle group-hover:text-vinmec-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Inline chip variant
  return (
    <div
      className="flex flex-col items-end gap-2 animate-fade-in-up"
      style={{ animationDelay: "100ms" }}
    >
      <p className="text-xs text-vinmec-text-muted px-1 text-right">
        {title ?? "Gợi ý tiếp theo"}
      </p>
      <div className="flex flex-wrap justify-end gap-2">
        {questions.map((q, i) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            style={{ animationDelay: `${i * 50}ms` }}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5",
              "border border-vinmec-primary/40 text-vinmec-primary",
              "bg-vinmec-primary/5 hover:bg-vinmec-primary/10",
              "rounded-full text-xs font-medium",
              "transition-all duration-150 hover:-translate-y-0.5",
              "animate-fade-in-up whitespace-normal text-right"
            )}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
