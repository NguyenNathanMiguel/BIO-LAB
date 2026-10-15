import React, { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, onRate, disabled, size = "h-5 w-5" }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled || !onRate}
          aria-label={`${n} sao`}
          onMouseEnter={() => onRate && !disabled && setHover(n)}
          onClick={() => onRate && onRate(n)}
          className={onRate && !disabled ? "cursor-pointer" : "cursor-default"}
        >
          <Star className={`${size} ${n <= shown ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
        </button>
      ))}
    </div>
  );
}