"use client";

import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface SlotChipProps {
  datetime: string; // ISO string
  label: string;    // formatted display e.g. "08:00"
  onSelect: () => void;
}

export function SlotChip({ label, onSelect }: SlotChipProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium",
        "bg-vinmec-primary/10 text-vinmec-primary border border-vinmec-primary/20",
        "hover:bg-vinmec-primary hover:text-white hover:border-vinmec-primary",
        "active:scale-95 transition-all duration-150 hover:-translate-y-0.5",
        "animate-fade-in-up cursor-pointer"
      )}
    >
      <Clock size={11} className="opacity-70" />
      {label}
    </button>
  );
}
