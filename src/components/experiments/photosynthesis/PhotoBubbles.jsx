import React from 'react';
import { effectiveRate, setupStatus } from '@/components/experiments/photosynthesis/photoModel';

export default function PhotoBubbles({ state, light, co2 }) {
  const rate = effectiveRate(state, light, co2), status = setupStatus(state), capture = Boolean(status.tube);
  if (!rate || !state.elapsed) return null;
  return <g pointerEvents="none" data-testid="photo-bubbles">{Array.from({ length: Math.min(28, Math.ceil(rate * 1.5)) }, (_, index) => {
    const progress = (state.elapsed / 5 + index * .137) % 1, y = 321 - progress * (capture ? 200 : 105);
    const x = capture ? status.funnel.x + (1 - Math.min(1, progress * 2)) * (Math.sin(index * 7) * 36) + Math.sin(progress * 18 + index) * 2 : status.plant.x + Math.sin(index * 7) * 28 + Math.sin(progress * 13 + index) * 4;
    const radius = 1.7 + (index % 3) * .7;
    return <g key={index}><circle cx={x} cy={y} r={radius} fill="var(--sim-paper)" fillOpacity=".6" stroke="var(--sim-metal)" strokeWidth=".6" /><circle cx={x - radius * .25} cy={y - radius * .3} r={radius * .28} fill="var(--sim-paper)" /></g>;
  })}</g>;
}