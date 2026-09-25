"use client";

import React from "react";
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

interface ChartsProps {
  projectProgressData: any[];
  tenderStatusData: any[];
  invoiceStatusData: any[];
  paymentSummaryData: any[];
  enquiryPipelineData: any[];
  plantStatusData: any[];
}

export function DashboardCharts({
  projectProgressData,
  tenderStatusData,
  invoiceStatusData,
  paymentSummaryData,
  enquiryPipelineData,
  plantStatusData,
}: ChartsProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Project Progress (Planned vs Actual) & Tender Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Project Physical Progress</h3>
              <p className="text-xs text-slate-500">Planned vs. Actual Milestone Completion (%)</p>
            </div>
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded">
              Current Fiscal Year
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectProgressData}
                margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, ""]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar
                  dataKey="planned"
                  name="Planned Progress %"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  name="Actual Progress %"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tender Status Donut Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Tender Lifecycle Status</h3>
            <p className="text-xs text-slate-500">Active bids distribution</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tenderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {tenderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Tenders`, name]}
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
          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-100 text-[11px]">
            {tenderStatusData.map((t) => (
              <div key={t.name} className="flex items-center gap-1.5 truncate">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-slate-600 truncate">{t.name}:</span>
                <span className="font-semibold text-slate-900">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Payment Cashflow & Invoice Financial Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Summary Cashflow */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Payment Cashflow Summary</h3>
              <p className="text-xs text-slate-500">
                Receipts vs Subcontractor Disbursements (₹ Crores)
              </p>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Positive Flow
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={paymentSummaryData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Cr`, ""]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "4px" }} />
                <Area
                  type="monotone"
                  dataKey="received"
                  name="Payments Received (Client)"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorRec)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="disbursed"
                  name="Vendor / Subcontractor Paid"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorDis)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice Status Overview */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Invoice Portfolio Status</h3>
              <p className="text-xs text-slate-500">
                Value of Invoices by Settlement Stage (₹ Crores)
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={invoiceStatusData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Cr`, "Amount"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="amount" name="Amount (₹ Cr)" radius={[4, 4, 0, 0]}>
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-inv-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Enquiry Pipeline & O&M Plants Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiry Pipeline */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Enquiry Pipeline Distribution</h3>
            <p className="text-xs text-slate-500">
              Estimated value of incoming RFQ / DPR requests (₹ Crores)
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enquiryPipelineData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  width={85}
                />
                <Tooltip
                  formatter={(val: any) => [`₹${val} Cr`, "Estimated Value"]}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" name="Value (₹ Cr)" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* O&M Plants Operational Uptime */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                O&M Treatment Facility Health
              </h3>
              <p className="text-xs text-slate-500">
                Live operational status and monthly uptime percentage
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              4 of 5 Running
            </span>
          </div>

          <div className="space-y-3">
            {plantStatusData.map((plant) => (
              <div
                key={plant.name}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                      plant.status === "Running" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                    }`}
                  />
                  <span className="font-semibold text-slate-800 truncate">{plant.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-500 text-[11px] font-mono">
                    Uptime: <strong className="text-slate-900">{plant.uptime}%</strong>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      plant.status === "Running"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {plant.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
