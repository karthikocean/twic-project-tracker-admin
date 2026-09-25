"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, X, Eye } from "lucide-react";

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

interface FileUploadProps {
  label?: string;
  description?: string;
  accept?: string;
  maxFiles?: number;
  onFilesChange?: (files: UploadedFileItem[]) => void;
  className?: string;
}

export function FileUpload({
  label = "Upload Documents",
  description = "PDF, DOCX, ZIP or DWG up to 25MB",
  accept = ".pdf,.docx,.zip,.dwg,.xlsx",
  maxFiles = 5,
  onFilesChange,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const simulateUpload = (newFile: File) => {
    const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const sizeInMb = (newFile.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMb} MB`;

    const item: UploadedFileItem = {
      id,
      name: newFile.name,
      size: sizeStr,
      type: newFile.type || "application/octet-stream",
      progress: 10,
      status: "uploading",
    };

    setFiles((prev) => {
      const updated = [...prev, item];
      onFilesChange?.(updated);
      return updated;
    });

    // Simulate upload ticks
    let currentProgress = 10;
    const interval = setInterval(() => {
      currentProgress += 30;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === id ? { ...f, progress: 100, status: "success" as const } : f
          );
          onFilesChange?.(updated);
          return updated;
        });
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress: currentProgress } : f))
        );
      }
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach((f) => simulateUpload(f));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((f) => simulateUpload(f));
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesChange?.(updated);
      return updated;
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-700">{label}</label>}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
          <p className="text-xs font-medium text-slate-700">
            <span className="text-blue-600 font-semibold underline">Click to upload</span> or drag
            and drop files
          </p>
          <p className="text-[11px] text-slate-400 mt-1">{description}</p>
        </div>
      </div>

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md text-xs"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-3">
                <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">{file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                    <span>{file.size}</span>
                    <span>•</span>
                    {file.status === "uploading" ? (
                      <span className="text-blue-600">Uploading {file.progress}%</span>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Ready
                      </span>
                    )}
                  </div>
                  {file.status === "uploading" && (
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all duration-150"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {file.status === "success" && (
                  <button
                    type="button"
                    onClick={() => setPreviewFile(file.name)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    title="Preview file details"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Remove file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Simulated Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-sm w-full text-center shadow-xl">
            <FileText className="h-10 w-10 text-blue-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-900 truncate">{previewFile}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Document verification verified. Stored in simulated secure repository.
            </p>
            <button
              type="button"
              onClick={() => setPreviewFile(null)}
              className="mt-5 w-full py-1.5 px-3 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
