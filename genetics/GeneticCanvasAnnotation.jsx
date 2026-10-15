import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { STRUCTURE_INFO } from "@/lib/geneticMaterialData";

const complements = { adenine: "thymine", thymine: "adenine", guanine: "cytosine", cytosine: "guanine", uracil: "adenine" };

const GeneticCanvasAnnotation = forwardRef(function GeneticCanvasAnnotation({ selected }, ref) {
  const card = useRef(null), line = useRef(null), dot = useRef(null);
  const info = STRUCTURE_INFO[selected?.id];
  const complementId = selected?.complementId || complements[selected?.id];
  const bonds = ["adenine", "thymine"].includes(selected?.id) ? 2 : ["guanine", "cytosine"].includes(selected?.id) ? 3 : null;

  useImperativeHandle(ref, () => ({
    update(x, y, width, height) {
      if (!card.current || !line.current) return;
      const cardWidth = Math.min(252, width - 24), placeLeft = x > width * .58;
      const left = Math.max(12, Math.min(width - cardWidth - 12, placeLeft ? x - cardWidth - 34 : x + 34));
      const top = Math.max(12, Math.min(height - 190, y - 65));
      card.current.style.width = `${cardWidth}px`; card.current.style.transform = `translate3d(${left}px,${top}px,0)`; card.current.style.opacity = "1";
      line.current.setAttribute("x1", x); line.current.setAttribute("y1", y); line.current.setAttribute("x2", placeLeft ? left + cardWidth : left); line.current.setAttribute("y2", top + 54); line.current.style.opacity = "1";
      dot.current.setAttribute("cx", x); dot.current.setAttribute("cy", y); dot.current.style.opacity = "1";
    },
    hide() { if (card.current) card.current.style.opacity = "0"; if (line.current) line.current.style.opacity = "0"; if (dot.current) dot.current.style.opacity = "0"; }
  }), []);

  if (!info) return null;
  return <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" data-testid="genetic-annotation">
    <svg className="absolute inset-0 h-full w-full"><line ref={line} className="stroke-emerald-300 transition-opacity" strokeWidth="2"/><circle ref={dot} r="5" className="fill-emerald-300 stroke-emerald-950 transition-opacity" strokeWidth="2"/></svg>
    <aside ref={card} className="absolute left-0 top-0 rounded-2xl border border-emerald-300/60 bg-lab-surface/95 p-4 text-lab-ink opacity-0 shadow-2xl backdrop-blur-md transition-opacity">
      <p className="text-base font-bold text-white">{info.name}</p><p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-lab-glow">{info.type}</p>
      <p className="mt-2 text-xs leading-relaxed text-lab-muted">{info.function}</p>
      {complementId && <p className="mt-2 text-xs text-cyan-100">Cặp bổ sung: <strong>{STRUCTURE_INFO[complementId]?.name}</strong></p>}
      {bonds && <p className="mt-1 text-xs text-cyan-100">Liên kết: <strong>{bonds} hydrogen bonds</strong></p>}
    </aside>
  </div>;
});
export default GeneticCanvasAnnotation;