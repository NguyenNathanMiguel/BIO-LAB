import React from "react";
import { AlertTriangle, Sparkles, Gauge, BookOpen } from "lucide-react";

const confidenceColor = { low: "text-amber-600 bg-amber-50", medium: "text-blue-600 bg-blue-50", high: "text-emerald-600 bg-emerald-50" };
const confidenceLabel = { low: "thấp", medium: "trung bình", high: "cao" };
const likelihoodLabel = { low: "thấp", medium: "trung bình", high: "cao" };

export default function DiagnosisResultCard({ result }) {
  if (!result) return null;
  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#0F2A20] text-lg">Phân Tích Của AI</h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${confidenceColor[result.confidence_level] || "text-slate-500 bg-slate-50"}`}>
          <Gauge className="w-3 h-3" /> Độ tin cậy {confidenceLabel[result.confidence_level] || "chưa rõ"}
        </span>
      </div>

      {result.is_unclear && (
        <div className="flex items-start gap-2 bg-amber-50 text-amber-700 rounded-xl p-4 text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{result.warning}</p>
        </div>
      )}

      {result.plant_type_guess && (
        <p className="text-sm text-slate-500">
          Loại cây phát hiện: <span className="font-medium text-slate-700">{result.plant_type_guess}</span>
        </p>
      )}

      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-2">Triệu Chứng Phát Hiện</h4>
        <div className="flex flex-wrap gap-2">
          {(result.symptoms || []).map((s, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">{s}</span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-500" /> Khả Năng Mắc Bệnh
        </h4>
        <div className="space-y-2">
          {(result.possible_conditions || []).map((c, i) => (
            <div key={i} className="rounded-xl bg-slate-50 p-3.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-slate-800">{c.name}</span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400">Khả năng {likelihoodLabel[c.likelihood] || c.likelihood}</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{c.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-500" /> Vì Sao Điều Này Xảy Ra
        </h4>
        <p className="text-sm text-slate-500 leading-relaxed">{result.biological_explanation}</p>
      </div>

      {!result.is_unclear && (
        <p className="text-xs text-slate-400 border-t border-slate-100 pt-4">{result.warning}</p>
      )}
    </div>
  );
}