import React from "react";
import LearningCycle from "@/components/dashboard/LearningCycle";
import FeatureVideoGrid from "@/components/dashboard/FeatureVideoGrid";

export default function Dashboard() {
  return (
    <div className="relative isolate">
      {/* Subtle page-wide background video, only on the home page. */}
      <video
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full object-cover opacity-40"
        src="https://media.base44.com/videos/public/6aabb82352d885cecdb66e2a/01dbc7496_cosmos_1082992569.mp4"
        autoPlay muted loop playsInline aria-hidden="true"
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#F6F8F4]/80" />
      <div className="relative isolate overflow-hidden">
        {/* Lab experiment video in the BIO-LAB hero. */}
        <video
          className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
          src="https://media.base44.com/videos/public/6aabb82352d885cecdb66e2a/f72164de6_197486-905015022_medium.mp4"
          autoPlay muted loop playsInline aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[#F6F8F4]/80" />
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="min-w-0 flex-1 w-full">
          <p className="text-foreground font-medium text-sm tracking-wide uppercase mb-2">Chào mừng đến phòng thí nghiệm</p>
          <h1 className="text-5xl md:text-7xl font-extrabold text-emerald-800 tracking-tight">BIO-LAB</h1>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
            Quan Sát. Phân Tích. Thí Nghiệm. Hiểu Biết.
          </h2>
          <p className="text-foreground mt-3 max-w-xl">
            Một phòng thí nghiệm Sinh học số dành cho học sinh Lớp 10–12 — khám phá thực vật, tế bào và các thí
            nghiệm cùng một trợ lý AI đặt câu hỏi gợi mở thay vì đưa ra đáp án.
          </p>
          </div>
          <img src="https://media.base44.com/images/public/6aae26965c22f8ce890f0526/925916732_Gemini_Generated_Image_jxi2q4jxi2q4jxi2-removebg-preview.png" alt="Minh họa kính hiển vi BIO-LAB" className="w-56 md:w-[22rem] lg:w-[26rem] shrink-0 object-contain" />
        </div>
      </div>

      <FeatureVideoGrid />

      <LearningCycle />
    </div>
  );
}