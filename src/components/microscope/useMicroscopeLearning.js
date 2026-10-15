import { useCallback, useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { findHotspot, microscopeChallenges, microscopeSpecimens } from '@/lib/microscopeSpecimens';
import trainingSlide from '@/components/microscope/trainingSlides';
export default function useMicroscopeLearning(specimen, choose, setMode) {
  const [selected, setSelected] = useState(null), [point, setPoint] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [index, setIndex] = useState(0), [active, setActive] = useState(false), [done, setDone] = useState(false), [feedback, setFeedback] = useState(''), [tasks, setTasks] = useState([]), [ready, setReady] = useState(false), [completionId, setCompletionId] = useState('');
  const generation = useRef(0), pending = useRef(false), challenge = microscopeChallenges[index];
  useEffect(() => { let mounted = true; base44.auth.me().then(user => base44.entities.MicroscopeTask.filter({ created_by_id: user.id }, '-created_date', 100)).then(rows => { if (mounted) { setTasks(rows); setReady(true); } }); return () => { mounted = false; generation.current++; }; }, []);
  const close = useCallback(() => { generation.current++; setPoint(null); setSelected(null); setBusy(false); setError(''); }, []);
  const cancel = () => { close(); setActive(false); setFeedback(''); setDone(false); };
  // Identification is fully deterministic: only hotspots defined for this specimen can match.
  const analyze = async tapped => {
    if (pending.current) return;
    const version = ++generation.current; setPoint(tapped); setSelected(null); setError('');
    const hotspot = findHotspot(specimen, tapped);
    if (active) {
      // Any instance of the asked structure type counts as correct.
      const target = (specimen.hotspots || []).find(h => h.id === challenge.targetId);
      const correct = hotspot && (hotspot.id === challenge.targetId || (target?.type && hotspot.type === target.type));
      if (!correct) { setFeedback(`Chưa đúng. Gợi ý: ${challenge.hint}`); return; }
      pending.current = true; setBusy(true);
      try {
        const key = `${challenge.specimenId}:${challenge.targetId}`; let task = tasks.find(t => t.challenge_id === key);
        if (!task) { task = await base44.entities.MicroscopeTask.create({ challenge_id: key, specimen_name: specimen.name, structure_id: hotspot.id }); setTasks(all => [...all, task]); }
        if (version === generation.current) { setCompletionId(task.id); setSelected(hotspot); setDone(true); setActive(false); setFeedback(`Chính xác! ${hotspot.function} ${hotspot.info}`); }
      }
      catch { setError('Chưa lưu được kết quả. Em hãy chọn lại cấu trúc để thử lại.'); }
      finally { pending.current = false; if (version === generation.current) setBusy(false); }
      return;
    }
    if (!hotspot) { setError('Chưa xác định. Hãy nhấn vào một cấu trúc có trong tiêu bản này để tìm hiểu.'); return; }
    setSelected(hotspot);
  };
  const start = () => { const target = microscopeSpecimens.find(s => s.id === challenge.specimenId); close(); choose(challenge.trainingSlide === false ? target : trainingSlide(target)); setMode('2D'); setActive(true); setDone(false); setFeedback('Quan sát và chọn trực tiếp trên tiêu bản.'); };
  const next = () => { close(); setIndex(i => (i + 1) % microscopeChallenges.length); setDone(false); setActive(false); setFeedback(''); };
  return { selected, point, analyzing: busy, error, close, cancel, analyze, select: setSelected, challenge, index, active, done, feedback, start, next, ready, completionId, completedCount: new Set(tasks.map(t => t.challenge_id)).size };
}