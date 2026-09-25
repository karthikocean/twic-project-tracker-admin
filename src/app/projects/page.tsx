"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ExportButton } from "@/components/common/ExportButton";
import { projectService } from "@/services/projectService";
import { Project } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import { Briefcase, Eye, Calendar, UserCheck, AlertTriangle } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const columns: Column<Project>[] = [
    {
      key: "projectNumber",
      header: "Project Code & Name",
      sortable: true,
      render: (row) => (
        <div>
          <Link
            href={`/projects/${row.id}`}
            className="font-semibold text-blue-700 hover:underline block leading-tight"
          >
            {row.projectName}
          </Link>
          <span className="text-xs font-mono text-slate-500">{row.projectNumber}</span>
        </div>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      sortable: true,
      render: (row) => <span className="text-xs font-medium text-slate-700">{row.clientName}</span>,
    },
    {
      key: "projectType",
      header: "Type",
      sortable: true,
      render: (row) => (
        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
          {row.projectType}
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
      key: "progressPercent",
      header: "Progress (Actual / Planned)",
      sortable: true,
      render: (row) => (
        <div className="w-36 space-y-1">
          <ProgressBar
            progress={row.progressPercent}
            planned={row.plannedProgressPercent}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Timeline",
      render: (row) => (
        <div className="text-[11px] text-slate-600">
          <div>Start: {formatDate(row.startDate)}</div>
          <div>End: {formatDate(row.endDate)}</div>
        </div>
      ),
    },
    {
      key: "projectManager",
      header: "Project Manager",
      render: (row) => (
        <span className="text-xs text-slate-700 font-medium flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-slate-400" />
          {row.projectManager}
        </span>
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
      header: "Action",
      render: (row) => (
        <Link
          href={`/projects/${row.id}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Workspace
        </Link>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Project Management Workspace"
        subtitle="Track execution, milestones, physical & financial progress, subcontractors, invoices, and plant handovers"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Projects" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={projects}
              filename="TWIC_Projects_Master_List"
              label="Export Projects"
            />
          </div>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Tracked Projects</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{projects.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Across Water, Wastewater, Advisory
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">In Execution</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {projects.filter((p) => p.status === "In Progress").length}
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-0.5">
            Active site teams deployed
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Variance / Delayed Alert</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1.5">
            {projects.filter((p) => p.status === "Delayed").length}
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Requires PMC site review</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Portfolio Value</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">
            {formatINR(projects.reduce((acc, p) => acc + p.contractValue, 0))}
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Under TWIC Management</div>
        </div>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search projects by code, title, client, or manager..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "In Progress", value: "In Progress" },
              { label: "Delayed", value: "Delayed" },
              { label: "Completed", value: "Completed" },
              { label: "On Hold", value: "On Hold" },
            ],
          },
        ]}
      />
    </AppLayout>
  );
}
