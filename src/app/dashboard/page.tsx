"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileQuestion,
  FileCheck2,
  CheckCircle,
  Users2,
  Briefcase,
  AlertTriangle,
  Receipt,
  CreditCard,
  Cpu,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsCard } from "@/components/common/StatsCard";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ActivityFeed } from "@/components/common/ActivityFeed";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { getDashboardKPIs, getDashboardCharts } from "@/services/dashboardService";
import { getProjects } from "@/services/projectService";
import { getActivities } from "@/services/activityService";
import { DashboardKPIData, Project, ActivityItem } from "@/types";
import { formatINRCrores, formatDate } from "@/utils/formatters";

export default function DashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<DashboardKPIData | null>(null);
  const [chartsData, setChartsData] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [kpiRes, chartRes, prjRes, actRes] = await Promise.all([
          getDashboardKPIs(),
          getDashboardCharts(),
          getProjects(),
          getActivities(),
        ]);
        setKpis(kpiRes);
        setChartsData(chartRes);
        setProjects(prjRes);
        setActivities(actRes);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const projectColumns: Column<Project>[] = [
    {
      key: "projectNumber",
      header: "Project No.",
      sortable: true,
      width: "w-28",
      render: (p) => (
        <span className="font-semibold text-blue-600 hover:underline">{p.projectNumber}</span>
      ),
    },
    {
      key: "projectName",
      header: "Project Name",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-slate-900 truncate max-w-xs">{p.projectName}</p>
          <p className="text-[11px] text-slate-500">{p.location}</p>
        </div>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      sortable: true,
      render: (p) => <span className="truncate max-w-[180px] block">{p.clientName}</span>,
    },
    {
      key: "projectType",
      header: "Type",
      sortable: true,
      render: (p) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
          {p.projectType}
        </span>
      ),
    },
    {
      key: "progressPercent",
      header: "Progress",
      sortable: true,
      width: "w-36",
      render: (p) => (
        <ProgressBar progress={p.progressPercent} planned={p.plannedProgressPercent} size="sm" />
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      render: (p) => formatDate(p.startDate),
    },
    {
      key: "endDate",
      header: "Target End",
      sortable: true,
      render: (p) => formatDate(p.endDate),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (p) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      key: "projectManager",
      header: "Project Manager",
      sortable: true,
      render: (p) => <span className="text-slate-600 truncate block">{p.projectManager}</span>,
    },
  ];

  return (
    <AppLayout title="Executive Overview & Project Dashboard">
      <PageHeader
        title="TWIC Project Tracker Dashboard"
        subtitle="Consolidated executive view of government water, desalination, effluent treatment, and infrastructure projects."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/enquiries/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>New Enquiry</span>
            </Link>
          </div>
        }
      />

      {/* Top KPI Metric Cards (Section 11) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        <StatsCard
          title="Total Enquiries"
          value={kpis?.totalEnquiries ?? "-"}
          subtitle="RFQ & Feasibility studies"
          icon={FileQuestion}
          accentColor="blue"
          onClick={() => router.push("/enquiries")}
        />
        <StatsCard
          title="Open Enquiries"
          value={kpis?.openEnquiries ?? "-"}
          subtitle="Under review or draft"
          icon={FileQuestion}
          accentColor="amber"
          onClick={() => router.push("/enquiries")}
        />
        <StatsCard
          title="Active Tenders"
          value={kpis?.activeTenders ?? "-"}
          subtitle="In bidding or evaluation"
          icon={FileCheck2}
          accentColor="blue"
          onClick={() => router.push("/tenders")}
        />
        <StatsCard
          title="Pending Approvals"
          value={kpis?.pendingApprovals ?? "-"}
          subtitle="Level 1, 2 or Board"
          icon={CheckCircle}
          accentColor="rose"
          onClick={() => router.push("/approvals")}
        />
        <StatsCard
          title="Qualified Vendors"
          value={kpis?.qualifiedVendors ?? "-"}
          subtitle="Approved contractors"
          icon={Users2}
          accentColor="emerald"
          onClick={() => router.push("/vendors")}
        />
        <StatsCard
          title="Active Projects"
          value={kpis?.activeProjects ?? "-"}
          subtitle="Under active execution"
          icon={Briefcase}
          accentColor="blue"
          onClick={() => router.push("/projects")}
        />
        <StatsCard
          title="Delayed Projects"
          value={kpis?.delayedProjects ?? "-"}
          subtitle="Behind baseline milestone"
          icon={AlertTriangle}
          accentColor="rose"
          onClick={() => router.push("/projects")}
        />
        <StatsCard
          title="Outstanding Invoices"
          value={formatINRCrores(kpis?.outstandingInvoicesAmount || 0)}
          subtitle="Pending settlement"
          icon={Receipt}
          accentColor="amber"
          onClick={() => router.push("/invoices")}
        />
        <StatsCard
          title="Payments Received"
          value={formatINRCrores(kpis?.paymentsReceivedAmount || 0)}
          subtitle="Cumulative receipts"
          icon={CreditCard}
          accentColor="emerald"
          onClick={() => router.push("/payments")}
        />
        <StatsCard
          title="O&M Plants Running"
          value={`${kpis?.omPlantsRunning ?? 0} / ${kpis?.omPlantsTotal ?? 0}`}
          subtitle="Treatment & ZLD facilities"
          icon={Cpu}
          accentColor="emerald"
          onClick={() => router.push("/plants")}
        />
      </div>



      {/* Recharts Data Visualizations (Section 12) */}
      {chartsData && (
        <div className="mb-6">
          <DashboardCharts
            projectProgressData={chartsData.projectProgress}
            tenderStatusData={chartsData.tenderStatus}
          />
        </div>
      )}

      {/* Bottom Section: Project Table & Recent Activities (Section 13 & 14) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard Projects Table */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Active Infrastructure Projects
              </h3>
              <p className="text-xs text-slate-500">
                Live progress tracking and milestone variance
              </p>
            </div>
            <Link
              href="/projects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
            >
              <span>View All Projects</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <DataTable
            columns={projectColumns}
            data={projects}
            isLoading={isLoading}
            searchPlaceholder="Search projects by name, code or client..."
            searchKeys={["projectName", "projectNumber", "clientName", "projectManager"]}
            onRowClick={(p) => router.push(`/projects/${p.id}`)}
            initialPageSize={5}
          />
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent System Activity</h3>
              <p className="text-xs text-slate-500">Chronological governance audit trail</p>
            </div>
            <Link
              href="/audit-logs"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Full Log
            </Link>
          </div>

          <ActivityFeed activities={activities} limit={7} />
        </div>
      </div>
    </AppLayout>
  );
}
