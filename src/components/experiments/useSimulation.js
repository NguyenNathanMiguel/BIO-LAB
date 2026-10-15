import { useEffect, useRef, useState } from 'react';
export default function useSimulation(kind) {
  const [running,setRunning]=useState(false),[speed,setSpeed]=useState(1),[elapsed,setElapsed]=useState(0);
  const elapsedRef=useRef(0), frame=useRef(), last=useRef();
  useEffect(()=>{elapsedRef.current=elapsed},[elapsed]);
  useEffect(()=>{if(!running)return;const tick=now=>{if(!last.current)last.current=now;const next=elapsedRef.current+(now-last.current)/1000*speed;last.current=now;const capped=kind==='osmosis'?Math.min(4800,next):next;elapsedRef.current=capped;setElapsed(capped);if(capped<4800||kind!=='osmosis')frame.current=requestAnimationFrame(tick);else setRunning(false)};frame.current=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame.current);last.current=null}},[running,speed,kind]);
  const reset=()=>{setRunning(false);setElapsed(0);elapsedRef.current=0};
  return {running,setRunning,speed,setSpeed,elapsed,reset};
}