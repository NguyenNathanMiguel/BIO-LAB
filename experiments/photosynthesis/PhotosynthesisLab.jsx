import React, { useEffect } from 'react';
import PhotoScene from '@/components/experiments/photosynthesis/PhotoScene';
import PhotoTray from '@/components/experiments/photosynthesis/PhotoTray';
import PhotoControls from '@/components/experiments/photosynthesis/PhotoControls';
import PhotoGasChart from '@/components/experiments/photosynthesis/PhotoGasChart';
import SimulationRecords from '@/components/experiments/SimulationRecords';
import usePhotoLab from '@/components/experiments/photosynthesis/usePhotoLab';
import usePhotoDrag from '@/components/experiments/photosynthesis/usePhotoDrag';
import '@/components/experiments/photosynthesis/photosynthesis.css';

export default function PhotosynthesisLab({ light, co2, onMeasurements }) {
  const lab = usePhotoLab(light, co2), drag = usePhotoDrag(lab.drop, lab.hover);
  useEffect(() => { onMeasurements(lab.records); }, [lab.records, onMeasurements]);
  return <section className="photo-lab" aria-label="Phòng thí nghiệm quang hợp kéo thả" {...drag.handlers}>
    <div className="px-4 pt-4 pb-3"><p className="text-xs uppercase tracking-widest opacity-70">Giai đoạn {lab.state.stage} / {lab.state.stage === 1 ? 'Lắp dụng cụ & thu khí' : 'Thử khí bằng que diêm'}</p><h4 className="mt-1 font-semibold">Một nhánh rong. Những bọt khí.</h4><p className="mt-1 text-xs leading-relaxed opacity-75">Kéo nhiều dụng cụ vào bàn, lật ống nghiệm đầy nước rồi úp kín lên cuống phễu. Khi đã thu khí, kéo ống sang giá để thử oxy.</p></div>
    <PhotoScene state={lab.state} light={light} co2={co2} drag={drag} onRotate={lab.rotate} /><PhotoTray state={lab.state} drag={drag} /><PhotoControls lab={lab} drag={drag} />
    <div className="px-4 pb-4"><p className="text-xs opacity-70">Quy ước mô phỏng: 1 bọt ≈ 0,05 mL. Các chấm li ti trong nước minh họa CO₂ hòa tan, không phải số đo thực tế.</p><SimulationRecords records={lab.records} onClear={lab.clearRecords} /><PhotoGasChart records={lab.records} /></div>
  </section>;
}