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
  Plus,
} from "lucide-react";
import { Modal } from "@/components/common/Modal";

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

  // Prepare New Report Form State
  const [isPrepareModalOpen, setIsPrepareModalOpen] = useState(false);
  const [reportFormData, setReportFormData] = useState({
    title: "",
    reportType: "Monthly Progress Report",
    projectId: "",
    period: "March 2026",
    progressPercent: 65,
    preparedBy: "Project Monitoring Cell",
    executiveSummary: "",
    status: "Draft",
  });
  const [customReports, setCustomReports] = useState<any[]>([]);

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

  const handleReportFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selProj = projects.find((p) => p.id === reportFormData.projectId);
    const newReport = {
      id: `rep-custom-${Date.now()}`,
      title: reportFormData.title || `${reportFormData.reportType} - ${reportFormData.period}`,
      reportType: reportFormData.reportType,
      projectName: selProj?.projectName || "All Key Projects",
      period: reportFormData.period,
      progressPercent: reportFormData.progressPercent,
      preparedBy: reportFormData.preparedBy,
      executiveSummary: reportFormData.executiveSummary || "Progress monitoring compilation for administrative review.",
      status: reportFormData.status,
      createdAt: new Date().toISOString(),
    };
    setCustomReports([newReport, ...customReports]);
    setIsPrepareModalOpen(false);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Reports & Analytics Center"
        subtitle="Generate, filter, prepare, and export administrative, technical, and financial project documentation"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Project Monitoring", href: "/progress" },
          { label: "Report Preparation" },
        ]}
        actions={
          <button
            type="button"
            onClick={() => {
              if (projects.length > 0 && !reportFormData.projectId) {
                setReportFormData((prev) => ({ ...prev, projectId: projects[0].id }));
              }
              setIsPrepareModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Prepare New Report</span>
          </button>
        }
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

      {/* Custom Prepared Reports Section */}
      {customReports.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Recently Prepared Project Documentation ({customReports.length})
            </h3>
            <span className="text-xs text-slate-500">Drafted in Current Session</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customReports.map((cRep) => (
              <div
                key={cRep.id}
                className="bg-white rounded-lg border border-blue-200 shadow-xs p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {cRep.reportType}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">{cRep.period}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{cRep.title}</h4>
                  <div className="text-[11px] text-slate-600 mb-2">Project: {cRep.projectName}</div>
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 mb-3">
                    {cRep.executiveSummary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">By {cRep.preparedBy}</span>
                  <ExportButton
                    data={[cRep]}
                    filename={cRep.title.replace(/\s+/g, "_")}
                    label="Export"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prepare New Report Modal */}
      <Modal
        isOpen={isPrepareModalOpen}
        onClose={() => setIsPrepareModalOpen(false)}
        title="Prepare Project Monitoring Report"
        subtitle="Compile periodic monitoring deliverables, milestone summaries, and technical appraisals"
        maxWidth="2xl"
      >
        <form onSubmit={handleReportFormSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Report Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={reportFormData.reportType}
                onChange={(e) => setReportFormData({ ...reportFormData, reportType: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              >
                <option value="Monthly Progress Report">Monthly Progress Report (MPR)</option>
                <option value="Site Inspection & Quality Summary">Site Inspection & Quality Summary</option>
                <option value="Milestone Completion Certificate">Milestone Completion Certificate</option>
                <option value="Financial & Billing Reconciliation">Financial & Billing Reconciliation</option>
                <option value="Contractor Delay & Bottleneck Audit">Contractor Delay & Bottleneck Audit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={reportFormData.projectId}
                onChange={(e) => setReportFormData({ ...reportFormData, projectId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectNumber} - {p.projectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Report Document Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={reportFormData.title}
                onChange={(e) => setReportFormData({ ...reportFormData, title: e.target.value })}
                placeholder="e.g. MPR - March 2026: SIPCOT Water Desalination"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reporting Period <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={reportFormData.period}
                onChange={(e) => setReportFormData({ ...reportFormData, period: e.target.value })}
                placeholder="e.g. March 2026"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Verified Physical Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={reportFormData.progressPercent}
                onChange={(e) =>
                  setReportFormData({ ...reportFormData, progressPercent: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-xs font-bold text-blue-700 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prepared By (Engineer / Unit)
              </label>
              <input
                type="text"
                value={reportFormData.preparedBy}
                onChange={(e) => setReportFormData({ ...reportFormData, preparedBy: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Executive Summary & Key Highlights <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reportFormData.executiveSummary}
              onChange={(e) => setReportFormData({ ...reportFormData, executiveSummary: e.target.value })}
              placeholder="Summary of critical milestones achieved, inspection observations, contractor deployment, and financial status..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Initial Status
              </label>
              <select
                value={reportFormData.status}
                onChange={(e) => setReportFormData({ ...reportFormData, status: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value="Draft">Draft (Internal Working Copy)</option>
                <option value="Under Review">Under Review (PMC Lead)</option>
                <option value="Submitted">Submitted (To Client Authority)</option>
                <option value="Approved">Approved & Certified</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPrepareModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save & Prepare Report
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
