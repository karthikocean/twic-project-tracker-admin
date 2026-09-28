"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { ExportButton } from "@/components/common/ExportButton";
import { invoiceService } from "@/services/invoiceService";
import { projectService } from "@/services/projectService";
import { Invoice, Project, InvoiceStatus } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  DollarSign,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Receipt,
  Wallet,
  Building,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

// Chart 1: Monthly Invoicing vs Collections Trend (₹ Cr)
const cashFlowTrendData = [
  { month: "Oct", billed: 3.2, collected: 2.8, outflow: 1.6 },
  { month: "Nov", billed: 3.8, collected: 3.1, outflow: 1.9 },
  { month: "Dec", billed: 4.5, collected: 3.9, outflow: 2.2 },
  { month: "Jan", billed: 4.1, collected: 3.6, outflow: 2.0 },
  { month: "Feb", billed: 5.2, collected: 4.4, outflow: 2.5 },
  { month: "Mar", billed: 4.8, collected: 4.2, outflow: 2.3 },
];

// Chart 2: Accounts Receivable Aging (₹ Lakhs)
const agingData = [
  { bucket: "0–30 Days (Current)", amount: 185, fill: "#16a34a" },
  { bucket: "31–60 Days", amount: 120, fill: "#2563eb" },
  { bucket: "61–90 Days", amount: 65, fill: "#f59e0b" },
  { bucket: ">90 Days Overdue", amount: 55, fill: "#ef4444" },
];

// Chart 3: Invoice Status Breakdown by Value
const invoiceStatusData = [
  { name: "Paid / Realized", value: 65, color: "#16a34a" },
  { name: "Verified & Cleared", value: 18, color: "#2563eb" },
  { name: "Submitted / In Review", value: 12, color: "#f59e0b" },
  { name: "Overdue Notice", value: 5, color: "#ef4444" },
];

