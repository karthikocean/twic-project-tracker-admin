"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Car,
  Home,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  HardHat,
  FileCheck2,
  DollarSign,
  Layers,
  ArrowUpRight,
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
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { formatINRCrores } from "@/utils/formatters";

// Chart 1: Resident Manpower Deployment by Engineering Discipline
const manpowerData = [
  { discipline: "Civil & Structural", deployed: 6, required: 6, fill: "#2563eb" },
  { discipline: "Piping & Mechanical", deployed: 4, required: 5, fill: "#3b82f6" },
  { discipline: "Electrical & Substation", deployed: 3, required: 3, fill: "#0284c7" },
  { discipline: "SCADA & Telemetry", deployed: 2, required: 2, fill: "#0d9488" },
  { discipline: "QA/QC Inspection", deployed: 2, required: 2, fill: "#16a34a" },
  { discipline: "HSE Safety Lead", deployed: 1, required: 1, fill: "#f59e0b" },
];

// Chart 2: Contractor Physical vs Financial S-Curve Progress (%)
const sCurveData = [
  { month: "Oct 2025", baseline: 35, actual: 36, financial: 32 },
  { month: "Nov 2025", baseline: 42, actual: 44, financial: 40 },
  { month: "Dec 2025", baseline: 50, actual: 51, financial: 48 },
  { month: "Jan 2026", baseline: 58, actual: 57, financial: 53 },
  { month: "Feb 2026", baseline: 65, actual: 64, financial: 60 },
  { month: "Mar 2026 (Est)", baseline: 72, actual: 70, financial: 67 },
];

// Chart 3: Quality NCR Resolution Breakdown
const ncrData = [
  { name: "Closed & Certified", value: 108, color: "#16a34a" },
  { name: "Under Rectification", value: 18, color: "#2563eb" },
  { name: "Pending Site Action", value: 10, color: "#f59e0b" },
  { name: "Escalated to Authority", value: 4, color: "#ef4444" },
];

// Chart 4: Monthly Milestone Certification & Billing Value (₹ Crores)
const billingData = [
  { month: "Nov", claimed: 48.2, certified: 46.5, deduction: 4.8 },
  { month: "Dec", claimed: 55.4, certified: 53.0, deduction: 5.5 },
  { month: "Jan", claimed: 62.0, certified: 59.8, deduction: 6.2 },
  { month: "Feb", claimed: 71.5, certified: 68.4, deduction: 7.1 },
  { month: "Mar", claimed: 65.0, certified: 62.5, deduction: 6.5 },
];

