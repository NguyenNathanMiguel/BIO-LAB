import React, { useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export default function MicroscopeViewer({ slide }) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(null);
  const dragRef = useRef(null);

  const clampZoom = (z) => Math.min(3, Math.max(1, z));

  const onWheel = (e) => {
    e.preventDefault();
    setZoom((z) => clampZoom(z - e.deltaY * 0.0015));
  };

  const onPointerDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origin: { ...pos } };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy });
  };
  const onPointerUp = () => { dragRef.current = null; };

  const reset = () => { setZoom(1); setPos({ x: 0, y: 0 }); setActive(null); };

  return (
    <div className="rounded-3xl bg-[#0F2A20] p-4 md:p-6">
      <div
        className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden bg-black cursor-grab select-none"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${zoom})`, transformOrigin: "center center" }}
        >
          <img src={slide.image} alt={slide.name} className="w-full h-full object-cover" draggable={false} />
          {slide.hotspots.map((h, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActive(active === i ? null : i); }}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-emerald-400/30 hover:ring-emerald-400/60 transition-all"
            />
          ))}
        </div>

        {active !== null && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg">
            <p className="font-semibold text-[#0F2A20] text-sm">{slide.hotspots[active].label}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{slide.hotspots[active].info}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-white/40 text-xs">Cuộn hoặc kéo để khám phá · bấm vào điểm đánh dấu để nhận diện cấu trúc</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom((z) => clampZoom(z - 0.3))} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom((z) => clampZoom(z + 0.3))} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={reset} className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}