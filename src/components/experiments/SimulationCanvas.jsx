import React, { useEffect, useRef } from 'react';
import { drawExperiment } from '@/components/experiments/drawExperiment';
export default function SimulationCanvas({kind,params,elapsed,running}) {
  const ref=useRef();
  useEffect(()=>{const canvas=ref.current;let frame;const render=()=>{drawExperiment(canvas,kind,params,elapsed);if(running)frame=requestAnimationFrame(render)};render();const resize=()=>drawExperiment(canvas,kind,params,elapsed);window.addEventListener('resize',resize);return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize)}},[kind,params,elapsed,running]);
  return <canvas ref={ref} className="block w-full rounded-xl border border-slate-200 bg-slate-50" role="img" aria-label="Mô phỏng dụng cụ và quá trình sinh học ở mức phân tử" />;
}