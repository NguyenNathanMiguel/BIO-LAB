// Region geometry for microscope structures. All coordinates are percentages of the
// specimen image, so regions stay aligned with the specimen through zoom and pan.
export const ellipse = (cx, cy, rx, ry, rotate = 0) => ({ kind: 'ellipse', cx, cy, rx, ry, rotate });
export const polygon = points => ({ kind: 'polygon', points });

export function toRegion(hotspot) {
  if (hotspot.region) return hotspot.region;
  const r = hotspot.radius || 7;
  return ellipse(hotspot.x, hotspot.y, r, r);
}

export function regionCenter(region) {
  if (region.kind === 'ellipse') return { x: region.cx, y: region.cy };
  const p = region.points;
  return { x: p.reduce((s, [x]) => s + x, 0) / p.length, y: p.reduce((s, [, y]) => s + y, 0) / p.length };
}

export function regionArea(region) {
  if (region.kind === 'ellipse') return Math.PI * region.rx * region.ry;
  const p = region.points;
  let sum = 0;
  for (let i = 0; i < p.length; i++) { const [x1, y1] = p[i], [x2, y2] = p[(i + 1) % p.length]; sum += x1 * y2 - x2 * y1; }
  return Math.abs(sum) / 2;
}

// pad widens the region slightly so touch and mouse clicks feel forgiving.
export function regionContains(region, point, pad = 1.2) {
  if (region.kind === 'ellipse') {
    const a = (-(region.rotate || 0) * Math.PI) / 180;
    const dx = point.x - region.cx, dy = point.y - region.cy;
    const rx = (Math.cos(a) * dx - Math.sin(a) * dy) / (region.rx + pad);
    const ry = (Math.sin(a) * dx + Math.cos(a) * dy) / (region.ry + pad);
    return rx * rx + ry * ry <= 1;
  }
  const c = regionCenter(region), p = region.points;
  const scaled = p.map(([x, y]) => {
    const d = Math.hypot(x - c.x, y - c.y) || 1;
    return [x + ((x - c.x) / d) * pad, y + ((y - c.y) / d) * pad];
  });
  let inside = false;
  for (let i = 0, j = scaled.length - 1; i < scaled.length; j = i++) {
    const [xi, yi] = scaled[i], [xj, yj] = scaled[j];
    if (yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Traces the region on a canvas already translated/scaled to the specimen image.
export function traceRegion(ctx, region, w, h) {
  const px = x => (x / 100 - 0.5) * w, py = y => (y / 100 - 0.5) * h;
  ctx.beginPath();
  if (region.kind === 'ellipse') {
    ctx.ellipse(px(region.cx), py(region.cy), Math.max(6, (region.rx * w) / 100), Math.max(6, (region.ry * h) / 100), ((region.rotate || 0) * Math.PI) / 180, 0, Math.PI * 2);
  } else {
    region.points.forEach(([x, y], i) => (i ? ctx.lineTo(px(x), py(y)) : ctx.moveTo(px(x), py(y))));
    ctx.closePath();
  }
}