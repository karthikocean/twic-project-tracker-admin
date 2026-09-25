"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Tabs } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { ExportButton } from "@/components/common/ExportButton";
import { invoiceService } from "@/services/invoiceService";
import { projectService } from "@/services/projectService";
import { Invoice, Project, InvoiceStatus } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import { DollarSign, FileText, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Invoice Form
  const [formData, setFormData] = useState({
    invoiceType: "Client Invoice" as "Client Invoice" | "Subcontractor Invoice",
    projectId: "",
    partyName: "",
    baseAmount: 1000000,
    taxRate: 18,
    dueDate: "2026-06-30",
  });

  useEffect(() => {
    async function init() {
      const [invList, projList] = await Promise.all([
        invoiceService.getInvoices(),
        projectService.getProjects(),
      ]);
      setInvoices(invList);
      setProjects(projList);
      if (projList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          projectId: projList[0].id,
          partyName: projList[0].clientName,
        }));
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProj = projects.find((p) => p.id === formData.projectId);

    const created = await invoiceService.createInvoice({
      projectId: formData.projectId,
      projectName: selectedProj?.projectName || "TWIC Project",
      partyId: selectedProj?.clientId || "party-1",
      partyName: formData.partyName,
      invoiceType: formData.invoiceType,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: formData.dueDate,
      baseAmount: formData.baseAmount,
      paymentStatus: "Submitted",
    });

    setInvoices([created, ...invoices]);
    setIsCreateModalOpen(false);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === "client") return inv.invoiceType === "Client Invoice";
    if (activeTab === "subcontractor") return inv.invoiceType === "Subcontractor Invoice";
    return true;
  });

  const totalInvoiced = filteredInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = filteredInvoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = filteredInvoices.reduce((acc, i) => acc + i.outstandingAmount, 0);
  const totalOverdue = filteredInvoices
    .filter((i) => i.paymentStatus === "Overdue")
    .reduce((acc, i) => acc + i.outstandingAmount, 0);

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
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${
              row.invoiceType === "Client Invoice"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "bg-purple-50 text-purple-700 border border-purple-200"
            }`}
          >
            {row.invoiceType}
          </span>
        </div>
      ),
    },
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      render: (row) => (
        <Link
          href={`/projects/${row.projectId}`}
          className="text-xs font-medium text-slate-800 hover:text-blue-700 max-w-[200px] block truncate"
        >
          {row.projectName}
        </Link>
      ),
    },
    {
      key: "partyName",
      header: "Client / Subcontractor",
      sortable: true,
      render: (row) => <span className="text-xs font-medium text-slate-700">{row.partyName}</span>,
    },
    {
      key: "invoiceDate",
      header: "Invoice & Due Date",
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
      header: "Total (incl. GST)",
      sortable: true,
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            {formatINR(row.totalAmount)}
          </span>
          <span className="text-[10px] text-slate-500">Base: {formatINR(row.baseAmount)}</span>
        </div>
      ),
    },
    {
      key: "paidAmount",
      header: "Paid Amount",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-emerald-700">{formatINR(row.paidAmount)}</span>
      ),
    },
    {
      key: "outstandingAmount",
      header: "Outstanding",
      sortable: true,
      render: (row) => (
        <span
          className={`text-xs font-bold ${
            row.outstandingAmount > 0 ? "text-amber-700" : "text-slate-400"
          }`}
        >
          {formatINR(row.outstandingAmount)}
        </span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      key: "actions",
      header: "Action",
      render: (row) => (
        <Link
          href={`/payments`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
        >
          <DollarSign className="w-3.5 h-3.5" /> Pay
        </Link>
      ),
    },
  ];

  const tabs = [
    { id: "all", label: `All Invoices (${invoices.length})` },
    {
      id: "client",
      label: `Client PMC Billing (${invoices.filter((i) => i.invoiceType === "Client Invoice").length})`,
    },
    {
      id: "subcontractor",
      label: `Subcontractor Invoices (${invoices.filter((i) => i.invoiceType === "Subcontractor Invoice").length})`,
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Finance & Invoices Register"
        subtitle="Manage client fee bills, progressive milestone claims, contractor disbursements, and GST compliance"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Invoices" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={filteredInvoices}
              filename="TWIC_Invoices_Master"
              label="Export Invoices"
            />
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Raise Invoice
            </button>
          </div>
        }
      />

      {/* Finance KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Invoiced Amount</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatINR(totalInvoiced)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across active portfolios</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Settled / Collected</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatINR(totalPaid)}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Realized in bank accounts</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Outstanding</div>
          <div className="text-xl font-bold text-amber-600 mt-1">{formatINR(totalOutstanding)}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Pending client verification</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Overdue Collections</div>
          <div className="text-xl font-bold text-red-600 mt-1">{formatINR(totalOverdue)}</div>
          <div className="text-[11px] text-red-700 mt-0.5">Exceeded credit payment terms</div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        data={filteredInvoices}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search invoices by number, project, or party..."
        filters={[
          {
            key: "paymentStatus",
            label: "Payment Status",
            options: [
              { label: "Submitted", value: "Submitted" },
              { label: "Approved", value: "Approved" },
              { label: "Partially Paid", value: "Partially Paid" },
              { label: "Paid", value: "Paid" },
              { label: "Overdue", value: "Overdue" },
            ],
          },
        ]}
      />

      {/* Modal: Raise Invoice */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Generate Project Invoice"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Invoice Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-2.5 rounded border text-xs flex items-center gap-2 cursor-pointer ${
                  formData.invoiceType === "Client Invoice"
                    ? "border-blue-600 bg-blue-50/50 text-blue-900 font-semibold"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={formData.invoiceType === "Client Invoice"}
                  onChange={() => {
                    const sel = projects.find((p) => p.id === formData.projectId);
                    setFormData({
                      ...formData,
                      invoiceType: "Client Invoice",
                      partyName: sel ? sel.clientName : "",
                    });
                  }}
                  className="text-blue-600"
                />
                Client PMC Fee Bill
              </label>
              <label
                className={`p-2.5 rounded border text-xs flex items-center gap-2 cursor-pointer ${
                  formData.invoiceType === "Subcontractor Invoice"
                    ? "border-purple-600 bg-purple-50/50 text-purple-900 font-semibold"
                    : "border-slate-200 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  checked={formData.invoiceType === "Subcontractor Invoice"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      invoiceType: "Subcontractor Invoice",
                      partyName: "Apex Water Technologies Pvt Ltd",
                    })
                  }
                  className="text-purple-600"
                />
                Subcontractor Claim
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Linked Project
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => {
                const sel = projects.find((p) => p.id === e.target.value);
                setFormData({
                  ...formData,
                  projectId: e.target.value,
                  partyName:
                    formData.invoiceType === "Client Invoice"
                      ? sel?.clientName || ""
                      : formData.partyName,
                });
              }}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billed Party Name (Client / Subcontractor)
            </label>
            <input
              type="text"
              value={formData.partyName}
              onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Taxable Base Amount (INR ₹)
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={formData.baseAmount}
                onChange={(e) => setFormData({ ...formData, baseAmount: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GST Rate (%)
              </label>
              <select
                value={formData.taxRate}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              >
                <option value={18}>18% (Standard Services)</option>
                <option value={12}>12% (Civil Concessions)</option>
                <option value={0}>0% (Exempt)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs flex justify-between font-bold text-slate-900">
            <span>Calculated Gross Payable:</span>
            <span>
              {formatINR(formData.baseAmount + (formData.baseAmount * formData.taxRate) / 100)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
