import React from "react";
import Microscope2D from "@/components/microscope/Microscope2D";
import GeneticExplorer from "@/components/genetics/GeneticExplorer";

export default function MicroscopeWorkspace(props) {
  if (props.mode === '3D') return <GeneticExplorer />;
  return <section className="rounded-3xl border border-lab-edge bg-lab-panel p-3 shadow-xl md:p-5"><div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-lab-glow">{props.specimen.training ? 'Tiêu bản luyện tập mô phỏng' : 'Tiêu bản đang quan sát'}</p><h2 className="mt-1 text-lg font-bold text-lab-ink">{props.specimen.name}</h2></div><span className="rounded-full border border-lab-edge px-3 py-1 text-xs font-semibold text-lab-glow">{props.settings.magnification}×</span></div><Microscope2D key={props.settings.magnification} {...props} /></section>;
}