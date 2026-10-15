import React from 'react';
import { Dna, RotateCcw } from 'lucide-react';

export default function GeneticToolbar({ mode, onMode, level, onLevel }) {
  const modes = [['DNA','DNA'],['RNA','RNA'],['CHROMOSOME','Nhiễm sắc thể']];
  return <div className="rounded-2xl border border-lab-edge bg-lab-panel/95 p-3 text-lab-ink shadow-xl backdrop-blur">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Dna className="h-5 w-5 text-lab-glow"/><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-lab-glow">3D Genetic Material Explorer</p><p className="text-xs text-lab-muted">Khám phá vật chất di truyền trong không gian</p></div></div>
      <div className="flex rounded-xl bg-lab-surface p-1">{modes.map(([value,label])=><button key={value} aria-pressed={mode===value} onClick={()=>onMode(value)} className={`rounded-lg px-3 py-2 text-xs font-bold ${mode===value?'bg-lab-glow text-lab-surface':'text-lab-muted'}`}>{label}</button>)}</div>
    </div>
    {mode!=='CHROMOSOME'&&<div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Cấp độ khám phá">{['Toàn bộ','Hai mạch','Cặp base','Nucleotide','Base nitrogen'].map((label,index)=><button key={label} aria-pressed={level===index+1} onClick={()=>onLevel(index+1)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] ${level===index+1?'border-lab-glow text-lab-glow':'border-lab-edge text-lab-muted'}`}><span className="mr-1 opacity-60">{index+1}</span>{label}</button>)}</div>}
  </div>;
}