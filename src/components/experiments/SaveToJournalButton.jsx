import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NotebookText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function SaveToJournalButton({ title, observation, evidence }) {
  const [saved, setSaved] = useState(null);

  const handleSave = async () => {
    const entry = await base44.entities.ObservationJournal.create({
      title,
      observation,
      evidence,
      source: "experiment",
      status: "draft",
    });
    setSaved(entry.id);
  };

  if (saved) {
    return (
      <Link to="/journal">
        <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-700">
          <Check className="w-4 h-4 mr-2" /> Đã lưu — mở Nhật Ký
        </Button>
      </Link>
    );
  }

  return (
    <Button onClick={handleSave} variant="outline" className="rounded-xl border-emerald-200 text-emerald-700">
      <NotebookText className="w-4 h-4 mr-2" /> Lưu kết quả vào Nhật Ký
    </Button>
  );
}