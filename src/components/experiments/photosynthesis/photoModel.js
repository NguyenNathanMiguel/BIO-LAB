export const tools = [
  { id: 'plant', label: 'Cây thủy sinh', phase: 1 },
  { id: 'funnel', label: 'Phễu thủy tinh', phase: 1 },
  { id: 'tube', label: 'Ống nghiệm', phase: 1 },
  { id: 'lamp', label: 'Đèn', phase: 1 },
  { id: 'matches', label: 'Hộp diêm', phase: 2 },
  { id: 'splint', label: 'Que diêm', phase: 2 },
];

export const initialPhotoState = () => ({ items: [], stage: 1, bubbles: 0, elapsed: 0, running: false, speed: 1, flameBurst: false, completed: false });

export function photoRate(light, co2) {
  const base = (light / 100) * 20 * (0.4 + co2 / 100);
  return Math.max(0, Math.min(18 * (1 - Math.exp(-light / 40)), base));
}

export const inBeaker = item => item.x > 205 && item.x < 425 && item.y > 205 && item.y < 355;
export const onRack = item => item.type === 'tube' && item.location === 'rack';
export const itemCount = (state, type) => state.items.filter(item => item.type === type).length;

export function setupStatus(state) {
  const plant = state.items.find(item => item.type === 'plant' && inBeaker(item));
  const funnel = state.items.find(item => item.type === 'funnel' && item.inverted && inBeaker(item) && (!plant || Math.hypot(item.x - plant.x, item.y - plant.y) < 90));
  const tube = state.items.find(item => item.type === 'tube' && item.location === 'neck' && item.inverted && item.fill > .95);
  const lamp = state.items.find(item => item.type === 'lamp' && item.on);
  return { plant, funnel, tube, lamp, ready: Boolean(plant && funnel && tube && lamp) };
}

export const effectiveRate = (state, light, co2) => {
  const { plant, lamp } = setupStatus(state);
  if (!plant || !lamp) return 0;
  const distance = Math.hypot(lamp.x - plant.x, lamp.y - plant.y);
  const distanceFactor = Math.max(.25, Math.min(1.15, 240 / Math.max(120, distance)));
  return photoRate(light * distanceFactor, co2);
};

export function advancePhoto(state, dt, light, co2) {
  const items = state.items.map(item => item.type === 'tube' && inBeaker(item) && item.location !== 'neck' && !item.inverted ? { ...item, fill: Math.min(1, item.fill + dt / 4) } : item);
  if (!state.running) return items.some((item, index) => item.fill !== state.items[index].fill) ? { ...state, items } : state;
  const seconds = dt * state.speed;
  const bubbles = effectiveRate({ ...state, items }, light, co2) * seconds / 60;
  const status = setupStatus({ ...state, items });
  const nextItems = items.map(item => item.id === status.tube?.id ? { ...item, gas: Math.min(10, item.gas + bubbles * .05), initialFill: item.initialFill || item.fill } : item);
  return { ...state, items: nextItems, elapsed: state.elapsed + seconds, bubbles: state.bubbles + bubbles };
}