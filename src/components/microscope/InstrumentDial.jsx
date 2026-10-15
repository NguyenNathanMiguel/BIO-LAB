import React from 'react';
export default function InstrumentDial({ label, value, onChange, description }) {
  return <label className="mb-5 flex items-center gap-3">
    <span aria-hidden="true" className="relative h-12 w-12 shrink-0 rounded-full border-4 border-lab-edge bg-lab-surface shadow-inner" style={{ transform: `rotate(${-135 + value * 2.7}deg)` }}><span className="absolute left-1/2 top-0 h-3 w-1 -translate-x-1/2 rounded-full bg-lab-glow" /></span>
    <span className="min-w-0 flex-1"><span className="flex justify-between text-xs font-semibold text-lab-ink"><span>{label}</span><span>{value}%</span></span><input aria-label={label} type="range" min="0" max="100" value={value} onChange={e => onChange(Number(e.target.value))} className="mt-2 w-full accent-lab-glow" /><span className="block text-[10px] text-lab-muted">{description}</span></span>
  </label>;
}