import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import LabVariable from '@/components/experiments/lab/LabVariable';
export default function LabControls({ definition, lab, onReset }) {
  return <section className="lab-panel lab-controls">
    <h3 className="lab-heading">ĐIỀU KIỆN THÍ NGHIỆM</h3>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">{definition.variables.map(spec => <LabVariable key={spec.id} spec={spec} value={lab.variables[spec.id]} onChange={lab.change} />)}</div>
    <div className="lab-divider mt-5 pt-4"><p className="lab-muted mb-2 text-xs">TỐC ĐỘ · 1× = 1 ngày / 2 giây</p>
      <div className="grid grid-cols-4 gap-2">{[1, 2, 4, 8].map(s => <button key={s} className={`lab-btn ${lab.speed === s ? 'is-active' : ''}`} aria-label={`Tốc độ ${s}×`} aria-pressed={lab.speed === s} onClick={() => lab.setSpeed(s)}>{s}×</button>)}</div>
      <div className="grid grid-cols-2 gap-2 mt-3"><button className="lab-btn lab-primary" data-testid="simulation-toggle" disabled={lab.state.day >= definition.maxDays} onClick={lab.toggle}>
        {lab.running ? <Pause size={17} /> : <Play size={17} />}{lab.running ? 'Tạm dừng' : lab.state.day === 0 ? 'Bắt đầu' : lab.state.day >= definition.maxDays ? 'Hoàn tất' : 'Tiếp tục'}
      </button><button className="lab-btn" onClick={onReset}><RotateCcw size={16} />Đặt lại</button></div>
      <p className="lab-muted mt-3 text-xs">Mỗi lượt tối đa {definition.maxDays} ngày. Bạn có thể thay đổi điều kiện ngay khi cây đang phát triển.</p>
    </div>
  </section>;
}