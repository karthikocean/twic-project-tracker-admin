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
import { subcontractorService } from "@/services/subcontractorService";
import { projectService } from "@/services/projectService";
import { SubcontractorAssignment, Project } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  TrendingUp,
  Plus,
  Users2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Eye,
  FileCheck,
} from "lucide-react";

export default function SubcontractorWorkProgressPage() {
  const [subcontractors, setSubcontractors] = useState<SubcontractorAssignment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Form State for Recording Subcontractor Work Progress
  const [formData, setFormData] = useState({
    subcontractorId: "",
    progressPercent: 50,
    milestoneName: "Package Stage Execution",
    claimedAmount: 250000,
    inspectionDate: new Date().toISOString().split("T")[0],
    certifyingEngineer: "Site In-charge",
    workDescription: "",
    status: "Active" as "Active" | "Completed" | "Pending",
  });

  const loadData = async () => {
    const [subs, projs] = await Promise.all([
      subcontractorService.getSubcontractors(),
      projectService.getProjects(),
    ]);
    setSubcontractors(subs);
    setProjects(projs);
    if (subs.length > 0 && !formData.subcontractorId) {
      setFormData((prev) => ({
        ...prev,
        subcontractorId: subs[0].id,
        progressPercent: subs[0].progressPercent,
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectSubcontractor = (id: string) => {
    const target = subcontractors.find((s) => s.id === id);
    setFormData((prev) => ({
      ...prev,
      subcontractorId: id,
      progressPercent: target?.progressPercent ?? prev.progressPercent,
    }));
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subcontractorId) return;

    await subcontractorService.updateSubcontractorProgress(
      formData.subcontractorId,
      Number(formData.progressPercent),
      formData.status
    );

    await loadData();
    setIsRecordModalOpen(false);
  };

  const selectedSub = subcontractors.find((s) => s.id === formData.subcontractorId);

  // Calculate metrics
  const totalPackages = subcontractors.length;
  const avgProgress =
    totalPackages > 0
      ? Math.round(
          subcontractors.reduce((acc, s) => acc + s.progressPercent, 0) / totalPackages
        )
      : 0;
  const totalContractVal = subcontractors.reduce((acc, s) => acc + s.contractValue, 0);
  const completedCount = subcontractors.filter(
    (s) => s.progressPercent >= 100 || s.status === "Completed"
  ).length;

  const columns: Column<SubcontractorAssignment>[] = [
    {
      key: "vendorName",
      header: "Subcontractor / Partner",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{row.vendorName}</span>
          <span className="text-[10px] text-slate-500 font-mono">ID: {row.id}</span>
        </div>
      ),
    },
    {
      key: "projectName",
      header: "Assigned Project",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-medium text-slate-800 max-w-[200px] block truncate">
          {row.projectName}
        </span>
      ),
    },
    {
      key: "scopeOfWork",
      header: "Package / Scope",
      render: (row) => (
        <span className="text-xs text-slate-600 block max-w-xs truncate" title={row.scopeOfWork}>
          {row.scopeOfWork}
        </span>
      ),
    },
    {
      key: "contractValue",
      header: "Package Value",
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold text-slate-800">{formatINR(row.contractValue)}</span>
      ),
    },
    {
      key: "progressPercent",
      header: "Work Progress",
      sortable: true,
      render: (row) => (
        <div className="w-32 space-y-1">
          <ProgressBar progress={row.progressPercent} size="sm" />
          <span className="text-[10px] font-bold text-slate-600 block text-right">
            {row.progressPercent}% Completed
          </span>
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
        <button
          type="button"
          onClick={() => {
            setFormData({
              subcontractorId: row.id,
              progressPercent: row.progressPercent,
              milestoneName: "Package Stage Execution",
              claimedAmount: Math.round(row.contractValue * 0.1),
              inspectionDate: new Date().toISOString().split("T")[0],
              certifyingEngineer: "Site In-charge",
              workDescription: `Progress update for ${row.scopeOfWork}`,
              status: row.status as "Active" | "Completed" | "Pending",
            });
            setIsRecordModalOpen(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
        >
          <TrendingUp className="w-3 h-3" /> Update Progress
        </button>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Subcontractor Work Progress"
        subtitle="Track on-site subcontractor execution, certified milestone completion, and inspection logs"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Subcontractor", href: "/subcontractors/progress" },
          { label: "Work Progress" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={subcontractors}
              filename="TWIC_Subcontractor_Work_Progress"
              label="Export Progress"
            />
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Work Progress</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Subcontractor Packages</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalPackages}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Civil & MEP Partners</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Average Progress</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{avgProgress}%</div>
          <div className="mt-2">
            <ProgressBar progress={avgProgress} size="sm" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Package Value</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {formatINR(totalContractVal)}
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5">Across active projects</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Completed Deliverables</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Fully certified packages</div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={subcontractors}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search by partner name, project, or scope of work..."
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

      {/* Record Subcontractor Progress Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Subcontractor Work Progress"
        subtitle="Certify site physical milestones, completed quantities, and billing claims"
        maxWidth="2xl"
      >
        <form onSubmit={handleProgressSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subcontractor Partner <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.subcontractorId}
                onChange={(e) => handleSelectSubcontractor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              >
                {subcontractors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.vendorName} ({s.projectName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Inspection & Verification Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {selectedSub && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Project:</span>
                <span className="font-semibold text-slate-800">{selectedSub.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scope of Work:</span>
                <span className="font-semibold text-slate-800">{selectedSub.scopeOfWork}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Package Value:</span>
                <span className="font-semibold text-blue-700">{formatINR(selectedSub.contractValue)}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Updated Physical Progress (% Achieved) <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progressPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, progressPercent: Number(e.target.value) })
                  }
                  className="w-24 px-3 py-2 text-xs font-bold text-blue-700 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
                <div className="flex-1">
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, formData.progressPercent))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Execution Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "Active" | "Completed" | "Pending",
                  })
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              >
                <option value="Active">Active / On-Site Work In Progress</option>
                <option value="Pending">Pending Inspection / Stage Verification</option>
                <option value="Completed">Completed & Work Handed Over</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Milestone / Activity Reference
              </label>
              <input
                type="text"
                value={formData.milestoneName}
                onChange={(e) => setFormData({ ...formData, milestoneName: e.target.value })}
                placeholder="e.g. Stage 2 - Piping & Valves Testing"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Certifying Engineer / In-charge
              </label>
              <input
                type="text"
                value={formData.certifyingEngineer}
                onChange={(e) => setFormData({ ...formData, certifyingEngineer: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Field Work Accomplished & Verification Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.workDescription}
              onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
              placeholder="Detail quantities checked, test reports verified, and physical milestone deliverables..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRecordModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Update Subcontractor Progress
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
