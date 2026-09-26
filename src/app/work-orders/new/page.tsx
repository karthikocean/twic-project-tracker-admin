"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSection } from "@/components/common/FormSection";
import { FileUpload } from "@/components/common/FileUpload";
import { createWorkOrder } from "@/services/workOrderService";
import { getProjects } from "@/services/projectService";
import { getVendors } from "@/services/vendorService";
import { Project, Vendor, WorkOrderStatus } from "@/types";

const workOrderSchema = z.object({
  projectId: z.string().min(1, "Please select an existing project"),
  selectedVendorId: z.string().min(1, "Please select an empaneled vendor"),
  contractValue: z.number().min(1000, "Contract value must be greater than zero"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  scopeOfWork: z.string().min(10, "Scope of work is required"),
  status: z.enum(["Draft", "Issued", "Active", "Completed", "Cancelled"]),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

export default function NewWorkOrderPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    Promise.all([getProjects(), getVendors()]).then(([p, v]) => {
      setProjects(p);
      setVendors(v.filter((ven) => ven.preQualificationStatus === "Approved"));
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      status: "Issued",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      contractValue: 50000000,
    },
  });

  const onSubmit = async (data: WorkOrderFormData) => {
    setIsSubmitting(true);
    try {
      const proj = projects.find((p) => p.id === data.projectId);
      const vend = vendors.find((v) => v.id === data.selectedVendorId);

      await createWorkOrder({
        ...data,
        projectName: proj?.projectName || "Infrastructure Project",
        clientId: proj?.clientId || "cl-001",
        clientName: proj?.clientName || "Government Board",
        selectedVendorName: vend?.companyName || "Empaneled Contractor",
        documents: [{ name: "LOA_Executed_Agreement.pdf", size: "3.5 MB" }],
      });

      setShowToast(true);
      setTimeout(() => router.push("/work-orders"), 1000);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Issue Work Order (LOA)">
      <PageHeader
        title="Issue Work Order / Letter of Award (LOA)"
        subtitle="Formal contract issuance to awarded contractor linked to project and client board."
        breadcrumbs={[{ label: "Work Orders", href: "/work-orders" }, { label: "New LOA" }]}
      />

      {showToast && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Work Order generated and issued! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormSection
          title="Project & Awardee Selection"
          description="Link work order to project and select approved contractor."
          stepNumber={1}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Project *
              </label>
              <select
                {...register("projectId")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-medium"
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectNumber} - {p.projectName}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.projectId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Approved Awardee / Contractor *
              </label>
              <select
                {...register("selectedVendorId")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-medium"
              >
                <option value="">Select Pre-Qualified Contractor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vendorCode} - {v.companyName}
                  </option>
                ))}
              </select>
              {errors.selectedVendorId && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.selectedVendorId.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Contract Value & Period"
          description="Total commercial obligation and construction schedule."
          stepNumber={2}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contract Value (₹ INR) *
              </label>
              <input
                type="number"
                {...register("contractValue", { valueAsNumber: true })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-mono"
              />
              {errors.contractValue && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.contractValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contract Start Date *
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Completion Target Date *
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Scope Narrative & Executed Contract Attachment"
          description="Detailed scope of services and performance guarantee bonds."
          stepNumber={3}
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Contract Scope *
            </label>
            <textarea
              rows={3}
              {...register("scopeOfWork")}
              placeholder="Supply, installation, hydrotesting, trial run, defect liability period..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 leading-relaxed"
            />
            {errors.scopeOfWork && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.scopeOfWork.message}</p>
            )}
          </div>

          <div className="pt-2">
            <FileUpload
              label="Attach Signed Agreement & Performance Bank Guarantee"
              description="Upload scanned bilateral agreement"
            />
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/work-orders"
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? "Issuing..." : "Issue Work Order"}</span>
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
