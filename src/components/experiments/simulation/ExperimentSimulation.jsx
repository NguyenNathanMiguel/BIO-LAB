import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import SimulationCanvas from '@/components/experiments/simulation/SimulationCanvas.jsx';
import useSimulation from '@/components/experiments/simulation/useSimulation.js';
export default function ExperimentSimulation({kind,params}) {
  const sim=useSimulation(kind,params), minutes=kind==='osmosis'?(sim.elapsed/60).toFixed(1):(sim.elapsed/60).toFixed(1);
  return <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4" aria-label="Mô phỏng tương tác">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h4 className="font-semibold text-slate-800">Mô phỏng 2D tương tác</h4><p className="text-xs text-slate-500">Quan sát đồng thời dụng cụ và quá trình ở cấp độ phân tử.</p></div><span className="text-sm font-medium text-slate-700">{minutes} phút</span></div>
    <SimulationCanvas kind={kind} params={params} elapsed={sim.elapsed} running={sim.running}/>
    <div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>sim.setRunning(!sim.running)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-sm text-white">{sim.running?<Pause className="h-4 w-4"/>:<Play className="h-4 w-4"/>}{sim.running?'Tạm dừng':'Bắt đầu'}</button><button onClick={sim.reset} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><RotateCcw className="h-4 w-4"/>Đặt lại</button><label className="ml-auto flex items-center gap-2 text-sm">Tốc độ<select value={sim.speed} onChange={e=>sim.setSpeed(Number(e.target.value))} className="rounded-lg border bg-white px-2 py-2"><option value="1">1×</option><option value="5">5×</option><option value="20">20×</option></select></label></div>
  </section>;
}