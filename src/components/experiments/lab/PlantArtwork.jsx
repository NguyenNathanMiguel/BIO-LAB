import React from 'react';
export default function PlantArtwork({ state, variables, running }) {
  const height = state.height * 8 - 14, count = Math.min(28, state.leaves), stress = (100 - state.health) / 100;
  return <g>
    <g clipPath="url(#lab-pot)" stroke="var(--sim-root)" fill="none" strokeLinecap="round">
      {Array.from({ length: 11 }, (_, i) => { const side = i % 2 ? 1 : -1, depth = Math.min(106, 22 + state.roots * 5 + i * 3), x = 340 + side * (12 + i * 3); return <g key={i} opacity={.55 + (i % 3) * .18}>
        <path d={`M340 317 Q${330 + side * 7} ${332 + i} ${x} ${320 + depth} q${side * 5} 10 ${side * 8} 17`} strokeWidth={1.8 - i * .08} />
        {[.35, .58, .8].map((t, j) => <path key={j} d={`M${340 + (x - 340) * t} ${320 + depth * t} q${side * 13} 0 ${side * (17 + j * 2)} 13 m${-side * 7} -8 l${side * 5} -7`} strokeWidth=".7" />)}
      </g>; })}
    </g>
    <g className={running ? 'lab-plant is-running' : 'lab-plant'} style={{ transformOrigin: '340px 316px' }}>
      <path d={`M340 318Q330 ${316 - height * .55} 343 ${316 - height}`} fill="none" stroke="var(--leaf-dark)" strokeWidth="6" />
      <path d={`M341 317Q333 ${316 - height * .55} 343 ${316 - height}`} fill="none" stroke="var(--leaf-bright)" strokeWidth="2" />
      {Array.from({ length: count }, (_, i) => { const t = (i + 1) / (count + 1), side = i % 2 ? 1 : -1, y = 306 - height * t, size = (.48 + Math.min(1, state.biomass / 6) * .45) * (1 - t * .5), angle = side === 1 ? -27 + stress * 30 : -153 - stress * 30;
        return <g key={i} transform={`translate(${338 + t * 4} ${y}) rotate(${angle}) scale(${size})`}>
          <path d="M0 0Q20 -8 29 0" stroke="var(--leaf-dark)" strokeWidth="2.4" fill="none" />
          <path d="M14 0C30 -28 68 -24 89 0C66 5 44 27 14 0Z" fill="url(#lab-leaf)" stroke="var(--leaf-dark)" strokeWidth="1" />
          <path d="M15 0Q48 -4 87 0M29 -1l11-13m1 13l15-16m0 15l12-11M30 0l13 11m1-11l14 9m0-10l13 6" fill="none" stroke="var(--leaf-bright)" strokeWidth=".85" opacity=".8" />
        </g>;
      })}
      <path d={`M343 ${316 - height}q-8-8 0-14q9 8 0 14`} fill="url(#lab-leaf)" stroke="var(--leaf-dark)" />
    </g>
  </g>;
}