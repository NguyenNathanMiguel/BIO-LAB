import React from 'react';
import { RotateCcw } from 'lucide-react';
import InstrumentDial from '@/components/microscope/InstrumentDial';
export default function MicroscopeControls({ settings, onChange, onReset, mode }) {
  return <section className="rounded-2xl border border-lab-edge bg-lab-panel p-4 text-lab-ink">
    <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold">Bảng điều khiển</h3><button onClick={onReset} className="flex items-center gap-1 text-xs text-lab-glow"><RotateCcw className="h-4 w-4" /> Reset</button></div>
    {mode === '3D' ? <p className="text-xs leading-relaxed text-lab-muted">Xoay, dịch và thu phóng ngay trong mô hình. Chọn lớp để xem cấu trúc hoặc cô lập bào quan; Reset phục hồi toàn bộ mô hình.</p> : <>
      <p className="mb-2 text-xs text-lab-muted">Mâm vật kính · Độ phóng đại</p>
      <div className="mb-5 grid grid-cols-4 gap-1">{[40, 100, 400, 1000].map(value => <button key={value} aria-pressed={settings.magnification === value} onClick={() => onChange('magnification', value)} className={`rounded-full border py-3 text-xs font-semibold ${settings.magnification === value ? 'border-lab-glow bg-lab-glow text-lab-surface' : 'border-lab-edge bg-lab-surface text-lab-ink'}`}>{value}×</button>)}</div>
      <InstrumentDial label="Lấy nét" value={settings.focus} onChange={v => onChange('focus', v)} description="Xoay núm để tìm mặt phẳng rõ nét." />
      <InstrumentDial label="Chiếu sáng" value={settings.illumination} onChange={v => onChange('illumination', v)} description="Điều chỉnh cường độ đèn dưới tiêu bản." />
      <p className="mb-2 text-xs text-lab-muted">Chế độ quan sát</p><div className="grid grid-cols-2 gap-2">{[['brightfield', 'Trường sáng'], ['darkfield', 'Trường tối']].map(([value, label]) => <button key={value} aria-pressed={settings.viewMode === value} onClick={() => onChange('viewMode', value)} className={`rounded-lg border py-2 text-xs ${settings.viewMode === value ? 'border-lab-glow text-lab-glow' : 'border-lab-edge text-lab-muted'}`}>{label}</button>)}</div>
    </>}
  </section>;
}