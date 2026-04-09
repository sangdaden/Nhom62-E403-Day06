"use client";

import { cn } from "@/lib/utils";

interface DoctorCardProps {
  id: string;
  name: string;
  title: string;
  specialty?: string | null;
  experience?: number | null;
  departmentName: string;
  onSelect?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function DoctorCard({
  name,
  title,
  specialty,
  experience,
  departmentName,
  onSelect,
}: DoctorCardProps) {
  const initials = getInitials(name);

  return (
    <div
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={onSelect ? (e) => { if (e.key === "Enter" || e.key === " ") onSelect(); } : undefined}
      className={cn(
        "bg-white border border-vinmec-border rounded-xl p-3 shadow-card-soft",
        "flex items-start gap-3 transition-all duration-200",
        "hover:shadow-chat-bubble hover:-translate-y-0.5",
        "animate-fade-in-up",
        onSelect && "cursor-pointer hover:border-vinmec-primary/40 focus:outline-none focus:ring-2 focus:ring-vinmec-primary/30"
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-vinmec-primary to-vinmec-primary-dark flex items-center justify-center text-white font-semibold text-sm shadow-sm">
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-vinmec-text leading-tight truncate">
          {name}
        </p>
        <p className="text-xs text-vinmec-text-muted mt-0.5 truncate">{title}</p>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {specialty && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-vinmec-primary/10 text-vinmec-primary text-xs font-medium">
              {specialty}
            </span>
          )}
          {experience != null && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-vinmec-surface text-vinmec-text-muted text-xs">
              {experience} năm KN
            </span>
          )}
        </div>

        <p className="text-xs text-vinmec-text-subtle mt-1 truncate">
          {departmentName}
        </p>
      </div>

      {/* Action badge — visual affordance only, click handled by card */}
      {onSelect && (
        <span
          className={cn(
            "shrink-0 text-xs font-medium px-2.5 py-1.5 rounded-lg pointer-events-none",
            "bg-vinmec-primary/10 text-vinmec-primary"
          )}
        >
          Chọn ↗
        </span>
      )}
    </div>
  );
}
