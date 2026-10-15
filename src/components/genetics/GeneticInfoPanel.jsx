import React from 'react';
import { STRUCTURE_INFO } from '@/lib/geneticMaterialData';

export default function GeneticInfoPanel({ selected, onSelect }) {
  const info=STRUCTURE_INFO[selected?.id]||STRUCTURE_INFO.dna;
  return <aside data-testid="genetic-info" className="rounded-2xl border border-lab-edge bg-lab-panel p-4 text-lab-ink shadow-xl">
    <p className="text-[10px] font-bold uppercase tracking-[.18em] text-lab-glow">Thông tin cấu trúc</p>
    <h3 className="mt-2 text-lg font-bold">{info.name}</h3><span className="mt-1 inline-flex rounded-full bg-lab-glow/15 px-2 py-1 text-[10px] font-semibold text-lab-glow">{info.type}</span>
    <dl className="mt-4 space-y-3 text-xs leading-relaxed"><div><dt className="font-bold text-lab-glow">Chức năng</dt><dd className="mt-1 text-lab-muted">{info.function}</dd></div><div><dt className="font-bold text-lab-glow">Đặc điểm chính</dt><dd className="mt-1 text-lab-muted">{info.feature}</dd></div></dl>
    {selected?.complementId&&<div className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-xs text-cyan-100">Base bổ sung: <button className="font-bold underline" onClick={()=>onSelect({id:selected.complementId,pairIndex:selected.pairIndex,complementId:selected.id})}>{STRUCTURE_INFO[selected.complementId].name}</button>. Cả cặp base và liên kết hydrogen đang được nhấn sáng.</div>}
    <div className="mt-4"><p className="text-xs font-bold text-lab-glow">Cấu trúc liên quan</p><div className="mt-2 flex flex-wrap gap-2">{info.related.map(id=><button key={id} onClick={()=>onSelect({id})} className="rounded-full border border-lab-edge px-2 py-1 text-[10px] text-lab-muted hover:border-lab-glow hover:text-lab-glow">{STRUCTURE_INFO[id]?.name}</button>)}</div></div>
  </aside>;
}