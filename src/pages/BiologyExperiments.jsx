import React, { useState } from "react";
import PhotosynthesisExperiment from "@/components/experiments/PhotosynthesisExperiment";
import OsmosisExperiment from "@/components/experiments/OsmosisExperiment";
import EnzymeExperiment from "@/components/experiments/EnzymeExperiment";
import PlantGrowthExperiment from "@/components/experiments/lab/PlantGrowthExperiment";
import ExperimentFullscreen from "@/components/experiments/ExperimentFullscreen";

const experiments = [
  { id: "plant-growth", name: "Sự Phát Triển Của Cây", component: PlantGrowthExperiment },
  { id: "photosynthesis", name: "Tốc Độ Quang Hợp", component: PhotosynthesisExperiment },
  { id: "osmosis", name: "Thẩm Thấu Ở Tế Bào Khoai Tây", component: OsmosisExperiment },
  { id: "enzyme", name: "Hoạt Tính Enzyme", component: EnzymeExperiment },
];

export default function BiologyExperiments() {
  const [active, setActive] = useState(experiments[0].id);
  const selectedExperiment = experiments.find((e) => e.id === active);
  const Experiment = selectedExperiment.component;

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-6 md:py-8">
      <p className="text-lime-600 font-medium text-sm tracking-wide uppercase mb-2">🧪 Thí Nghiệm Sinh Học</p>
      <h1 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight mb-2">Phòng Mô Phỏng Sinh Học 2D</h1>
      <p className="text-slate-500 mb-6 max-w-xl">
        Thay đổi biến số, quan sát kết quả và tự rút ra kết luận — giống như trong phòng thí nghiệm thực.
      </p>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {experiments.map((e) => (
          <button
            key={e.id}
            onClick={() => setActive(e.id)}
            aria-pressed={e.id === active}
            className={`shrink-0 min-h-11 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              e.id === active ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      <ExperimentFullscreen title={selectedExperiment.name}>
        <Experiment />
      </ExperimentFullscreen>
    </div>
  );
}