export default function PMCModulePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs: TabItem[] = [
    { id: "dashboard", label: "PMC Analytics Dashboard", count: 4 },
    { id: "overview", label: "Supervised Mandates & Stages", count: 3 },
    { id: "logistics", label: "Expert & Site Logistics", count: 4 },
    { id: "reports", label: "Monthly Reports & Site Audits", count: 2 },
  ];

  return (
    <AppLayout title="PMC Dashboard | Project Management Consultancy">
      <PageHeader
        title="Project Management Consultancy (PMC) Directorate"
        subtitle="On-site resident engineering, quality assurance (QA/QC), contractor supervision, physical milestone audits, and payment certification."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "PMC Module", href: "/pmc" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Inspection Reports</span>
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#002b5f] hover:bg-[#001f44] rounded-lg shadow-xs transition-colors"
            >
              <Building className="h-3.5 w-3.5" />
              <span>All Monitored Projects</span>
            </Link>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD (MIN 4 CHARTS) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* PMC Executive KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Mandates</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">3 Mega Works</div>
              <p className="text-xs text-slate-500 mt-1">₹1,120 Cr portfolio under supervision</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-blue-600">
                <span>Thoothukudi, Perungudi, Sri City</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Resident Engineers</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <HardHat className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">18 Deployed</div>
              <p className="text-xs text-slate-500 mt-1">100% site presence across 3 work zones</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Civil, Mechanical, Electrical, SCADA</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Quality NCR Resolution</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">96.4%</div>
              <p className="text-xs text-slate-500 mt-1">108 of 140 non-conformances cleared</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero critical safety violations</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Certified Milestone Bills</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹342.50 Cr</div>
              <p className="text-xs text-slate-500 mt-1">Physical measurement vetted & certified</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>100% verified prior to disbursement</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Manpower Deployment by Discipline */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Resident Engineering Staff & Manpower Allocation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Deployed vs Required specialists across active construction zones
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  18 Deployed
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={manpowerData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 8]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      dataKey="discipline"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={120}
                    />
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} Engineers`, name === "deployed" ? "Deployed" : "Sanctioned"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="deployed" name="Deployed On-Site" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="required" name="Sanctioned Strength" fill="#94a3b8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Contractor S-Curve Progress Monitoring */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Physical vs Financial S-Curve Progress (%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Baseline planned schedule vs actual verified field progress & financial billing
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  S-Curve Monitoring
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
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
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      name="Planned Baseline %"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      fill="#f1f5f9"
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      name="Actual Physical %"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="#dbeafe"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="financial"
                      name="Financial Certified %"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="#dcfce7"
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Quality Assurance & NCR Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Quality NCR (Non-Conformance Reports) Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defects, material testing failures & site rectification tracking (140 total)
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  QA/QC Audits
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ncrData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {ncrData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} Reports`, name]}
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
                {ncrData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Monthly Milestone Certification & Billing Value */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Milestone Certification & Billing Value (₹ Cr)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Contractor Claimed vs PMC Certified Amount & Retention Deductions
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Billing Review
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={billingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
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
                    <Bar dataKey="claimed" name="Contractor Claimed" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="certified" name="PMC Certified" fill="#0284c7" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="deduction" name="Retention / Advance Deducted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Average Certification Turnaround: <strong>4.2 Days</strong></span>
                <span className="text-emerald-700 font-semibold">100% Measurement Book Audited</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Active PMC Mandates
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">3 Projects</p>
              <p className="text-xs text-blue-600 mt-1">Thoothukudi, Perungudi, Sri City</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Resident Engineers
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">18 Deployed</p>
              <p className="text-xs text-emerald-600 mt-1">Civil, Piping & Electrical Leads</p>
            </div>
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Monthly Reports Approved
              </span>
              <p className="text-2xl font-bold text-slate-900 mt-1">100%</p>
              <p className="text-xs text-slate-500 mt-1">Aligned with billing cycles</p>
            </div>
          </div>

          {/* Connected PMC Stage Cards */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Connected PMC Lifecycle Stages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">1. Enquiry / RFQ</span>
                <p className="text-slate-600">CMWSSB & APIIC PMC terms of reference.</p>
                <Link
                  href="/enquiries/enq-002"
                  className="text-blue-600 font-semibold hover:underline block"
                >
                  ENQ-2025-002 →
                </Link>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">2. Cost Preparation</span>
                <p className="text-slate-600">Manpower & vehicle rate schedule (₹4.32 Cr).</p>
                <Link
                  href="/costings/cst-002"
                  className="text-blue-600 font-semibold hover:underline block"
                >
                  CST-2025-002 →
                </Link>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">3. LOA / Work Order</span>
                <p className="text-slate-600">Active PMC supervision contract issued.</p>
                <Link
                  href="/work-orders/wo-002"
                  className="text-blue-600 font-semibold hover:underline block"
                >
                  WO-2024-042 →
                </Link>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">4. Milestones & Progress</span>
                <p className="text-slate-600">68% completed • Membrane installation.</p>
                <Link
                  href="/projects/prj-002"
                  className="text-blue-600 font-semibold hover:underline block"
                >
                  Project PRJ-2024-002 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOGISTICS */}
      {activeTab === "logistics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Field Site Logistics & Deployment Matrix
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Resident staff, expert consultants, inspection vehicles, and site accommodation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Site Manpower & Expert Roster</span>
                </div>
                <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                  <li>Resident Construction Manager: Er. S. Balamurugan (Full-time)</li>
                  <li>QA/QC Piping Inspector: Er. V. Rangarajan (Site stationed)</li>
                  <li>Membrane & SCADA Expert: Dr. K. Swaminathan (Bi-weekly visits)</li>
                  <li>HSE Safety Officer: Mr. A. Prakash (Daily compliance)</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Car className="h-4 w-4 text-emerald-600" />
                  <span>Vehicles & Site Office Logistics</span>
                </div>
                <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                  <li>Dedicated Site Inspection Utility 4WD (TN-09-CB-4819)</li>
                  <li>Guesthouse Accommodation: Perungudi Guest Suites (Room 204 & 205)</li>
                  <li>Mobile Testing Lab: Non-Destructive Concrete & Ultrasonic Gauge</li>
                  <li>Internet & Telemetry SCADA Uplink: 100 Mbps fiber dedicated</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === "reports" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Recent Monthly Reports & Site Inspections
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900">MR-2025-02-001 (February 2025)</span>
                <p className="text-slate-500">
                  Perungudi 60 MLD TTRO • 68% Physical Progress Achieved
                </p>
              </div>
              <StatusBadge status="Approved" size="sm" />
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900">MR-2025-02-002 (February 2025)</span>
                <p className="text-slate-500">
                  Sri City Pipeline • 52% Progress (Highway Crossing Delayed)
                </p>
              </div>
              <StatusBadge status="Reviewed" size="sm" />
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
