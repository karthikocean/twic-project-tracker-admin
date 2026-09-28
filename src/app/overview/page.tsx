"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Workflow,
  ArrowRight,
  Compass,
  Briefcase,
  Cpu,
  Shield,
  FileQuestion,
  Calculator,
  FileCheck2,
  FileText,
  CheckCircle2,
  Award,
  Flag,
  Receipt,
  CreditCard,
  Layers,
  Users,
  Settings,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

export default function OverviewLifecyclePage() {
  return (
    <AppLayout>
      <div className="w-full space-y-6">
        <PageHeader
          title="Project Tracker — Architectural Flow & Hierarchy"
          subtitle="Operational workflow mapping across Advisory, PMC, Plant Operations (O&M), and Governance Modules"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Overview & Flows" },
          ]}
        />

        {/* Master Flow Tree Canvas */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-8">
          {/* Top Root: Project Tracker - Dashboard */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-3 bg-[#002244] text-white rounded-xl shadow-md font-bold text-sm tracking-wide flex items-center gap-2 border border-blue-900">
              <Workflow className="w-4 h-4 text-amber-400" />
              <span>Project Tracker — Dashboard</span>
            </div>
            <div className="w-[2px] h-8 bg-slate-300" />
            <div className="w-full max-w-4xl h-[2px] bg-slate-300" />
          </div>

          {/* 7 Main Module Pillars matching diagram + User Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {/* Pillar 1: Advisory */}
            <div className="bg-slate-50/70 border border-blue-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">1. Advisory</h3>
                    <span className="text-[10px] text-blue-700 font-semibold">
                      Detailed Feasibility Report & Detailed Project Report
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  {/* Detailed Feasibility Report Sub-branch */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>Detailed Feasibility Report</span>
                    </div>
                    <div className="space-y-1 pl-1">
                      <Link href="/enquiries" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Enquiry / RFQ
                      </Link>
                      <Link href="/costings" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Preparation of Costing
                      </Link>
                    </div>
                  </div>

                  {/* Detailed Project Report Sub-branch */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <span>Detailed Project Report</span>
                    </div>
                    <div className="space-y-1 pl-1">
                      <Link href="/tenders" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> RFP / Tender Status
                      </Link>
                      <Link href="/work-orders" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> LOA / Work Order from Client
                      </Link>
                      <Link href="/milestones" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Project Deliverables / Milestone
                      </Link>
                    </div>
                  </div>

                  {/* DPR + RFP Sub-branch */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider mb-1.5">
                      DPR + RFP
                    </div>
                    <div className="space-y-1 pl-1">
                      <Link href="/approvals" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Approval Note (Expert/Subcontractor)
                      </Link>
                      <Link href="/evaluations" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Technical Bid Evaluation
                      </Link>
                      <Link href="/approvals" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Note for Approval
                      </Link>
                      <Link href="/milestones" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Milestone Status
                      </Link>
                      <Link href="/payments" className="flex items-center gap-1.5 text-blue-700 hover:underline">
                        <ArrowRight className="w-3 h-3 text-slate-400" /> Payment Note
                      </Link>
                    </div>
                  </div>

                  {/* Transaction Advisory */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <Link href="/advisory" className="font-bold text-xs text-blue-900 hover:underline flex items-center justify-between">
                      <span>Transaction Advisory</span>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/advisory"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                Open Advisory Module
              </Link>
            </div>

            {/* Pillar 2: PMC */}
            <div className="bg-slate-50/70 border border-emerald-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">2. PMC</h3>
                    <span className="text-[10px] text-emerald-700 font-semibold">Project Management Consultancy</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Pre-Contract & Procurement
                    </div>
                    <Link href="/enquiries" className="flex items-center gap-1.5 text-emerald-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Enquiry / RFQ
                    </Link>
                    <Link href="/costings" className="flex items-center gap-1.5 text-emerald-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Preparation of Costing
                    </Link>
                    <Link href="/tenders" className="flex items-center gap-1.5 text-emerald-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> RFP / Tender Upload Status
                    </Link>
                    <Link href="/work-orders" className="flex items-center gap-1.5 text-emerald-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> LOA / Work Order from Client
                    </Link>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Consultancy Logistics
                    </div>
                    <Link href="/pmc" className="flex items-center gap-1.5 text-emerald-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Approval Note: Expert/Manpower & Logistics
                    </Link>
                    <Link href="/milestones" className="flex items-center gap-1.5 text-emerald-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Milestone Tracking
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/pmc"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                Open PMC Module
              </Link>
            </div>

            {/* Pillar 3: Project Monitoring */}
            <div className="bg-slate-50/70 border border-teal-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-teal-100">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">3. Project Monitoring</h3>
                    <span className="text-[10px] text-teal-700 font-semibold">Execution & Site Oversight</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Work Progress
                    </div>
                    <Link href="/progress" className="flex items-center gap-1.5 text-teal-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Physical & Financial Progress
                    </Link>
                    <Link href="/progress" className="flex items-center gap-1.5 text-teal-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Inspection & Verification Logs
                    </Link>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Report Preparation
                    </div>
                    <Link href="/reports" className="flex items-center gap-1.5 text-teal-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Monthly Progress Reports (MPR)
                    </Link>
                    <Link href="/reports" className="flex items-center gap-1.5 text-teal-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Inspection & Milestone Summaries
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/progress"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors"
              >
                Open Project Monitoring
              </Link>
            </div>

            {/* Pillar 4: Subcontractor */}
            <div className="bg-slate-50/70 border border-purple-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-purple-100">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">4. Subcontractor</h3>
                    <span className="text-[10px] text-purple-700 font-semibold">Specialized Partner Packages</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Work Progress
                    </div>
                    <Link href="/subcontractors/progress" className="flex items-center gap-1.5 text-purple-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Subcontractor Work Progress
                    </Link>
                    <Link href="/subcontractors/progress" className="flex items-center gap-1.5 text-purple-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Physical Milestone Certification
                    </Link>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Management & Directory
                    </div>
                    <Link href="/subcontractors" className="flex items-center gap-1.5 text-purple-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Subcontractors Directory
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/subcontractors/progress"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors"
              >
                Open Subcontractor Module
              </Link>
            </div>

            {/* Pillar 5: Invoicing & Payments */}
            <div className="bg-slate-50/70 border border-amber-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-amber-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">5. Invoicing & Payments</h3>
                    <span className="text-[10px] text-amber-700 font-semibold">Billing, Claims & Settlements</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <Link href="/invoices/client" className="flex items-center justify-between text-amber-900 font-semibold hover:underline">
                      <span>Client Invoices</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500">Government billing & tax claims</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <Link href="/invoices/subcontractor" className="flex items-center justify-between text-amber-900 font-semibold hover:underline">
                      <span>Subcontractor Invoices</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500">Vendor bills & verification</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                    <Link href="/payments" className="flex items-center justify-between text-amber-900 font-semibold hover:underline">
                      <span>Payment Status</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500">Receipts & Treasury settlements</p>
                  </div>
                </div>
              </div>

              <Link
                href="/invoices/client"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
              >
                Open Invoicing & Payments
              </Link>
            </div>

            {/* Pillar 6: O&M */}
            <div className="bg-slate-50/70 border border-cyan-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-cyan-100">
                  <div className="w-7 h-7 rounded-lg bg-cyan-700 text-white flex items-center justify-center font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">6. O&M</h3>
                    <span className="text-[10px] text-cyan-700 font-semibold">Plant Operations & Maintenance</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <Link href="/plants" className="font-bold text-slate-900 hover:underline flex items-center justify-between">
                      <span>Plant Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-700" />
                    </Link>
                    <p className="text-[10px] text-slate-500 mt-1">Water treatment facilities and specs</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                      Plant Operation Status
                    </div>
                    <Link href="/plants" className="flex items-center gap-1.5 text-cyan-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Pre-treatment
                    </Link>
                    <Link href="/plants" className="flex items-center gap-1.5 text-cyan-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> RO (Reverse Osmosis)
                    </Link>
                    <Link href="/plants" className="flex items-center gap-1.5 text-cyan-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Additional Crystallizer
                    </Link>
                    <Link href="/plants" className="flex items-center gap-1.5 text-cyan-800 hover:underline">
                      <ArrowRight className="w-3 h-3 text-slate-400" /> Utility Services / ATFD
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/plants"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg transition-colors"
              >
                Open O&M Module
              </Link>
            </div>

            {/* Pillar 7: User Management (Newly organized per prompt) */}
            <div className="bg-slate-50/70 border border-indigo-200 rounded-2xl p-4 shadow-2xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-indigo-100">
                  <div className="w-7 h-7 rounded-lg bg-indigo-700 text-white flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">7. User Management</h3>
                    <span className="text-[10px] text-indigo-700 font-semibold">Security & System Governance</span>
                  </div>
                </div>

                <div className="space-y-3 mt-3 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <Link href="/users" className="flex items-center justify-between text-indigo-900 font-semibold hover:underline">
                      <span>Users Directory</span>
                      <Users className="w-3.5 h-3.5 text-indigo-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500 mt-0.5">Officer credentials & onboarding</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <Link href="/roles" className="flex items-center justify-between text-indigo-900 font-semibold hover:underline">
                      <span>Roles & Permissions</span>
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500 mt-0.5">Authorization matrix & SoD rules</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <Link href="/audit-logs" className="flex items-center justify-between text-indigo-900 font-semibold hover:underline">
                      <span>Audit Trail & System Logs</span>
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500 mt-0.5">Immutable audit forensics</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <Link href="/settings" className="flex items-center justify-between text-indigo-900 font-semibold hover:underline">
                      <span>Settings & Configuration</span>
                      <Settings className="w-3.5 h-3.5 text-indigo-600" />
                    </Link>
                    <p className="text-[10px] text-slate-500 mt-0.5">System parameters & API controls</p>
                  </div>
                </div>
              </div>

              <Link
                href="/user-management"
                className="mt-3 block text-center py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                Open User Management
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
