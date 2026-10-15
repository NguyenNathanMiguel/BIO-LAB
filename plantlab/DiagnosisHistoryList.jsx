import React from "react";
import { Image } from "@/components/ui/image";

export default function DiagnosisHistoryList({ items, onSelect }) {
  if (!items?.length) return null;
  return (
    <div className="mt-10">
      <h3 className="text-sm font-medium text-slate-500 mb-3">Lịch Sử Chẩn Đoán Của Bạn</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="shrink-0 w-24 rounded-2xl overflow-hidden border border-slate-100 hover:border-emerald-300 transition-colors"
          >
            <Image src={item.image_url} alt="Past diagnosis" className="w-24 h-24" />
          </button>
        ))}
      </div>
    </div>
  );
}