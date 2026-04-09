"use client";

import { X } from "lucide-react";
import { VinmecLogo } from "@/components/brand/VinmecLogo";

interface ChatHeaderProps {
  onClose?: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="bg-vinmec-primary flex items-center gap-3 px-3 h-[72px] shrink-0">
      <button
        onClick={onClose}
        aria-label="Đóng và đăng xuất"
        className="w-9 h-9 flex items-center justify-center rounded-full
                   hover:bg-white/20 active:bg-white/30 transition-colors shrink-0"
      >
        <X size={20} className="text-white" />
      </button>

      <VinmecLogo size={32} />

      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-base leading-tight truncate">
          Trợ lý ảo VinmecCare
        </p>
        <p className="text-white/80 text-xs flex items-center gap-1 mt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Đang hoạt động
        </p>
      </div>
    </div>
  );
}
