import { useRef, useState } from "react";

const bases = { plant: [340, 330], water: [109, 370], co2: [529, 360], thermometer: [606, 300], nutrients: [609, 420], ruler: [436, 195] };
const initial = () => Object.fromEntries(Object.keys(bases).map(type => [type, { x: 0, y: 0, visible: true }]));

export default function usePlantEquipmentDrag() {
  const [items, setItems] = useState(initial), [selected, setSelected] = useState(null), [ghost, setGhost] = useState(null);
  const svgRef = useRef(null), active = useRef(null);
  const point = event => { const svg = svgRef.current, p = svg.createSVGPoint(); p.x = event.clientX; p.y = event.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const start = (event, type, fromTray = false) => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); active.current = { type, fromTray }; setSelected(type); };
  const move = event => { const drag = active.current; if (!drag) return; const p = point(event), [bx, by] = bases[drag.type]; setGhost({ type: drag.type, x: event.clientX, y: event.clientY }); if (!drag.fromTray) setItems(current => ({ ...current, [drag.type]: { ...current[drag.type], x: p.x - bx, y: p.y - by } })); };
  const end = event => { const drag = active.current; active.current = null; setGhost(null); if (!drag) return; const p = point(event), [bx, by] = bases[drag.type], inside = p.x >= 15 && p.x <= 665 && p.y >= 35 && p.y <= 465; setItems(current => ({ ...current, [drag.type]: inside ? { x: p.x - bx, y: p.y - by, visible: true } : { ...current[drag.type], visible: false } })); };
  const reset = () => { setItems(initial()); setSelected(null); setGhost(null); active.current = null; };
  return { items, selected, ghost, svgRef, start, reset, handlers: { onPointerMove: move, onPointerUp: end, onPointerCancel: () => { active.current = null; setGhost(null); } } };
}