import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NotebookPen, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { summarizeResult, summarizeConditions } from '@/components/experiments/lab/plantGrowthModel';
export default function LabObservation({ definition, lab, notes, setNotes, runs, name }) {
  const [saving, setSaving] = useState(false), [saved, setSaved] = useState(null), [error, setError] = useState('');
  const save = async e => {
    e.preventDefault(); setSaving(true); setError(''); setSaved(null);
    const current = lab.capture(name.trim() || 'Thử nghiệm');
    const report = run => `${run.name}\n${summarizeResult(definition, run.state)}\nĐiều kiện theo thời gian:\n${run.changes.map(c => `Ngày ${c.day.toFixed(2)}: ${summarizeConditions(definition, c)}`).join('\n')}\nDữ liệu (ngày, chiều cao cm, số lá, sinh khối):\n${run.history.map(s => [s.day.toFixed(2), s.height.toFixed(2), s.leaves, s.biomass.toFixed(2)].join(', ')).join('\n')}`;
    try {
      const entry = await base44.entities.ObservationJournal.create({ title: `${definition.title} — ${current.name}`, observation: notes.observation.trim(), hypothesis: notes.hypothesis, conclusion: notes.conclusion, evidence: `Mô hình giáo dục, không phải dự báo nông nghiệp.\n\n${[...runs, current].map(report).join('\n\n')}`, source: 'experiment', status: 'draft' });
      setSaved(entry.id);
    } catch (err) { setError(err.message || 'Chưa lưu được. Hãy thử lại.'); }
    finally { setSaving(false); }
  };
  return <form onSubmit={save} className="lab-panel" data-testid="lab-observation"><h3 className="lab-heading">GHI CHÉP KHOA HỌC</h3>
    <div className="grid gap-4 md:grid-cols-3">{definition.observationFields.map(field => <label className="block text-xs font-semibold" key={field.key}>{field.label}<textarea className="lab-input block w-full mt-2 min-h-28 font-normal text-sm" aria-label={field.label} maxLength={4000} required={field.key === 'observation'} value={notes[field.key]} onChange={e => { setNotes({ ...notes, [field.key]: e.target.value }); setSaved(null); }} placeholder={field.key === 'conclusion' ? definition.conclusionPrompt : 'Ghi lại suy nghĩ của bạn…'} /></label>)}</div>
    <div className="lab-run mt-4"><h4 className="text-xs font-semibold mb-2">KẾT QUẢ · TỰ ĐỘNG GHI NHẬN</h4><p className="text-sm leading-relaxed" data-testid="observation-result">{summarizeResult(definition, lab.state)}</p></div>
    <div className="flex flex-wrap items-center gap-3 mt-4"><button className="lab-btn lab-primary" type="submit" disabled={saving || lab.state.day === 0 || !notes.observation.trim()}>{saving ? <Loader2 size={17} className="animate-spin" /> : <NotebookPen size={17} />} {saving ? 'Đang lưu…' : 'Lưu vào Nhật Ký'}</button>
      {saved && <Link className="lab-saved underline text-sm py-3" data-testid="journal-saved" data-journal-id={saved} to="/journal">Đã lưu — mở Nhật Ký</Link>}<p className="lab-muted text-xs">Lưu sẽ tạm dừng và chụp lại số đo, điều kiện, đồ thị cùng các lượt so sánh.</p></div>
    {error && <p role="alert" className="lab-error mt-3 text-sm">{error}</p>}
  </form>;
}