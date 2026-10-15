import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import SaveToJournalButton from "./SaveToJournalButton";
import ExperimentSimulation from "@/components/experiments/ExperimentSimulation";

// Higher external solute concentration -> water leaves cell -> mass decreases
function massChangePercent(concentration, minutes) {
  const equilibrium = -0.35 * (concentration - 20) / 10;
  return (equilibrium * (1 - Math.exp(-minutes / 15))).toFixed(1);
}

export default function OsmosisExperiment() {
  const [concentration, setConcentration] = useState(20);

  const data = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ time: i * 10, mass: Number(massChangePercent(concentration, i * 10)) })),
    [concentration]
  );
  const finalChange = massChangePercent(concentration, 80);
  const direction = finalChange > 0.5 ? "tăng" : finalChange < -0.5 ? "giảm" : "gần như không đổi";

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8">
      <h3 className="font-semibold text-[#0F2A20] text-lg mb-1">Thẩm Thấu Ở Tế Bào Khoai Tây</h3>
      <p className="text-sm text-slate-500 mb-6">
        Đặt một miếng khoai tây vào dung dịch muối (sucrose) và quan sát khối lượng thay đổi như thế nào sau 80 phút.
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Nồng Độ Dung Dịch</span>
          <span className="font-medium text-amber-600">{concentration}% muối</span>
        </div>
        <Slider value={[concentration]} onValueChange={([v]) => setConcentration(v)} max={40} step={2} />
      </div>

      <div className="rounded-2xl bg-amber-50 p-4 mb-6">
        <p className="text-sm text-amber-700">
          Sau 80 phút, miếng khoai tây <span className="font-semibold">{direction} khối lượng</span> — mức thay đổi{" "}
          <span className="font-semibold">{finalChange}%</span>.
        </p>
      </div>

      <ExperimentSimulation kind="osmosis" params={{ concentration }} />

      <div className="h-56 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} label={{ value: "Phút", position: "insideBottom", offset: -3, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: "Khối lượng %", angle: -90, position: "insideLeft", fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="mass" stroke="#d97706" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <SaveToJournalButton
        title="Thí Nghiệm Thẩm Thấu"
        observation={`Trong dung dịch muối ${concentration}%, miếng khoai tây ${direction} khối lượng (thay đổi ${finalChange}% sau 80 phút).`}
        evidence="Đường cong thay đổi khối lượng mô phỏng cho tế bào khoai tây trong dung dịch nhược trương/ưu trương."
      />
    </div>
  );
}