import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import SaveToJournalButton from "./SaveToJournalButton";
import PhotosynthesisLab from '@/components/experiments/photosynthesis/PhotosynthesisLab';

// Simplified light-saturation curve for O2 bubble rate
function bubbleRate(light, co2) {
  const base = (light / 100) * 20 * (0.4 + co2 / 100);
  const saturation = 18 * (1 - Math.exp(-light / 40));
  return Math.max(0, Math.min(saturation, base)).toFixed(1);
}

export default function PhotosynthesisExperiment() {
  const [light, setLight] = useState(50);
  const [co2, setCo2] = useState(50);
  const [measurements, setMeasurements] = useState([]);

  const data = useMemo(
    () => Array.from({ length: 11 }, (_, i) => ({ light: i * 10, rate: Number(bubbleRate(i * 10, co2)) })),
    [co2]
  );
  const currentRate = bubbleRate(light, co2);

  return (
    <div className="biology-lab space-y-6">
      <header>
        <p className="lab-muted text-xs tracking-widest uppercase mb-1">BIOLOGY SIMULATION LAB · 02</p>
        <h3 className="text-xl md:text-2xl font-semibold leading-snug">Tốc Độ Quang Hợp</h3>
        <p className="lab-muted text-sm mt-2">Điều chỉnh → Lắp dụng cụ → Thu khí → Thử oxy → Ghi kết quả</p>
      </header>
      <p className="lab-muted text-sm">
        Thay đổi cường độ ánh sáng và nồng độ CO2 cho một cây thủy sinh, sau đó quan sát tốc độ tạo bọt khí oxy.
      </p>

      <div className="lab-panel grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="lab-muted">Cường Độ Ánh Sáng</span>
            <span className="font-medium text-emerald-600">{light}%</span>
          </div>
          <Slider value={[light]} onValueChange={([v]) => setLight(v)} max={100} step={5} />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="lab-muted">Nồng Độ CO2</span>
            <span className="font-medium text-emerald-600">{co2}%</span>
          </div>
          <Slider value={[co2]} onValueChange={([v]) => setCo2(v)} max={100} step={5} />
        </div>
      </div>

      <div className="lab-run flex items-center justify-between gap-4">
        <span className="lab-muted text-sm">Tốc độ O₂ theo thông số khi có cây và bật đèn</span>
        <span className="font-semibold text-lg text-[var(--sim-mint)]">{currentRate} bọt/phút</span>
      </div>

      <PhotosynthesisLab light={light} co2={co2} onMeasurements={setMeasurements} />

      <div className="lab-panel h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="light" tick={{ fontSize: 11 }} label={{ value: "Ánh sáng %", position: "insideBottom", offset: -3, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <SaveToJournalButton
        key={measurements.map(r => r.id).join(',')}
        title="Thí Nghiệm Quang Hợp"
        observation={`Ở mức ánh sáng ${light}% và CO2 ${co2}%, tốc độ tạo bọt khí oxy là ${currentRate} bọt/phút.`}
        evidence={measurements.length ? measurements.map((r, i) => `Lần ${i + 1}: ${r.parameters}; ${r.minutes} phút; ${r.value} mL khí; ${r.bubbles} bọt; nước trong ống khi nối: ${Math.round(r.initialFill * 100)}%; chưa thử que đóm.`).join('\n') : 'Đường cong bão hòa ánh sáng mô phỏng cho quá trình tạo oxy ở cây thủy sinh. Chưa ghi lần đo thu khí.'}
      />
    </div>
  );
}