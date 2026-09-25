"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  FileCheck2,
  Send,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailPageSkeleton } from "@/components/common/LoadingSkeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  getEnquiryById,
  updateEnquiryStatus,
  convertEnquiryToCosting,
} from "@/services/enquiryService";
import { getCostingById } from "@/services/costingService";
import { getTenderById } from "@/services/tenderService";
import { Enquiry, Costing, Tender, EnquiryStatus } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [relatedCosting, setRelatedCosting] = useState<Costing | null>(null);
  const [relatedTender, setRelatedTender] = useState<Tender | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Action states
  const [actionConfirm, setActionConfirm] = useState<{
    open: boolean;
    type: "submit" | "convert-costing" | "convert-tender" | "status";
    title: string;
    message: string;
    newStatus?: EnquiryStatus;
  }>({ open: false, type: "status", title: "", message: "" });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const enq = await getEnquiryById(resolvedParams.id);
        if (enq) {
          setEnquiry(enq);
          if (enq.relatedCostingId) {
            const cst = await getCostingById(enq.relatedCostingId);
            if (cst) setRelatedCosting(cst);
          }
          if (enq.relatedTenderId) {
            const tnd = await getTenderById(enq.relatedTenderId);
            if (tnd) setRelatedTender(tnd);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStatusChange = async (newStatus: EnquiryStatus) => {
    if (!enquiry) return;
    try {
      const updated = await updateEnquiryStatus(
        enquiry.id,
        newStatus,
        `Status updated from detail workspace to ${newStatus}`
      );
      setEnquiry(updated);
      showToast(`Enquiry status updated to ${newStatus}!`);
    } catch (e) {
      console.error(e);
    } finally {
      setActionConfirm((prev) => ({ ...prev, open: false }));
    }
  };

  const handleConvertToCosting = async () => {
    if (!enquiry) return;
    try {
      const res = await convertEnquiryToCosting(enquiry.id);
      setEnquiry(res.enquiry);
      const cst = await getCostingById(res.costingId);
      if (cst) setRelatedCosting(cst);
      showToast("Converted to Costing! Worksheet initialized.");
      router.push(`/costings/${res.costingId}`);
    } catch (e) {
      console.error(e);
    } finally {
      setActionConfirm((prev) => ({ ...prev, open: false }));
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Loading Enquiry...">
        <DetailPageSkeleton />
      </AppLayout>
    );
  }

  if (!enquiry) {
    return (
      <AppLayout title="Enquiry Not Found">
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h2 className="text-base font-semibold text-slate-900">Enquiry Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">The requested enquiry does not exist.</p>
          <Link
            href="/enquiries"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md"
          >
            Back to Enquiries
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Enquiry: ${enquiry.enquiryNumber}`}>
      <PageHeader
        title={enquiry.projectName}
        subtitle={`${enquiry.enquiryNumber} • ${enquiry.clientName}`}
        breadcrumbs={[{ label: "Enquiries", href: "/enquiries" }, { label: enquiry.enquiryNumber }]}
        actions={
          <div className="flex items-center gap-2">
            {enquiry.status === "DRAFT" && (
              <button
                type="button"
                onClick={() =>
                  setActionConfirm({
                    open: true,
                    type: "status",
                    title: "Submit Enquiry for Review",
                    message: "Are you sure you want to mark this enquiry as SUBMITTED?",
                    newStatus: "SUBMITTED",
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <Send className="h-3.5 w-3.5 text-blue-600" />
                <span>Mark Submitted</span>
              </button>
            )}

            {!enquiry.relatedCostingId && (
              <button
                type="button"
                onClick={() =>
                  setActionConfirm({
                    open: true,
                    type: "convert-costing",
                    title: "Convert Enquiry to Costing",
                    message:
                      "Initialize a new Cost Preparation worksheet with manpower, consultant, and travel items?",
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>Convert to Costing</span>
              </button>
            )}

            {enquiry.relatedCostingId && (
              <Link
                href={`/costings/${enquiry.relatedCostingId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
              >
                <Calculator className="h-3.5 w-3.5" />
                <span>View Costing Worksheet</span>
              </Link>
            )}
          </div>
        }
      />

      {toastMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scope, Description, Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Overview */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Scope & Executive Description
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800">
                {enquiry.businessType}
              </span>
            </div>

            <div className="prose prose-sm text-xs text-slate-700 leading-relaxed mb-5">
              <p>{enquiry.description}</p>
            </div>

            {enquiry.scopeOfWork && (
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs mb-5">
                <p className="font-semibold text-slate-900 mb-1">Key Deliverables & Terms:</p>
                <p className="text-slate-600 leading-relaxed">{enquiry.scopeOfWork}</p>
              </div>
            )}

            {/* Financial & Deadline bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 bg-slate-50/70 rounded-md">
                <span className="text-slate-400 text-[11px] block">Estimated Budget</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatINR(enquiry.estimatedValue)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ({formatINRCrores(enquiry.estimatedValue)})
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-md">
                <span className="text-slate-400 text-[11px] block">Receipt Date</span>
                <span className="font-semibold text-slate-900">
                  {formatDate(enquiry.enquiryDate)}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-md">
                <span className="text-slate-400 text-[11px] block">Response Deadline</span>
                <span className="font-semibold text-slate-900">
                  {formatDate(enquiry.expectedResponseDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Attached RFP / EOI Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Enquiry Documents ({enquiry.documents?.length || 0})
            </h3>
            {enquiry.documents && enquiry.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enquiry.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                      <div className="min-w-0 truncate">
                        <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {doc.size} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Simulating download of ${doc.name}`)}
                      className="text-[11px] text-blue-600 hover:underline shrink-0 ml-2 font-medium"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No documents attached.</p>
            )}
          </div>

          {/* Related Upstream / Downstream Modules (Section 47 Connection) */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Connected Business Workflow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Costing Card */}
              <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-blue-600" />
                    Related Costing
                  </span>
                  {relatedCosting && <StatusBadge status={relatedCosting.status} size="sm" />}
                </div>

                {relatedCosting ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {relatedCosting.costingNumber}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Quotation: <strong>{formatINR(relatedCosting.finalQuotation)}</strong>
                    </p>
                    <Link
                      href={`/costings/${relatedCosting.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <span>Open Costing Worksheet</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] text-slate-400 mb-2">
                      No costing sheet linked to this enquiry yet.
                    </p>
                    <button
                      type="button"
                      onClick={handleConvertToCosting}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded"
                    >
                      + Generate Costing
                    </button>
                  </div>
                )}
              </div>

              {/* Tender Card */}
              <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCheck2 className="h-3.5 w-3.5 text-cyan-600" />
                    Related Tender
                  </span>
                  {relatedTender && <StatusBadge status={relatedTender.status} size="sm" />}
                </div>

                {relatedTender ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {relatedTender.tenderNumber}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {relatedTender.title}
                    </p>
                    <Link
                      href={`/tenders/${relatedTender.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <span>View Tender Workspace</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] text-slate-400 mb-2">
                      No public tender published yet.
                    </p>
                    <Link
                      href="/tenders/new"
                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded"
                    >
                      Draft NIT Tender
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Card, Client Info & Chronological Timeline */}
        <div className="space-y-6">
          {/* Status & Review Actions Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Lifecycle Status
            </span>
            <div className="flex items-center justify-between mb-4">
              <StatusBadge status={enquiry.status} />
              <span className="text-xs text-slate-400 font-mono">
                {formatDate(enquiry.createdAt)}
              </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="block text-[11px] font-semibold text-slate-500 uppercase">
                Change Status (Simulated Workflow)
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(
                  [
                    "DRAFT",
                    "SUBMITTED",
                    "UNDER REVIEW",
                    "CONVERTED",
                    "REJECTED",
                    "CLOSED",
                  ] as EnquiryStatus[]
                ).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`px-2 py-1 text-[11px] rounded font-medium border text-left transition-colors ${
                      enquiry.status === st
                        ? "bg-slate-900 text-white border-slate-900 font-semibold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Client Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[11px] block">
              Client Details
            </span>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{enquiry.clientName}</p>
              <Link
                href={`/clients/${enquiry.clientId}`}
                className="text-blue-600 hover:underline text-[11px]"
              >
                View Client Profile →
              </Link>
            </div>
            {enquiry.assignedTo && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">Lead Consultant</span>
                <p className="font-semibold text-slate-800">{enquiry.assignedTo}</p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Enquiry Progress Timeline
            </h4>
            <div className="space-y-4 text-xs">
              {enquiry.timeline?.map((item, idx) => (
                <div key={idx} className="relative pl-5 pb-3 border-l border-slate-200 last:pb-0">
                  <div className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{item.user}</p>
                  {item.notes && (
                    <p className="text-slate-600 text-[11px] mt-1 bg-slate-50 p-2 rounded border border-slate-100">
                      {item.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={actionConfirm.open}
        title={actionConfirm.title}
        message={actionConfirm.message}
        onConfirm={() => {
          if (actionConfirm.type === "status" && actionConfirm.newStatus) {
            handleStatusChange(actionConfirm.newStatus);
          } else if (actionConfirm.type === "convert-costing") {
            handleConvertToCosting();
          }
        }}
        onCancel={() => setActionConfirm((prev) => ({ ...prev, open: false }))}
      />
    </AppLayout>
  );
}
