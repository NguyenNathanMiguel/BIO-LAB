import React from 'react';
import { magnificationScale } from '@/components/microscope/optics';

// Positions the single annotation in specimen coordinates so it stays attached to
// the structure while the stage is panned or zoomed.
export default function MicroscopeAnnotation({ hotspot, image, settings, view }) {
  if (!hotspot || !image || !Number.isFinite(hotspot.x)) return null;
  const scale = magnificationScale[settings.magnification] * view.zoom;
  const fit = Math.max(1 / image.naturalWidth, 1 / image.naturalHeight);
  const width = image.naturalWidth * fit * scale, height = image.naturalHeight * fit * scale;
  const left = 50 + view.x * 100 + (hotspot.x / 100 - .5) * width * 100;
  const top = 50 + view.y * 100 + (hotspot.y / 100 - .5) * height * 100;
  if (left < 2 || left > 98 || top < 2 || top > 98) return null;
  // Near the top edge the label flips below the structure so it stays inside the field of view.
  const below = top < 48, cardTop = below ? Math.min(94, top + 24) : Math.max(8, top - 24), side = left > 55 ? 'right' : 'left';
  return <div className="pointer-events-none absolute inset-0" data-testid="microscope-annotation">
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1={left} y1={cardTop} x2={left} y2={top} stroke="#6ee7b7" strokeWidth=".4" strokeDasharray="1.6 1.2" vectorEffect="non-scaling-stroke" />
    </svg>
    <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_4px_rgba(110,231,183,.7)]" style={{ left: `${left}%`, top: `${top}%` }} />
    <aside className="absolute w-[46%] max-w-[210px] -translate-y-full rounded-xl border border-emerald-400/40 bg-lab-surface/95 px-3 py-2 shadow-xl backdrop-blur"
      style={{ left: `${left}%`, top: `${cardTop}%`, transform: `translate(${side === 'right' ? '-92%' : '-8%'}, ${below ? '0%' : '-100%'})` }}>
      <p className="text-sm font-bold uppercase tracking-wide text-lab-ink">{hotspot.label}</p>
      {hotspot.groupCount > 1 && <p className="mt-0.5 text-[11px] font-semibold text-cyan-300">{hotspot.label} × {hotspot.groupCount}</p>}
      {hotspot.category && <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">{hotspot.category}</p>}
      <p className="mt-1 text-[11px] leading-snug text-lab-muted">{hotspot.function}</p>
      {hotspot.info && <p className="mt-1 text-[11px] leading-snug text-lab-muted">{hotspot.info}</p>}
    </aside>
  </div>;
}