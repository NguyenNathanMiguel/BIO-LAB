import React from "react";
import { Image } from "@/components/ui/image";

export default function SpecimenLibrary({ specimens, selectedId, onSelect }) {
  return (
    <section className="rounded-2xl border border-emerald-900/10 bg-white p-3">
      <h2 className="mb-3 text-sm font-semibold text-emerald-950">Thư viện tiêu bản</h2>
      <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 xl:max-h-[650px] xl:grid-cols-1">
        {specimens.map((item) => (
          <button key={item.id} onClick={() => onSelect(item)} className={`flex items-center gap-3 rounded-xl border p-2 text-left transition ${selectedId === item.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-300"}`}>
            <Image src={item.image} alt={item.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-emerald-950">{item.name}</span>
              <span className="block text-[11px] text-slate-500">{item.description}</span>
              <span className="block text-[10px] text-slate-500">Cần nhận diện: {item.hotspots.map(h => h.label).join(', ')}</span>
              <span className="text-[10px] font-medium text-emerald-600">Khuyên dùng {item.recommended}×</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}