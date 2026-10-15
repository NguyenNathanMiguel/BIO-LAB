export function simulationReading(kind, params, seconds) {
  const minutes = seconds / 60;
  if (kind === 'enzyme') {
    const rate = params.temp <= 40 ? params.temp * 1.8 : Math.max(2, 72 - (params.temp - 40) * 4.5);
    return { value: Math.floor(rate * minutes), unit: 'bọt O₂', detail: `${rate.toFixed(1)} bọt/phút` };
  }
  if (kind === 'photo') {
    const base = (params.light / 100) * 20 * (0.4 + params.co2 / 100);
    const rate = Math.max(0, Math.min(18 * (1 - Math.exp(-params.light / 40)), base));
    return { value: Math.floor(rate * minutes), unit: 'bọt O₂', detail: `${rate.toFixed(1)} bọt/phút` };
  }
  const equilibrium = -0.35 * (params.concentration - 20) / 10;
  const change = equilibrium * (1 - Math.exp(-Math.min(minutes, 80) / 15));
  return { value: change.toFixed(1), unit: '% khối lượng', detail: `${(10 * (1 + change / 100)).toFixed(2)} g từ 10,00 g` };
}
export function parameterSummary(kind, params) {
  if (kind === 'enzyme') return `${params.temp}°C`;
  if (kind === 'photo') return `Ánh sáng ${params.light}% · CO₂ ${params.co2}%`;
  return `Dung dịch ${params.concentration}%`;
}