import React, { useState } from 'react';
import PhotoToolArt from '@/components/experiments/photosynthesis/PhotoToolArt';
import { itemCount, tools } from '@/components/experiments/photosynthesis/photoModel';

export default function PhotoTray({ state, drag }) {
  const [open, setOpen] = useState(true);
  return <><button type="button" onClick={() => setOpen(value => !value)} className="w-full min-h-11 px-4 text-left text-xs font-semibold tracking-widest bg-[var(--sim-panel)] text-[var(--sim-paper)]">KHAY DỤNG CỤ {open ? '— Thu gọn' : '— Mở'}</button>{open && <div className="photo-tray" aria-label="Khay dụng cụ">{tools.map(tool => {
    const disabled = tool.phase > state.stage || itemCount(state, tool.id) >= 10;
    return <button type="button" key={tool.id} disabled={disabled} data-testid={`tool-${tool.id}`} aria-label={tool.label} aria-pressed={drag.selected?.type === tool.id} className="photo-tray-item photo-tool" onPointerDown={event => drag.startDrag(event, { type: tool.id, fromTray: true })} onClick={() => drag.setSelected({ type: tool.id, fromTray: true })}><svg viewBox="-70 -80 140 160" aria-hidden="true"><PhotoToolArt type={tool.id} /></svg>{tool.label}<small>{tool.phase > state.stage ? 'Giai đoạn 2' : `${itemCount(state, tool.id)}/10`}</small></button>;
  })}</div>}{drag.ghost && <svg className="photo-drag-ghost" style={{ left: drag.ghost.x, top: drag.ghost.y }} viewBox="-70 -80 140 160" aria-hidden="true"><PhotoToolArt type={drag.ghost.source.type} lit={state.items.find(item => item.id === drag.ghost.source.id)?.lit} /></svg>}</>;
}