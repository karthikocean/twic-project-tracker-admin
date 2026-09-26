"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  CheckCircle2,
  Building2,
  Briefcase,
  IndianRupee,
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FileUpload } from "@/components/common/FileUpload";
import { createEnquiry } from "@/services/enquiryService";
import { getClients } from "@/services/clientService";
import { Client, BusinessType } from "@/types";

const enquirySchema = z.object({
  clientId: z.string().min(1, "Please select a client authority"),
  projectName: z.string().min(5, "Project name must be at least 5 characters"),
  businessType: z.enum(["ADVISORY", "PMC", "O&M"]),
  enquiryDate: z.string().min(1, "Enquiry date is required"),
  expectedResponseDate: z.string().min(1, "Response deadline is required"),
  estimatedValue: z.number().min(1000, "Estimated value must be at least ₹1,000"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  scopeOfWork: z.string().optional(),
  assignedTo: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

function formatToIndianCurrency(num: number | undefined): string {
  if (!num || isNaN(num)) return "₹ 0";
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2)} Crore`;
  }
  if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2)} Lakh`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

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
    control,
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

  const watchedEstimatedValue = useWatch({ control, name: "estimatedValue" });
  const watchedResponseDate = useWatch({ control, name: "expectedResponseDate" });

  // Calculate days remaining until expected response date
  const calculateDaysRemaining = () => {
    if (!watchedResponseDate) return null;
    const target = new Date(watchedResponseDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = calculateDaysRemaining();

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      const client = clients.find((c) => c.id === data.clientId);
      await createEnquiry({
        ...data,
        clientName: client?.name || "Government Board",
      });
      setSuccessToast(true);
      setTimeout(() => router.push("/enquiries"), 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create New Enquiry">
      <div className="w-full space-y-5">
        {/* Page Header */}
        <PageHeader
          title="Log New Enquiry / RFQ"
          subtitle="Capture incoming government request for proposal, preliminary feasibility, or PMC study."
          breadcrumbs={[{ label: "Enquiries", href: "/enquiries" }, { label: "New Enquiry" }]}
        />

        {successToast && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">Enquiry Registered Successfully!</p>
              <p className="text-[11px] text-emerald-700 font-normal">
                New entry created in DRAFT pipeline. Redirecting to RFQ registers...
              </p>
            </div>
          </div>
        )}

        {/* Form Container (Full Width) */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Section 1: Client & Classification */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 md:p-6 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Client & Project Scope
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Designate client municipal authority and technical vertical
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                Mandatory
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Client Selection (2 cols on desktop) */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    Client / Municipal Authority <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("clientId")}
                    className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium ${
                      errors.clientId
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                    }`}
                  >
                    <option value="">Select Government Client Board</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.clientId ? (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.clientId.message}
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Select the issuing agency or government department
                    </p>
                  )}
                </div>

                {/* Business Type (1 col on desktop) */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    Business Engagement Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register("businessType")}
                    className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                  >
                    <option value="ADVISORY">ADVISORY (DPR / Feasibility / PPP)</option>
                    <option value="PMC">PMC (Project Management Consultancy)</option>
                    <option value="O&M">O&M (Plant Operation & Maintenance)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Determines workflow stage & documentation standards
                  </p>
                </div>
              </div>

              {/* Project Title */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-slate-400" />
                  Project Title / Enquiry Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("projectName")}
                  placeholder="e.g. Detailed Project Report for 75 MLD Desalination Facility at Nagapattinam"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 ${
                    errors.projectName
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.projectName ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.projectName.message}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Clear official title as specified in client communication or RFQ notice
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Financial Estimate & Timeline (Extended 4-col responsive grid) */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 md:p-6 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-100">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Commercials & Timelines
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Estimated contract valuation, receipt dates, and response deadline
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Budget & SLA
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Estimated Value */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                    <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                    Estimated Value <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {formatToIndianCurrency(watchedEstimatedValue)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    {...register("estimatedValue", { valueAsNumber: true })}
                    placeholder="25000000"
                    className={`w-full pl-7 pr-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-semibold ${
                      errors.estimatedValue
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                        : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                    }`}
                  />
                </div>
                {errors.estimatedValue ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.estimatedValue.message}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Approximate tender / RFP budget</p>
                )}
              </div>

              {/* Receipt Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Receipt Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("enquiryDate")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">Date letter or RFP was received</p>
              </div>

              {/* Expected Response Date */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    Response Deadline <span className="text-rose-500">*</span>
                  </label>
                  {daysRemaining !== null && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        daysRemaining < 0
                          ? "bg-rose-100 text-rose-700"
                          : daysRemaining <= 5
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {daysRemaining < 0
                        ? "Overdue"
                        : daysRemaining === 0
                        ? "Due Today"
                        : `${daysRemaining} days left`}
                    </span>
                  )}
                </div>
                <input
                  type="date"
                  {...register("expectedResponseDate")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">Proposal submission cutoff</p>
              </div>

              {/* Assigned Team Lead */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Assigned Lead Engineer
                </label>
                <input
                  type="text"
                  {...register("assignedTo")}
                  placeholder="e.g. Er. Muralidharan (Advisory BU)"
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">Bid lead manager in charge</p>
              </div>
            </div>
          </div>

          {/* Section 3: Scope Narrative & Attachments */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 md:p-6 shadow-xs transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    Scope Narrative & Client Documents
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Executive synopsis, Terms of Reference (ToR) and RFP tender documents
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Executive Description & Key Terms <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Provide background regarding municipal coverage, capacity in MLD/TDP, regulatory benchmarks, and initial deliverables..."
                  className={`w-full px-3 py-2.5 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 leading-relaxed ${
                    errors.description
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.description && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Supporting RFP Documents & Draft ToR
                </label>
                <FileUpload
                  label="Upload Client RFP / Expression of Interest (EOI)"
                  description="Upload official letter, tender document, site topography map (PDF, DOCX, XLSX up to 25MB)"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                New entry will be saved in <strong>DRAFT</strong> status under active pipeline.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href="/enquiries"
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
                <span>{isSubmitting ? "Submitting..." : "Save Draft Enquiry"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
