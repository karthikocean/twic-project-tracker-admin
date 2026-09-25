import React from "react";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className = "" }: StatusBadgeProps) {
  const normalized = (status || "").toLowerCase().trim();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";

  // Green / Success
  if (
    [
      "approved",
      "completed",
      "paid",
      "running",
      "active",
      "converted",
      "technically qualified",
      "awarded",
      "passed",
    ].includes(normalized)
  ) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium";
  }
  // Amber / Warning / In Progress
  else if (
    [
      "in progress",
      "under review",
      "under verification",
      "pending",
      "submitted",
      "applications open",
      "partially paid",
      "commercially evaluated",
      "issued",
      "reviewed",
    ].includes(normalized)
  ) {
    styles = "bg-amber-50 text-amber-700 border-amber-200 font-medium";
  }
  // Red / Destructive
  else if (
    [
      "delayed",
      "rejected",
      "overdue",
      "disqualified",
      "stopped",
      "cancelled",
      "failed",
      "blacklisted",
    ].includes(normalized)
  ) {
    styles = "bg-rose-50 text-rose-700 border-rose-200 font-medium";
  }
  // Orange / Blue / Neutral
  else if (["maintenance", "returned", "on hold", "applications closed"].includes(normalized)) {
    styles = "bg-orange-50 text-orange-700 border-orange-200 font-medium";
  } else if (["published", "draft", "not started"].includes(normalized)) {
    styles = "bg-blue-50 text-blue-700 border-blue-200 font-medium";
  }

  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs font-medium" : "px-2.5 py-1 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles} ${sizeClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
}
