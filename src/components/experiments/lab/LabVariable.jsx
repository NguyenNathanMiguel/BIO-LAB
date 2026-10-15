import React from 'react';
import { Sun, Droplets, Wind, Thermometer, Sprout, Minus, Plus } from 'lucide-react';
const icons = { Sun, Droplets, Wind, Thermometer, Sprout };
export default function LabVariable({ spec, value, onChange }) {
  const Icon = icons[spec.icon];
  return <div className={`lab-variable tone-${spec.tone}`}>
    <div className="flex items-center gap-2"><Icon className="h-5 w-5 shrink-0" /><label htmlFor={`lab-${spec.id}`} className="flex-1 text-sm font-semibold">{spec.label}</label><output htmlFor={`lab-${spec.id}`} data-testid={`value-${spec.id}`} className="lab-readout">{value}{spec.unit}</output></div>
    <div className="flex items-center gap-1">
      <button type="button" aria-label={`Giảm ${spec.label}`} className="lab-small" disabled={value <= spec.min} onClick={() => onChange(spec.id, value - 1)}><Minus size={16} /></button>
      <input id={`lab-${spec.id}`} aria-label={spec.label} type="range" min={spec.min} max={spec.max} step="1" value={value} onChange={e => onChange(spec.id, Number(e.target.value))} />
      <button type="button" aria-label={`Tăng ${spec.label}`} className="lab-small" disabled={value >= spec.max} onClick={() => onChange(spec.id, value + 1)}><Plus size={16} /></button>
    </div>
    <p className="lab-muted text-xs leading-relaxed">{spec.meaning}</p>
  </div>;
}