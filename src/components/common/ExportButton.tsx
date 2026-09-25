"use client";

import React, { useState } from "react";
import { Download, Check } from "lucide-react";
import { exportToCsv } from "@/utils/exportCsv";

interface ExportButtonProps<T extends Record<string, any>> {
  filename: string;
  data: T[];
  headers?: { key: keyof T; label: string }[];
  label?: string;
  className?: string;
}

export function ExportButton<T extends Record<string, any>>({
  filename,
  data,
  headers,
  label = "Export CSV",
  className = "",
}: ExportButtonProps<T>) {
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    exportToCsv(filename, data, headers);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs ${className}`}
    >
      {downloaded ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-emerald-700">Exported</span>
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5 text-slate-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
