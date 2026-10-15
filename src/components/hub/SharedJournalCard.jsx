import React, { useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import JournalCaptureImage from "@/components/journal/JournalCaptureImage";
import StarRating from "@/components/hub/StarRating";
import CommentSection from "@/components/hub/CommentSection";

export default function SharedJournalCard({ entry, ratings, myRating, user, onRate }) {
  const [open, setOpen] = useState(false);
  const isOwner = entry.created_by_id === user.id;
  const avg = ratings.length ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length).toFixed(1) : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-4">
        {entry.image_file_uri && <JournalCaptureImage entry={entry} />}
        {!entry.image_file_uri && entry.image_url && (
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl"><Image src={entry.image_url} alt={entry.title} className="h-full w-full" /></div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-[#0F2A20]">{entry.title}</p>
          <p className="text-xs text-slate-400">{entry.author_name || "Người dùng"} · {format(new Date(entry.shared_date || entry.created_date), "dd/MM/yyyy HH:mm")}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StarRating value={myRating?.stars || 0} onRate={isOwner ? null : (n) => onRate(entry, n)} />
            <span className="text-xs text-slate-500">{avg ? `${avg} ★ · ${ratings.length} đánh giá` : "Chưa có đánh giá"}</span>
            {isOwner && <span className="text-[11px] text-emerald-600">Nhật ký của bạn</span>}
          </div>
        </div>
        <button onClick={() => setOpen(!open)} aria-label="Xem chi tiết" className="flex items-center gap-1 text-slate-400">
          <MessageCircle className="h-4 w-4" />{open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="space-y-3 px-4 pb-4 text-sm">
          {entry.image_file_uri && <JournalCaptureImage entry={entry} expanded />}
          <Row label="Quan Sát" value={entry.observation} />
          <Row label="Bằng Chứng" value={entry.evidence} />
          <Row label="Giả Thuyết" value={entry.hypothesis} />
          <Row label="Kết Luận" value={entry.conclusion} />
          <CommentSection journalId={entry.id} user={user} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return <div><p className="mb-0.5 text-xs font-medium text-slate-400">{label}</p><p className="whitespace-pre-line text-slate-600">{value}</p></div>;
}