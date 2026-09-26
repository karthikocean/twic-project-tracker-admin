"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  CheckCircle2,
  ShieldCheck,
  Layers,
  FileCheck2,
  User,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSection } from "@/components/common/FormSection";
import { FileUpload } from "@/components/common/FileUpload";
import { createApproval } from "@/services/approvalService";

const approvalSchema = z.object({
  entityType: z.enum(["Enquiry", "Costing", "Tender", "Evaluation", "Work Order", "Invoice"]),
  entityReferenceCode: z.string().min(3, "Reference code / scope must be at least 3 characters"),
  currentLevel: z.enum(["Level 1 - Project Manager", "Level 2 - COO", "Level 3 - MD / Board"]),
  requestedBy: z.string().min(3, "Officer name must be at least 3 characters"),
  requestDate: z.string().min(1, "Request date is required"),
  priority: z.enum(["Normal", "High", "Urgent"]),
  comments: z.string().min(5, "Please provide justification comments (at least 5 characters)"),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

export default function NewApprovalPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      entityType: "Work Order",
      currentLevel: "Level 2 - COO",
      requestedBy: "Er. Muralidharan (Technical Committee Head)",
      requestDate: new Date().toISOString().split("T")[0],
      priority: "Normal",
      comments: "Commercial evaluation finalized; submitting for tiered governance concurrence.",
    },
  });

  const onSubmit = async (data: ApprovalFormData) => {
    setIsSubmitting(true);
    try {
      await createApproval({
        entityType: data.entityType,
        entityReferenceCode: data.entityReferenceCode,
        currentLevel: data.currentLevel,
        requestedBy: data.requestedBy,
        requestDate: data.requestDate,
        comments: `[Priority: ${data.priority}] ${data.comments}`,
      });
      setSuccessToast(true);
      setTimeout(() => router.push("/approvals"), 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Initiate Approval">
      <div className="w-full space-y-5">
        <PageHeader
          title="Initiate Governance Approval Request"
          subtitle="Submit an operational entity (Enquiry, Costing, Tender, Evaluation, Work Order, or Invoice) for tiered governance review."
          breadcrumbs={[{ label: "Approvals", href: "/approvals" }, { label: "New Approval" }]}
        />

        {successToast && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">Approval Request Initiated Successfully!</p>
              <p className="text-[11px] text-emerald-700 font-normal">
                Dispatched to governance workflow under PENDING status. Redirecting to approvals board...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Section 1: Entity & Reference */}
          <FormSection
            title="Target Entity & Reference Scope"
            description="Specify which procurement or technical record requires governance concurrence."
            stepNumber={1}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  Target Entity Type <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("entityType")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                >
                  <option value="Enquiry">Enquiry (RFQ Scope & Pre-bid)</option>
                  <option value="Costing">Costing (Worksheet Quotation & Margin)</option>
                  <option value="Tender">Tender (Notice Inviting Tender - NIT)</option>
                  <option value="Evaluation">Evaluation (Technical & Commercial Evaluation)</option>
                  <option value="Work Order">Work Order (Letter of Award - LOA)</option>
                  <option value="Invoice">Invoice (Payment Certificate Milestone)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Functional module where this request originates
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <FileCheck2 className="h-3.5 w-3.5 text-slate-400" />
                  Reference Code / Scope Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("entityReferenceCode")}
                  placeholder="e.g. WO-2025-004 (Cuddalore Desalination Phase 1) or CST-2025-003"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 ${
                    errors.entityReferenceCode
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.entityReferenceCode ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.entityReferenceCode.message}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Enter the document number, project name, or reference code for identification
                  </p>
                )}
              </div>
            </div>
          </FormSection>

          {/* Section 2: Governance Tier & Officer */}
          <FormSection
            title="Governance Tier & Requesting Officer"
            description="Assign the starting review stage and officer coordinates."
            stepNumber={2}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  Starting Approval Tier <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("currentLevel")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                >
                  <option value="Level 1 - Project Manager">Level 1 — Project Manager</option>
                  <option value="Level 2 - COO">Level 2 — COO</option>
                  <option value="Level 3 - MD / Board">Level 3 — MD / Board</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Designated reviewer level</p>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Requesting Officer / Department <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("requestedBy")}
                  placeholder="e.g. Er. Muralidharan (Technical Committee Head)"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium ${
                    errors.requestedBy
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.requestedBy && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.requestedBy.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Submission Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("requestDate")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Review Urgency
                </label>
                <select
                  {...register("priority")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                >
                  <option value="Normal">Normal (Standard 5-day SLA)</option>
                  <option value="High">High (48-hour Turnaround)</option>
                  <option value="Urgent">Urgent (Immediate Board Review)</option>
                </select>
              </div>
            </div>
          </FormSection>

          {/* Section 3: Justification & Attachments */}
          <FormSection
            title="Justification & Supporting Documents"
            description="Detail the rationale, contractual thresholds, and supporting committee notes."
            stepNumber={3}
          >
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Executive Justification & Technical Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register("comments")}
                  placeholder="Outline key reasons for escalation, commercial variance details, or why this item requires approval concurrence..."
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 leading-relaxed ${
                    errors.comments
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.comments && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.comments.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Attach Committee Note / Supporting Schedules
                </label>
                <FileUpload
                  label="Upload Approval Annexure (PDF, DOCX, XLSX)"
                  description="Attach technical committee note, comparative statement, or contract draft (up to 25MB)"
                />
              </div>
            </div>
          </FormSection>

          {/* Bottom Action Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                New request will be logged under <strong>PENDING</strong> status and routed to the designated review tier.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href="/approvals"
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
              >
                Cancel & Return
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? "Submitting Request..." : "Submit Approval Request"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
