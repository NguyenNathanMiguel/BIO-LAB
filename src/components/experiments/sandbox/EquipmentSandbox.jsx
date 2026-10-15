import React, { useState } from "react";
import SimulationCanvas from "@/components/experiments/SimulationCanvas";
import { equipmentDetail } from "@/components/experiments/sandbox/sandboxModel";

export default function EquipmentSandbox({ kind, params, elapsed, running, sandbox }) {
  const [trayOpen, setTrayOpen] = useState(true);
  const selected = sandbox.items.find(item => item.id === sandbox.selected);
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden" {...sandbox.handlers}>
    <button type="button" onClick={() => setTrayOpen(value => !value)} className="w-full min-h-11 px-4 text-left text-xs font-semibold tracking-widest text-emerald-800 bg-emerald-50">KHAY DỤNG CỤ {trayOpen ? "— Thu gọn" : "— Mở"}</button>
    {trayOpen && <div className="flex gap-2 overflow-x-auto border-y border-slate-200 bg-white p-3">
      {sandbox.config.map(tool => <button type="button" key={tool.type} data-testid={`sandbox-tool-${tool.type}`} onPointerDown={event => sandbox.start(event, { ...tool, fromTray: true })} className="min-h-11 min-w-32 touch-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-emerald-400">{tool.label}</button>)}
    </div>}
    <div ref={sandbox.stageRef} data-testid="sandbox-stage" className="relative min-h-64 touch-none overflow-hidden bg-white">
      <SimulationCanvas kind={kind} params={params} elapsed={elapsed} running={running} />
      {sandbox.items.map(item => <button type="button" key={item.id} onPointerDown={event => sandbox.start(event, item)} onClick={() => sandbox.selected === item.id || null} className={`absolute z-10 min-h-11 min-w-24 -translate-x-1/2 -translate-y-1/2 touch-none rounded-xl border px-3 py-2 text-xs shadow-md ${sandbox.selected === item.id ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-white"}`} style={{ left: `${item.x}%`, top: `${item.y}%`, transform: `translate(-50%, -50%) rotate(${item.rotation}deg)` }}><strong className="block text-slate-700">{item.label}</strong><span className="text-slate-500">{equipmentDetail(kind, item.type, params)}</span></button>)}
      {sandbox.ghost && <div className="pointer-events-none fixed z-[120] min-h-11 min-w-24 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-emerald-400 bg-white px-3 py-2 text-xs shadow-xl" style={{ left: sandbox.ghost.clientX, top: sandbox.ghost.clientY }}>{sandbox.ghost.label}</div>}
    </div>
    <div className="flex min-h-12 items-center gap-2 border-t border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
      <span>Kéo dụng cụ vào bàn; kéo trở lại khay để cất.</span>
      {selected?.rotatable && <button type="button" onClick={() => sandbox.rotate(selected.id)} className="ml-auto min-h-11 rounded-lg border px-3 text-slate-700">Xoay 45°</button>}
      {selected && <button type="button" onClick={() => sandbox.remove(selected.id)} className={`${selected.rotatable ? "" : "ml-auto"} min-h-11 rounded-lg border px-3 text-slate-700`}>Trả về khay</button>}
    </div>
  </div>;
}