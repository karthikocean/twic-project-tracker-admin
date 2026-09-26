import React from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  stepNumber?: number;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  stepNumber,
  badge,
  children,
  className = "",
}: FormSectionProps) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/90 p-5 md:p-6 shadow-2xs ${className}`}>
      <div className="flex items-start justify-between pb-3.5 mb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          {stepNumber !== undefined && (
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold shrink-0 mt-0.5">
              {stepNumber}
            </span>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h4>
            {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
          </div>
        </div>
        {badge && (
          <span className="px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-md">
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}
