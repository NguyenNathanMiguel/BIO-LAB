import React, { useEffect, useState } from "react";
import { GraduationCap, ShieldAlert } from "lucide-react";
import { base44 } from "@/api/base44Client";
import JournalEntryCard from "@/components/journal/JournalEntryCard";

export default function TeacherDashboard() {
  const [entries, setEntries] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await base44.auth.me().catch(() => null);
      const admin = user?.role === "admin";
      setIsAdmin(admin);
      if (admin) {
        const items = await base44.entities.ObservationJournal.list("-created_date", 100);
        setEntries(items);
      }
    })();
  }, []);

  if (isAdmin === false) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">Trang này chỉ dành cho tài khoản giáo viên/quản trị.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
      <p className="text-emerald-600 font-medium text-sm tracking-wide uppercase mb-2 flex items-center gap-1.5">
        <GraduationCap className="w-4 h-4" /> Dành Cho Giáo Viên
      </p>
      <h1 className="text-2xl md:text-3xl font-semibold text-[#0F2A20] tracking-tight mb-2">Nhật Ký Học Sinh</h1>
      <p className="text-slate-500 mb-8">Xem lại nhật ký quan sát của tất cả học sinh.</p>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">Chưa có ghi chú của học sinh nào.</div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} showStudent />
          ))}
        </div>
      )}
    </div>
  );
}