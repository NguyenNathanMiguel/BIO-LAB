import React, { useState } from "react";
import SimulationRecords from "@/components/experiments/SimulationRecords";
import useSimulation from "@/components/experiments/useSimulation";
import useEquipmentSandbox from "@/components/experiments/sandbox/useEquipmentSandbox";
import EquipmentSandbox from "@/components/experiments/sandbox/EquipmentSandbox";
import { sandboxEquipment } from "@/components/experiments/sandbox/sandboxModel";
import { parameterSummary, simulationReading } from "@/components/experiments/simulationReadings";

export default function ExperimentSimulation({ kind, params }) {
  const sim = useSimulation(kind), sandbox = useEquipmentSandbox(sandboxEquipment[kind]), [records, setRecords] = useState([]);
  const minutes = (sim.elapsed / 60).toFixed(1), reading = simulationReading(kind, params, sim.elapsed);
  const reset = () => { sim.reset(); sandbox.reset(); setRecords([]); };
  const record = () => setRecords(items => [...items, { id: crypto.randomUUID(), parameters: parameterSummary(kind, params), minutes, value: reading.value, unit: reading.unit }]);
  return <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4" aria-label="Phòng thí nghiệm 2D tương tác">
    <div className="mb-3 flex items-center justify-between gap-3"><div><h4 className="font-semibold text-slate-800">Phòng thí nghiệm 2D</h4><p className="text-xs text-slate-500">Chọn dụng cụ, kéo vào bàn, điều chỉnh rồi chạy mô phỏng.</p></div><span className="text-sm font-medium text-slate-700">{minutes} phút</span></div>
    <EquipmentSandbox kind={kind} params={params} elapsed={sim.elapsed} running={sim.running} sandbox={sandbox} />
    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm"><span className="text-slate-500">Kết quả hiện tại: </span><strong data-testid="simulation-reading">{reading.value} {reading.unit}</strong><span className="ml-2 text-slate-500">({reading.detail})</span></div>
    <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => sim.setRunning(!sim.running)} className="min-h-11 rounded-xl bg-emerald-700 px-4 text-sm text-white">{sim.running ? "Tạm dừng" : "Bắt đầu"}</button><button onClick={reset} className="min-h-11 rounded-xl border px-4 text-sm">Đặt lại</button><button disabled={!sim.elapsed} onClick={record} className="min-h-11 rounded-xl border px-4 text-sm disabled:opacity-40">Ghi kết quả</button><label className="ml-auto flex items-center gap-2 text-sm">Tốc độ<select value={sim.speed} onChange={event => sim.setSpeed(Number(event.target.value))} className="min-h-11 rounded-lg border bg-white px-2">{[1,2,4,8].map(value => <option value={value} key={value}>{value}×</option>)}</select></label></div>
    <SimulationRecords records={records} onClear={() => setRecords([])} />
  </section>;
}