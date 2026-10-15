import React from "react";
import { Image } from "@/components/ui/image";

export default function LearningCycle() {
  return (
    <section aria-label="Vòng tuần hoàn học tập" className="mx-auto mt-10 max-w-6xl px-6 pb-12 md:pb-16">
      <Image
        src="https://media.base44.com/images/public/6aabb82352d885cecdb66e2a/8e284caec_image.png"
        alt="Vòng tuần hoàn học tập gồm sáu bước: Quan sát, Phân tích, Giả thuyết, Thí nghiệm, Hiểu và Ghi chép"
        fittingType="fit"
        originWidth={1024}
        originHeight={745}
        className="h-auto w-full rounded-3xl shadow-sm"
      />
    </section>
  );
}