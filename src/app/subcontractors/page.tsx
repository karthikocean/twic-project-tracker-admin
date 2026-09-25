"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ExportButton } from "@/components/common/ExportButton";
import { subcontractorService } from "@/services/subcontractorService";
import { SubcontractorAssignment } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import { Users, Eye, Building2, Briefcase } from "lucide-react";

export default function SubcontractorsPage() {
  const [subcontractors, setSubcontractors] = useState<SubcontractorAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subcontractorService.getSubcontractors().then((data) => {
      setSubcontractors(data);
      setLoading(false);
    });
  }, []);

  const columns: Column<SubcontractorAssignment>[] = [
    {
      key: "vendorName",
      header: "Subcontractor / Partner",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            href={`/subcontractors/${row.id}`}
            className="font-semibold text-blue-700 hover:underline block leading-tight"
          >
            {row.vendorName}
          </Link>
          <span className="text-[11px] font-mono text-slate-500">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: "projectName",
      header: "Assigned Project",
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
      key: "scopeOfWork",
      header: "Scope of Work",
      render: (row) => (
        <span className="text-xs text-slate-600 block max-w-xs truncate" title={row.scopeOfWork}>
          {row.scopeOfWork}
        </span>
      ),
    },
    {
      key: "contractValue",
      header: "Contract Value",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">{formatINR(row.contractValue)}</span>
      ),
    },
    {
      key: "startDate",
      header: "Timeline",
      render: (row) => (
        <div className="text-[11px] text-slate-600 whitespace-nowrap">
          <div>{formatDate(row.startDate)}</div>
          <div>to {formatDate(row.endDate)}</div>
        </div>
      ),
    },
    {
      key: "progressPercent",
      header: "Work Progress",
      sortable: true,
      render: (row) => (
        <div className="w-28 space-y-1">
          <ProgressBar progress={row.progressPercent} size="sm" />
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Link
          href={`/subcontractors/${row.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Subcontractor Management"
        subtitle="Manage specialized subcontractor packages, physical milestones, work certification, and subcontractor invoices"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Subcontractors" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={subcontractors}
              filename="TWIC_Subcontractor_Assignments"
              label="Export Subcontractors"
            />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active Subcontractors</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{subcontractors.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Specialized mechanical & civil partners
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Subcontracted Value</div>
          <div className="text-xl font-bold text-blue-700 mt-1">
            {formatINR(subcontractors.reduce((acc, s) => acc + s.contractValue, 0))}
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5">Committed across projects</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">In Execution</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {subcontractors.filter((s) => s.status === "Active" || s.status === "Pending").length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">On-site work active</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Completed Packages</div>
          <div className="text-2xl font-bold text-slate-700 mt-1">
            {subcontractors.filter((s) => s.status === "Completed").length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Final bills processed</div>
        </div>
      </div>

      <DataTable
        data={subcontractors}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search subcontractors by partner, project, or scope..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "Active" },
              { label: "Pending", value: "Pending" },
              { label: "Completed", value: "Completed" },
            ],
          },
        ]}
      />
    </AppLayout>
  );
}
