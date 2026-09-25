import React from "react";

interface ProgressBarProps {
  progress: number;
  planned?: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  progress,
  planned,
  showText = true,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  let barColor = "bg-blue-600";
  if (clamped >= 100) {
    barColor = "bg-emerald-600";
  } else if (planned !== undefined && clamped < planned - 10) {
    barColor = "bg-rose-500";
  } else if (clamped > 50) {
    barColor = "bg-blue-600";
  } else {
    barColor = "bg-sky-500";
  }

  const heightClass = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  const variance = planned !== undefined ? clamped - planned : 0;

  return (
    <div className={`w-full ${className}`}>
      {showText && (
        <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
          <span className="font-semibold text-slate-800">{clamped}%</span>
          {planned !== undefined && (
            <span className="text-[11px] text-slate-500">
              Planned: {planned}%{" "}
              {variance < 0 ? (
                <span className="text-rose-600 font-medium">({variance}%)</span>
              ) : variance > 0 ? (
                <span className="text-emerald-600 font-medium">(+{variance}%)</span>
              ) : (
                <span className="text-slate-400">(0%)</span>
              )}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${barColor} ${heightClass} rounded-full transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
