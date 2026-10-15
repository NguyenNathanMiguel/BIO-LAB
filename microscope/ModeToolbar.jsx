import React from "react";
import { Maximize, Minimize } from "lucide-react";

export default function ModeToolbar({ mode, onMode, fullscreen, onFullscreen }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-900/10 bg-white p-2 shadow-sm"><div className="flex rounded-xl bg-emerald-950 p-1">{[["2D", "Kính 2D"], ["3D", "Di truyền 3D"]].map(([item, label]) => <button key={item} aria-pressed={mode === item} onClick={() => onMode(item)} className={`rounded-lg px-6 py-2 text-sm font-bold transition ${mode === item ? "bg-emerald-400 text-emerald-950" : "text-white/60"}`}>{label}</button>)}</div><button onClick={onFullscreen} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-emerald-700">{fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}{fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}</button></div>;
}