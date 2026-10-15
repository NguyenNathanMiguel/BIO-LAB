import React, { useEffect, useState } from 'react';
import { Camera, MapPin, NotebookPen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
export default function CaptureNotes({ specimen, settings, marking, onToggleMarking, captureRef, mode, markers }) {
  const [note, setNote] = useState(''), [capture, setCapture] = useState(null), [busy, setBusy] = useState(''), [error, setError] = useState(''), [savedId, setSavedId] = useState('');
  useEffect(() => () => { if (capture?.url) URL.revokeObjectURL(capture.url); }, [capture?.url]);
  const takePhoto = async () => {
    if (busy) return; setBusy('capture'); setError(''); setSavedId('');
    try { const result = await captureRef.current.capture(); setCapture({ ...result, url: URL.createObjectURL(result.blob), settings: { ...settings }, markers: [...markers], mode }); }
    catch (e) { setError(e.message || 'Không thể chụp ảnh lúc này.'); } finally { setBusy(''); }
  };
  const save = async () => {
    if (busy || savedId) return; setBusy('save'); setError('');
    try {
      let uri = capture?.fileUri;
      if (capture && !uri) { const result = await base44.integrations.Core.UploadPrivateFile({ file: new File([capture.blob], 'microscope.png', { type: 'image/png' }) }); uri = result.file_uri; setCapture(old => ({ ...old, fileUri: uri })); }
      const s = capture?.settings || settings, m = capture?.markers || markers, name = mode === '3D' ? 'Tế bào thực vật 3D' : specimen.name;
      const entry = await base44.entities.ObservationJournal.create({ title: `Quan sát: ${name}`, image_file_uri: uri, observation: note.trim() || `Quan sát ${name}${mode === '2D' ? ` ở độ phóng đại ${s.magnification}×` : ''}.`, evidence: `${specimen.training && mode === '2D' ? 'Tiêu bản luyện tập mô phỏng · ' : ''}${mode === '2D' ? `Độ phóng đại ${s.magnification}× · Lấy nét ${s.focus}% · Chiếu sáng ${s.illumination}% · ${s.viewMode === 'brightfield' ? 'Trường sáng' : 'Trường tối'}` : 'Mô hình tế bào thực vật 3D'}${capture ? `\nẢnh chụp: ${capture.detail}` : ''}${m.length ? `\n${m.length} đánh dấu: ${m.map((p, i) => `${i + 1}: (${p.x.toFixed(1)}%, ${p.y.toFixed(1)}%)`).join('; ')}` : ''}`, source: 'microscope', status: 'draft' }); setSavedId(entry.id);
    } catch { setError('Chưa lưu được quan sát. Ghi chú vẫn được giữ, hãy thử lại.'); } finally { setBusy(''); }
  };
  return <section data-testid="capture-notes" data-saved-id={savedId} className="rounded-2xl border border-border bg-card p-4 text-card-foreground">
    <div className="mb-3 grid grid-cols-2 gap-2"><button disabled={Boolean(busy)} onClick={takePhoto} className="flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-xs disabled:opacity-50"><Camera className="h-4 w-4" />{busy === 'capture' ? 'Đang chụp…' : capture ? 'Chụp lại' : 'Chụp ảnh'}</button><button disabled={mode !== '2D'} aria-pressed={marking} onClick={onToggleMarking} className={`flex items-center justify-center gap-1 rounded-lg border py-2 text-xs disabled:opacity-40 ${marking ? 'border-lab-glow bg-lab-panel text-lab-glow' : 'border-border'}`}><MapPin className="h-4 w-4" />Đánh dấu</button></div>
    {capture && <div className="mb-3"><Image src={capture.url} alt="Ảnh chụp trường nhìn hiện tại" fittingType="fit" className="aspect-square w-full rounded-lg bg-lab-surface" /><a href={capture.url} download="kinh-hien-vi.png" className="mt-1 block text-xs underline">Tải ảnh chụp</a></div>}
    {mode === '2D' && <p className="mb-2 text-xs text-muted-foreground">{markers.length} điểm đánh dấu · Reset để xoá</p>}
    <label htmlFor="microscope-note" className="mb-2 flex items-center gap-1 text-xs font-semibold"><NotebookPen className="h-4 w-4" />Ghi chú</label><textarea id="microscope-note" aria-label="Ghi chú quan sát" value={note} maxLength={5000} onChange={e => { setNote(e.target.value); setSavedId(''); }} placeholder="Mô tả điều em quan sát…" className="h-24 w-full resize-y rounded-lg border border-input bg-background p-2 text-xs" />
    {error && <p role="alert" className="my-2 text-xs text-destructive">{error}</p>}
    <button onClick={save} disabled={Boolean(busy || savedId)} className="mt-2 w-full rounded-lg bg-lab-panel py-2 text-xs font-semibold text-lab-ink disabled:opacity-60">{busy === 'save' ? <><Loader2 className="mr-1 inline h-3 w-3 animate-spin" />Đang lưu…</> : savedId ? 'Đã lưu vào Nhật Ký' : 'Lưu quan sát'}</button>
    {savedId && <Link to="/journal" className="mt-2 block text-center text-xs underline">Mở Nhật Ký Quan Sát</Link>}
  </section>;
}