// Chart 4: Project-wise Cash Inflow vs Outflow (₹ Cr)
const projectCashData = [
  { project: "Thoothukudi Desal", inflow: 7.8, outflow: 4.2 },
  { project: "Perungudi TTRO", inflow: 5.4, outflow: 2.9 },
  { project: "Sri City Pipeline", inflow: 3.2, outflow: 1.8 },
  { project: "Hosur CETP", inflow: 2.1, outflow: 1.2 },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Invoicing & Financial Dashboard", count: 4 },
    { id: "all", label: "All Invoices", count: invoices.length },
    {
      id: "client",
      label: "Client Invoices",
      count: invoices.filter((i) => i.invoiceType === "Client Invoice").length,
    },
    {
      id: "subcontractor",
      label: "Subcontractor Invoices",
      count: invoices.filter((i) => i.invoiceType === "Subcontractor Invoice").length,
    },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === "client") return inv.invoiceType === "Client Invoice";
    if (activeTab === "subcontractor") return inv.invoiceType === "Subcontractor Invoice";
    return true;
  });

  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice No.",
      sortable: true,
      render: (inv) => (
        <span className="font-semibold text-blue-700 hover:underline">{inv.invoiceNumber}</span>
      ),
    },
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      render: (inv) => (
        <span className="text-slate-800 font-medium truncate block max-w-[200px]">
          {inv.projectName}
        </span>
      ),
    },
    {
      key: "partyName",
      header: "Billed To / From",
      sortable: true,
      render: (inv) => (
        <div>
          <span className="text-slate-900 font-medium block truncate max-w-[160px]">
            {inv.partyName}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">{inv.invoiceType}</span>
        </div>
      ),
    },
    {
      key: "invoiceDate",
      header: "Invoice Date",
      sortable: true,
      render: (inv) => formatDate(inv.invoiceDate),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (inv) => formatDate(inv.dueDate),
    },
    {
      key: "totalAmount",
      header: "Total (Inc. GST)",
      sortable: true,
      render: (inv) => (
        <span className="font-bold text-slate-900">{formatINR(inv.totalAmount)}</span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Status",
      sortable: true,
      render: (inv) => <StatusBadge status={inv.paymentStatus} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (inv) => (
        <Link
          href={`/invoices/${inv.id}`}
          className="text-xs font-semibold text-blue-700 hover:underline"
        >
          View Bill
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Invoicing & Payments Dashboard | TWIC Project ERP">
      <PageHeader
        title="Invoicing & Cash Flow Management Directorate"
        subtitle="Consolidated receivables billing, government department collections, subcontractor disbursements, and GST compliance."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Invoicing & Payments", href: "/invoices" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002b5f] hover:bg-[#001f44] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Generate Invoice</span>
            </button>
            <ExportButton
              data={invoices}
              filename="TWIC_Invoice_Register"
              label="Export Invoices"
            />
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD (MIN 4 CHARTS) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Client Billings</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹18.45 Cr</div>
              <p className="text-xs text-slate-500 mt-1">Total revenue raised this fiscal</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <span>TWAD, CMWSSB, SIPCOT</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Collections Realized</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹14.20 Cr</div>
              <p className="text-xs text-slate-500 mt-1">77.0% collection realization rate</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero bad debt write-offs</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Subcontractor Payables</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹8.60 Cr</div>
              <p className="text-xs text-slate-500 mt-1">Certified package disbursements</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span>100% on-time vendor settlement</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Net Working Surplus</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">₹5.60 Cr</div>
              <p className="text-xs text-slate-500 mt-1">Operating treasury liquidity</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>Comfortable debt-service ratio</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Invoicing vs Collections Trend */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Monthly Invoicing vs Collections Trend (₹ Cr)
                  </h3>
                  <p className="text-xs text-slate-500">Billed client revenue vs actual cash collected vs vendor outflow</p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Cash Flow
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" Cr" />
                    <Tooltip
                      formatter={(val: any) => [`₹${val} Cr`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Area
                      type="monotone"
                      dataKey="billed"
                      name="Billed to Clients"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="#dbeafe"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      name="Realized Collections"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="#dcfce7"
                      fillOpacity={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="outflow"
                      name="Vendor Outflow"
                      stroke="#f59e0b"
                      strokeDasharray="3 3"
                      fill="#fef3c7"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Accounts Receivable Aging Analysis */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Accounts Receivable Aging Breakdown (₹ Lakhs)
                  </h3>
                  <p className="text-xs text-slate-500">Outstanding government department invoices by overdue duration</p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Receivables
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={agingData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} unit=" L" />
                    <YAxis
                      dataKey="bucket"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(val: any) => [`₹${val} Lakhs`, "Overdue Amount"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}>
                      {agingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Invoice Status Breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Invoice Status Breakdown by Value
                  </h3>
                  <p className="text-xs text-slate-500">Distribution of bills across clearance & payment gates</p>
                </div>
                <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  Status Share
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, "Share of Value"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
                {invoiceStatusData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Project Cash Inflow vs Outflow */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Project Cash Inflow vs Outflow (₹ Cr)
                  </h3>
                  <p className="text-xs text-slate-500">Net project operating margin across key infrastructure sites</p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Project Margin
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectCashData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="project" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" Cr" />
                    <Tooltip
                      formatter={(val: any) => [`₹${val} Cr`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="inflow" name="Client Inflow (Receipts)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outflow" name="Vendor Outflow (Disbursements)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Net Margin Surplus: <strong>+₹4.60 Cr</strong></span>
                <span className="text-emerald-700 font-semibold">GST Compliance 100% Filed</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TABS: ALL / CLIENT / SUBCONTRACTOR INVOICES */}
      {activeTab !== "dashboard" && (
        <DataTable
          data={filteredInvoices}
          columns={columns}
          isLoading={loading}
          searchPlaceholder="Search invoices by invoice number, project, or party name..."
          filters={[
            {
              key: "paymentStatus",
              label: "Payment Status",
              options: [
                { label: "Paid", value: "Paid" },
                { label: "Submitted", value: "Submitted" },
                { label: "Verified", value: "Verified" },
                { label: "Overdue", value: "Overdue" },
              ],
            },
          ]}
        />
      )}

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Project Invoice"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Invoice Type</label>
              <select
                value={formData.invoiceType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    invoiceType: e.target.value as "Client Invoice" | "Subcontractor Invoice",
                  })
                }
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
              >
                <option value="Client Invoice">Client Invoice (Receivable from Govt)</option>
                <option value="Subcontractor Invoice">Subcontractor Invoice (Payable)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Linked Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => {
                  const p = projects.find((proj) => proj.id === e.target.value);
                  setFormData({
                    ...formData,
                    projectId: e.target.value,
                    partyName: p?.clientName || formData.partyName,
                  });
                }}
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
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
              <label className="block font-semibold text-slate-700 mb-1">Party / Vendor Name</label>
              <input
                type="text"
                value={formData.partyName}
                onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Amount (₹)</label>
                <input
                  type="number"
                  value={formData.baseAmount}
                  onChange={(e) => setFormData({ ...formData, baseAmount: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Base Amount:</span>
                <span>{formatINR(formData.baseAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>{formatINR(formData.baseAmount * 0.18)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Total Invoice Value:</span>
                <span>{formatINR(formData.baseAmount * 1.18)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#002b5f] text-white rounded hover:bg-[#001f44] cursor-pointer font-semibold"
              >
                Generate & Issue Invoice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}
