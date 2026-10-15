import React, { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import SaveToJournalButton from "./SaveToJournalButton";
import ExperimentSimulation from "@/components/experiments/ExperimentSimulation";

// Catalase reaction rate: rises with temperature then crashes past ~45C (denaturation)
function reactionRate(temp) {
  if (temp <= 40) return (temp * 1.8).toFixed(1);
  const drop = Math.max(0, (temp - 40) * 4.5);
  return Math.max(2, 72 - drop).toFixed(1);
}

export default function EnzymeExperiment() {
  const [temp, setTemp] = useState(25);

  const data = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ temp: i * 5, rate: Number(reactionRate(i * 5)) })),
    []
  );
  const rate = reactionRate(temp);
  const denatured = temp > 55;

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8">
      <h3 className="font-semibold text-[#0F2A20] text-lg mb-1">Hoạt Tính Enzyme Theo Nhiệt Độ</h3>
      <p className="text-sm text-slate-500 mb-6">
        Catalase phân giải hydrogen peroxide thành nước và bọt khí oxy. Thay đổi nhiệt độ và quan sát tốc độ tạo bọt khí.
      </p>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Nhiệt Độ</span>
          <span className="font-medium text-rose-600">{temp}°C</span>
        </div>
        <Slider value={[temp]} onValueChange={([v]) => setTemp(v)} max={65} step={1} />
      </div>

      <div className={`rounded-2xl p-4 mb-6 ${denatured ? "bg-rose-50" : "bg-emerald-50"}`}>
        <p className={`text-sm ${denatured ? "text-rose-700" : "text-emerald-700"}`}>
          Tốc độ phản ứng: <span className="font-semibold">{rate} bọt/phút</span>
          {denatured && " — enzyme có thể đã bị biến tính ở nhiệt độ này."}
        </p>
      </div>

      <ExperimentSimulation kind="enzyme" params={{ temp }} />

      <div className="h-56 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="temp" tick={{ fontSize: 11 }} label={{ value: "Nhiệt độ °C", position: "insideBottom", offset: -3, fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="rate" stroke="#e11d48" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <SaveToJournalButton
        title="Thí Nghiệm Hoạt Tính Enzyme"
        observation={`Ở ${temp}°C, catalase tạo ra ${rate} bọt/phút.${denatured ? " Enzyme có dấu hiệu bị biến tính." : ""}`}
        evidence="Đường cong tốc độ phản ứng catalase mô phỏng trong khoảng nhiệt độ 0-65°C."
      />
    </div>
  );
}