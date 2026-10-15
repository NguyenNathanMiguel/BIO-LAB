import { useRef, useState } from "react";

export default function useEquipmentSandbox(config) {
  const [items, setItems] = useState([]), [ghost, setGhost] = useState(null), [selected, setSelected] = useState(null);
  const stageRef = useRef(null), active = useRef(null);
  const start = (event, source) => {
    if (event.button !== 0) return;
    event.preventDefault();
    const item = source.fromTray ? { ...source, id: crypto.randomUUID(), rotation: 0 } : source;
    active.current = { item, startX: event.clientX, startY: event.clientY, moved: false };
    setSelected(item.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = event => {
    const drag = active.current;
    if (!drag) return;
    if (Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4) drag.moved = true;
    if (drag.moved) setGhost({ ...drag.item, clientX: event.clientX, clientY: event.clientY });
  };
  const end = event => {
    const drag = active.current;
    active.current = null; setGhost(null);
    if (!drag?.moved) return;
    const rect = stageRef.current.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) { if (!drag.item.fromTray) setItems(current => current.filter(item => item.id !== drag.item.id)); return; }
    const x = Math.max(5, Math.min(95, (event.clientX - rect.left) / rect.width * 100));
    const y = Math.max(10, Math.min(90, (event.clientY - rect.top) / rect.height * 100));
    setItems(current => drag.item.fromTray ? [...current, { ...drag.item, fromTray: false, x, y }] : current.map(item => item.id === drag.item.id ? { ...item, x, y } : item));
  };
  const rotate = id => setItems(current => current.map(item => item.id === id ? { ...item, rotation: (item.rotation + 45) % 360 } : item));
  const remove = id => { setItems(current => current.filter(item => item.id !== id)); setSelected(null); };
  const reset = () => { setItems([]); setSelected(null); setGhost(null); active.current = null; };
  return { items, ghost, selected, stageRef, start, handlers: { onPointerMove: move, onPointerUp: end, onPointerCancel: () => { active.current = null; setGhost(null); } }, rotate, remove, reset, config };
}