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
import { createTender } from "@/services/tenderService";
import { getClients } from "@/services/clientService";
import { Client, TenderStatus } from "@/types";

const tenderSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  clientId: z.string().min(1, "Please select a client"),
  tenderType: z.enum(["Open Tender", "Limited Tender", "Single Source", "RFP / EOI"]),
  estimatedValue: z.number().min(1000, "Estimated value must be greater than zero"),
  publishDate: z.string().min(1, "Publish date is required"),
  submissionDeadline: z.string().min(1, "Submission deadline is required"),
  scopeOfWork: z.string().min(10, "Scope of work is required"),
  status: z.enum([
    "Draft",
    "Published",
    "Applications Open",
    "Applications Closed",
    "Under Evaluation",
    "Approved",
    "Awarded",
    "Closed",
  ]),
});

type TenderFormData = z.infer<typeof tenderSchema>;

export default function NewTenderPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    getClients().then(setClients);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenderFormData>({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      tenderType: "Open Tender",
      status: "Published",
      publishDate: new Date().toISOString().split("T")[0],
      submissionDeadline: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      estimatedValue: 150000000,
    },
  });

  const onSubmit = async (data: TenderFormData) => {
    setIsSubmitting(true);
    try {
      const selectedClient = clients.find((c) => c.id === data.clientId);
      await createTender({
        ...data,
        clientName: selectedClient?.name || "Government Authority",
        documents: [
          {
            name: "NIT_Tender_Notice.pdf",
            size: "2.4 MB",
            date: new Date().toISOString().split("T")[0],
          },
        ],
      });
      setShowToast(true);
      setTimeout(() => router.push("/tenders"), 1000);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Publish New Tender">
      <PageHeader
        title="Publish Notice Inviting Tender (NIT)"
        subtitle="Create a new procurement tender, upload technical schedules, and open bidder applications."
        breadcrumbs={[{ label: "Tenders", href: "/tenders" }, { label: "New Tender" }]}
      />

      {showToast && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Tender published successfully! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        <FormSection
          title="Tender Classification & Client Authority"
          description="Identify the tendering department and procurement method."
          stepNumber={1}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tendering Authority / Client *
              </label>
              <select
                {...register("clientId")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-medium"
              >
                <option value="">Select Government Client</option>
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
                Procurement Method *
              </label>
              <select
                {...register("tenderType")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-medium"
              >
                <option value="Open Tender">Open Tender</option>
                <option value="Limited Tender">Limited Tender</option>
                <option value="Single Source">Single Source</option>
                <option value="RFP / EOI">RFP / EOI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tender NIT Title *
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. EPC Contract for Construction of 50 MLD Desalination Facility..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
            />
            {errors.title && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.title.message}</p>
            )}
          </div>
        </FormSection>

        <FormSection
          title="Commercial Estimate & Submission Window"
          description="Approved tender budget and key e-submission milestones."
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
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-mono"
              />
              {errors.estimatedValue && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.estimatedValue.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                NIT Publish Date *
              </label>
              <input
                type="date"
                {...register("publishDate")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bid Submission Deadline *
              </label>
              <input
                type="date"
                {...register("submissionDeadline")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Status
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-medium"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Applications Open">Applications Open</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Scope of Work & Tender Volumes"
          description="Detailed execution specifications and document attachments."
          stepNumber={3}
        >
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Scope of Work *
            </label>
            <textarea
              rows={4}
              {...register("scopeOfWork")}
              placeholder="State technical requirements, design parameters, standards, testing and trial run criteria..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 leading-relaxed"
            />
            {errors.scopeOfWork && (
              <p className="text-[11px] text-rose-600 mt-1">{errors.scopeOfWork.message}</p>
            )}
          </div>

          <div className="pt-2">
            <FileUpload
              label="Attach Tender Volumes (Commercial, Technical & Drawings)"
              description="Upload PDF volumes or ZIP packages up to 50MB"
            />
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/tenders"
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
            <span>{isSubmitting ? "Publishing..." : "Publish Tender"}</span>
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
