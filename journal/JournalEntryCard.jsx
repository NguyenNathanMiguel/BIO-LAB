import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Share2, Globe } from "lucide-react";
import { Image } from "@/components/ui/image";
import { format } from "date-fns";
import JournalCaptureImage from '@/components/journal/JournalCaptureImage';

const statusColor = { draft: "bg-slate-100 text-slate-500", ai_reviewed: "bg-blue-50 text-blue-600", completed: "bg-emerald-50 text-emerald-600" };
const statusLabel = { draft: "bản nháp", ai_reviewed: "đã có AI nhận xét", completed: "hoàn thành" };

export default function JournalEntryCard({ entry, onDelete, onShare, showStudent }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-4 text-left">
        {entry.image_file_uri && <JournalCaptureImage entry={entry} />}
        {!entry.image_file_uri && entry.image_url && (
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
            <Image src={entry.image_url} alt={entry.title} className="w-full h-full" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#0F2A20] text-sm truncate">{entry.title}</p>
          <p className="text-xs text-slate-400">
            {showStudent && entry.created_by_id ? `Học sinh · ` : ""}{format(new Date(entry.created_date), "dd/MM/yyyy HH:mm")}
            {entry.is_shared && <span className="ml-2 inline-flex items-center gap-1 text-emerald-600"><Globe className="h-3 w-3" /> đã chia sẻ</span>}
          </p>
        </div>
        <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${statusColor[entry.status] || statusColor.draft}`}>
          {statusLabel[entry.status] || statusLabel.draft}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 text-sm">
          {entry.image_file_uri && <JournalCaptureImage entry={entry} expanded />}
          <Row label="Quan Sát" value={entry.observation} />
          <Row label="Bằng Chứng" value={entry.evidence} />
          <Row label="Giả Thuyết" value={entry.hypothesis} />
          {entry.ai_analysis && <Row label="Phân Tích AI" value={entry.ai_analysis} highlight />}
          <Row label="Kết Luận" value={entry.conclusion} />
          {(onDelete || onShare) && (
            <div className="flex flex-wrap items-center gap-4 pt-1">
              {onShare && (
                <button onClick={() => onShare(entry)} className="flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700">
                  <Share2 className="w-3.5 h-3.5" /> {entry.is_shared ? "Ngừng chia sẻ" : "Chia sẻ lên Hub"}
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(entry.id)} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" /> Xóa ghi chú
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 mb-0.5">{label}</p>
      <p className={`whitespace-pre-line ${highlight ? "text-emerald-700 bg-emerald-50 rounded-lg p-2.5" : "text-slate-600"}`}>{value}</p>
    </div>
  );
}