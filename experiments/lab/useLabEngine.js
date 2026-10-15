import { useCallback, useEffect, useRef, useState } from 'react';
import SimulationEngine from '@/components/experiments/lab/SimulationEngine';
export default function useLabEngine(definition) {
  const engine = useRef(null);
  if (!engine.current) engine.current = new SimulationEngine(definition);
  const [snapshot, setSnapshot] = useState(() => engine.current.snapshot());
  const publish = useCallback(() => setSnapshot(engine.current.snapshot()), []);
  useEffect(() => {
    let frame, previous, published = 0;
    const tick = now => {
      if (previous !== undefined && engine.current.running) {
        engine.current.advance(Math.min(.2, (now - previous) / 1000));
        if (now - published > 70 || !engine.current.running) { publish(); published = now; }
      }
      previous = now; frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [publish]);
  const change = (key, value) => { engine.current.change(key, value); publish(); };
  const toggle = () => { if (engine.current.state.day < definition.maxDays) engine.current.running = !engine.current.running; publish(); };
  const speed = value => { engine.current.speed = value; publish(); };
  const reset = () => { engine.current.reset(); publish(); };
  const capture = name => { const run = engine.current.capture(name); publish(); return run; };
  return { ...snapshot, change, toggle, setSpeed: speed, reset, capture };
}