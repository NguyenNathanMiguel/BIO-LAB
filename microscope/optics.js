import { toRegion, traceRegion } from '@/lib/microscopeRegions';
export const magnificationScale = { 40: 1, 100: 1.65, 400: 3.1, 1000: 5.2 };
export function drawOptics(canvas, image, settings, view, markers, point, selected, strength = 1) {
  const ctx = canvas.getContext('2d'), size = canvas.width, scale = magnificationScale[settings.magnification] * view.zoom;
  const fit = Math.max(size / image.naturalWidth, size / image.naturalHeight), w = image.naturalWidth * fit, h = image.naturalHeight * fit;
  const opticFilter = `${settings.viewMode === 'darkfield' ? 'invert(1) hue-rotate(160deg) contrast(1.6)' : 'contrast(1.05)'} brightness(${.15 + settings.illumination / 75}) blur(${Math.abs(settings.focus - 88) / 18 / scale}px)`;
  const drawImage = () => { ctx.filter = opticFilter; ctx.drawImage(image, -w / 2, -h / 2, w, h); ctx.filter = 'none'; };
  // Highlight follows the structure's own region so it matches the biological shape.
  const focusPath = spot => traceRegion(ctx, spot.region || toRegion(spot), w, h);
  ctx.clearRect(0, 0, size, size); ctx.save(); ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#050b09'; ctx.fillRect(0, 0, size, size);
  ctx.translate(size / 2 + view.x * size, size / 2 + view.y * size); ctx.scale(scale, scale);
  const focus = selected && Number.isFinite(selected.x) ? selected : null;
  if (focus && strength > 0) {
    // Unrelated area is dimmed only while a structure is selected.
    ctx.save(); ctx.globalAlpha = 1 - .75 * strength; drawImage(); ctx.restore();
    // Every instance of the selected structure group stays bright; the clicked one glows stronger.
    (focus.relatedSpots || []).forEach(spot => { ctx.save(); focusPath(spot); ctx.clip(); ctx.globalAlpha = 1; drawImage(); ctx.restore(); ctx.save(); focusPath(spot); ctx.globalAlpha = strength * .85; ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 3 / scale; ctx.shadowColor = '#67e8f9'; ctx.shadowBlur = 10 / scale; ctx.stroke(); ctx.restore(); });
    ctx.save(); focusPath(focus); ctx.clip(); ctx.globalAlpha = 1; drawImage(); ctx.restore();
    ctx.save(); focusPath(focus); ctx.globalAlpha = strength; ctx.strokeStyle = '#5eead4'; ctx.lineWidth = 4.5 / scale; ctx.shadowColor = '#99f6e4'; ctx.shadowBlur = 20 / scale; ctx.stroke(); ctx.restore();
  } else drawImage();
  [...markers, ...(point && !focus ? [{ ...point, active: true }] : [])].forEach((p, i) => {
    const x = (p.x / 100 - .5) * w, y = (p.y / 100 - .5) * h;
    ctx.strokeStyle = p.active ? '#7dd3fc' : '#fcd34d'; ctx.lineWidth = 2 / scale; ctx.beginPath(); ctx.arc(x, y, 9 / scale, 0, Math.PI * 2); ctx.stroke();
    if (!p.active) { ctx.fillStyle = '#fcd34d'; ctx.font = `${12 / scale}px sans-serif`; ctx.fillText(String(i + 1), x + 12 / scale, y); }
  });
  ctx.restore(); ctx.save(); const shade = ctx.createRadialGradient(size / 2, size / 2, size * .28, size / 2, size / 2, size * .5); shade.addColorStop(0, 'transparent'); shade.addColorStop(1, 'rgba(0,0,0,.58)'); ctx.fillStyle = shade; ctx.fillRect(0, 0, size, size); ctx.restore();
}
export function canvasBlob(canvas) { return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Không thể chụp ảnh.')), 'image/png')); }