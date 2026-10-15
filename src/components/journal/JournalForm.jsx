import React, { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";

export default function JournalForm({ onSaved, onCancel }) {
  const [title, setTitle] = useState("");
  const [observation, setObservation] = useState("");
  const [evidence, setEvidence] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [aiMessage, setAiMessage] = useState("");
  const [aiHistory, setAiHistory] = useState([]); // [{ question, answer, error }]
  const [aiFormError, setAiFormError] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [openHistoryIndex, setOpenHistoryIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);
  const currentEntry = aiHistory.length ? aiHistory[aiHistory.length - 1] : null;
  const pastHistory = aiHistory.slice(0, -1).map((h, index) => ({ ...h, index })).reverse();

  const handleUpload = async (file) => {
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
    setImageUrl(file_url);
  };

  const handleAskAi = async () => {
    const question = aiMessage.trim();
    if (!question) {
      setAiFormError("Vui lòng nhập câu hỏi trước.");
      return;
    }
    setAiFormError("");
    setLoadingAi(true);
    const entryIndex = aiHistory.length;
    setAiHistory((h) => [...h, { question, answer: null, error: null }]);
    setOpenHistoryIndex(entryIndex);
    try {
      const { data } = await base44.functions.invoke("biologyAiAssistant", {
        observation, evidence, hypothesis, conclusion, image_url: imageUrl, message: question,
      });
      if (data.error) throw new Error(data.error);
      setAiHistory((h) => h.map((item, i) => (i === entryIndex ? { ...item, answer: data.answer } : item)));
    } catch (e) {
      setAiHistory((h) => h.map((item, i) => (i === entryIndex ? { ...item, error: "Trợ lý chưa trả lời được. Vui lòng gửi lại." } : item)));
    } finally {
      setLoadingAi(false);
      setAiMessage("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const aiAnalysis = aiHistory.filter((h) => h.answer).map((h) => `Hỏi: ${h.question}\nTrả lời: ${h.answer}`).join("\n\n") || null;
    await base44.entities.ObservationJournal.create({
      title, observation, evidence, hypothesis, conclusion,
      image_url: imageUrl,
      ai_analysis: aiAnalysis,
      status: aiAnalysis ? "ai_reviewed" : "draft",
      source: "general",
    });
    setSaving(false);
    onSaved();
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm p-6 md:p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#0F2A20] text-lg">Ghi Mới</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
      </div>

      <Input placeholder="Tiêu đề (ví dụ: Lá vàng gần cửa sổ)" value={title} onChange={(e) => setTitle(e.target.value)} />

      {imageUrl ? (
        <div className="rounded-2xl overflow-hidden aspect-video bg-slate-50">
          <Image src={imageUrl} alt="Observation" className="w-full h-full" fittingType="fit" />
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 aspect-[3/1] flex items-center justify-center text-slate-400 text-sm gap-2 hover:border-emerald-300"
        >
          <Upload className="w-4 h-4" /> Đính kèm ảnh (không bắt buộc)
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} />

      <Field label="Quan Sát" value={observation} onChange={setObservation} placeholder="Bạn đã nhận thấy điều gì?" />
      <Field label="Bằng Chứng" value={evidence} onChange={setEvidence} placeholder="Dữ liệu hoặc chi tiết nào hỗ trợ điều này?" />
      <Field label="Giả Thuyết" value={hypothesis} onChange={setHypothesis} placeholder="Bạn nghĩ điều gì đang xảy ra, và tại sao?" />
      <Field label="Kết Luận" value={conclusion} onChange={setConclusion} placeholder="Bạn đã rút ra kết luận gì?" />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
        <label className="text-sm font-medium text-emerald-800">Hỏi Trợ Lý Sinh Học AI</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Textarea
            value={aiMessage}
            onChange={(e) => { setAiMessage(e.target.value); if (aiFormError) setAiFormError(""); }}
            placeholder='Ví dụ: "Tôi nên viết gì?", "Cho tôi gợi ý", "Cấu trúc này là gì?"'
            className="min-h-[60px] bg-white flex-1"
          />
          <Button onClick={handleAskAi} disabled={loadingAi} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 shrink-0 sm:self-end">
            {loadingAi ? "Đang gửi..." : "Gửi câu hỏi"}
          </Button>
        </div>
        {aiFormError && <p className="text-xs text-red-500">{aiFormError}</p>}
        <p className="text-xs text-emerald-700/70">Trợ lý sẽ dựa trên ảnh và nội dung bạn đã viết để hướng dẫn — chỉ viết câu trả lời hoàn chỉnh khi bạn yêu cầu rõ ("viết hoàn chỉnh giúp tôi").</p>

        {currentEntry && (
          <div className="space-y-1.5">
            <p className="text-sm text-slate-600"><span className="font-medium text-slate-500">Câu hỏi: </span>{currentEntry.question}</p>
            {currentEntry.answer && (
              <div className="rounded-xl bg-white p-3 text-sm text-emerald-800 whitespace-pre-line">
                <span className="font-medium">Trợ Lý Sinh Học AI: </span>{currentEntry.answer}
              </div>
            )}
            {currentEntry.error && <p className="text-xs text-red-500">{currentEntry.error}</p>}
            {loadingAi && !currentEntry.answer && !currentEntry.error && (
              <p className="text-xs text-emerald-600">AI đang phân tích...</p>
            )}
          </div>
        )}

        {pastHistory.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setHistoryOpen((v) => !v)}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Lịch sử hỏi ({pastHistory.length})
            </button>

            {historyOpen && (
              <div className="mt-2 space-y-1.5">
                {pastHistory.map((h) => (
                  <div key={h.index} className="border border-emerald-100 rounded-xl bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenHistoryIndex((cur) => (cur === h.index ? null : h.index))}
                      className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50/60"
                    >
                      <span className="font-medium text-slate-500">Câu hỏi: </span>{h.question}
                    </button>
                    {openHistoryIndex === h.index && (
                      <div className="px-3 pb-3">
                        {h.answer && (
                          <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 whitespace-pre-line">
                            <span className="font-medium">Trợ Lý Sinh Học AI: </span>{h.answer}
                          </div>
                        )}
                        {h.error && <p className="text-xs text-red-500">{h.error}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>Hủy</Button>
        <Button onClick={handleSave} disabled={saving || !title || !observation} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Lưu Ghi Chú
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-[80px]" />
    </div>
  );
}