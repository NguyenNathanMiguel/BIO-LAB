import React, { useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { microscopeChallenges, microscopeSpecimens } from "@/lib/microscopeSpecimens";
import ModeToolbar from "@/components/microscope/ModeToolbar";
import SpecimenLibrary from "@/components/microscope/SpecimenLibrary";
import MicroscopeWorkspace from "@/components/microscope/MicroscopeWorkspace";
import MicroscopeControls from "@/components/microscope/MicroscopeControls";
import ChallengePanel from "@/components/microscope/ChallengePanel";
import LabAssistant from "@/components/microscope/LabAssistant";
import CaptureNotes from "@/components/microscope/CaptureNotes";
import useMicroscopeLearning from '@/components/microscope/useMicroscopeLearning';

export default function VirtualMicroscope() {
  const rootRef = useRef(null), captureRef = useRef(null), [mode, setMode] = useState('2D'), [specimen, setSpecimen] = useState(microscopeSpecimens[0]);
  const [settings, setSettings] = useState({ magnification: 400, focus: 88, illumination: 72, viewMode: 'brightfield' }), [fullscreen, setFullscreen] = useState(false), [marking, setMarking] = useState(false), [markers, setMarkers] = useState([]), [resetKey, setResetKey] = useState(0);
  const choose = item => { setSpecimen(item); setMarkers([]); setMarking(false); setSettings(old => ({ ...old, magnification: item.recommended })); setResetKey(n => n + 1); };
  const learning = useMicroscopeLearning(specimen, choose, setMode);
  useEffect(() => { const change = () => setFullscreen(Boolean(document.fullscreenElement)); const escape = e => { if (e.key === 'Escape' && !document.fullscreenElement) setFullscreen(false); }; document.addEventListener('fullscreenchange', change); document.addEventListener('keydown', escape); return () => { document.removeEventListener('fullscreenchange', change); document.removeEventListener('keydown', escape); }; }, []);
  useEffect(() => { if (!fullscreen) return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; }; }, [fullscreen]);
  const toggleFullscreen = async () => { if (fullscreen) { if (document.fullscreenElement) await document.exitFullscreen(); setFullscreen(false); return; } setFullscreen(true); try { await rootRef.current.requestFullscreen(); } catch { /* Window-filling workspace is retained where native fullscreen is unavailable. */ } };
  const reset = () => { setSettings({ magnification: specimen.recommended, focus: 88, illumination: 72, viewMode: 'brightfield' }); learning.close(); setMarkers([]); setMarking(false); setResetKey(n => n + 1); };
  const changeMode = value => { if (mode === value) return; learning.cancel(); setMarking(false); setMode(value); };
  const selectSpecimen = item => { learning.cancel(); setMode('2D'); choose(item); };
  return <div ref={rootRef} data-testid="microscope-lab" data-fullscreen={fullscreen} className={fullscreen ? 'fixed inset-0 z-[100] h-[100dvh] overflow-y-auto bg-lab-surface p-3 md:p-5' : 'mx-auto max-w-[1600px] px-4 py-8 md:px-6'}>
    {!fullscreen && <header className="mb-5"><p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Kính Hiển Vi Ảo</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-emerald-950">Phòng Kính Hiển Vi Tương Tác</h1><p className="mt-2 text-sm text-muted-foreground">Quan sát tiêu bản 2D hoặc khám phá vật chất di truyền trong không gian 3D.</p></header>}
    <div className={fullscreen ? 'sticky top-0 z-40 bg-lab-surface pb-2' : ''}><ModeToolbar mode={mode} onMode={changeMode} fullscreen={fullscreen} onFullscreen={toggleFullscreen} /></div>
    {fullscreen && mode === '2D' && <label className="my-3 flex items-center gap-3 text-xs text-lab-ink">Tiêu bản<select aria-label="Chọn tiêu bản" value={specimen.id} onChange={e => selectSpecimen(microscopeSpecimens.find(s => s.id === e.target.value))} className="min-w-0 rounded-lg border border-lab-edge bg-lab-panel p-2">{microscopeSpecimens.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
    <div className={`mt-4 grid items-start gap-4 ${mode === '3D' ? 'grid-cols-1' : fullscreen ? 'md:grid-cols-[minmax(0,1fr)_260px]' : 'lg:grid-cols-[minmax(0,1fr)_260px] 2xl:grid-cols-[220px_minmax(0,1fr)_260px]'}`}>
      <div className={mode === '3D' || fullscreen ? 'min-w-0' : 'min-w-0 2xl:col-start-2'}><MicroscopeWorkspace key={`${mode}-${specimen.id}-${resetKey}`} captureRef={captureRef} mode={mode} specimen={specimen} settings={settings} selected={learning.selected} onSelect={learning.select} marking={marking} markers={markers} onMark={marker => setMarkers(all => [...all, marker])} point={learning.point} analyzing={learning.analyzing} onAnalyzePoint={learning.analyze} onClose={learning.close} />{learning.error && <p role="alert" className="mt-3 rounded-lg bg-card p-3 text-sm text-destructive">{learning.error}</p>}</div>
      {mode === '2D' && <div className={`min-w-0 space-y-4 ${fullscreen ? 'md:sticky md:top-20 md:max-h-[calc(100dvh-110px)] md:overflow-y-auto' : ''}`}>
        <MicroscopeControls mode={mode} settings={settings} onChange={(key, value) => { if (key === 'magnification') { learning.close(); setResetKey(n => n + 1); } setSettings(old => ({ ...old, [key]: value })); }} onReset={reset} />
        <CaptureNotes key={`capture-${mode}-${specimen.id}-${Boolean(specimen.training)}`} captureRef={captureRef} mode={mode} specimen={specimen} settings={settings} markers={markers} marking={marking} onToggleMarking={() => setMarking(v => !v)} />
        <ChallengePanel challenge={learning.challenge} index={learning.index} total={microscopeChallenges.length} completed={learning.done} completedCount={learning.completedCount} active={learning.active} busy={learning.analyzing || !learning.ready} completionId={learning.completionId} feedback={learning.feedback} onStart={learning.start} onNext={learning.next} />
        <LabAssistant key={`assistant-${mode}-${specimen.id}-${Boolean(specimen.training)}`} specimen={specimen} structure={learning.selected} challengeHint={learning.active ? learning.challenge.hint : ''} />
      </div>}
      {!fullscreen && mode === '2D' && <div className="min-w-0 lg:col-span-2 2xl:col-span-1 2xl:col-start-1 2xl:row-start-1"><SpecimenLibrary specimens={microscopeSpecimens} selectedId={specimen.id} onSelect={selectSpecimen} /></div>}
    </div>
  </div>;
}