"use client";

import React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import {
  HelpCircle,
  FileQuestion,
  Calculator,
  FileText,
  Building,
  UserCheck,
  CheckCircle2,
  Briefcase,
  Layers,
  TrendingUp,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  ArrowRight,
} from "lucide-react";

export default function OverviewLifecyclePage() {
  const steps = [
    {
      num: 1,
      title: "Business Enquiry",
      module: "/enquiries",
      desc: "Incoming RFQ / DPR requests from government agencies (TWAD, CMWSSB, SIPCOT) logged with estimated capital value.",
      icon: <FileQuestion className="w-5 h-5 text-blue-600" />,
      color: "border-blue-200 bg-blue-50/30",
    },
    {
      num: 2,
      title: "Cost Preparation",
      module: "/costings",
      desc: "Detailed manpower, technical expert, travel, and contractor rate build-up with interactive margin calculation.",
      icon: <Calculator className="w-5 h-5 text-indigo-600" />,
      color: "border-indigo-200 bg-indigo-50/30",
    },
    {
      num: 3,
      title: "Tender Publishing",
      module: "/tenders",
      desc: "Competitive e-tender publication, scope specification, bid security, and closing schedules.",
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      color: "border-purple-200 bg-purple-50/30",
    },
    {
      num: 4,
      title: "Vendor Pre-Qualification",
      module: "/pre-qualification",
      desc: "Actual 9-section statutory compliance: PAN, GST, 3-yr turnover, technical manpower, wastewater past experience.",
      icon: <Building className="w-5 h-5 text-amber-600" />,
      color: "border-amber-200 bg-amber-50/30",
    },
    {
      num: 5,
      title: "Tender Applications",
      module: "/tender-applications",
      desc: "Bid submissions logged from pre-qualified vendors with technical capability and commercial quotations.",
      icon: <Briefcase className="w-5 h-5 text-sky-600" />,
      color: "border-sky-200 bg-sky-50/30",
    },
    {
      num: 6,
      title: "Technical & Commercial Evaluation",
      module: "/evaluations",
      desc: "Comparative assessment of responsive bidders, L1 contractor determination, and verification notes.",
      icon: <UserCheck className="w-5 h-5 text-teal-600" />,
      color: "border-teal-200 bg-teal-50/30",
    },
    {
      num: 7,
      title: "Multi-Level Approvals",
      module: "/approvals",
      desc: "Governance workflow: Project Manager recommendation → Finance review → COO / Board final sanction.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      color: "border-emerald-200 bg-emerald-50/30",
    },
    {
      num: 8,
      title: "Letter of Award (LOA) / Work Order",
      module: "/work-orders",
      desc: "Formal issuance of contract agreements, performance guarantees, milestone deliverables, and mobilization dates.",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      color: "border-blue-200 bg-blue-50/30",
    },
    {
      num: 9,
      title: "Project Execution Workspace",
      module: "/projects",
      desc: "Centralized execution cockpit with 9 tabs: Milestones, physical progress, invoices, reports, documents, and audit logs.",
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      color: "border-indigo-200 bg-indigo-50/30",
    },
    {
      num: 10,
      title: "Subcontractor Allocations",
      module: "/subcontractors",
      desc: "Specialized mechanical & piping work packages assigned to certified vendors with progressive milestone certificates.",
      icon: <Building className="w-5 h-5 text-purple-600" />,
      color: "border-purple-200 bg-purple-50/30",
    },
    {
      num: 11,
      title: "Site Progress Verification",
      module: "/progress",
      desc: "Resident Engineer field inspections, physical completion %, delay bottleneck logging, and next period plans.",
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      color: "border-teal-200 bg-teal-50/30",
    },
    {
      num: 12,
      title: "Client & Subcontractor Invoices",
      module: "/invoices",
      desc: "Progressive fee billing to client departments alongside verification of subcontractor payment claims.",
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
      color: "border-amber-200 bg-amber-50/30",
    },
    {
      num: 13,
      title: "Payment Settlements & Treasury",
      module: "/payments",
      desc: "Direct electronic fund transfers (RTGS/NEFT), balance sheet reconciliation, and accounts clearance.",
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      color: "border-emerald-200 bg-emerald-50/30",
    },
    {
      num: 14,
      title: "Executive Dashboard & Analytics",
      module: "/dashboard",
      desc: "High-level KPI cards, interactive Recharts visualizations, plant ZLD telemetries, and portfolio health.",
      icon: <LayoutDashboard className="w-5 h-5 text-blue-700" />,
      color: "border-blue-300 bg-blue-100/40",
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="TWIC End-to-End Enterprise Project Lifecycle"
        subtitle="Visual workflow map illustrating the interconnected governance journey from initial client enquiry down to treasury payments"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Lifecycle Overview" }]}
      />

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs mb-8">
        <div className="max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 mb-2">
            Integrated Government Project Management Architecture
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every operational record in TWIC is connected across phases. An Enquiry converts into a
            Costing sheet and Tender. Prequalified vendors submit applications that undergo
            multi-stage evaluation and COO approval before a Work Order is sanctioned. The Work
            Order launches an active Project workspace, coordinating subcontractors, milestone
            certificates, client invoices, and treasury payouts.
          </p>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {steps.map((step) => (
          <Link
            key={step.num}
            href={step.module}
            className={`p-4 rounded-lg border ${step.color} shadow-xs hover:shadow-md transition-all group flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                  {step.num}
                </span>
                <div className="p-2 rounded bg-white border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {step.title}
              </h3>
              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-blue-700 group-hover:underline">
              <span>Access Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
