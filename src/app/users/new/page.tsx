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
  User as UserIcon,
  Mail,
  Building,
  Shield,
  AlertCircle,
  Briefcase,
  Phone,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSection } from "@/components/common/FormSection";
import { userService } from "@/services/userService";
import { UserRole } from "@/types";

const userSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  department: z.string().min(2, "Please select or specify a department"),
  designation: z.string().optional(),
  role: z.enum([
    "ADMIN",
    "COO",
    "ADVISORY",
    "PMC",
    "OM",
    "ACCOUNTS",
    "HR",
    "PROJECT_MANAGER",
    "VIEWER",
  ]),
  status: z.enum(["Active", "Inactive"]),
});

type UserFormData = z.infer<typeof userSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "PROJECT_MANAGER",
      status: "Active",
      department: "Project Management Consultancy",
      designation: "Executive Engineer",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    try {
      await userService.createUser({
        name: data.name,
        email: data.email,
        department: data.department,
        role: data.role as UserRole,
        status: data.status,
      });
      setSuccessToast(true);
      setTimeout(() => router.push("/users"), 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create User">
      <div className="w-full space-y-5">
        <PageHeader
          title="Create New User Account"
          subtitle="Provision enterprise credentials and assign role-based access control (RBAC) permissions."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Administration" },
            { label: "Users", href: "/users" },
            { label: "New User" },
          ]}
        />

        {successToast && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">User Account Provisioned Successfully!</p>
              <p className="text-[11px] text-emerald-700 font-normal">
                Credentials registered with active mock authentication. Redirecting to User Directory...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Section 1: Personal & Contact Information */}
          <FormSection
            title="Personal & Contact Information"
            description="Official identity details and electronic mail coordinates."
            stepNumber={1}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Er. S. Annamalai"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium ${
                    errors.name
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.name ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Official government or officer name</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="e.g. annamalai@twic-demo.com"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 ${
                    errors.email
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.email ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Used for login and notification alerts</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="e.g. +91 98400 12345"
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">Optional mobile contact coordinate</p>
              </div>
            </div>
          </FormSection>

          {/* Section 2: Department & Designation */}
          <FormSection
            title="Organizational Placement"
            description="Assign department wing and executive title."
            stepNumber={2}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  Department / Wing <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("department")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-medium"
                >
                  <option value="Executive Directorate">Executive Directorate</option>
                  <option value="Operations & Governance">Operations & Governance</option>
                  <option value="Advisory & DPR Wing">Advisory & DPR Wing</option>
                  <option value="Project Management Consultancy">Project Management Consultancy (PMC)</option>
                  <option value="Plant Operations & Maintenance">Plant Operations & Maintenance (O&M)</option>
                  <option value="Finance & Accounts">Finance & Accounts</option>
                  <option value="Human Resources & Admin">Human Resources & Admin</option>
                  <option value="Legal & Regulatory Cell">Legal & Regulatory Cell</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Operational branch within TWIC</p>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                  Official Designation / Title
                </label>
                <input
                  type="text"
                  {...register("designation")}
                  placeholder="e.g. Chief General Manager / Senior Consultant"
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800"
                />
                <p className="text-[10px] text-slate-400 mt-1">Corporate or departmental designation</p>
              </div>
            </div>
          </FormSection>

          {/* Section 3: RBAC Role & Status */}
          <FormSection
            title="Role-Based Access Control (RBAC) & Status"
            description="Grant permission level and account active state."
            stepNumber={3}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  Assigned Security Role <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("role")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-semibold"
                >
                  <option value="ADMIN">ADMIN — Full System Superuser & Audit Rights</option>
                  <option value="COO">COO — Multi-Level Governance & High-Value Approvals</option>
                  <option value="ADVISORY">ADVISORY — DPR, Feasibility & Pipeline Scopes</option>
                  <option value="PMC">PMC — Construction Supervision & Work Orders</option>
                  <option value="OM">OM — Plant Monitoring, Chemical & Power Logs</option>
                  <option value="ACCOUNTS">ACCOUNTS — Invoices, Subcontractor Ledger & Tax</option>
                  <option value="HR">HR — Staff Allocation & Manpower Rosters</option>
                  <option value="PROJECT_MANAGER">PROJECT_MANAGER — Field Execution & Daily Progress</option>
                  <option value="VIEWER">VIEWER — Read-Only Observability & Reports</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Controls access scope across navigation items</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Account Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-semibold"
                >
                  <option value="Active">Active (Immediate Portal Access)</option>
                  <option value="Inactive">Inactive (Suspended / On Leave)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Whether the account can authenticate</p>
              </div>
            </div>
          </FormSection>

          {/* Bottom Action Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                New user will be granted permissions matching the chosen <strong>RBAC Role</strong>.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href="/users"
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
                <span>{isSubmitting ? "Provisioning User..." : "Create User Account"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
