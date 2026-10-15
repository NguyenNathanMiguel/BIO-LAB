import React, { useState } from 'react';
import { Camera, Plus, X } from 'lucide-react';
import LabGraph from '@/components/experiments/lab/LabGraph';
import { summarizeConditions } from '@/components/experiments/lab/plantGrowthModel';
export default function LabComparison({ definition, lab, runs, name, setName, onCapture, onNew, onRemove }) {
  const [visible, setVisible] = useState(false);
  return <section className="lab-panel">
    <h3 className="lab-heading">THỬ NGHIỆM</h3><p className="lab-muted text-sm mb-4">Giữ kết quả A, tạo lượt B rồi thay đổi điều kiện. Các lượt được giữ trong phiên này; hãy lưu Nhật Ký để lưu lâu dài.</p>
    <div className="flex flex-wrap gap-2"><input className="lab-input flex-1 min-w-0" aria-label="Tên thử nghiệm" maxLength={60} value={name} onChange={e => setName(e.target.value)} />
      <button className="lab-btn" disabled={lab.state.day === 0 || runs.length >= 4 || !name.trim()} onClick={onCapture}><Camera size={16} />Giữ kết quả</button>
      <button className="lab-btn" onClick={onNew}><Plus size={16} />Lượt mới</button>
      <button className="lab-btn lab-primary" disabled={runs.length < 2} onClick={() => setVisible(v => !v)} aria-expanded={visible}>{visible ? 'Ẩn so sánh' : 'SO SÁNH KẾT QUẢ'}</button></div>
    <p className="lab-muted text-xs mt-2">Giữ kết quả sẽ tạm dừng lượt hiện tại. Tối đa 4 lượt; “Lượt mới” giữ các kết quả, “Đặt lại” xóa toàn bộ phiên.</p>
    {runs.length > 0 && <div className="mt-4 grid gap-3 md:grid-cols-2">{runs.map((run, i) => <article key={run.id} className="lab-run" data-testid={`run-${i}`}>
      <div className="flex items-center justify-between"><h4 className="font-semibold break-words min-w-0">{run.name}</h4><button className="lab-small shrink-0" aria-label={`Xóa kết quả ${run.name}`} onClick={() => onRemove(run.id)}><X size={16} /></button></div>
      <p className="lab-muted text-xs">Ngày {run.state.day.toFixed(1)} · {run.changes.length > 1 ? 'Có thay đổi điều kiện trong lượt' : 'Điều kiện cố định'}</p>
      <p className="lab-muted text-xs leading-relaxed mt-2">Ban đầu: {summarizeConditions(definition, run.changes[0])}</p>
      {run.changes.length > 1 && <details className="text-xs mt-2"><summary className="cursor-pointer min-h-11 py-3">Lịch sử điều kiện ({run.changes.length - 1} thay đổi)</summary><ul className="max-h-40 overflow-auto space-y-2">{run.changes.slice(1).map((c, j) => <li key={j}>Ngày {c.day.toFixed(2)} · {summarizeConditions(definition, c)}</li>)}</ul></details>}
      <dl className="grid grid-cols-3 gap-2 mt-3">{definition.measurements.slice(0, 3).map(m => <div key={m.key}><dt className="lab-muted text-xs">{m.label}</dt><dd className="font-semibold">{run.state[m.key].toFixed(m.digits)} <small className="font-normal">{m.unit}</small></dd></div>)}</dl>
    </article>)}</div>}
    {visible && runs.length >= 2 && <div className="mt-4"><p className="lab-muted text-sm mb-3">So sánh tại cùng thời điểm. Các lượt có thể kết thúc ở những ngày khác nhau; không có kết quả được tự động xếp hạng.</p><LabGraph definition={definition} runs={runs} comparison /></div>}
  </section>;
}