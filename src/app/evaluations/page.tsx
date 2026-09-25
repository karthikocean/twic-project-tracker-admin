"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  DollarSign,
  Building2,
  Check,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { getEvaluations, updateEvaluation } from "@/services/evaluationService";
import { Evaluation, EvaluationStatus } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: "Approve" | "Reject" | "Return";
    title: string;
    message: string;
  }>({ open: false, action: "Approve", title: "", message: "" });

  useEffect(() => {
    getEvaluations().then((data) => {
      setEvaluations(data);
      if (data.length > 0) {
        setSelectedEval(data[0]);
        setRemarks(data[0].remarks);
      }
      setIsLoading(false);
    });
  }, []);

  const handleSelect = (ev: Evaluation) => {
    setSelectedEval(ev);
    setRemarks(ev.remarks);
  };

  const handleAction = async (action: "Approve" | "Reject" | "Return") => {
    if (!selectedEval) return;
    const newStatus: EvaluationStatus =
      action === "Approve" ? "Approved" : action === "Reject" ? "Rejected" : "Returned";

    try {
      const updated = await updateEvaluation(selectedEval.id, {
        status: newStatus,
        remarks,
      });
      setSelectedEval(updated);
      setEvaluations((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setToastMessage(`Evaluation marked as ${newStatus}!`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmModal((prev) => ({ ...prev, open: false }));
    }
  };

  return (
    <AppLayout title="Bid Evaluation Committee">
      <PageHeader
        title="Technical & Commercial Tender Evaluation"
        subtitle="QCBS / Least-Cost (L1) scoring and evaluation notes for bidder selection."
        breadcrumbs={[{ label: "Tenders", href: "/tenders" }, { label: "Evaluations" }]}
      />

      {toastMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Disclaimers required in Section 26 */}
      <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Evaluation Scoring Matrix Policy Notice:</span>
          <p className="text-amber-800 leading-relaxed">
            Detailed weighted formula (QCBS 70:30 or Pure L1 Least Cost) is marked as{" "}
            <span className="font-bold text-amber-950 underline">
              &quot;TBD - Client Confirmation Required&quot;
            </span>{" "}
            because specific government department tender conditions vary per work package.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Evaluations */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Tender Evaluation Packets ({evaluations.length})
            </h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {evaluations.map((ev) => {
              const isSelected = selectedEval?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => handleSelect(ev)}
                  className={`p-4 cursor-pointer transition-colors text-xs space-y-1 ${
                    isSelected ? "bg-blue-50/60 border-l-4 border-l-blue-600" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-blue-600">{ev.evaluationNumber}</span>
                    <StatusBadge status={ev.status} size="sm" />
                  </div>
                  <p className="font-bold text-slate-900">{ev.vendorName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{ev.tenderTitle}</p>
                  <div className="flex justify-between items-center pt-1 text-[11px]">
                    <span className="text-slate-400 font-mono">
                      Rank: L{ev.commercialRank || "-"}
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatINRCrores(ev.commercialAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Evaluation Details (Section 26 Requirements) */}
        {selectedEval ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Vendor Information */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Vendor Information
                </span>
                <StatusBadge status={selectedEval.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Bidding Vendor</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedEval.vendorName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Tender NIT</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedEval.tenderNumber}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 text-[11px] block">Tender Subject</span>
                  <p className="text-slate-700 font-medium">{selectedEval.tenderTitle}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Technical Evaluation */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Technical Evaluation Score
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Technical Qualification</span>
                  <div className="mt-1">
                    <StatusBadge status={selectedEval.technicalStatus} />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Technical Score</span>
                  <span className="text-xl font-bold text-slate-900">
                    {selectedEval.technicalScore} / 100
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">Rule: {selectedEval.disclaimer}</p>
            </div>

            {/* Section 3: Commercial Evaluation */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Commercial Evaluation & Financial Ranking
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Commercial Bid Amount</span>
                  <span className="text-lg font-bold text-slate-900 font-mono">
                    {formatINR(selectedEval.commercialAmount)}
                  </span>
                  <span className="text-[11px] text-slate-500 block font-mono">
                    ({formatINRCrores(selectedEval.commercialAmount)})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 text-[11px] block">Commercial Position</span>
                  <span className="text-lg font-bold text-blue-700">
                    Rank: L{selectedEval.commercialRank || 1} (Lowest Bidder)
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Remarks */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Evaluation Committee Remarks
              </h3>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Committee observations, compliance caveats, and recommendations..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 leading-relaxed"
              />
            </div>

            {/* Section 5: Documents & Actions */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Evaluator: <strong>{selectedEval.evaluatedBy}</strong> •{" "}
                {formatDate(selectedEval.evaluationDate)}
              </div>

              {/* Action Buttons: Approve, Reject, Return */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      action: "Return",
                      title: "Return Evaluation",
                      message: "Return evaluation sheet to committee for financial re-check?",
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                >
                  Return
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      action: "Reject",
                      title: "Reject Bidder",
                      message: "Mark this bidder as rejected/disqualified?",
                    })
                  }
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      action: "Approve",
                      title: "Approve Evaluation",
                      message: `Confirm approval of L${selectedEval.commercialRank || 1} evaluation for ${selectedEval.vendorName}? This will advance the record to Work Order issuance.`,
                    })
                  }
                  className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
                >
                  Approve Evaluation
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmDialog
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={
          confirmModal.action === "Approve"
            ? "primary"
            : confirmModal.action === "Reject"
              ? "danger"
              : "warning"
        }
        confirmText={confirmModal.action}
        onConfirm={() => handleAction(confirmModal.action)}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </AppLayout>
  );
}
