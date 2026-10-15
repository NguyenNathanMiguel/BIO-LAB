import React from 'react';
import { Target } from 'lucide-react';
export default function GeneticChallenge({ challenge, index, total, active, feedback, completed, onStart, onNext }) {
  return <section data-testid="genetic-challenge" className="rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-lab-ink">
    <div className="flex items-center justify-between"><h3 className="flex items-center gap-2 text-sm font-bold"><Target className="h-4 w-4 text-amber-300"/>Thử thách</h3><span className="text-[10px] text-amber-200">{Math.min(index+1,total)} / {total}</span></div>
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100/20"><div className="h-full bg-amber-300 transition-all" style={{width:`${completed/total*100}%`}}/></div>
    {!active?<button onClick={onStart} className="mt-3 w-full rounded-lg bg-amber-300 py-2 text-xs font-bold text-amber-950">Bắt đầu thử thách</button>:<><p className="mt-3 text-xs font-semibold">{challenge.prompt}</p><p aria-live="polite" className={`mt-2 min-h-8 text-[11px] ${feedback?.correct?'text-emerald-300':'text-amber-100'}`}>{feedback?.message||'Chọn một cấu trúc trên mô hình.'}</p>{feedback?.correct&&<button onClick={onNext} className="mt-2 w-full rounded-lg border border-amber-300 py-2 text-xs text-amber-200">Thử thách tiếp theo</button>}</>}
  </section>;
}