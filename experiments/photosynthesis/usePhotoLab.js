import { useEffect, useRef, useState } from 'react';
import { advancePhoto, initialPhotoState, itemCount, onRack, setupStatus } from '@/components/experiments/photosynthesis/photoModel';

const makeItem = (id, type, x, y) => ({ id, type, x, y, inverted: false, fill: 0, initialFill: 0, gas: 0, on: false, lit: false, location: 'stage' });

export default function usePhotoLab(light, co2) {
  const [state, setState] = useState(initialPhotoState), [records, setRecords] = useState([]);
  const latest = useRef({ light, co2 }); latest.current = { light, co2 };
  useEffect(() => {
    let frame, last = performance.now(), painted = last;
    const tick = now => { if (now - painted >= 1000 / 60) { const dt = Math.min((now - last) / 1000, .2); last = now; painted = now; setState(current => advancePhoto(current, dt, latest.current.light, latest.current.co2)); } frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, []);

  const patch = change => setState(current => ({ ...current, ...change }));
  const updateItem = (id, change) => setState(current => ({ ...current, items: current.items.map(item => item.id === id ? { ...item, ...change } : item) }));
  const removeItem = id => setState(current => ({ ...current, items: current.items.filter(item => item.id !== id) }));
  const rotate = id => setState(current => {
    const status = setupStatus(current);
    return { ...current, items: current.items.map(item => {
      if (item.id !== id) return item;
      if (item.type === 'tube' && !item.inverted && item.fill > .95 && status.funnel) return { ...item, inverted: true, x: status.funnel.x, y: status.funnel.y - 162, location: 'neck', initialFill: item.fill };
      return { ...item, inverted: !item.inverted, location: item.location === 'neck' ? 'stage' : item.location, gas: item.location === 'neck' ? 0 : item.gas };
    }) };
  });

  const drop = (source, x, y) => setState(current => {
    if (source.fromTray && itemCount(current, source.type) >= 10) return current;
    if (!source.fromTray && (x < 32 || x > 568)) return { ...current, items: current.items.filter(item => item.id !== source.id) };
    let item = source.fromTray ? makeItem(source.id, source.type, x, y) : current.items.find(entry => entry.id === source.id);
    if (!item) return current;
    item = { ...item, x: Math.max(38, Math.min(562, x)), y: Math.max(52, Math.min(344, y)), location: 'stage' };
    const status = setupStatus(current);
    if (item.type === 'plant' && x > 205 && x < 425 && y > 190) item = { ...item, x: 313, y: 319 };
    if (item.type === 'funnel' && x > 205 && x < 425 && y > 185) item = { ...item, x: 314, y: 299 };
    if (item.type === 'tube' && item.inverted && item.fill > .95 && status.funnel && Math.hypot(x - status.funnel.x, y - (status.funnel.y - 152)) < 100) item = { ...item, x: status.funnel.x, y: status.funnel.y - 162, location: 'neck', initialFill: item.fill };
    if (item.type === 'tube' && item.gas > .05 && x > 450 && y > 220) item = { ...item, x: 509, y: 278, inverted: false, location: 'rack' };
    const items = source.fromTray ? [...current.items, item] : current.items.map(entry => entry.id === item.id ? item : entry);
    const stage = items.some(onRack) ? 2 : current.stage;
    return { ...current, items, stage, running: stage === 2 ? false : current.running };
  });

  const hover = (source, x, y) => setState(current => {
    const moving = current.items.find(item => item.id === source.id);
    if (!moving || moving.type !== 'splint' || current.stage !== 2 || current.completed) return current;
    const matchbox = current.items.find(item => item.type === 'matches' && Math.hypot(x - item.x, y - item.y) < 62);
    if (matchbox && !moving.lit) return { ...current, items: current.items.map(item => item.id === moving.id ? { ...item, lit: true } : item) };
    const tube = current.items.find(item => onRack(item) && Math.hypot(x - item.x, y - (item.y - 72)) < 58);
    if (moving.lit && tube && !current.flameBurst) {
      window.setTimeout(() => setState(value => ({ ...value, flameBurst: false, completed: true, items: value.items.map(item => item.id === moving.id ? { ...item, lit: false } : item) })), 900);
      return { ...current, flameBurst: true, running: false };
    }
    return current;
  });

  const record = () => {
    const tube = state.items.find(item => item.type === 'tube' && (item.gas > 0 || item.initialFill > 0));
    setRecords(current => [...current, { id: crypto.randomUUID(), parameters: `Ánh sáng ${light}% · CO₂ ${co2}%`, minutes: (state.elapsed / 60).toFixed(2), value: (tube?.gas || 0).toFixed(2), unit: 'mL khí', bubbles: Math.floor(state.bubbles), initialFill: tube?.initialFill || 0, light, co2, oxygenTest: state.completed }]);
  };
  return { state, patch, updateItem, removeItem, rotate, drop, hover, records, record, clearRecords: () => setRecords([]), reset: () => { setState(initialPhotoState()); setRecords([]); } };
}