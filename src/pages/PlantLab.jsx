import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PlantUploader from "@/components/plantlab/PlantUploader";
import DiagnosisResultCard from "@/components/plantlab/DiagnosisResultCard";
import DiagnosisHistoryList from "@/components/plantlab/DiagnosisHistoryList";

export default function PlantLab() {
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    const user = await base44.auth.me().catch(() => null);
    if (!user) return;
    const items = await base44.entities.PlantDiagnosis.filter({ created_by_id: user.id }, "-created_date", 10);
    setHistory(items);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAnalyzed = (data) => {
    setResult(data);
    loadHistory();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
      <p className="text-emerald-600 font-medium text-sm tracking-wide uppercase mb-2">🌿 Phòng Thực Vật</p>
      <h1 className="text-2xl md:text-3xl font-semibold text-[#0F2A20] tracking-tight mb-2">Chẩn Đoán Cây Bằng AI</h1>
      <p className="text-slate-500 mb-8 max-w-xl">
        Tải lên hoặc chụp ảnh một cây hoặc lá. AI sẽ tìm các triệu chứng có thể quan sát được và giải thích cơ sở
        sinh học phía sau — đây là ước tính mang tính giáo dục, không phải chẩn đoán chuyên môn.
      </p>

      <PlantUploader onAnalyzed={handleAnalyzed} analyzing={analyzing} setAnalyzing={setAnalyzing} />

      <div className="mt-6">
        <DiagnosisResultCard result={result} />
      </div>

      <DiagnosisHistoryList items={history} onSelect={setResult} />
    </div>
  );
}