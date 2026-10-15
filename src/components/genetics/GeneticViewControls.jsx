import React from 'react';
import { Focus, Pause, Play, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
const angles=[0,45,90,135,180,225,270,315,360];
export default function GeneticViewControls({ apiRef, rotating, setRotating, onReset }) {
  const act=(method,...args)=>apiRef.current?.[method](...args);
  return <section className="rounded-2xl border border-lab-edge bg-lab-panel p-3 text-lab-ink">
    <div className="flex items-center justify-between gap-2"><div><p className="text-xs font-bold">Góc nhìn 360°</p><p className="text-[10px] text-lab-muted">Kéo tự do hoặc chọn góc</p></div><div className="flex gap-1"><button aria-label="Thu nhỏ" onClick={()=>act('zoom',.82)} className="rounded-lg border border-lab-edge p-2"><ZoomOut className="h-4 w-4"/></button><button aria-label="Phóng to" onClick={()=>act('zoom',1.22)} className="rounded-lg border border-lab-edge p-2"><ZoomIn className="h-4 w-4"/></button></div></div>
    <div className="mt-3 grid grid-cols-5 gap-1">{angles.map(angle=><button key={angle} onClick={()=>act('setAngle',angle)} className="rounded-md bg-lab-surface px-1 py-1.5 text-[10px] text-lab-muted">{angle}°</button>)}</div>
    <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]"><button onClick={()=>{act('reset');onReset?.();}} className="flex items-center justify-center gap-1 rounded-lg border border-lab-edge py-2"><RotateCcw className="h-3.5 w-3.5"/>Reset View</button><button onClick={()=>{const next=!rotating;setRotating(next);act('autoRotate',next);}} className="flex items-center justify-center gap-1 rounded-lg border border-lab-edge py-2">{rotating?<Pause className="h-3.5 w-3.5"/>:<Play className="h-3.5 w-3.5"/>}{rotating?'Stop Rotation':'Auto Rotate'}</button><button onClick={()=>act('focus')} className="flex items-center justify-center gap-1 rounded-lg border border-lab-edge py-2"><Focus className="h-3.5 w-3.5"/>Focus Selected</button></div>
  </section>;
}