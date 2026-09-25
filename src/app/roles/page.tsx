"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Shield, Check, Minus, Info } from "lucide-react";

export default function RolesPage() {
  const roles = [
    { name: "ADMIN", desc: "Super Administrator - Full access across all systems" },
    { name: "COO", desc: "Chief Operating Officer - Approvals, executive oversight" },
    { name: "ADVISORY", desc: "Advisory & DPR division - Costing, RFQ, transaction advisory" },
    { name: "PMC", desc: "Project Management Consultant - Site supervision, monthly reports" },
    { name: "OM", desc: "Operations & Maintenance - Water plant monitoring, ZLD SCADA" },
    { name: "ACCOUNTS", desc: "Finance & Accounts - Invoicing, disbursements, treasury" },
    { name: "HR", desc: "Human Resources - Manpower allocation & personnel" },
    { name: "PROJECT_MANAGER", desc: "Resident Engineer / Project In-Charge" },
    { name: "VIEWER", desc: "Audit & Read-Only inspection access" },
  ];

  const modules = [
    { name: "Enquiries & RFQ", access: ["ADMIN", "COO", "ADVISORY"] },
    { name: "Cost Preparation", access: ["ADMIN", "COO", "ADVISORY"] },
    { name: "Tenders & Applications", access: ["ADMIN", "COO", "ADVISORY", "PMC"] },
    { name: "Vendor Pre-Qualification", access: ["ADMIN", "COO", "PMC", "ADVISORY"] },
    { name: "Technical Evaluation", access: ["ADMIN", "COO", "ADVISORY", "PMC"] },
    { name: "Executive Approvals", access: ["ADMIN", "COO"] },
    { name: "Work Orders (LOA)", access: ["ADMIN", "COO", "ADVISORY"] },
    { name: "Projects & Milestones", access: ["ADMIN", "COO", "PMC", "PROJECT_MANAGER"] },
    { name: "Site Progress Logs", access: ["ADMIN", "COO", "PMC", "PROJECT_MANAGER"] },
    { name: "Subcontractor Allocations", access: ["ADMIN", "COO", "PMC", "PROJECT_MANAGER"] },
    { name: "O&M Plant Operations", access: ["ADMIN", "COO", "OM"] },
    { name: "Invoices & Billing", access: ["ADMIN", "COO", "ACCOUNTS"] },
    { name: "Payment Disbursements", access: ["ADMIN", "COO", "ACCOUNTS"] },
    { name: "Audit Trail & System Logs", access: ["ADMIN", "COO", "VIEWER"] },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Role & Module Authorization Matrix"
        subtitle="Operational role classifications, segregation of duties (SoD), and administrative privileges"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Administration" },
          { label: "Roles & Permissions" },
        ]}
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Module Access by Role Classification
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Segregation of Duties compliant with CVC / CAG guidelines
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">System Module</th>
                {roles.map((r) => (
                  <th key={r.name} className="px-2 py-3 text-center whitespace-nowrap">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {modules.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-semibold text-slate-900">{m.name}</td>
                  {roles.map((r) => {
                    const hasAccess = m.access.includes(r.name) || r.name === "ADMIN";
                    return (
                      <td key={r.name} className="px-2 py-3 text-center">
                        {hasAccess ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-slate-300">
                            <Minus className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((r) => (
          <div key={r.name} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div className="text-xs font-bold text-slate-900 mb-1">{r.name}</div>
            <p className="text-xs text-slate-600">{r.desc}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
