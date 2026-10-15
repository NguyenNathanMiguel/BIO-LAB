import React from 'react';
import { ZoomIn, ZoomOut, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
export default function StageNavigation({ zoom, pan }) {
  return <div className="mt-4 flex flex-wrap items-center justify-center gap-2" aria-label="Điều khiển bàn tiêu bản">
    {[[ZoomOut, 'Thu nhỏ', () => zoom(1 / 1.2)], [ZoomIn, 'Phóng to', () => zoom(1.2)], [ArrowLeft, 'Dịch trái', () => pan(-.1, 0)], [ArrowRight, 'Dịch phải', () => pan(.1, 0)], [ArrowUp, 'Dịch lên', () => pan(0, -.1)], [ArrowDown, 'Dịch xuống', () => pan(0, .1)]].map(([Icon, label, action]) => <button key={label} type="button" aria-label={label} title={label} onClick={action} className="rounded-full border border-lab-edge bg-lab-panel p-2.5 text-lab-ink shadow-inner hover:bg-lab-edge focus-visible:ring-2 focus-visible:ring-lab-glow"><Icon className="h-4 w-4" /></button>)}
  </div>;
}