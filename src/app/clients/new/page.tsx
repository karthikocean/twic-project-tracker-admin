"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Building2, CheckCircle2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSection } from "@/components/common/FormSection";
import { createClient } from "@/services/clientService";

const clientSchema = z.object({
  name: z.string().min(3, "Client name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10),
  contactPerson: z.string().min(3, "Contact person name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  status: z.enum(["Active", "Inactive"]),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      status: "Active",
      state: "Tamil Nadu",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      await createClient(data);
      setSuccessToast(true);
      setTimeout(() => {
        router.push("/clients");
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Add New Client">
      <PageHeader
        title="Register New Client Board"
        subtitle="Add a new government water supply board, municipal body, or industrial promotion corporation."
        breadcrumbs={[{ label: "Clients", href: "/clients" }, { label: "New Client" }]}
      />

      {successToast && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Client record successfully registered in local mock state! Redirecting...</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormSection
          title="Organization Details"
          description="Official title and administrative code for tender tagging."
          stepNumber={1}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client / Board Full Name *
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="e.g. Tamil Nadu Water Supply and Drainage Board"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Code *
              </label>
              <input
                type="text"
                {...register("code")}
                placeholder="e.g. TWAD"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 uppercase"
              />
              {errors.code && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.code.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Nodal Contact Officer"
          description="Chief engineer or executive director responsible for project approvals."
          stepNumber={2}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Designated Officer & Title *
              </label>
              <input
                type="text"
                {...register("contactPerson")}
                placeholder="e.g. Er. K. Sivakumar, Chief Engineer"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.contactPerson && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.contactPerson.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="ce.twad@tn.gov.in"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Phone / Landline *
              </label>
              <input
                type="text"
                {...register("phone")}
                placeholder="+91 44 2852 4985"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Headquarters Location & Status"
          description="Registered head office details for contract correspondence."
          stepNumber={3}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headquarters Address *
              </label>
              <input
                type="text"
                {...register("address")}
                placeholder="31, Kamarajar Salai, Chepauk"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.address && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                {...register("city")}
                placeholder="Chennai"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.city && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                {...register("state")}
                placeholder="Tamil Nadu"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
              />
              {errors.state && (
                <p className="text-[11px] text-rose-600 mt-1">{errors.state.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 font-medium"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/clients"
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
            <span>{isSubmitting ? "Saving Client..." : "Save Client Record"}</span>
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
