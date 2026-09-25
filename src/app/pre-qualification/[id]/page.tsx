"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileBadge2,
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  FileText,
  UserCheck,
  Coins,
  Check,
  Award,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailPageSkeleton } from "@/components/common/LoadingSkeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  getPreQualificationById,
  approveVendor,
  rejectVendor,
  returnVendor,
} from "@/services/vendorService";
import { PreQualificationData } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function PreQualificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [pq, setPq] = useState<PreQualificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    action: "Approve" | "Reject" | "Return";
    title: string;
    message: string;
    notes?: string;
  }>({ open: false, action: "Approve", title: "", message: "" });

  const [verificationNotes, setVerificationNotes] = useState("");

  useEffect(() => {
    getPreQualificationById(resolvedParams.id).then((data) => {
      if (data) {
        setPq(data);
        setVerificationNotes(data.verificationNotes || "");
      }
      setIsLoading(false);
    });
  }, [resolvedParams.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const executeAction = async () => {
    if (!pq) return;
    try {
      let updated: PreQualificationData;
      if (confirmModal.action === "Approve") {
        updated = await approveVendor(
          pq.id,
          verificationNotes || "Statutory documents & turnover verified"
        );
        showToast("Vendor Pre-Qualification Approved successfully!");
      } else if (confirmModal.action === "Reject") {
        updated = await rejectVendor(
          pq.id,
          verificationNotes || "Criteria benchmarks not fulfilled"
        );
        showToast("Vendor Pre-Qualification Rejected.");
      } else {
        updated = await returnVendor(
          pq.id,
          verificationNotes || "Clarification sought on statutory audit"
        );
        showToast("Application Returned to Vendor for modifications.");
      }
      setPq(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmModal((prev) => ({ ...prev, open: false }));
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Loading Pre-Qualification Review...">
        <DetailPageSkeleton />
      </AppLayout>
    );
  }

  if (!pq) {
    return (
      <AppLayout title="Pre-Qualification Not Found">
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500">Record not found.</p>
          <Link
            href="/pre-qualification"
            className="mt-4 inline-block text-xs font-semibold text-blue-600"
          >
            Back to Register
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`PQ Review: ${pq.companyName}`}>
      <PageHeader
        title={`Pre-Qualification Review: ${pq.companyName}`}
        subtitle={`Dossier ${pq.id.toUpperCase()} • Submitted: ${formatDate(pq.submissionDate)}`}
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: "Pre-Qualification", href: "/pre-qualification" },
          { label: pq.companyName },
        ]}
        actions={
          <Link
            href="/pre-qualification"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </Link>
        }
      />

      {toastMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: The 9 Sections Review */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1 & 2: Company & Statutory */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Company & Statutory Identifiers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Company Name</span>
                <span className="font-bold text-slate-900 text-sm">{pq.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Website</span>
                <a
                  href={pq.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {pq.website || "N/A"}
                </a>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 text-[11px] block">Registered Address</span>
                <span className="text-slate-700">{pq.registeredAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">PAN Number</span>
                <span className="font-mono font-semibold text-slate-900">{pq.panNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">GSTIN</span>
                <span className="font-mono font-semibold text-slate-900">{pq.gstNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">MSME Number</span>
                <span className="font-mono text-slate-700">
                  {pq.msmeCertificateNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">ROC Registration</span>
                <span className="font-mono text-slate-700">{pq.rocCertificateNumber}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Contact Persons */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Authorized Contact Persons ({pq.contactPersons?.length || 0})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {pq.contactPersons?.map((cp) => (
                <div key={cp.id} className="p-3 bg-slate-50 rounded border border-slate-200">
                  <p className="font-bold text-slate-900">{cp.name}</p>
                  <p className="text-[11px] text-slate-500">{cp.designation}</p>
                  <div className="mt-1 pt-1 border-t border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                    <p>Phone: {cp.mobile}</p>
                    <p>Email: {cp.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Turnover */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Annual Audited Turnover Figures
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {pq.turnovers?.map((t) => (
                <div key={t.financialYear} className="py-2.5 flex justify-between items-center">
                  <span className="font-medium text-slate-800">
                    Financial Year {t.financialYear}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      {formatINR(t.turnoverAmount)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({formatINRCrores(t.turnoverAmount)})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Audited
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 & 6: Technical Personnel & Employees */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Technical Personnel & Workforce
              </h3>
              <span className="text-xs font-bold text-slate-900">
                Total Staff: {pq.technicalEmployeesCount + pq.nonTechnicalEmployeesCount}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="p-3 bg-blue-50/50 rounded border border-blue-100">
                <span className="text-[11px] text-blue-700 block">Technical Workforce</span>
                <span className="text-lg font-bold text-blue-900">
                  {pq.technicalEmployeesCount} Engineers & Chemists
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Non-Technical Staff</span>
                <span className="text-lg font-bold text-slate-800">
                  {pq.nonTechnicalEmployeesCount} Admin & Support
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-700 block">Key Technical Specialists:</span>
              {pq.technicalPersonnel?.map((tp) => (
                <div
                  key={tp.id}
                  className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-slate-900">{tp.name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      ({tp.qualification}) • {tp.experienceYears} Years Exp
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 font-medium text-slate-700">
                    {tp.specialization}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Water & Wastewater Project Experience */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              5. Past Project Experience (Water & Wastewater Industries)
            </h3>
            <div className="space-y-3 text-xs">
              {pq.pastProjects?.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{proj.projectName}</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {formatINRCrores(proj.projectValue)}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{proj.projectDescription}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>
                      Client: <strong>{proj.clientName}</strong>
                    </span>
                    <span>WO Ref: {proj.workOrderNumber || "Verified"}</span>
                    <span className="text-emerald-700 font-semibold">{proj.completionStatus}</span>
                  </div>
                  {proj.completionTestimonial && (
                    <div className="p-2 bg-white rounded border border-slate-100 text-[11px] text-slate-600 italic">
                      &quot;{proj.completionTestimonial}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Enclosures */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              6. Enclosures & Verification Dossier
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {pq.enclosures?.map((enc) => (
                <div
                  key={enc.id}
                  className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{enc.title}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded shrink-0">
                    {enc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Status Card, Actions & Declaration Undertaking */}
        <div className="space-y-6">
          {/* Status Card & Actions (Section 23 requirement) */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Current Verification Status
              </span>
              <StatusBadge status={pq.status} />
            </div>

            {pq.verifiedBy && (
              <div className="text-xs text-slate-600 space-y-0.5">
                <p>
                  <strong>Verified By:</strong> {pq.verifiedBy}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(pq.verifiedAt)}
                </p>
              </div>
            )}

            {/* Verification Remarks Input */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Committee Remarks / Notes
              </label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Enter committee verification notes or reason for rejection/return..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 leading-relaxed"
              />
            </div>

            {/* Committee Verification Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setConfirmModal({
                    open: true,
                    action: "Approve",
                    title: "Approve Pre-Qualification",
                    message: `Are you sure you want to APPROVE ${pq.companyName} for government water & infra works empanelment?`,
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Approve Vendor Pre-Qualification</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      action: "Return",
                      title: "Return to Vendor",
                      message:
                        "Return application to vendor seeking clarifications or additional audited documents?",
                    })
                  }
                  className="flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Return</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      action: "Reject",
                      title: "Reject Pre-Qualification",
                      message:
                        "Reject this vendor application for non-compliance with statutory/technical criteria?",
                    })
                  }
                  className="flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>

          {/* Declaration & Signatory Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[11px] block">
              Section 9: Legal Declaration
            </span>
            <div>
              <span className="text-slate-400 text-[11px]">Authorized Signatory</span>
              <p className="font-bold text-slate-900 mt-0.5">{pq.authorizedSignatory}</p>
              <p className="text-slate-500 text-[11px]">{pq.designation}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
              <div>
                <span className="text-slate-400">Place</span>
                <p className="font-semibold text-slate-800">{pq.placeOfDeclaration}</p>
              </div>
              <div>
                <span className="text-slate-400">Date</span>
                <p className="font-semibold text-slate-800">{formatDate(pq.dateOfDeclaration)}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Signature Uploaded
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> Office Seal Attached
              </span>
            </div>
          </div>
        </div>
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
        onConfirm={executeAction}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </AppLayout>
  );
}
