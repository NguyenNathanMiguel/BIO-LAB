import React from 'react';
import PhotoToolArt from '@/components/experiments/photosynthesis/PhotoToolArt';
import PhotoBubbles from '@/components/experiments/photosynthesis/PhotoBubbles';
import { setupStatus } from '@/components/experiments/photosynthesis/photoModel';

export default function PhotoScene({ state, light, co2, drag, onRotate }) {
  const status = setupStatus(state);
  const renderItem = item => {
    const scale = item.type === 'plant' ? .42 : item.type === 'matches' ? .7 : item.type === 'splint' ? .85 : 1;
    return <g key={item.id} data-testid={`placed-${item.type}`} data-item-id={item.id} transform={`translate(${item.x} ${item.y})`} className="photo-tool photo-snapped" onPointerDown={event => drag.startDrag(event, { id: item.id, type: item.type, fromTray: false })}><rect x="-55" y="-82" width="110" height="164" fill="transparent" /><g transform={`scale(${scale})`}><PhotoToolArt type={item.type} inverted={item.inverted} fill={item.fill} gas={item.gas} bright={item.on ? light : 0} on={item.on} lit={item.lit} /></g></g>;
  };
  return <div className={`photo-stage ${state.running ? 'photo-flow' : ''}`}><svg ref={drag.svgRef} viewBox="0 0 600 410" aria-label="Bàn thí nghiệm thu khí từ cây thủy sinh">
    <defs><linearGradient id="photo-wall" x2="0" y2="1"><stop stopColor="var(--sim-paper)" /><stop offset="1" stopColor="var(--sim-wall)" /></linearGradient><linearGradient id="photo-water" x2="0" y2="1"><stop stopColor="var(--sim-water)" stopOpacity=".22" /><stop offset="1" stopColor="var(--sim-water)" stopOpacity=".6" /></linearGradient><linearGradient id="photo-beam"><stop stopColor="var(--sim-light)" stopOpacity=".4" /><stop offset="1" stopColor="var(--sim-light)" stopOpacity="0" /></linearGradient></defs>
    <rect width="600" height="410" fill="url(#photo-wall)" /><path d="M0 82H600M0 162H600M100 0V342M200 0V342M300 0V342M400 0V342M500 0V342" stroke="var(--sim-paper)" opacity=".6" />
    <text x="22" y="29" fontSize="12" letterSpacing="2" fill="var(--sim-edge)">BIO-LAB / QUANG HỢP</text><text x="578" y="29" textAnchor="end" fontSize="10" fill="var(--sim-edge)">{state.stage === 1 ? 'THU KHÍ BẰNG ĐẨY NƯỚC' : 'THỬ KHÍ OXY'}</text>
    <rect y="352" width="600" height="58" fill="var(--sim-metal)" /><path d="M0 352H600" stroke="var(--sim-paper)" strokeWidth="5" />
    {status.lamp && <path d={`M${status.lamp.x + 42} ${status.lamp.y - 48}L${270 + light * 1.7} ${137 - light * .2}V355L${status.lamp.x + 18} ${status.lamp.y - 29}Z`} fill="url(#photo-beam)" opacity={light / 100} pointerEvents="none" />}
    <path d="M207 179V338Q207 352 225 352H410Q424 352 424 338V179" fill="var(--sim-paper)" fillOpacity=".12" stroke="var(--sim-metal)" strokeWidth="2.5" /><path d="M210 212Q267 206 316 212T421 212V337Q421 348 409 348H225Q210 348 210 337Z" fill="url(#photo-water)" /><path d="M210 212Q267 206 316 212T421 212" stroke="var(--sim-water)" strokeWidth="2" fill="none" /><path d="M215 192V333M230 232V327" stroke="var(--sim-paper)" strokeWidth="4" opacity=".55" />
    {Array.from({ length: Math.round(co2 / 4) }, (_, index) => <circle key={index} cx={222 + (index * 47) % 184} cy={227 + (index * 31) % 111} r=".9" fill="var(--sim-paper)" opacity=".6" />)}
    <g opacity="0.001">
      <rect data-photo-zone="beaker" x="260" y="240" width="112" height="92" fill="var(--sim-paper)" />
      <rect data-photo-zone="neck" x="284" y="92" width="60" height="88" fill="var(--sim-paper)" />
      <rect data-photo-zone="lamp" x="62" y="210" width="86" height="100" fill="var(--sim-paper)" />
      <rect data-photo-zone="rack" x="474" y="246" width="70" height="70" fill="var(--sim-paper)" />
      <rect data-photo-zone="match-area" x="105" y="75" width="90" height="80" fill="var(--sim-paper)" />
      <rect data-photo-zone="tube-mouth" x="480" y="175" width="58" height="64" fill="var(--sim-paper)" />
      <rect data-photo-zone="delete-left" x="0" y="80" width="25" height="230" fill="var(--sim-paper)" />
    </g>
    {state.items.map(renderItem)}
    {state.items.filter(item => item.id === drag.selected?.id && (item.type === 'funnel' || (item.type === 'tube' && item.fill > .95 && status.funnel))).map(item => <g key={`rotate-${item.id}`} role="button" aria-label={`Lật ${item.type === 'tube' ? 'ống nghiệm' : 'phễu'} tại chỗ`} tabIndex="0" transform={`translate(${item.x + 48} ${item.y - 65})`} onPointerDown={event => event.stopPropagation()} onClick={() => onRotate(item.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') onRotate(item.id); }} className="photo-rotate-handle"><circle r="18" fill="var(--sim-panel)" stroke="var(--sim-mint)" strokeWidth="2" /><text textAnchor="middle" y="6" fontSize="20" fill="var(--sim-paper)">↻</text></g>)}
    <PhotoBubbles state={state} light={light} co2={co2} />
    <g transform="translate(509 328)"><PhotoToolArt type="rack" /></g><text x="509" y="383" textAnchor="middle" fontSize="11" fill="var(--sim-paper)">Giá ống nghiệm</text><text x="314" y="383" textAnchor="middle" fontSize="11" fill="var(--sim-paper)">Cốc nước · rong đuôi chó</text>
    <path d="M0 45V350M600 45V350" stroke="var(--sim-heat)" strokeWidth="7" opacity={drag.selected && !drag.selected.fromTray ? .55 : 0} /><text x="12" y="65" fill="var(--sim-heat)" fontSize="10" opacity={drag.selected && !drag.selected.fromTray ? 1 : 0}>THẢ ĐỂ XOÁ</text><text x="588" y="65" textAnchor="end" fill="var(--sim-heat)" fontSize="10" opacity={drag.selected && !drag.selected.fromTray ? 1 : 0}>THẢ ĐỂ XOÁ</text>
    {state.flameBurst && <g className="photo-flame-burst" transform="translate(509 202)"><path d="M0 42C-47 16-22-22-8-39C-5-15 16-22 18-52C51-13 44 24 0 42Z" fill="var(--sim-heat)" /><path d="M0 29C-18 15-10-4 2-22C21 5 17 20 0 29Z" fill="var(--sim-light)" /></g>}
  </svg></div>;
}