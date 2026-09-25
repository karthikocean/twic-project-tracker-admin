"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { ExportButton } from "@/components/common/ExportButton";
import { enquiryService } from "@/services/enquiryService";
import { tenderService } from "@/services/tenderService";
import { vendorService } from "@/services/vendorService";
import { projectService } from "@/services/projectService";
import { subcontractorService } from "@/services/subcontractorService";
import { invoiceService } from "@/services/invoiceService";
import { paymentService } from "@/services/paymentService";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Building,
  Layers,
} from "lucide-react";

export default function ReportsPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [tenders, setTenders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [subcontractors, setSubcontractors] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [dateRange, setDateRange] = useState("ALL");
  const [selectedClient, setSelectedClient] = useState("ALL");

  useEffect(() => {
    async function loadAll() {
      const [enq, tnd, vnd, prj, sub, inv, pay] = await Promise.all([
        enquiryService.getEnquiries(),
        tenderService.getTenders(),
        vendorService.getVendors(),
        projectService.getProjects(),
        subcontractorService.getSubcontractors(),
        invoiceService.getInvoices(),
        paymentService.getPayments(),
      ]);

      setEnquiries(enq);
      setTenders(tnd);
      setVendors(vnd);
      setProjects(prj);
      setSubcontractors(sub);
      setInvoices(inv);
      setPayments(pay);
      setLoading(false);
    }
    loadAll();
  }, []);

  const reportCategories = [
    {
      title: "Project Progress & Milestones Report",
      description:
        "Planned vs actual completion percentages, contractor delays, and milestone statuses.",
      count: `${projects.length} Projects`,
      data: projects,
      filename: "TWIC_Project_Progress_Report",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Client & Subcontractor Invoices Report",
      description:
        "Cumulative billing breakdown, GST taxes, realization, and ageing of receivables.",
      count: `${invoices.length} Invoices`,
      data: invoices,
      filename: "TWIC_Invoices_Financial_Report",
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: "Tender Application & Evaluation Report",
      description: "Published bids, opening dates, evaluated technical & commercial quotes.",
      count: `${tenders.length} Tenders`,
      data: tenders,
      filename: "TWIC_Tenders_Evaluation_Report",
      icon: <FileText className="w-5 h-5 text-purple-600" />,
    },
    {
      title: "Vendor Pre-Qualification Dossier Report",
      description: "Turnover, technical personnel count, GST/MSME compliance, and approval stage.",
      count: `${vendors.length} Vendors`,
      data: vendors,
      filename: "TWIC_Vendor_Prequalification_Report",
      icon: <Building className="w-5 h-5 text-amber-600" />,
    },
    {
      title: "Treasury Payment Settlements Report",
      description:
        "RTGS/NEFT clearing transactions, dates, reference numbers, and credited accounts.",
      count: `${payments.length} Payments`,
      data: payments,
      filename: "TWIC_Treasury_Settlement_Report",
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
    },
    {
      title: "Subcontractor Execution Report",
      description:
        "Packages assigned, work scopes, physical progress, and contractor disbursement.",
      count: `${subcontractors.length} Subcontractors`,
      data: subcontractors,
      filename: "TWIC_Subcontractor_Package_Report",
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: "Business Enquiries & DPR Pipeline",
      description:
        "Government enquiries, client leads, estimated sanction values, and conversion status.",
      count: `${enquiries.length} Enquiries`,
      data: enquiries,
      filename: "TWIC_Enquiries_Pipeline_Report",
      icon: <FileText className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Reports & Analytics Center"
        subtitle="Generate, filter, and export administrative, technical, and financial project documentation"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Reports" }]}
      />

      {/* Global Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-700">Filter Scope:</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Date Range:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 font-medium text-slate-700"
            >
              <option value="ALL">All Time / Complete History</option>
              <option value="FY2026">Current FY 2025-2026</option>
              <option value="Q4">Last 90 Days</option>
              <option value="M1">Current Month</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Target Client:</span>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 font-medium text-slate-700"
            >
              <option value="ALL">All Government & Private Entities</option>
              <option value="TWAD">TWAD Board</option>
              <option value="CMWSSB">Chennai Metro Water (CMWSSB)</option>
              <option value="SIPCOT">SIPCOT Tamil Nadu</option>
              <option value="TIDCO">TIDCO Defense Corridor</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Format: <strong className="text-slate-700">Client-Side CSV (UTF-8)</strong>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportCategories.map((rep, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-blue-400 transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  {rep.icon}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {rep.count}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1.5">{rep.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{rep.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Verified TWIC Schema</span>
              <ExportButton data={rep.data} filename={rep.filename} label="Download CSV" />
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
