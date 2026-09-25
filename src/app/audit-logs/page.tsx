"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { ExportButton } from "@/components/common/ExportButton";
import { initialAuditLogs } from "@/mock/auditLogs";
import { AuditLog } from "@/types";
import { formatDate } from "@/utils/formatters";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLogs(initialAuditLogs);
      setLoading(false);
    }, 150);
  }, []);

  const columns: Column<AuditLog>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      sortable: true,
      render: (row) => (
        <div className="text-xs text-slate-700 whitespace-nowrap font-mono">
          <div>{formatDate(row.timestamp)}</div>
          <div className="text-[10px] text-slate-400">
            {new Date(row.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: "userName",
      header: "User / Actor",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block">{row.userName}</span>
          <span className="text-[10px] text-slate-500 font-mono">{row.userEmail}</span>
        </div>
      ),
    },
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            row.action.includes("APPROVED") || row.action.includes("CREATE")
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : row.action.includes("REJECT")
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
          }`}
        >
          {row.action}
        </span>
      ),
    },
    {
      key: "module",
      header: "Module",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
          {row.module}
        </span>
      ),
    },
    {
      key: "recordReference",
      header: "Record Reference",
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-700">{row.recordReference}</span>
      ),
    },
    {
      key: "description",
      header: "Audit Description",
      render: (row) => (
        <span className="text-xs text-slate-600 max-w-md block">{row.description}</span>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Immutable Audit & Compliance Trail"
        subtitle="Chronological record of system actions, document approvals, contractor selections, and financial entries"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Administration" },
          { label: "Audit Logs" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={logs}
              filename="TWIC_System_Audit_Trail"
              label="Export Audit Trail"
            />
          </div>
        }
      />

      <DataTable
        data={logs}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search audit trail by actor, action, module, or record..."
        filters={[
          {
            key: "module",
            label: "Module",
            options: [
              { label: "PRE_QUALIFICATION", value: "PRE_QUALIFICATION" },
              { label: "TENDER", value: "TENDER" },
              { label: "APPROVAL", value: "APPROVAL" },
              { label: "WORK_ORDER", value: "WORK_ORDER" },
              { label: "PROJECT", value: "PROJECT" },
              { label: "INVOICE", value: "INVOICE" },
              { label: "PAYMENT", value: "PAYMENT" },
            ],
          },
        ]}
      />
    </AppLayout>
  );
}
