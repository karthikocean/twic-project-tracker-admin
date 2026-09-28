"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  FileText,
  Calculator,
  CheckCircle2,
  FileCheck2,
  Receipt,
  ArrowRight,
  Clock,
  Layers,
  TrendingUp,
  Landmark,
  ShieldCheck,
  Scale,
  Award,
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
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";

// Chart 1: Advisory Portfolio by Study Domain
const advisoryDomainData = [
  { name: "Detailed Project Reports (DPR)", value: 42, color: "#2563eb" },
  { name: "Techno-Economic Feasibility (TEFR)", value: 25, color: "#0284c7" },
  { name: "Transaction Advisory (PPP / HAM)", value: 18, color: "#0d9488" },
  { name: "Environmental Clearance (EIA / CRZ)", value: 15, color: "#16a34a" },
];

// Chart 2: DPR Study Milestone Clearance Funnel
const dprFunnelData = [
  { stage: "Inception Report", completed: 14, inProgress: 0 },
  { stage: "Field & Marine Survey", completed: 12, inProgress: 2 },
  { stage: "Draft DPR Submission", completed: 9, inProgress: 3 },
  { stage: "Stakeholder Review", completed: 7, inProgress: 2 },
  { stage: "Govt Cabinet Approval", completed: 5, inProgress: 2 },
];

// Chart 3: Consultancy Fee Realization by Client Agency (₹ Crores)
const feeRealizationData = [
  { agency: "TWAD Board", billed: 9.8, collected: 8.2, pipeline: 3.5 },
  { agency: "CMWSSB", billed: 7.4, collected: 6.5, pipeline: 2.8 },
  { agency: "SIPCOT", billed: 5.2, collected: 4.8, pipeline: 1.9 },
  { agency: "TIDCO", billed: 3.6, collected: 3.1, pipeline: 1.4 },
  { agency: "APIIC", billed: 2.4, collected: 1.8, pipeline: 1.2 },
];

// Chart 4: Statutory Clearances Velocity (Target vs Actual Days)
const clearanceVelocityData = [
  { clearance: "CRZ Coastal Clearance", target: 90, actual: 105 },
  { clearance: "TNPCB Consent (CTE)", target: 60, actual: 54 },
  { clearance: "Forest / Wildlife NOC", target: 120, actual: 135 },
  { clearance: "Marine Outfall (NIO)", target: 75, actual: 70 },
];

