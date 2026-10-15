import React, { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
export default function LabAssistant({ specimen, structure, challengeHint }) {
  const [question, setQuestion] = useState(''), [answer, setAnswer] = useState('Hãy quan sát hình dạng, vị trí và mối liên hệ giữa các cấu trúc trước khi đặt tên.'), [loading, setLoading] = useState(false), [error, setError] = useState('');
  const sequence = useRef(0);
  useEffect(() => () => { sequence.current++; }, []);
  const ask = async (explain = false) => {
    if (loading || (!explain && !question.trim())) return; setLoading(true); setError(''); const id = ++sequence.current;
    try {
      const structures = (specimen.hotspots || []).map(h => ({ label: h.label, category: h.category, function: h.function, info: h.info }));
      const q = explain ? `Cấu trúc ${structure.label || structure.name} là gì và có tác dụng gì?` : question;
      const { data } = await base44.functions.invoke('microscopeStructureAssistant', { specimenName: specimen.name, structures, question: q, selectedLabel: structure?.label || structure?.name });
      if (data.error) throw new Error(data.error);
      if (id === sequence.current) { setAnswer(data.answer); setQuestion(''); }
    }
    catch { if (id === sequence.current) setError('Trợ lý chưa phản hồi. Em có thể thử lại.'); }
    finally { if (id === sequence.current) setLoading(false); }
  };
  return <section className="rounded-2xl border border-lab-edge bg-card p-4"><h3 className="mb-2 flex items-center gap-2 text-sm font-semibold"><Bot className="h-4 w-4" />Trợ lý phòng thí nghiệm AI</h3><p data-testid="lab-answer" aria-live="polite" className="mb-3 whitespace-pre-line rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">{answer}</p>{error && <p role="alert" className="mb-2 text-xs text-destructive">{error}</p>}<div className="flex gap-2"><input aria-label="Câu hỏi cho trợ lý AI" value={question} maxLength={1200} onChange={e => setQuestion(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') ask(); }} placeholder="Cấu trúc này có vai trò gì?" className="min-w-0 flex-1 rounded-lg border border-input bg-background px-2 text-xs" /><button aria-label="Gửi câu hỏi" onClick={() => ask()} disabled={loading || !question.trim()} className="rounded-lg bg-lab-panel p-2.5 text-lab-ink disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</button></div>{structure && !challengeHint && <button onClick={() => ask(true)} disabled={loading} className="mt-3 text-xs underline disabled:opacity-50">Giải thích cấu trúc đã chọn</button>}</section>;
}