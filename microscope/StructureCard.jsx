import React from "react";
import { X } from "lucide-react";

export default function StructureCard({ structure, loading, onClose }) {
  if (!structure && !loading) return null;
  return <div aria-live="polite" className="relative mt-4 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-lg">
    <button aria-label="Đóng thông tin cấu trúc" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute right-3 top-3 text-slate-400"><X className="h-4 w-4" /></button>
    {loading ? <div className="flex items-center gap-2 pr-6">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      <p className="text-xs font-semibold text-emerald-700">Đang ghi nhận cấu trúc đã chọn...</p>
    </div> : <>
      <p className="pr-6 text-sm font-bold uppercase text-emerald-950">{structure.label}</p>
      {structure.groupCount > 1 && <p className="mt-0.5 text-xs font-semibold text-cyan-700">{structure.label} × {structure.groupCount} · Tất cả cấu trúc cùng loại đang được làm nổi bật</p>}
      {structure.category && <p className="mt-0.5 text-[11px] text-slate-500">{structure.category}</p>}
      <p className="mt-2 text-xs font-semibold text-emerald-700">Chức năng</p>
      <p className="text-xs leading-relaxed text-slate-600">{structure.function}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-700">Đặc điểm</p>
      <p className="text-xs leading-relaxed text-slate-600">{structure.info}</p>
      {structure.related?.length > 0 && <>
        <p className="mt-2 text-xs font-semibold text-emerald-700">Cấu trúc liên quan</p>
        <div className="mt-1 flex flex-wrap gap-1.5">{structure.related.map((name) => <span key={name} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">{name}</span>)}</div>
      </>}
    </>}
  </div>;
}