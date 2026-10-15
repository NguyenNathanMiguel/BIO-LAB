import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function CommentSection({ journalId, user }) {
  const [comments, setComments] = useState(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.JournalComment.filter({ journal_id: journalId }, "created_date", 100).then(setComments);
  }, [journalId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    const created = await base44.entities.JournalComment.create({ journal_id: journalId, content: text.trim(), author_name: user.full_name || user.email });
    setComments((prev) => [...(prev || []), created]);
    setText("");
    setSaving(false);
  };

  return (
    <div className="rounded-xl bg-[#F6F8F4] p-3">
      <p className="mb-2 text-xs font-medium text-slate-500">Bình luận {comments ? `(${comments.length})` : ""}</p>
      {comments === null && <p className="text-xs text-slate-400">Đang tải…</p>}
      {comments?.length === 0 && <p className="text-xs text-slate-400">Chưa có bình luận nào.</p>}
      <div className="space-y-2">
        {comments?.map((c) => (
          <div key={c.id} className="rounded-lg bg-white p-2.5 text-sm">
            <p className="text-xs text-slate-400"><span className="font-medium text-[#0F2A20]">{c.author_name || "Người dùng"}</span> · {format(new Date(c.created_date), "dd/MM/yyyy HH:mm")}</p>
            <p className="mt-0.5 whitespace-pre-line text-slate-600">{c.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Viết bình luận…" className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" />
        <Button type="submit" size="sm" disabled={saving || !text.trim()} className="rounded-lg bg-emerald-600 hover:bg-emerald-700"><Send className="h-4 w-4" /></Button>
      </form>
    </div>
  );
}