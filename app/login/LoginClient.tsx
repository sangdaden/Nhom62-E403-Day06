"use client";

import { useRouter } from "next/navigation";
import { VinmecLogo } from "@/components/brand/VinmecLogo";
import { MobileStatusBar } from "@/components/layout/MobileStatusBar";
import { UserCard } from "@/components/login/UserCard";
import { useUserSession, type SessionUser } from "@/lib/store/user-session";

interface LoginClientProps {
  users: SessionUser[];
}

export function LoginClient({ users }: LoginClientProps) {
  const setUser = useUserSession((s) => s.setUser);
  const router = useRouter();

  const handleSelect = (u: SessionUser) => {
    setUser(u);
    router.push("/chat");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MobileStatusBar />

      {/* Header */}
      <div className="bg-vinmec-primary px-6 pt-8 pb-10 flex flex-col items-center gap-3">
        <VinmecLogo size={40} />
        <p className="text-white/90 text-sm font-medium mt-1">
          Trợ lý ảo sức khỏe 24/7
        </p>
      </div>

      {/* Content card overlapping header */}
      <div className="flex-1 bg-vinmec-surface px-4 -mt-4 rounded-t-3xl">
        <div className="pt-6 pb-4 px-1">
          <h1 className="text-xl font-bold text-vinmec-text mb-1">
            Chọn tài khoản demo
          </h1>
          <p className="text-sm text-vinmec-text-muted leading-relaxed">
            Vui lòng chọn một tài khoản để bắt đầu trò chuyện với trợ lý ảo
            VinmecCare
          </p>
        </div>

        <div className="space-y-3 mt-2">
          {users.map((user, i) => (
            <UserCard key={user.id} user={user} onSelect={handleSelect} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-vinmec-surface py-4 text-center">
        <p className="text-xs text-vinmec-text-subtle">
          Powered by OpenAI • Demo học tập
        </p>
      </div>
    </div>
  );
}
