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
import { createEnquiry } from "@/services/enquiryService";
import { getClients } from "@/services/clientService";
import { Client, BusinessType } from "@/types";

const enquirySchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  projectName: z.string().min(5, "Project name must be at least 5 characters"),
  businessType: z.enum(["ADVISORY", "PMC", "O&M"]),
  enquiryDate: z.string().min(1, "Enquiry date is required"),
  expectedResponseDate: z.string().min(1, "Response deadline is required"),
  estimatedValue: z.number().min(1000, "Estimated value must be greater than zero"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scopeOfWork: z.string().optional(),
  assignedTo: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function NewEnquiryPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      businessType: "ADVISORY",
      enquiryDate: new Date().toISOString().split("T")[0],
      expectedResponseDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      estimatedValue: 25000000,
      assignedTo: "Er. Muralidharan (Advisory BU)",
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      const selectedClient = clients.find((c) => c.id === data.clientId);
      await createEnquiry({
        ...data,
        clientName: selectedClient?.name || "Government Board",
      });
      setSuccessToast(true);
      setTimeout(() => router.push("/enquiries"), 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create New Enquiry">
      <PageHeader
        title="Log New Enquiry / RFQ"
        subtitle="Capture incoming government request for proposal, preliminary feasibility, or PMC study."
        breadcrumbs={[{ label: "Enquiries", href: "/enquiries" }, { label: "New Enquiry" }]}
      />

      {successToast && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Enquiry registered successfully with status DRAFT! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <FormSection
          title="Client & Scope Classification"
          description="Identify the client authority and project vertical."
          stepNumber={1}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client / Municipal Authority *
              </label>
              <select
                {...register("clientId")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 font-medium"
              >
                <option value="">Select Government Client Board</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Type *
              </label>
              <select
                {...register("businessType")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 font-medium"
              >
                <option value="ADVISORY">ADVISORY (DPR / Feasibility / PPP)</option>
                <option value="PMC">PMC (Project Management Consultancy)</option>
                <option value="O&M">O&M (Plant Operation & Maintenance)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title / Enquiry Subject *
            </label>
            <input
              type="text"
              {...register("projectName")}
              placeholder="e.g. Detailed Project Report for 75 MLD Desalination Facility at Nagapattinam"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
            />
            {errors.projectName && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.projectName.message}</p>
            )}
          </div>
        </FormSection>

        <FormSection
          title="Financial Estimate & Timelines"
          description="Estimated tender value and proposal submission window."
          stepNumber={2}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Value (INR) *
              </label>
              <input
                type="number"
                {...register("estimatedValue", { valueAsNumber: true })}
                placeholder="25000000"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.estimatedValue && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.estimatedValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enquiry Receipt Date *
              </label>
              <input
                type="date"
                {...register("enquiryDate")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Response Date *
              </label>
              <input
                type="date"
                {...register("expectedResponseDate")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Team Lead
              </label>
              <input
                type="text"
                {...register("assignedTo")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Scope Narrative & Terms of Reference"
          description="Detailed scope of services and technical specifications."
          stepNumber={3}
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Executive Description *
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Provide context regarding client requirements, geographical coverage, and core project outcomes..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 leading-relaxed"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="pt-2">
            <FileUpload
              label="Attach Client RFP / Expression of Interest (EOI)"
              description="Upload client tender notice, site map or draft ToR (PDF, DOCX)"
            />
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/enquiries"
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? "Submitting..." : "Save Draft Enquiry"}</span>
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
