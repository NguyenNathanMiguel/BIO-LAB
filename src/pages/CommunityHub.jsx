import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SharedJournalCard from "@/components/hub/SharedJournalCard";

export default function CommunityHub() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      const [items, all] = await Promise.all([
        base44.entities.ObservationJournal.filter({ is_shared: true }, "-shared_date", 200),
        base44.entities.JournalRating.list("-created_date", 2000),
      ]);
      setUser(me);
      setEntries(items);
      setRatings(all);
      setLoading(false);
    })();
  }, []);

  const rate = async (entry, stars) => {
    const existing = ratings.find((r) => r.journal_id === entry.id && r.created_by_id === user.id);
    if (existing) {
      await base44.entities.JournalRating.update(existing.id, { stars });
      setRatings((prev) => prev.map((r) => (r.id === existing.id ? { ...r, stars } : r)));
    } else {
      const created = await base44.entities.JournalRating.create({ journal_id: entry.id, journal_owner_id: entry.created_by_id, stars });
      setRatings((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-teal-700">Cộng Đồng</p>
      <h1 className="text-2xl font-semibold tracking-tight text-[#0F2A20] md:text-3xl">Hub Chia Sẻ Nhật Ký</h1>
      <p className="mb-6 mt-1 text-slate-500">Xem nhật ký quan sát của bạn học, đánh giá sao và để lại bình luận.</p>
      {loading && <p className="py-10 text-center text-sm text-slate-400">Đang tải…</p>}
      {!loading && entries.length === 0 && <p className="py-16 text-center text-sm text-slate-400">Chưa có nhật ký nào được chia sẻ. Hãy là người đầu tiên!</p>}
      <div className="space-y-3">
        {entries.map((entry) => (
          <SharedJournalCard
            key={entry.id}
            entry={entry}
            user={user}
            ratings={ratings.filter((r) => r.journal_id === entry.id)}
            myRating={ratings.find((r) => r.journal_id === entry.id && r.created_by_id === user.id)}
            onRate={rate}
          />
        ))}
      </div>
    </div>
  );
}