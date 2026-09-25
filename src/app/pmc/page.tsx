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
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";

export default function PMCModulePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs: TabItem[] = [
    { id: "overview", label: "PMC Projects Overview", count: 3 },
    { id: "logistics", label: "Expert / Manpower / Vehicle / Guesthouse", count: 4 },
    { id: "reports", label: "Monthly Reports & Site Audits", count: 2 },
  ];

  return (
    <AppLayout title="Project Management Consultancy (PMC)">
      <PageHeader
        title="Project Management Consultancy (PMC)"
        subtitle="On-site resident engineering, quality assurance, contractor supervision, and milestone certification."
        breadcrumbs={[{ label: "PMC Module" }]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

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
