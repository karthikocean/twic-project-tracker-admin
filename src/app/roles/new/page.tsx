"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  CheckCircle2,
  Shield,
  Building,
  AlertCircle,
  FileText,
  Layers,
  CheckSquare,
  Square,
  KeyRound,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSection } from "@/components/common/FormSection";
import { createRole, getModules, ModulePermission } from "@/services/roleService";

const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Role code must be at least 2 characters")
    .max(30, "Role code must be under 30 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Role code should only contain alphanumeric characters and underscores"),
  title: z.string().min(2, "Role display title is required"),
  department: z.string().min(2, "Department is required"),
  desc: z.string().min(5, "Please provide a concise description of responsibilities"),
  status: z.enum(["Active", "Inactive"]),
});

type RoleFormData = z.infer<typeof roleSchema>;

export default function NewRolePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [allModules, setAllModules] = useState<ModulePermission[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  useEffect(() => {
    async function loadModules() {
      const mods = await getModules();
      setAllModules(mods);
      // Pre-select first 3 common modules by default
      setSelectedModules(mods.slice(0, 3).map((m) => m.name));
    }
    loadModules();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      title: "",
      department: "Project Management Consultancy",
      desc: "",
      status: "Active",
    },
  });

  const roleNameVal = watch("name");

  const toggleModule = (moduleName: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  const selectAllModules = () => {
    setSelectedModules(allModules.map((m) => m.name));
  };

  const deselectAllModules = () => {
    setSelectedModules([]);
  };

  const onSubmit = async (data: RoleFormData) => {
    setIsSubmitting(true);
    try {
      const formattedCode = data.name.trim().toUpperCase().replace(/\s+/g, "_");
      await createRole(
        {
          name: formattedCode,
          title: data.title.trim(),
          desc: data.desc.trim(),
          department: data.department,
          status: data.status,
        },
        selectedModules
      );
      setSuccessToast(true);
      setTimeout(() => router.push("/roles"), 1200);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout title="Create Security Role">
      <div className="w-full space-y-5">
        <PageHeader
          title="Create New Security Role"
          subtitle="Define role specifications, organizational remit, and assign granular module authorization privileges."
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Administration" },
            { label: "Roles & Permissions", href: "/roles" },
            { label: "New Role" },
          ]}
        />

        {successToast && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-900">Security Role Created Successfully!</p>
              <p className="text-[11px] text-emerald-700 font-normal">
                Role registered and module authorization matrix updated. Redirecting to Roles Matrix...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Section 1: Role Specification */}
          <FormSection
            title="Role Specification & Classification"
            description="Unique identifier, display title, and organizational department."
            stepNumber={1}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                  Role Code / Identifier <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  onChange={(e) => {
                    setValue("name", e.target.value.toUpperCase().replace(/\s+/g, "_"));
                  }}
                  placeholder="e.g. TECH_LEAD"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-mono font-bold uppercase ${
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
                  <p className="text-[10px] text-slate-400 mt-1">
                    System key (e.g. QUALITY_AUDITOR, GIS_LEAD)
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  Display Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  placeholder="e.g. Lead Technical Specialist"
                  className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium ${
                    errors.title
                      ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                  }`}
                />
                {errors.title ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title.message}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">Human-friendly role name</p>
                )}
              </div>

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
                  <option value="Internal Audit">Internal Audit & Compliance</option>
                  <option value="Engineering & Design Cell">Engineering & Design Cell</option>
                  <option value="Quality Assurance & Safety">Quality Assurance & Safety</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Organizational division</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Role Status <span className="text-rose-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full px-3 py-2 text-xs bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 font-semibold"
                >
                  <option value="Active">Active (Available for Assignment)</option>
                  <option value="Inactive">Inactive (Draft / Deprecated)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Whether users can be assigned this role</p>
              </div>
            </div>
          </FormSection>

          {/* Section 2: Role Description & Remit */}
          <FormSection
            title="Scope & Governance Remit"
            description="Detail the responsibilities, limits of authority, and compliance expectations."
            stepNumber={2}
          >
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                Role Description & Authority Scope <span className="text-rose-500">*</span>
              </label>
              <textarea
                {...register("desc")}
                rows={3}
                placeholder="e.g. Lead Technical Specialist - Responsible for technical evaluation of tender bids, DPR validation, and on-site engineering milestone clearances."
                className={`w-full px-3 py-2 text-xs bg-slate-50/70 border rounded-lg transition-colors focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 ${
                  errors.desc
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : "border-slate-200 hover:border-slate-300 focus:border-blue-600"
                }`}
              />
              {errors.desc ? (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.desc.message}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">
                  Brief description displayed on authorization cards and audit summaries.
                </p>
              )}
            </div>
          </FormSection>

          {/* Section 3: Module Permissions Authorization */}
          <FormSection
            title="Module Access Authorization"
            description="Select the system modules and workspaces this role will be permitted to access."
            stepNumber={3}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Granted Access Modules:
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                    {selectedModules.length} of {allModules.length} Modules Authorized
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllModules}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={deselectAllModules}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                  >
                    <Square className="h-3.5 w-3.5" />
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Module Checkbox Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
                {allModules.map((module) => {
                  const isChecked = selectedModules.includes(module.name);
                  return (
                    <label
                      key={module.name}
                      onClick={() => toggleModule(module.name)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-blue-50/40 border-blue-300 shadow-2xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Handled by container onClick
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
                      />
                      <div className="text-xs">
                        <div className={`font-semibold ${isChecked ? "text-blue-900" : "text-slate-800"}`}>
                          {module.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {isChecked ? "Full Read/Write Access" : "Restricted Access"}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </FormSection>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                New role <strong>{roleNameVal || "ROLE_CODE"}</strong> will immediately appear in the Authorization Matrix.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href="/roles"
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
                <span>{isSubmitting ? "Creating Role..." : "Save & Register Role"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
