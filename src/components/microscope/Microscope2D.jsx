import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import StructureCard from '@/components/microscope/StructureCard';
import MicroscopeAnnotation from '@/components/microscope/MicroscopeAnnotation';
import StageNavigation from '@/components/microscope/StageNavigation';
import useMicroscopeStage from '@/components/microscope/useMicroscopeStage';
import { drawOptics, canvasBlob } from '@/components/microscope/optics';
export default function Microscope2D({ specimen, settings, selected, marking, markers, onMark, point, analyzing, onAnalyzePoint, onClose, captureRef }) {
  const canvas = useRef(null), previousSelected = useRef(null), animationFrame = useRef(null), [image, setImage] = useState(null), [imageError, setImageError] = useState(false);
  const { view, scale, zoom, pan, events } = useMicroscopeStage(settings, image, marking ? onMark : onAnalyzePoint);
  useEffect(() => {
    if (!image || !canvas.current) return;
    cancelAnimationFrame(animationFrame.current);
    const visual = selected || previousSelected.current;
    if (selected === previousSelected.current) { drawOptics(canvas.current, image, settings, view, markers, point, visual, 1); return; }
    const started = performance.now();
    const animate = now => {
      const progress = Math.min(1, (now - started) / 260);
      drawOptics(canvas.current, image, settings, view, markers, point, visual, selected ? progress : 1 - progress);
      if (progress < 1) animationFrame.current = requestAnimationFrame(animate);
      else previousSelected.current = selected;
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [image, settings, view, markers, point, selected]);
  useEffect(() => { const el = canvas.current; const wheel = e => { e.preventDefault(); zoom(Math.exp(-e.deltaY * .001)); }; el.addEventListener('wheel', wheel, { passive: false }); return () => el.removeEventListener('wheel', wheel); }, [zoom]);
  useImperativeHandle(captureRef, () => ({ capture: async () => { if (!image || imageError) throw new Error('Đợi tiêu bản tải xong trước khi chụp.'); return { blob: await canvasBlob(canvas.current), detail: `Thu phóng ${scale.toFixed(2)} · Bàn tiêu bản ${view.x.toFixed(2)}, ${view.y.toFixed(2)}` }; } }), [image, imageError, scale, view]);
  return <div className="mx-auto w-full max-w-[720px]">
    <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border-[14px] border-lab-surface bg-lab-surface shadow-[0_0_0_3px_hsl(var(--lab-edge)),0_18px_40px_rgba(0,0,0,.4)]">
      <div className="pointer-events-none absolute inset-0 opacity-0" aria-hidden="true"><Image src={specimen.image} alt="" crossOrigin="anonymous" draggable={false} className="h-full w-full" onLoad={e => setImage(e.currentTarget)} onError={() => setImageError(true)} /></div>
      <canvas ref={canvas} width="1000" height="1000" aria-label={`Trường nhìn ${specimen.name}`} data-testid="microscope-lens" data-scale={scale} data-pan={`${view.x},${view.y}`} data-structure={selected?.id || ''} data-ready={Boolean(image)} className={`relative h-full w-full touch-none rounded-full ${marking ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`} {...events} />
      <MicroscopeAnnotation hotspot={selected} image={image} settings={settings} view={view} />
      {!selected && !marking && image && <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-lab-surface/80 px-3 py-1.5 text-[11px] text-lab-ink backdrop-blur">Chạm vào một cấu trúc để khám phá.</p>}
      {!image && <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-lab-ink">{imageError ? 'Không tải được tiêu bản.' : 'Đang nạp tiêu bản…'}</p>}
    </div>
    <StageNavigation zoom={zoom} pan={pan} />
    <p className="mt-3 text-center text-xs text-lab-muted">Kéo để dịch tiêu bản · Cuộn để thu phóng · Chạm để {marking ? 'đánh dấu' : 'nhận diện cấu trúc'}</p>
    <p className="mt-1 text-center text-[10px] text-lab-muted">Trường tối và độ phóng đại được mô phỏng để học tập.</p>
    <StructureCard structure={selected} loading={analyzing} onClose={onClose} />
  </div>;
}