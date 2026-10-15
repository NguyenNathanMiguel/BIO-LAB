const clamp = (n, a = 0, b = 100) => Math.max(a, Math.min(b, n));
export const plantGrowthModel = {
  id: 'plant-growth', title: 'Các yếu tố ảnh hưởng đến sự phát triển của cây', maxDays: 30, stepDays: .05,
  variables: [
    { id: 'light', label: 'Cường độ ánh sáng', min: 0, max: 100, unit: '%', initial: 60, meaning: 'Năng lượng ánh sáng đến tán lá.', icon: 'Sun', tone: 'light' },
    { id: 'water', label: 'Lượng nước', min: 0, max: 100, unit: '%', initial: 65, meaning: 'Mức cấp nước; thay đổi sẽ làm ẩm đất ngay.', icon: 'Droplets', tone: 'water' },
    { id: 'co2', label: 'Nồng độ CO₂', min: 0, max: 100, unit: '%', initial: 50, meaning: 'Thang CO₂ tương đối trong mô hình, không phải % khí thực.', icon: 'Wind', tone: 'mint' },
    { id: 'temperature', label: 'Nhiệt độ', min: 10, max: 40, unit: '°C', initial: 25, meaning: 'Nhiệt độ môi trường quanh cây.', icon: 'Thermometer', tone: 'heat' },
    { id: 'nutrients', label: 'Dinh dưỡng', min: 0, max: 100, unit: '%', initial: 60, meaning: 'Mức cung cấp khoáng tương đối cho rễ.', icon: 'Sprout', tone: 'mint' },
  ],
  initialState: () => ({ day: 0, height: 6, leaves: 4, roots: 4, biomass: 1, moisture: 65, health: 90, status: 'Bình thường' }),
  onVariable: (state, key, value) => key === 'water' ? { ...state, moisture: value } : state,
  step(state, v, dt) {
    const moisture = clamp(state.moisture + ((v.water - state.moisture) * .5 - (.35 + v.light * .009 + Math.max(0, v.temperature - 20) * .035)) * dt);
    const light = Math.min(1, v.light / 60) * (1 - Math.max(0, v.light - 80) * .018);
    const water = Math.min(1, moisture / 50) * (1 - Math.max(0, moisture - 78) * .025);
    const co2 = (1 - Math.exp(-v.co2 / 28)) / (1 - Math.exp(-70 / 28));
    const temp = Math.exp(-Math.pow((v.temperature - 25) / 10, 2));
    const nutrient = Math.min(1, v.nutrients / 55) * (1 - Math.max(0, v.nutrients - 80) * .025);
    const stress = clamp(Math.max((25 - moisture) / 25, (moisture - 80) / 20, (v.light - 80) / 20, (v.temperature - 30) / 10, (v.nutrients - 80) / 20), 0, 1);
    const health = clamp(state.health + ((96 - stress * 80 - Math.max(0, 20 - v.nutrients) * 1.5 - Math.max(0, 15 - v.light)) - state.health) * .16 * dt);
    const growth = Math.max(0, light * water * co2 * temp * nutrient) * (.3 + health / 140);
    const biomass = Math.max(.4, state.biomass + (.32 * growth * (1 - state.biomass / 25) - stress * .018) * dt);
    const status = moisture < 25 ? 'Thiếu nước' : moisture > 82 ? 'Đất quá ẩm' : v.temperature > 32 ? 'Stress nhiệt' : v.temperature < 17 ? 'Nhiệt độ thấp' : v.light < 20 ? 'Thiếu sáng' : v.light > 85 ? 'Stress ánh sáng' : v.nutrients < 20 ? 'Thiếu dinh dưỡng' : v.nutrients > 85 ? 'Stress dinh dưỡng' : v.co2 < 15 ? 'CO₂ thấp' : 'Bình thường';
    return { day: Math.min(30, state.day + dt), height: state.height + .85 * growth * (1 - state.height / 55) * dt, leaves: 4 + Math.floor(Math.max(0, biomass - 1) / .42), roots: state.roots + .38 * growth * water * dt, biomass, moisture, health, status };
  },
  measurements: [
    { key: 'height', label: 'Chiều cao', unit: 'cm', digits: 1 }, { key: 'leaves', label: 'Số lá', unit: 'lá', digits: 0 },
    { key: 'biomass', label: 'Sinh khối', unit: 'chỉ số', digits: 2 }, { key: 'roots', label: 'Phát triển rễ', unit: 'cm', digits: 1 },
    { key: 'moisture', label: 'Độ ẩm đất', unit: '%', digits: 1 }, { key: 'health', label: 'Sức sống', unit: '/100', digits: 0 },
  ],
  graphs: [{ key: 'height', label: 'Chiều cao (cm)' }, { key: 'biomass', label: 'Sinh khối (chỉ số)' }, { key: 'leaves', label: 'Số lá' }],
  observationFields: [{ key: 'observation', label: 'QUAN SÁT' }, { key: 'hypothesis', label: 'DỰ ĐOÁN' }, { key: 'conclusion', label: 'KẾT LUẬN' }],
  conclusionPrompt: 'Điều kiện nào đã thay đổi? Dữ liệu hỗ trợ kết luận của bạn như thế nào?',
};
export const defaultVariables = definition => Object.fromEntries(definition.variables.map(v => [v.id, v.initial]));
export const summarizeResult = (definition, state) => `Ngày ${state.day.toFixed(1)} · ${definition.measurements.map(m => `${m.label}: ${state[m.key].toFixed(m.digits)} ${m.unit}`).join(' · ')} · Trạng thái: ${state.status}`;
export const summarizeConditions = (definition, vars) => definition.variables.map(v => `${v.label}: ${vars[v.id]}${v.unit}`).join(' · ');