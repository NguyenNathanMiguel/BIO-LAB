import { useRef, useState } from 'react';

export default function usePhotoDrag(drop, hover) {
  const [selected, setSelected] = useState(null), [ghost, setGhost] = useState(null);
  const svgRef = useRef(null), active = useRef(null);
  const point = event => { const rect = svgRef.current.getBoundingClientRect(); return { x: (event.clientX - rect.left) * 600 / rect.width, y: (event.clientY - rect.top) * 410 / rect.height }; };
  const startDrag = (event, source) => { if (event.button !== 0) return; event.preventDefault(); const prepared = source.fromTray && !source.id ? { ...source, id: crypto.randomUUID() } : source; setSelected(prepared); active.current = { source: prepared, startX: event.clientX, startY: event.clientY, moved: false }; event.currentTarget.setPointerCapture(event.pointerId); };
  const move = event => { const current = active.current; if (!current) return; if (Math.hypot(event.clientX - current.startX, event.clientY - current.startY) > 5) current.moved = true; if (!current.moved) return; setGhost({ source: current.source, x: event.clientX, y: event.clientY }); const position = point(event); hover(current.source, position.x, position.y); };
  const end = event => { const current = active.current; if (!current) return; active.current = null; setGhost(null); if (!current.moved) return; const position = point(event); drop(current.source, position.x, position.y); };
  const cancel = () => { active.current = null; setGhost(null); };
  return { selected, setSelected, ghost, svgRef, startDrag, handlers: { onPointerMove: move, onPointerUp: end, onPointerCancel: cancel }, clear: () => { cancel(); setSelected(null); } };
}