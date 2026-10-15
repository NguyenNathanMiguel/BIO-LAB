import { useRef, useState } from 'react';
import { magnificationScale } from '@/components/microscope/optics';
export default function useMicroscopeStage(settings, image, onTap) {
  const [view, setView] = useState({ zoom: 1, x: 0, y: 0 }), drag = useRef(null);
  const scale = magnificationScale[settings.magnification] * view.zoom;
  const bound = (next) => { const s = magnificationScale[settings.magnification] * next.zoom, limit = Math.max(0, (s - 1) / 2); return { ...next, x: Math.max(-limit, Math.min(limit, next.x)), y: Math.max(-limit, Math.min(limit, next.y)) }; };
  const zoom = (factor) => setView(v => bound({ ...v, zoom: Math.max(1, Math.min(3, v.zoom * factor)) }));
  const pan = (x, y) => setView(v => bound({ ...v, x: v.x + x, y: v.y + y }));
  const down = (e) => { if (e.button !== 0) return; drag.current = { sx: e.clientX, sy: e.clientY, view, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { const d = drag.current; if (!d) return; const dx = e.clientX - d.sx, dy = e.clientY - d.sy; if (Math.hypot(dx, dy) > 4) d.moved = true; if (d.moved) { const size = e.currentTarget.clientWidth; setView(bound({ ...d.view, x: d.view.x + dx / size, y: d.view.y + dy / size })); } };
  const up = (e) => { const d = drag.current; drag.current = null; if (!d || d.moved || !image) return; const r = e.currentTarget.getBoundingClientRect(), fit = Math.max(r.width / image.naturalWidth, r.height / image.naturalHeight); const x = .5 + (e.clientX - r.left - r.width / 2 - view.x * r.width) / (image.naturalWidth * fit * scale), y = .5 + (e.clientY - r.top - r.height / 2 - view.y * r.width) / (image.naturalHeight * fit * scale); if (x >= 0 && x <= 1 && y >= 0 && y <= 1) onTap({ x: x * 100, y: y * 100 }); };
  return { view, scale, zoom, pan, events: { onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: () => { drag.current = null; } } };
}