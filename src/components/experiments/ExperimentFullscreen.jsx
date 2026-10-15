import React, { useEffect, useState } from "react";

export default function ExperimentFullscreen({ title, children }) {
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    if (!fullscreen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("biology-fullscreen");
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("biology-fullscreen");
    };
  }, [fullscreen]);

  return (
    <div className={fullscreen ? "fixed inset-0 z-[100] overflow-y-auto bg-[var(--sim-bg)] p-3 sm:p-5" : "relative"}>
      <div className={fullscreen ? "mx-auto max-w-[1800px]" : ""}>
        <div className={`flex items-center justify-between gap-3 ${fullscreen ? "mb-3 text-[var(--sim-paper)]" : "mb-3"}`}>
          {fullscreen && <h2 className="text-lg font-semibold">{title}</h2>}
          <button type="button" onClick={() => setFullscreen(value => !value)} className="ml-auto min-h-11 rounded-xl border border-emerald-600 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
            {fullscreen ? "Thoát toàn màn hình" : "⛶ TOÀN MÀN HÌNH"}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}