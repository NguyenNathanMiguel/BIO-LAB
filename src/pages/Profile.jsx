import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { computeLevel } from "@/lib/userLevel";
import ProfileHeader from "@/components/profile/ProfileHeader";
import LevelBadge from "@/components/profile/LevelBadge";
import JournalEntryCard from "@/components/journal/JournalEntryCard";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me();
      const [items, ratings] = await Promise.all([
        base44.entities.ObservationJournal.filter({ created_by_id: me.id }, "-created_date", 200),
        base44.entities.JournalRating.filter({ journal_owner_id: me.id }, "-created_date", 1000),
      ]);
      setUser(me);
      setEntries(items);
      setStars(ratings.reduce((sum, r) => sum + (r.stars || 0), 0));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-10 text-center text-sm text-slate-400">Đang tải hồ sơ…</div>;

  const level = computeLevel(entries.length, stars);
  const stats = { journals: entries.length, shared: entries.filter((e) => e.is_shared).length, stars };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-6 py-10 md:py-14">
      <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">Hồ Sơ Của Tôi</p>
      <ProfileHeader user={user} stats={stats} />
      <LevelBadge level={level} />
      <div>
        <h2 className="mb-3 text-lg font-semibold text-[#0F2A20]">Nhật ký đã lưu ({entries.length})</h2>
        {entries.length === 0 && <p className="py-10 text-center text-sm text-slate-400">Bạn chưa có nhật ký nào.</p>}
        <div className="space-y-3">
          {entries.map((entry) => <JournalEntryCard key={entry.id} entry={entry} />)}
        </div>
      </div>
    </div>
  );
}