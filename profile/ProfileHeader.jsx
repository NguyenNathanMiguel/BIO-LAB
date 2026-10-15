import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function ProfileHeader({ user, stats }) {
  const initial = (user.full_name || user.email || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0F2A20] text-2xl font-semibold text-emerald-200">{initial}</div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold text-[#0F2A20]">{user.full_name || "Người dùng"}</h1>
          <p className="truncate text-sm text-slate-500">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => base44.auth.logout("/login")} className="rounded-xl">
          <LogOut className="mr-1.5 h-4 w-4" /> Đăng xuất
        </Button>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat label="Nhật ký" value={stats.journals} />
        <Stat label="Đã chia sẻ" value={stats.shared} />
        <Stat label="Sao nhận được" value={stats.stars} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F6F8F4] p-3">
      <p className="text-xl font-semibold text-[#0F2A20]">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}