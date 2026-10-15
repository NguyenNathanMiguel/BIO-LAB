import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import JournalForm from "@/components/journal/JournalForm";
import JournalEntryCard from "@/components/journal/JournalEntryCard";

export default function ObservationJournal() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const user = await base44.auth.me().catch(() => null);
    if (!user) return;
    const items = await base44.entities.ObservationJournal.filter({ created_by_id: user.id }, "-created_date", 50);
    setEntries(items);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleShare = async (entry) => {
    const user = await base44.auth.me();
    const data = entry.is_shared
      ? { is_shared: false }
      : { is_shared: true, author_name: user.full_name || user.email, shared_date: new Date().toISOString() };
    await base44.entities.ObservationJournal.update(entry.id, data);
    setEntries((prev) => prev.map((e) => (e.id === entry.id ? { ...e, ...data } : e)));
  };

  const handleDelete = async (id) => {
    await base44.entities.ObservationJournal.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 md:py-14">
      <p className="text-amber-600 font-medium text-sm tracking-wide uppercase mb-2">📓 Nhật Ký Quan Sát</p>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#0F2A20] tracking-tight mb-1">Nhật Ký Của Bạn</h1>
          <p className="text-slate-500">Quan Sát → Bằng Chứng → Giả Thuyết → Phân Tích AI → Kết Luận</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl shrink-0">
            <Plus className="w-4 h-4 mr-1.5" /> Ghi Mới
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <JournalForm onSaved={() => { setShowForm(false); load(); }} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {!loading && entries.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-400 text-sm">Chưa có ghi chú nào — hãy bắt đầu quan sát đầu tiên của bạn.</div>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <JournalEntryCard key={entry.id} entry={entry} onDelete={handleDelete} onShare={handleShare} />
        ))}
      </div>
    </div>
  );
}