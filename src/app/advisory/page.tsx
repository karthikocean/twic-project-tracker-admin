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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";

export default function AdvisoryModulePage() {
  const [activeTab, setActiveTab] = useState("dpr");

  const tabs: TabItem[] = [
    { id: "dpr", label: "DPR (Detailed Project Report)", count: 2 },
    { id: "dpr-rfp", label: "DPR + RFP Advisory", count: 1 },
    { id: "transaction", label: "Transaction Advisory (PPP / HAM)", count: 1 },
  ];

  return (
    <AppLayout title="Advisory & Technical Feasibility Services">
      <PageHeader
        title="Advisory & DPR Directorate"
        subtitle="Government project preparation, techno-economic feasibility studies, environmental clearances, and PPP transaction advisory."
        breadcrumbs={[{ label: "Advisory Services" }]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Tab 1: DPR Section */}
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

      {/* Tab 2: DPR + RFP Section */}
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

      {/* Tab 3: Transaction Advisory (Section 19 requirement) */}
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
