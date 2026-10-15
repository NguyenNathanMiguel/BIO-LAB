import React from 'react';
export default function LabLamp({ value, onChange }) {
  const x = 156 + value * .82, y = 53 + value * .84;
  const drag = e => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const svg = e.currentTarget.ownerSVGElement, point = svg.createSVGPoint(); point.x = e.clientX; point.y = e.clientY;
    const p = point.matrixTransform(svg.getScreenCTM().inverse());
    onChange('light', Math.max(0, Math.min(100, ((p.x - 156) * .82 + (p.y - 53) * .84) / (.82 ** 2 + .84 ** 2))));
  };
  return <g>
    <path d={`M${x - 22} ${y + 16}L260 319H428L${x + 26} ${y + 16}Z`} fill="url(#lab-beam)" opacity={value / 100} pointerEvents="none" />
    <path d="M82 309V170" stroke="var(--sim-metal)" strokeWidth="9" /><path d={`M82 170L124 107L${x} ${y - 19}`} fill="none" stroke="var(--sim-ink)" strokeWidth="10" strokeLinejoin="round" />
    <path d={`M84 169L126 109L${x} ${y - 17}`} fill="none" stroke="var(--sim-metal)" strokeWidth="3" />
    <ellipse cx="82" cy="310" rx="38" ry="8" fill="var(--sim-metal)" /><circle cx="82" cy="170" r="9" fill="var(--sim-light)" />
    <path d="M156 53L238 137" stroke="var(--sim-metal)" strokeDasharray="3 6" opacity=".45" />
    <g role="slider" tabIndex="0" aria-label="Kéo đèn để thay đổi ánh sáng" aria-valuemin="0" aria-valuemax="100" aria-valuenow={value} data-testid="lab-lamp"
      onPointerDown={e => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={drag} onPointerUp={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
      onKeyDown={e => { if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); onChange('light', value + (['ArrowUp', 'ArrowRight'].includes(e.key) ? 5 : -5)); } }}
      transform={`translate(${x} ${y})`} className="lab-lamp" style={{ touchAction: 'none' }}>
      <rect x="-55" y="-55" width="110" height="110" rx="15" fill="transparent" />
      <path d="M-9-31H9L31 14Q0 26-31 14Z" fill="url(#lab-metal)" stroke="var(--sim-ink)" strokeWidth="2" /><ellipse cy="15" rx="31" ry="8" fill="var(--sim-light)" />
      <path d="M-20 6L-8-24" stroke="var(--sim-paper)" opacity=".6" strokeWidth="2" />
    </g>
    <text x="39" y="39" fill="var(--sim-ink)" fontSize="12">Kéo đèn ↘ / ↖ · {value}%</text>
  </g>;
}