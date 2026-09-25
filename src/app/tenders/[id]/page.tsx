"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileCheck2,
  Calendar,
  Building2,
  Users2,
  FileText,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Inbox,
  Check,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailPageSkeleton } from "@/components/common/LoadingSkeleton";
import { getTenderById, updateTenderStatus } from "@/services/tenderService";
import { getTenderApplications } from "@/services/tenderApplicationService";
import { getEvaluations } from "@/services/evaluationService";
import { Tender, TenderApplication, Evaluation, TenderStatus } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function TenderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tender, setTender] = useState<Tender | null>(null);
  const [applications, setApplications] = useState<TenderApplication[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const t = await getTenderById(resolvedParams.id);
        if (t) {
          setTender(t);
          const [allApps, allEvals] = await Promise.all([
            getTenderApplications(t.id),
            getEvaluations(),
          ]);
          setApplications(allApps);
          setEvaluations(allEvals.filter((e) => e.tenderId === t.id));
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = async (status: TenderStatus) => {
    if (!tender) return;
    try {
      const updated = await updateTenderStatus(tender.id, status);
      setTender(updated);
      showToast(`Tender status changed to ${status}!`);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Loading Tender...">
        <DetailPageSkeleton />
      </AppLayout>
    );
  }

  if (!tender) {
    return (
      <AppLayout title="Tender Not Found">
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500">Tender record not found.</p>
          <Link href="/tenders" className="mt-4 inline-block text-xs font-semibold text-blue-600">
            Back to Tenders
          </Link>
        </div>
      </AppLayout>
    );
  }

  const tabs: TabItem[] = [
    { id: "overview", label: "Tender Overview" },
    { id: "applications", label: "Bids & Applications", count: applications.length },
    { id: "evaluations", label: "Technical & Commercial Evaluation", count: evaluations.length },
    { id: "documents", label: "Tender Volumes", count: tender.documents?.length || 0 },
  ];

  return (
    <AppLayout title={`Tender: ${tender.tenderNumber}`}>
      <PageHeader
        title={tender.title}
        subtitle={`${tender.tenderNumber} • ${tender.clientName}`}
        breadcrumbs={[{ label: "Tenders", href: "/tenders" }, { label: tender.tenderNumber }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/tenders"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            <Link
              href="/tender-applications"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              <Inbox className="h-3.5 w-3.5" />
              <span>All Tender Bids</span>
            </Link>
          </div>
        }
      />

      {toastMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Scope of Work */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Scope of Work & Technical Mandate
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {tender.scopeOfWork}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-5 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded">
                  <span className="text-slate-400 text-[11px] block">Estimated Tender Value</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatINR(tender.estimatedValue)}
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    ({formatINRCrores(tender.estimatedValue)})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <span className="text-slate-400 text-[11px] block">Publish Date</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(tender.publishDate)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded">
                  <span className="text-slate-400 text-[11px] block">Submission Deadline</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(tender.submissionDeadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Awarded Vendor Banner if Awarded */}
            {tender.awardedVendorName && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">L1 Awarded Contractor:</span>
                    <p className="font-semibold text-emerald-950 text-sm mt-0.5">
                      {tender.awardedVendorName}
                    </p>
                  </div>
                </div>
                <Link
                  href="/work-orders"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold shadow-xs"
                >
                  View Work Order LOA →
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Status & Procurement Lifecycle Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tender Stage
                </span>
                <StatusBadge status={tender.status} />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-2">
                  Update Tender Status (Simulated)
                </label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {(
                    [
                      "Draft",
                      "Published",
                      "Applications Open",
                      "Applications Closed",
                      "Under Evaluation",
                      "Approved",
                      "Awarded",
                      "Closed",
                    ] as TenderStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-2 py-1 text-[11px] rounded text-left border font-medium transition-colors ${
                        tender.status === st
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

            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-2">
              <span className="font-bold uppercase tracking-wider text-slate-400 text-[11px] block">
                Procurement Authority
              </span>
              <p className="font-semibold text-slate-900 text-sm">{tender.clientName}</p>
              <p className="text-slate-500">Method: {tender.tenderType}</p>
              <p className="text-slate-500">Total Bids Received: {applications.length}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "applications" && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contractor Applications & Bid Submissions ({applications.length})
            </h3>
            <Link
              href="/evaluations"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Open Evaluation Board →
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {applications.map((app) => (
                <div key={app.id} className="py-3.5 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-600">{app.applicationNumber}</span>
                      <StatusBadge status={app.status} size="sm" />
                    </div>
                    <p className="font-bold text-slate-900 mt-1">{app.vendorName}</p>
                    <p className="text-[11px] text-slate-500">
                      Technical Status: <strong>{app.technicalStatus}</strong> • Submitted:{" "}
                      {formatDate(app.submissionDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono block">
                      {formatINR(app.commercialAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({formatINRCrores(app.commercialAmount)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3">
              No applications submitted for this tender.
            </p>
          )}
        </div>
      )}

      {activeTab === "evaluations" && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Bid Evaluation Committee Record
          </h3>
          {evaluations.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {evaluations.map((ev) => (
                <div key={ev.id} className="py-3.5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">{ev.vendorName}</span>
                      <span className="ml-2 font-mono text-[11px] text-slate-400">
                        Rank: L{ev.commercialRank || "-"}
                      </span>
                    </div>
                    <StatusBadge status={ev.status} size="sm" />
                  </div>
                  <p className="text-slate-600">{ev.remarks}</p>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                    <span>
                      Technical Score: <strong>{ev.technicalScore}/100</strong>
                    </span>
                    <span className="font-bold text-slate-900">
                      Commercial: {formatINR(ev.commercialAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3">No evaluations completed yet.</p>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Published NIT Documents & Drawings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {tender.documents?.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center gap-2 truncate mr-2">
                  <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-800 truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-400">{doc.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Simulating download of ${doc.name}`)}
                  className="text-[11px] text-blue-600 font-semibold hover:underline shrink-0"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
