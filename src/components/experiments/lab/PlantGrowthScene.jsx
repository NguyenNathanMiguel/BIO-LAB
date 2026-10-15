import React from "react";
import LabDefinitions from "@/components/experiments/lab/LabDefinitions";
import PlantArtwork from "@/components/experiments/lab/PlantArtwork";
import LabEquipment from "@/components/experiments/lab/LabEquipment";
import LabLamp from "@/components/experiments/lab/LabLamp";
import PlantEquipmentTray from "@/components/experiments/lab/PlantEquipmentTray";
import usePlantEquipmentDrag from "@/components/experiments/lab/usePlantEquipmentDrag";

export default function PlantGrowthScene({ state, variables, running, onChange }) {
  const drag = usePlantEquipmentDrag(), hue = 123-(100-state.health)/100*62-Math.max(0,(35-variables.nutrients)/35)*23;
  const leafPalette = { "--leaf-bright": `hsl(${hue} 58% 53%)`, "--leaf-main": `hsl(${hue} 46% 35%)`, "--leaf-dark": `hsl(${hue} 48% 20%)` };
  const plant = drag.items.plant;
  return <div className="lab-scene" data-testid="growth-scene" {...drag.handlers}>
    <div className="lab-scene-caption"><span>CÂY TRONG MÔI TRƯỜNG KIỂM SOÁT</span><span data-testid="lab-day">Ngày {state.day.toFixed(1)}</span></div><PlantEquipmentTray drag={drag}/>
    <svg ref={drag.svgRef} viewBox="0 0 680 480" style={leafPalette} className="block w-full touch-none" aria-label="Bàn thí nghiệm cây với dụng cụ kéo thả">
      <LabDefinitions/><rect width="680" height="480" fill="url(#lab-wall)"/><rect width="680" height="400" fill="url(#lab-grid)"/><rect y="436" width="680" height="44" fill="var(--sim-metal)" opacity=".15"/>
      <LabLamp value={variables.light} onChange={onChange}/>
      {plant.visible && <g transform={`translate(${plant.x} ${plant.y})`} className="lab-draggable-tool" onPointerDown={event => drag.start(event,"plant")} style={{filter:drag.selected==="plant"?"drop-shadow(0 8px 6px rgb(0 0 0 / .22))":"none"}}><rect x="250" y="70" width="180" height="380" fill="transparent"/><g clipPath="url(#lab-pot)"><path d="M278 321Q337 309 402 321V434H278Z" fill="url(#lab-soil)"/><rect x="280" y={429-state.moisture*.55} width="120" height={state.moisture*.55} fill="var(--sim-water)" opacity=".16"/></g><PlantArtwork state={state} variables={variables} running={running}/><path d="M279 307L289 422Q340 444 391 422L401 307Z" fill="url(#lab-glass)" stroke="var(--sim-metal)" strokeWidth="2"/></g>}
      <LabEquipment state={state} variables={variables} drag={drag}/><text x="340" y="463" textAnchor="middle" fill="var(--sim-ink)" fontSize="12">Độ ẩm đất: {state.moisture.toFixed(1)}% · Rễ: {state.roots.toFixed(1)} cm</text>
    </svg>
    <div className="flex items-center justify-between gap-2 px-4 py-3"><p className="lab-muted text-xs">Kéo dụng cụ để bố trí; kéo ra ngoài bàn để trả về khay. Vị trí đèn điều chỉnh ánh sáng hiệu dụng.</p><button type="button" className="lab-btn" onClick={drag.reset}>Đặt lại dụng cụ</button></div>
  </div>;
}