import React, { useState } from 'react';
import { Sprout } from 'lucide-react';
import useLabEngine from '@/components/experiments/lab/useLabEngine';
import LabControls from '@/components/experiments/lab/LabControls';
import LabMeasurements from '@/components/experiments/lab/LabMeasurements';
import LabGraph from '@/components/experiments/lab/LabGraph';
import LabComparison from '@/components/experiments/lab/LabComparison';
import LabObservation from '@/components/experiments/lab/LabObservation';
import '@/components/experiments/lab/lab.css';
const emptyNotes = { observation: '', hypothesis: '', conclusion: '' };
export default function SimulationLab({ definition, Scene }) {
  const lab = useLabEngine(definition), [runs, setRuns] = useState([]), [notes, setNotes] = useState(emptyNotes);
  const [name, setName] = useState('Thử nghiệm A'), [version, setVersion] = useState(0);
  const fresh = (clearAll = false) => {
    lab.reset(); setNotes({ ...emptyNotes }); setVersion(v => v + 1);
    setName(`Thử nghiệm ${String.fromCharCode(65 + (clearAll ? 0 : runs.length))}`);
    if (clearAll) setRuns([]);
  };
  const capture = () => {
    if (lab.state.day === 0 || runs.length >= 4 || !name.trim()) return;
    setRuns([...runs, { ...lab.capture(name.trim()), id: crypto.randomUUID() }]);
  };
  return <div className="biology-lab space-y-4" data-testid="biology-lab">
    <header className="flex gap-3 items-start pb-1"><span className="lab-status !border-0 !p-0 mt-1"><Sprout size={28} /></span><div>
      <p className="lab-muted text-xs tracking-widest uppercase mb-1">BIOLOGY SIMULATION LAB · 01</p><h2 className="text-xl md:text-2xl font-semibold leading-snug">{definition.title}</h2>
      <p className="lab-muted text-sm mt-2">Điều chỉnh → Chạy → Quan sát → Đo lường → So sánh → Kết luận</p>
    </div></header>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <Scene key={`scene-${version}`} state={lab.state} variables={lab.variables} running={lab.running} onChange={lab.change} />
      <LabControls definition={definition} lab={lab} onReset={() => fresh(true)} />
    </div>
    <LabMeasurements definition={definition} state={lab.state} />
    <LabGraph key={`graph-${version}`} definition={definition} history={lab.history} />
    <LabComparison key={`compare-${version}`} definition={definition} lab={lab} runs={runs} name={name} setName={setName} onCapture={capture} onNew={() => fresh()} onRemove={id => setRuns(r => r.filter(run => run.id !== id))} />
    <LabObservation key={`notes-${version}`} definition={definition} lab={lab} notes={notes} setNotes={setNotes} runs={runs} name={name} />
    <p className="lab-muted text-xs leading-relaxed px-1">Mô hình giáo dục xác định, không dùng ngẫu nhiên; cùng điều kiện ban đầu và cùng lịch thay đổi sẽ cho cùng kết quả. Các thang % là mức tương đối, không đại diện cho mọi loài cây và không dùng để dự báo hoặc tư vấn nông nghiệp. Mỗi lần điều chỉnh chỉ tác động đến phát triển kể từ thời điểm đó; nước cũng làm thay đổi ngay độ ẩm đất.</p>
  </div>;
}