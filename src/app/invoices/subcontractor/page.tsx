"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { ExportButton } from "@/components/common/ExportButton";
import { invoiceService } from "@/services/invoiceService";
import { projectService } from "@/services/projectService";
import { subcontractorService } from "@/services/subcontractorService";
import { Invoice, Project, SubcontractorAssignment } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  FileText,
  Plus,
  Network,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function SubcontractorInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [subcontractors, setSubcontractors] = useState<SubcontractorAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Subcontractor Invoice Form
  const [formData, setFormData] = useState({
    projectId: "",
    partyName: "",
    invoiceNumber: "",
    baseAmount: 450000,
    taxRate: 18,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    workPackage: "Piping & Civil Works Phase 1",
    remarks: "Certified as per measurement sheet checked by site team.",
  });

  const loadData = async () => {
    const [invList, projList, subList] = await Promise.all([
      invoiceService.getInvoices(),
      projectService.getProjects(),
      subcontractorService.getSubcontractors(),
    ]);
    const subInvoices = invList.filter((i) => i.invoiceType === "Subcontractor Invoice");
    setInvoices(subInvoices);
    setProjects(projList);
    setSubcontractors(subList);

    if (subList.length > 0 && !formData.partyName) {
      setFormData((prev) => ({
        ...prev,
        projectId: subList[0].projectId || (projList[0] ? projList[0].id : ""),
        partyName: subList[0].vendorName,
        invoiceNumber: `SUB-INV-2026-${String(subInvoices.length + 1).padStart(3, "0")}`,
        workPackage: subList[0].scopeOfWork,
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubcontractorChange = (vendorName: string) => {
    const matched = subcontractors.find((s) => s.vendorName === vendorName);
    setFormData((prev) => ({
      ...prev,
      partyName: vendorName,
      projectId: matched?.projectId || prev.projectId,
      workPackage: matched?.scopeOfWork || prev.workPackage,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find((p) => p.id === formData.projectId);

    const taxAmount = Math.round((Number(formData.baseAmount) * Number(formData.taxRate)) / 100);
    const totalAmount = Number(formData.baseAmount) + taxAmount;

    await invoiceService.createInvoice({
      projectId: formData.projectId || (projects[0] ? projects[0].id : "p-1"),
      projectName: selectedProj?.projectName || "TWIC Project",
      partyId: `sub-vendor-${Date.now()}`,
      partyName: formData.partyName || "Subcontractor Partner",
      invoiceType: "Subcontractor Invoice",
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      baseAmount: Number(formData.baseAmount),
      paymentStatus: "Submitted",
      remarks: `${formData.workPackage} — ${formData.remarks}`,
    });

    await loadData();
    setIsCreateModalOpen(false);
  };

  // Metrics
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, i) => acc + i.outstandingAmount, 0);
  const totalOverdue = invoices
    .filter((i) => i.paymentStatus === "Overdue")
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

  const calculatedTax = Math.round((Number(formData.baseAmount) * Number(formData.taxRate)) / 100);
  const calculatedTotal = Number(formData.baseAmount) + calculatedTax;

  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice / Bill Number",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">
            {row.invoiceNumber}
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 bg-purple-50 text-purple-700 border border-purple-200">
            Subcontractor Claim
          </span>
        </div>
      ),
    },
    {
      key: "partyName",
      header: "Subcontractor Partner",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{row.partyName}</span>
          <span className="text-[10px] text-slate-500 max-w-[200px] block truncate">
            {row.remarks || "Work package claim"}
          </span>
        </div>
      ),
    },
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-slate-800 max-w-[200px] block truncate">
          {row.projectName}
        </span>
      ),
    },
    {
      key: "invoiceDate",
      header: "Timeline",
      sortable: true,
      render: (row) => (
        <div className="text-[11px] text-slate-600 whitespace-nowrap">
          <div>Claim: {formatDate(row.invoiceDate)}</div>
          <div className="text-slate-500">Due: {formatDate(row.dueDate)}</div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Claimed Amount",
      sortable: true,
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-900 block">{formatINR(row.totalAmount)}</span>
          <span className="text-[10px] text-slate-500">Base: {formatINR(row.baseAmount)}</span>
        </div>
      ),
    },
    {
      key: "paidAmount",
      header: "Disbursed & Balance",
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <span className="text-emerald-700 font-semibold block">{formatINR(row.paidAmount)}</span>
          {row.outstandingAmount > 0 ? (
            <span className="text-amber-600 text-[11px]">Pending: {formatINR(row.outstandingAmount)}</span>
          ) : (
            <span className="text-slate-400 text-[10px]">Fully Cleared</span>
          )}
        </div>
      ),
    },
    {
      key: "paymentStatus",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Subcontractor Invoices"
        subtitle="Verify, track, and clear subcontractor progress bills, measurement certifications, and payment disbursements"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Invoicing & Payments", href: "/invoices/subcontractor" },
          { label: "Subcontractor Invoices" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={invoices}
              filename="TWIC_Subcontractor_Invoices"
              label="Export Invoices"
            />
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  invoiceNumber: `SUB-INV-2026-${String(invoices.length + 1).padStart(3, "0")}`,
                }));
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Subcontractor Invoice</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Subcontractor Billing</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalInvoiced)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{invoices.length} Bills Processed</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Disbursed (Paid Out)</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatINR(totalPaid)}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Cleared via Treasury</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Clearance</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{formatINR(totalOutstanding)}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Under verification or review</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overdue Claims</div>
          <div className="text-xl font-bold text-red-600 mt-1">{formatINR(totalOverdue)}</div>
          <div className="text-[11px] text-red-700 mt-0.5">Awaiting stage fund release</div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={invoices}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search subcontractor invoices by bill number, partner, or project..."
        filters={[
          {
            key: "paymentStatus",
            label: "Payment Status",
            options: [
              { label: "Paid", value: "Paid" },
              { label: "Submitted", value: "Submitted" },
              { label: "Partially Paid", value: "Partially Paid" },
              { label: "Overdue", value: "Overdue" },
            ],
          },
        ]}
      />

      {/* Create Subcontractor Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Record Subcontractor Invoice Claim"
        subtitle="Log subcontractor milestone claim for measurement verification and treasury disbursement"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subcontractor Partner <span className="text-rose-500">*</span>
              </label>
              {subcontractors.length > 0 ? (
                <select
                  value={formData.partyName}
                  onChange={(e) => handleSubcontractorChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                >
                  {subcontractors.map((s) => (
                    <option key={s.id} value={s.vendorName}>
                      {s.vendorName} ({s.projectName})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.partyName}
                  onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                  placeholder="e.g. Apex Mechanical Solutions Pvt Ltd"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
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
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subcontractor Bill Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bill Submission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Base Claim Amount (INR) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1000"
                value={formData.baseAmount}
                onChange={(e) => setFormData({ ...formData, baseAmount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Applicable GST Rate (%)
              </label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value={18}>18% GST (Civil & MEP)</option>
                <option value={12}>12% GST (Works Contract)</option>
                <option value={5}>5% GST</option>
                <option value={0}>0% (Tax Exempt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Payable Amount (INR)
              </label>
              <div className="px-3 py-2 text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 rounded-lg">
                {formatINR(calculatedTotal)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Package & Scope Reference <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.workPackage}
              onChange={(e) => setFormData({ ...formData, workPackage: e.target.value })}
              placeholder="e.g. Package Stage 2: Clariflocculator mechanical assembly"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Measurement Verification & Certification Notes
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Measurement sheet reference, joint inspection sign-off, or deductions..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Record Subcontractor Bill
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
