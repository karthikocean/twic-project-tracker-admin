"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ExportButton } from "@/components/common/ExportButton";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { subcontractorService } from "@/services/subcontractorService";
import { SubcontractorAssignment } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  Users,
  Eye,
  Building2,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

// Chart 1: Subcontractor Contract Value Distribution (₹ Cr)
const contractValueData = [
  { partner: "L&T Hydrocarbon", value: 14.2, fill: "#2563eb" },
  { partner: "Thermax Water", value: 11.5, fill: "#3b82f6" },
  { partner: "UEM India", value: 8.4, fill: "#0284c7" },
  { partner: "Flowchem Systems", value: 4.6, fill: "#0d9488" },
  { partner: "Ion Exchange", value: 4.1, fill: "#16a34a" },
];

// Chart 2: Partner Physical Progress: Planned vs Actual (%)
const partnerProgressData = [
  { partner: "L&T Hydrocarbon", planned: 75, actual: 72 },
  { partner: "Thermax Water", planned: 68, actual: 65 },
  { partner: "UEM India", planned: 55, actual: 52 },
  { partner: "Flowchem Systems", planned: 45, actual: 48 },
  { partner: "Ion Exchange", planned: 40, actual: 42 },
];

// Chart 3: Specialized Work Scope Breakdown
const scopeBreakdownData = [
  { name: "Civil & Marine Outfall", value: 35, color: "#2563eb" },
  { name: "RO Membranes & Vessels", value: 28, color: "#0284c7" },
  { name: "High-Pressure Piping", value: 18, color: "#0d9488" },
  { name: "SCADA & Telemetry", value: 12, color: "#16a34a" },
  { name: "Sludge & Dewatering", value: 7, color: "#f59e0b" },
];

// Chart 4: Invoicing, Certified & Retention (₹ Lakhs)
const billingRetentionData = [
  { partner: "L&T", invoiced: 980, certified: 940, retention: 94 },
  { partner: "Thermax", invoiced: 720, certified: 690, retention: 69 },
  { partner: "UEM", invoiced: 430, certified: 410, retention: 41 },
  { partner: "Flowchem", invoiced: 210, certified: 200, retention: 20 },
  { partner: "Ion Exch.", invoiced: 180, certified: 170, retention: 17 },
];

export default function SubcontractorsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [subcontractors, setSubcontractors] = useState<SubcontractorAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subcontractorService.getSubcontractors().then((data) => {
      setSubcontractors(data);
      setLoading(false);
    });
  }, []);

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Subcontractor Analytics Dashboard", count: 4 },
    { id: "directory", label: "Partners Directory & Assignments", count: subcontractors.length },
  ];

  const columns: Column<SubcontractorAssignment>[] = [
    {
      key: "vendorName",
      header: "Subcontractor / Partner",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            href={`/subcontractors/${row.id}`}
            className="font-semibold text-blue-700 hover:underline block leading-tight"
          >
            {row.vendorName}
          </Link>
          <span className="text-[11px] font-mono text-slate-500">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: "projectName",
      header: "Assigned Project",
      sortable: true,
      render: (row) => (
        <Link
          href={`/projects/${row.projectId}`}
          className="text-xs font-medium text-slate-800 hover:text-blue-700 max-w-[200px] block truncate"
        >
          {row.projectName}
        </Link>
      ),
    },
    {
      key: "scopeOfWork",
      header: "Scope of Work",
      render: (row) => (
        <span className="text-xs text-slate-600 block max-w-xs truncate" title={row.scopeOfWork}>
          {row.scopeOfWork}
        </span>
      ),
    },
    {
      key: "contractValue",
      header: "Contract Value",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">{formatINR(row.contractValue)}</span>
      ),
    },
    {
      key: "startDate",
      header: "Timeline",
      render: (row) => (
        <div className="text-[11px] text-slate-600 whitespace-nowrap">
          <div>{formatDate(row.startDate)}</div>
          <div>to {formatDate(row.endDate)}</div>
        </div>
      ),
    },
    {
      key: "progressPercent",
      header: "Work Progress",
      sortable: true,
      render: (row) => (
        <div className="w-28 space-y-1">
          <ProgressBar progress={row.progressPercent} size="sm" />
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Link
          href={`/subcontractors/${row.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Subcontractors Dashboard | TWIC Project ERP">
      <PageHeader
        title="Subcontractor & Partner Management Directorate"
        subtitle="Manage specialized subcontractor packages, physical milestones, work certification, retention money security, and partner performance."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Subcontractor Module", href: "/subcontractors" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/subcontractors/progress"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Work Progress View</span>
            </Link>
            <ExportButton
              data={subcontractors}
              filename="TWIC_Subcontractor_Assignments"
              label="Export Subcontractors"
            />
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD (MIN 4 CHARTS) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Partners</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{subcontractors.length || 6} Specialized</div>
              <p className="text-xs text-slate-500 mt-1">Mechanical, Civil & SCADA vendors</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <span>100% pre-qualified partners</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Subcontracted Value</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹42.80 Cr</div>
              <p className="text-xs text-slate-500 mt-1">Committed work packages on site</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Across 5 active mega projects</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Physical Progress</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">58.6%</div>
              <p className="text-xs text-slate-500 mt-1">Physical package delivery velocity</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span>No major contractual dispute</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Retention Money Held</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹4.28 Cr</div>
              <p className="text-xs text-slate-500 mt-1">Safeguarded against defects liability</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>10% security deduction active</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Subcontractor Contract Value Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Subcontractor Contract Value Distribution (₹ Cr)
                  </h3>
                  <p className="text-xs text-slate-500">Value of work packages awarded to specialized partners</p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Contract Capex
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contractValueData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="partner"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" Cr" />
                    <Tooltip
                      formatter={(val: any) => [`₹${val} Cr`, "Contract Value"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="value" name="Contract Value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Partner Physical Progress (Planned vs Actual %) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Partner Physical Progress: Planned vs Actual (%)
                  </h3>
                  <p className="text-xs text-slate-500">Scheduled milestone target vs field verified progress</p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Partner SLA
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={partnerProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="partner"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="planned" name="Planned %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Physical %" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Specialized Work Scope Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Specialized Package Scope Distribution
                  </h3>
                  <p className="text-xs text-slate-500">Breakdown of technical scopes awarded across sites</p>
                </div>
                <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  Work Packages
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scopeBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {scopeBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, "Share of Scope"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
                {scopeBreakdownData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Invoicing, Certified & Retention Withheld */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Billing, Certification & Retention (₹ Lakhs)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Invoiced claims vs certified disbursements & 10% retention withheld
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Payments Audit
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billingRetentionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="partner" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" L" />
                    <Tooltip
                      formatter={(val: any) => [`₹${val} Lakhs`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="invoiced" name="Invoiced" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="certified" name="Certified & Paid" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="retention" name="Retention Withheld" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Security Deposit / Bank Guarantee: <strong>100% Valid</strong></span>
                <span className="text-emerald-700 font-semibold">Zero Lien Disputes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRECTORY */}
      {activeTab === "directory" && (
        <DataTable
          data={subcontractors}
          columns={columns}
          isLoading={loading}
          searchPlaceholder="Search subcontractors by partner, project, or scope..."
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { label: "Active", value: "Active" },
                { label: "Pending", value: "Pending" },
                { label: "Completed", value: "Completed" },
              ],
            },
          ]}
        />
      )}
    </AppLayout>
  );
}
