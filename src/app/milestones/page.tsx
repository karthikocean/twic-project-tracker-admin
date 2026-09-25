"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Modal } from "@/components/common/Modal";
import { ExportButton } from "@/components/common/ExportButton";
import { milestoneService } from "@/services/milestoneService";
import { projectService } from "@/services/projectService";
import { Milestone, Project } from "@/types";
import { formatDate } from "@/utils/formatters";
import { Plus, Layers, AlertTriangle } from "lucide-react";

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Milestone state
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    plannedStartDate: "2026-05-01",
    plannedEndDate: "2026-08-31",
    weightagePercent: 15,
  });

  useEffect(() => {
    async function init() {
      const [allMilestones, allProjects] = await Promise.all([
        milestoneService.getMilestones(),
        projectService.getProjects(),
      ]);
      setMilestones(allMilestones);
      setProjects(allProjects);
      if (allProjects.length > 0) {
        setFormData((prev) => ({ ...prev, projectId: allProjects[0].id }));
      }
      setLoading(false);
    }
    init();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selProj = projects.find((p) => p.id === formData.projectId);
    const created = await milestoneService.createMilestone({
      projectId: formData.projectId,
      projectName: selProj ? selProj.projectName : "TWIC Project",
      title: formData.title,
      description: formData.title,
      plannedStartDate: formData.plannedStartDate,
      plannedEndDate: formData.plannedEndDate,
      progressPercent: 0,
      status: "Not Started",
      weightagePercent: Number(formData.weightagePercent),
    });
    setMilestones([created, ...milestones]);
    setIsAddModalOpen(false);
    setFormData({
      projectId: projects[0]?.id || "",
      title: "",
      plannedStartDate: "2026-05-01",
      plannedEndDate: "2026-08-31",
      weightagePercent: 15,
    });
  };

  const columns: Column<Milestone>[] = [
    {
      key: "title",
      header: "Milestone Deliverable",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 block leading-tight">{row.title}</span>
          <span className="text-[11px] text-slate-500 font-mono">ID: {row.id}</span>
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
          className="text-xs font-medium text-blue-700 hover:underline max-w-[200px] block truncate"
        >
          {row.projectName}
        </Link>
      ),
    },
    {
      key: "plannedStartDate",
      header: "Planned Timeline",
      sortable: true,
      render: (row) => (
        <div className="text-xs text-slate-600 whitespace-nowrap">
          <div>Start: {formatDate(row.plannedStartDate)}</div>
          <div>End: {formatDate(row.plannedEndDate)}</div>
        </div>
      ),
    },
    {
      key: "actualStartDate",
      header: "Actual Schedule",
      render: (row) => (
        <div className="text-xs text-slate-600 whitespace-nowrap">
          <div>Start: {row.actualStartDate ? formatDate(row.actualStartDate) : "Pending"}</div>
          <div>End: {row.actualEndDate ? formatDate(row.actualEndDate) : "—"}</div>
        </div>
      ),
    },
    {
      key: "weightagePercent",
      header: "Weightage",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">{row.weightagePercent}%</span>
      ),
    },
    {
      key: "progressPercent",
      header: "Execution Progress",
      sortable: true,
      render: (row) => (
        <div className="w-32 space-y-1">
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
      header: "Action",
      render: (row) => (
        <Link
          href={`/projects/${row.projectId}`}
          className="text-xs text-blue-700 hover:underline font-medium"
        >
          View in Project →
        </Link>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Project Milestones Register"
        subtitle="Comprehensive baseline milestone tracking, deliverable verification, and schedule compliance"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", href: "/projects" },
          { label: "Milestones" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={milestones}
              filename="TWIC_Milestones_Register"
              label="Export Milestones"
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Milestones Tracked</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{milestones.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Across all PMC & Advisory projects
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Completed Deliverables</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {milestones.filter((m) => m.status === "Completed").length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            Passed sign-off & client verification
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Active In Progress</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {milestones.filter((m) => m.status === "In Progress").length}
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">Under current site works</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Delayed Milestones</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1">
            {milestones.filter((m) => m.status === "Delayed").length}
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            Escalated to Chief Operating Officer
          </div>
        </div>
      </div>

      <DataTable
        data={milestones}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search milestones by title or ID..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Completed", value: "Completed" },
              { label: "In Progress", value: "In Progress" },
              { label: "Not Started", value: "Not Started" },
              { label: "Delayed", value: "Delayed" },
            ],
          },
        ]}
      />

      {/* Add Milestone Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Baseline Milestone"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Project
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
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
              Milestone Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Civil construction up to plinth level for Pump House"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Planned Start
              </label>
              <input
                type="date"
                value={formData.plannedStartDate}
                onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Planned End</label>
              <input
                type="date"
                value={formData.plannedEndDate}
                onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Weightage (%)</label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.weightagePercent}
              onChange={(e) =>
                setFormData({ ...formData, weightagePercent: Number(e.target.value) })
              }
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800"
            >
              Save Milestone
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
