import React from "react";
import { Target, Lightbulb, CheckCircle2 } from "lucide-react";

export default function ChallengePanel({ challenge, index, total, completed, completedCount, active, busy, completionId, feedback, onStart, onNext }) {
  return (
    <section data-testid="challenge-panel" data-completion-id={completionId} className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-semibold text-amber-950"><Target className="h-4 w-4" /> Thử thách</h3><span className="text-xs font-medium text-amber-700">{index + 1} / {total}</span></div>
      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-amber-200"><div className="h-full bg-amber-500 transition-all" style={{ width: `${(completedCount / total) * 100}%` }} /></div>
      <p className="mb-2 text-xs text-amber-700">Đã hoàn thành {completedCount} / {total}</p>
      <p className="mb-2 text-[11px] text-amber-800">Luyện nhận diện trên tiêu bản mô phỏng có vị trí cấu trúc xác định.</p>
      <p className="text-sm text-amber-950">{challenge.objective}</p>
      {feedback && <p className={`mt-3 rounded-lg p-2 text-xs ${completed ? "bg-emerald-100 text-emerald-800" : "bg-white text-amber-800"}`}>{completed ? <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> : <Lightbulb className="mr-1 inline h-3.5 w-3.5" />}{feedback}</p>}
      <button disabled={busy || active} onClick={completed ? onNext : onStart} className="mt-3 w-full rounded-lg bg-amber-500 py-2 text-xs font-semibold text-amber-950 disabled:opacity-60">{busy ? 'Đang tải…' : completed ? 'Thử thách tiếp theo' : active ? 'Chọn cấu trúc trong kính' : 'Bắt đầu trên tiêu bản'}</button>
    </section>
  );
}