export default function AdvisoryModulePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Advisory Analytics Dashboard", count: 4 },
    { id: "dpr", label: "DPR (Detailed Project Report)", count: 2 },
    { id: "dpr-rfp", label: "DPR + RFP Advisory", count: 1 },
    { id: "transaction", label: "Transaction Advisory (PPP / HAM)", count: 1 },
  ];

  return (
    <AppLayout title="Advisory Dashboard | TWIC Project ERP">
      <PageHeader
        title="Advisory & Technical Feasibility Directorate"
        subtitle="Government project preparation, techno-economic feasibility studies (TEFR), DPR engineering, environmental clearances, and PPP transaction advisory."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Advisory Module", href: "/advisory" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/enquiries/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#002b5f] hover:bg-[#001f44] rounded-lg shadow-xs transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>+ Create DPR Enquiry</span>
            </Link>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* TAB 1: ADVISORY EXECUTIVE ANALYTICS DASHBOARD (MIN 4 CHARTS) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Advisory Mandates</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">14 Studies</div>
              <p className="text-xs text-slate-500 mt-1">DPRs, TEFRs & Transaction Advisory</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <Award className="w-3.5 h-3.5" />
                <span>5 Cleared for Cabinet Sanction</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Project Capex Structured</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Landmark className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹4,850 Cr</div>
              <p className="text-xs text-slate-500 mt-1">State water, desalination & CETP assets</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>TN & AP State Agencies</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Consultancy Order Book</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹28.4 Cr</div>
              <p className="text-xs text-slate-500 mt-1">₹24.4 Cr billed / ₹10.8 Cr in pipeline</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span>86% collection efficiency</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Statutory Velocity</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">112 Days</div>
              <p className="text-xs text-slate-500 mt-1">Average statutory clearance turnaround</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>CRZ, Forest, TNPCB approvals</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Advisory Portfolio by Domain */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Advisory Mandates by Service Domain
                  </h3>
                  <p className="text-xs text-slate-500">Distribution across consultancy practice disciplines</p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Practice Mix
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={advisoryDomainData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {advisoryDomainData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, "Share"]}
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
                {advisoryDomainData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: DPR Study Milestone Clearance Funnel */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    DPR Milestone Clearance Pipeline
                  </h3>
                  <p className="text-xs text-slate-500">Stage-wise progression from Inception to Cabinet Approval</p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Stage Velocity
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dprFunnelData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 16]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={120}
                    />
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} Studies`, name === "completed" ? "Cleared" : "Underway"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="completed" name="Cleared / Approved" fill="#16a34a" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="inProgress" name="Currently Underway" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Consultancy Fee Realization by Client Agency */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Fee Realization by Client Agency (₹ Cr)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Billed to date vs collected revenue vs upcoming pipeline
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  Financials
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feeRealizationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="agency" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" Cr" />
                    <Tooltip
                      formatter={(val: any) => [`₹${val} Cr`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="billed" name="Billed Amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="collected" name="Realized Receipts" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pipeline" name="Upcoming Pipeline" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Statutory Clearances Velocity */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Statutory Clearances Velocity (Days)
                  </h3>
                  <p className="text-xs text-slate-500">
                    SLA Target Days vs Actual Elapsed Days across statutory boards
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold">
                  NOC Timelines
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clearanceVelocityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="clearance" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" d" />
                    <Tooltip
                      formatter={(val: any) => [`${val} Days`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="target" name="Target SLA Days" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Elapsed Days" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: DPR Section */}
      {activeTab === "dpr" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  DPR Preparation & Pre-Feasibility Workflow
                </h3>
                <p className="text-xs text-slate-500">
                  Enquiry / RFQ analysis leading to itemized consultancy cost preparation.
                </p>
              </div>
              <Link
                href="/enquiries/new"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800"
              >
                + Create DPR Enquiry
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DPR Stage 1: Enquiry / RFQ */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Active DPR Enquiries
                  </span>
                  <StatusBadge status="Under Review" size="sm" />
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">ENQ-2025-001</span>
                    <span className="text-slate-400">TWAD Board</span>
                  </div>
                  <p className="text-slate-600 font-medium">
                    100 MLD Desalination Facility at Thoothukudi
                  </p>
                  <p className="text-[11px] text-slate-400">Estimated Value: ₹4.50 Cr</p>
                  <Link
                    href="/enquiries/enq-001"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold pt-1 hover:underline"
                  >
                    <span>View Enquiry</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* DPR Stage 2: Cost Preparation */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calculator className="h-4 w-4 text-emerald-600" />
                    Approved DPR Costing
                  </span>
                  <StatusBadge status="Approved" size="sm" />
                </div>
                <div className="p-3 bg-white rounded border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">CST-2025-001</span>
                    <span className="font-bold text-emerald-700">₹4.15 Cr Final</span>
                  </div>
                  <p className="text-slate-600">
                    Includes marine intake simulation, NIO consultant, bathymetry.
                  </p>
                  <Link
                    href="/costings/cst-001"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold pt-1 hover:underline"
                  >
                    <span>Open Costing Worksheet</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DPR + RFP Section */}
      {activeTab === "dpr-rfp" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              DPR + RFP Advisory Milestones & Tender Tracking
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Full lifecycle advisory from preliminary report to RFP publication, LOA award, and
              milestone tracking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">1. RFP / Tender Upload Status</span>
                  <StatusBadge status="Published" size="sm" />
                </div>
                <p className="text-slate-600">
                  Tender <strong>TND-2025-001</strong> published on e-tender portal.
                </p>
                <Link
                  href="/tenders/tnd-001"
                  className="text-blue-600 text-[11px] font-semibold hover:underline block"
                >
                  View Tender Documents →
                </Link>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">2. LOA / Work Order</span>
                  <StatusBadge status="Issued" size="sm" />
                </div>
                <p className="text-slate-600">
                  Work Order <strong>WO-2025-001</strong> issued to VA Tech Wabag (₹478 Cr).
                </p>
                <Link
                  href="/work-orders/wo-001"
                  className="text-blue-600 text-[11px] font-semibold hover:underline block"
                >
                  View Work Order Details →
                </Link>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">3. Project Milestones</span>
                  <StatusBadge status="In Progress" size="sm" />
                </div>
                <p className="text-slate-600">5 Deliverables defined • Bathymetry ongoing.</p>
                <Link
                  href="/projects/prj-001"
                  className="text-blue-600 text-[11px] font-semibold hover:underline block"
                >
                  Open Project Workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Transaction Advisory */}
      {activeTab === "transaction" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Transaction Advisory (PPP / HAM Structuring)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Expert approvals, commercial evaluation notes, and payment milestone certifications.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Approval Note for Expert</span>
                <p className="text-slate-600">
                  Senior Legal Counsel & Concession Agreement specialist engaged.
                </p>
                <StatusBadge status="Approved" size="sm" />
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Commercial Evaluation Note</span>
                <p className="text-slate-600">
                  Belagavi 24x7 Water Supply financial tariff model cleared.
                </p>
                <StatusBadge status="Commercially Evaluated" size="sm" />
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Note for Approval (Board)</span>
                <p className="text-slate-600">
                  RFP qualification criteria submitted for MD clearance.
                </p>
                <StatusBadge status="Pending" size="sm" />
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">Payment Note Release</span>
                <p className="text-slate-600">
                  Deliverable 2 invoice submitted to KUWSDB (₹89.68 L).
                </p>
                <StatusBadge status="Submitted" size="sm" />
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
