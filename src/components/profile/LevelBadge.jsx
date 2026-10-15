import React from "react";
import { Award } from "lucide-react";
import { LEVELS } from "@/lib/userLevel";

export default function LevelBadge({ level, compact }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
        <Award className="h-3 w-3" /> {level.name}
      </span>
    );
  }
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Cấp bậc</p>
          <p className="text-xl font-semibold text-[#0F2A20]">{level.name}</p>
        </div>
        <p className="ml-auto text-sm text-slate-500">{level.score} điểm</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${level.progress}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {level.next ? `Còn ${level.next.min - level.score} điểm để đạt ${level.next.name}` : "Bạn đã đạt cấp bậc cao nhất!"}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {LEVELS.map((l, i) => (
          <span key={l.name} className={`rounded-full px-2 py-0.5 text-[11px] ${i <= level.index ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>{l.name}</span>
        ))}
      </div>
    </div>
  );
}