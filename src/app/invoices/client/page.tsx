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
import { Invoice, Project } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import { DollarSign, FileText, Plus, CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";

export default function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Client Invoice Form
  const [formData, setFormData] = useState({
    projectId: "",
    clientName: "",
    invoiceNumber: "",
    baseAmount: 1500000,
    taxRate: 18,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    milestoneRef: "Milestone Deliverable Completion",
    remarks: "Payment due within 30 days of submission.",
  });

  const loadData = async () => {
    const [invList, projList] = await Promise.all([
      invoiceService.getInvoices(),
      projectService.getProjects(),
    ]);
    const clientOnly = invList.filter((i) => i.invoiceType === "Client Invoice");
    setInvoices(clientOnly);
    setProjects(projList);

    if (projList.length > 0 && !formData.projectId) {
      setFormData((prev) => ({
        ...prev,
        projectId: projList[0].id,
        clientName: projList[0].clientName,
        invoiceNumber: `TWIC-CLI-2026-${String(clientOnly.length + 1).padStart(3, "0")}`,
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProjectChange = (pid: string) => {
    const proj = projects.find((p) => p.id === pid);
    setFormData((prev) => ({
      ...prev,
      projectId: pid,
      clientName: proj?.clientName || prev.clientName,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find((p) => p.id === formData.projectId);

    const taxAmount = Math.round((Number(formData.baseAmount) * Number(formData.taxRate)) / 100);
    const totalAmount = Number(formData.baseAmount) + taxAmount;

    await invoiceService.createInvoice({
      projectId: formData.projectId,
      projectName: selectedProj?.projectName || "TWIC Project",
      partyId: selectedProj?.clientId || "party-1",
      partyName: formData.clientName || selectedProj?.clientName || "Client Authority",
      invoiceType: "Client Invoice",
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      baseAmount: Number(formData.baseAmount),
      paymentStatus: "Submitted",
      remarks: `${formData.milestoneRef} — ${formData.remarks}`,
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
      header: "Invoice Number",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">
            {row.invoiceNumber}
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 bg-blue-50 text-blue-700 border border-blue-200">
            Client Invoice
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
      key: "partyName",
      header: "Client Authority",
      sortable: true,
      render: (row) => <span className="text-xs font-medium text-slate-700">{row.partyName}</span>,
    },
    {
      key: "invoiceDate",
      header: "Timeline",
      sortable: true,
      render: (row) => (
        <div className="text-[11px] text-slate-600 whitespace-nowrap">
          <div>Inv: {formatDate(row.invoiceDate)}</div>
          <div className="text-slate-500">Due: {formatDate(row.dueDate)}</div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      header: "Total Invoiced",
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
      header: "Realized & Balance",
      sortable: true,
      render: (row) => (
        <div className="text-xs">
          <span className="text-emerald-700 font-semibold block">{formatINR(row.paidAmount)}</span>
          {row.outstandingAmount > 0 ? (
            <span className="text-amber-600 text-[11px]">Due: {formatINR(row.outstandingAmount)}</span>
          ) : (
            <span className="text-slate-400 text-[10px]">Settled</span>
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
        title="Client Invoices"
        subtitle="Manage government and client billing claims, GST invoices, payment receipts, and aged receivables"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Invoicing & Payments", href: "/invoices/client" },
          { label: "Client Invoices" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={invoices}
              filename="TWIC_Client_Invoices"
              label="Export Invoices"
            />
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  invoiceNumber: `TWIC-CLI-2026-${String(invoices.length + 1).padStart(3, "0")}`,
                }));
                setIsCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Client Invoice</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Client Invoiced</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalInvoiced)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{invoices.length} Invoices Issued</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Realized (Paid)</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatINR(totalPaid)}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            {totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0}% Realization Rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Outstanding Receivables</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{formatINR(totalOutstanding)}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Pending Client Clearance</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overdue Invoices</div>
          <div className="text-xl font-bold text-red-600 mt-1">{formatINR(totalOverdue)}</div>
          <div className="text-[11px] text-red-700 mt-0.5">Beyond Payment Terms</div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={invoices}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search client invoices by number, client, or project..."
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

      {/* Create Client Invoice Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate New Client Invoice"
        subtitle="Create official tax invoice against project deliverables, milestone verification, or DPR fees"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Client Authority Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Invoice Number <span className="text-rose-500">*</span>
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
                Invoice Date <span className="text-rose-500">*</span>
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
                Base Amount (INR) <span className="text-rose-500">*</span>
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
                GST / Tax Rate (%)
              </label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value={18}>18% GST (Standard)</option>
                <option value={12}>12% GST (Works Contract)</option>
                <option value={5}>5% GST</option>
                <option value={0}>0% (Tax Exempt)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Total Invoice Value (INR)
              </label>
              <div className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
                {formatINR(calculatedTotal)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Milestone / Scope Reference <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.milestoneRef}
              onChange={(e) => setFormData({ ...formData, milestoneRef: e.target.value })}
              placeholder="e.g. Stage 3: Detailed Project Report (DPR) Submission"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Payment Terms & Remarks
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Bank account details, RTGS coordinates, payment clauses..."
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
              Generate Client Invoice
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
