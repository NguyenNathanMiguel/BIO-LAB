import React from 'react';
export default function LabDefinitions() {
  return <defs>
    <linearGradient id="lab-wall" x2="0" y2="1"><stop stopColor="var(--sim-wall)" /><stop offset="1" stopColor="var(--sim-fog)" /></linearGradient>
    <linearGradient id="lab-glass"><stop stopColor="var(--sim-water)" stopOpacity=".3" /><stop offset=".3" stopColor="var(--sim-paper)" stopOpacity=".12" /><stop offset=".85" stopColor="var(--sim-water)" stopOpacity=".15" /><stop offset="1" stopColor="var(--sim-paper)" stopOpacity=".5" /></linearGradient>
    <linearGradient id="lab-soil" x2="0" y2="1"><stop stopColor="var(--sim-soil-light)" /><stop offset="1" stopColor="var(--sim-soil)" /></linearGradient>
    <linearGradient id="lab-metal"><stop stopColor="var(--sim-metal)" /><stop offset=".48" stopColor="var(--sim-fog)" /><stop offset="1" stopColor="var(--sim-metal)" /></linearGradient>
    <linearGradient id="lab-beam" x1=".4" x2=".7" y2="1"><stop stopColor="var(--sim-light)" stopOpacity=".65" /><stop offset="1" stopColor="var(--sim-light)" stopOpacity="0" /></linearGradient>
    <linearGradient id="lab-leaf" x2="1" y2="1"><stop stopColor="var(--leaf-bright)" /><stop offset=".55" stopColor="var(--leaf-main)" /><stop offset="1" stopColor="var(--leaf-dark)" /></linearGradient>
    <pattern id="lab-grain" width="23" height="17" patternUnits="userSpaceOnUse"><path d="M3 3l3 1m8 8l4-1M8 15l2-2" stroke="var(--sim-soil-light)" opacity=".4" strokeWidth="2" /></pattern>
    <pattern id="lab-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="var(--sim-metal)" opacity=".08" /></pattern>
    <clipPath id="lab-pot"><path d="M281 307L291 420Q340 439 389 420L399 307Z" /></clipPath>
  </defs>;
}