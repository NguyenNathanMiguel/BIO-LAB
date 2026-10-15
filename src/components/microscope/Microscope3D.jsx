import React, { useCallback, useRef, useState } from "react";
import usePlantCellScene from "@/hooks/usePlantCellScene";
import StructureCard from "@/components/microscope/StructureCard";
import StageNavigation from '@/components/microscope/StageNavigation';

const structures = [
  { id: "cell-wall", name: "Vách tế bào", function: "Nâng đỡ và bảo vệ tế bào.", info: "Lớp cellulose cứng tạo hình dạng ổn định." },
  { id: "cell-membrane", name: "Màng tế bào", function: "Kiểm soát chất ra vào tế bào.", info: "Màng có tính thấm chọn lọc." },
  { id: "nucleus", name: "Nhân tế bào", function: "Chứa DNA và điều khiển hoạt động tế bào.", info: "Trung tâm lưu trữ thông tin di truyền." },
  { id: "chloroplast", name: "Lục lạp", function: "Thực hiện quang hợp.", info: "Diệp lục hấp thụ năng lượng ánh sáng." },
  { id: "vacuole", name: "Không bào", function: "Dự trữ và duy trì sức trương.", info: "Chiếm phần lớn thể tích tế bào trưởng thành." },
  { id: "cytoplasm", name: "Tế bào chất", function: "Môi trường cho các phản ứng chuyển hóa.", info: "Chứa bào quan và hệ enzyme." }
];
export default function Microscope3D({ onStructure, captureRef }) {
  const host = useRef(null), [selected, setSelected] = useState(null), [hidden, setHidden] = useState([]), [isolated, setIsolated] = useState(null), [navigation, setNavigation] = useState('rotate');
  const select = useCallback(id => { const item = structures.find(s => s.id === id); setSelected(item); onStructure(item); }, [onStructure]);
  usePlantCellScene(host, select, hidden, isolated, selected?.id, captureRef);
  return <div>
    <div className="relative h-[420px] overflow-hidden rounded-2xl border border-lab-edge bg-lab-surface sm:h-[520px]"><div ref={host} className="h-full w-full" /><p className="pointer-events-none absolute left-3 top-3 right-3 text-xs text-lab-muted">Kéo: {navigation === 'pan' ? 'dịch' : 'xoay 360°'} · Cuộn hoặc chụm hai ngón: thu phóng</p></div>
    <div className="mt-3 flex justify-center gap-2">{[['rotate', 'Xoay'], ['pan', 'Dịch']].map(([value, label]) => <button key={value} aria-pressed={navigation === value} onClick={() => { setNavigation(value); captureRef.current.navigation(value); }} className={`rounded-lg border px-4 py-2 text-xs ${navigation === value ? 'border-lab-glow text-lab-glow' : 'border-lab-edge text-lab-muted'}`}>{label}</button>)}</div>
    <StageNavigation zoom={factor => captureRef.current.zoom(factor)} pan={(x, y) => captureRef.current.pan(x, y)} />
    <StructureCard structure={selected} onClose={() => { setSelected(null); onStructure(null); }} />
    <aside className="mt-4 text-lab-ink"><h3 className="mb-3 text-sm font-semibold">Các lớp tế bào</h3><div className="grid gap-2 sm:grid-cols-2">{structures.map(item => <div key={item.id} className="rounded-xl border border-lab-edge bg-lab-surface p-3"><button onClick={() => select(item.id)} className={`w-full text-left text-xs font-semibold ${selected?.id === item.id ? 'text-lab-glow' : 'text-lab-ink'}`}>{item.name}</button><div className="mt-2 flex gap-2"><button aria-label={`${hidden.includes(item.id) ? 'Hiện' : 'Ẩn'} ${item.name}`} onClick={() => setHidden(list => list.includes(item.id) ? list.filter(id => id !== item.id) : [...list, item.id])} className="rounded border border-lab-edge px-2 py-1 text-[11px] text-lab-muted">{hidden.includes(item.id) ? 'Hiện' : 'Ẩn'}</button><button aria-label={`${isolated === item.id ? 'Bỏ cô lập' : 'Cô lập'} ${item.name}`} onClick={() => { setHidden(list => list.filter(id => id !== item.id)); setIsolated(isolated === item.id ? null : item.id); select(item.id); }} className="rounded border border-lab-edge px-2 py-1 text-[11px] text-lab-glow">{isolated === item.id ? 'Hiện tất cả' : 'Cô lập'}</button></div></div>)}</div></aside>
  </div>;
}