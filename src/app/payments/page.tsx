"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { ExportButton } from "@/components/common/ExportButton";
import { paymentService } from "@/services/paymentService";
import { invoiceService } from "@/services/invoiceService";
import { Payment, Invoice, PaymentMode } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import { DollarSign, Plus } from "lucide-react";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    invoiceId: "",
    amount: 500000,
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "RTGS" as PaymentMode,
  });

  useEffect(() => {
    async function init() {
      const [payList, invList] = await Promise.all([
        paymentService.getPayments(),
        invoiceService.getInvoices(),
      ]);
      setPayments(payList);
      setInvoices(invList);
      if (invList.length > 0) {
        setFormData((prev) => ({ ...prev, invoiceId: invList[0].id }));
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selInvoice = invoices.find((i) => i.id === formData.invoiceId);
    if (!selInvoice) return;

    const recorded = await paymentService.recordPayment({
      invoiceId: selInvoice.id,
      invoiceNumber: selInvoice.invoiceNumber,
      projectId: selInvoice.projectId,
      projectName: selInvoice.projectName,
      payerOrPayee: selInvoice.partyName,
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      transactionReference: `TXN-${Date.now().toString().slice(-8)}`,
      status: "Completed",
    });

    setPayments([recorded, ...payments]);

    // Update local invoices list to reflect updated paid/outstanding amounts
    const updatedInvoices = await invoiceService.getInvoices();
    setInvoices(updatedInvoices);

    setIsRecordModalOpen(false);
  };

  const columns: Column<Payment>[] = [
    {
      key: "paymentReference",
      header: "Payment Reference",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-mono font-bold text-slate-900 text-xs block">
            {row.paymentReference}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Tx ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: "invoiceNumber",
      header: "Linked Invoice",
      sortable: true,
      render: (row) => (
        <span className="font-mono font-medium text-blue-700 text-xs">{row.invoiceNumber}</span>
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
      key: "paymentDate",
      header: "Payment Date",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-700">{formatDate(row.paymentDate)}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount Transferred",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-bold text-emerald-700">{formatINR(row.amount)}</span>
      ),
    },
    {
      key: "paymentMode",
      header: "Payment Mode",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
          {row.paymentMode}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <AppLayout>
      <PageHeader
        title="Payment Disbursements & Collections"
        subtitle="Real-time banking reconciliation, treasury settlement ledger, and electronic fund transfers"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Payments" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={payments}
              filename="TWIC_Payment_Disbursements_Ledger"
              label="Export Payments"
            />
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Record Payment
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Settlements Recorded</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{payments.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Electronic fund transactions</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Volume Settled</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatINR(totalCollected)}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Cleared via Treasury & Banking</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Primary Transfer Channel</div>
          <div className="text-xl font-bold text-blue-700 mt-1">RTGS / NEFT</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Direct inter-bank gross settlement</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Reconciliation Status</div>
          <div className="text-xl font-bold text-slate-800 mt-1">100% Verified</div>
          <div className="text-[11px] text-slate-500 mt-0.5">No unallocated credits</div>
        </div>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search payments by reference, invoice, or project..."
        filters={[
          {
            key: "paymentMode",
            label: "Payment Mode",
            options: [
              { label: "RTGS", value: "RTGS" },
              { label: "NEFT", value: "NEFT" },
              { label: "Bank Transfer", value: "Bank Transfer" },
              { label: "Cheque", value: "Cheque" },
            ],
          },
        ]}
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Bank Settlement / Payment Receipt"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Outstanding Invoice
            </label>
            <select
              value={formData.invoiceId}
              onChange={(e) => {
                const inv = invoices.find((i) => i.id === e.target.value);
                setFormData({
                  ...formData,
                  invoiceId: e.target.value,
                  amount: inv ? inv.outstandingAmount : 500000,
                });
              }}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600"
              required
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} | {inv.partyName} | Outstanding:{" "}
                  {formatINR(inv.outstandingAmount)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Amount (INR ₹)
            </label>
            <input
              type="number"
              min="1000"
              step="1000"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Settlement Mode
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMode: e.target.value as PaymentMode })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              >
                <option value="RTGS">RTGS (Real Time Gross Settlement)</option>
                <option value="NEFT">NEFT (National Electronic Fund)</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Treasury Cheque / DD</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800">
            <strong>Note:</strong> Recording this payment will immediately reduce the outstanding
            balance on the linked invoice and update the financial KPI cards.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800"
            >
              Confirm Settlement
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
