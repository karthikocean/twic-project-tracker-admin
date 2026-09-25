"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { ProgressBar } from "@/components/common/ProgressBar";
import { projectService } from "@/services/projectService";
import { Project, ProjectProgressHistory } from "@/types";
import { formatDate } from "@/utils/formatters";
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  ArrowUpRight,
} from "lucide-react";

export default function ProgressPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [history, setHistory] = useState<ProjectProgressHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
        projectService.getProjectProgressHistory(data[0].id).then((h) => setHistory(h));
      }
      setLoading(false);
    });
  }, []);

  const handleSelectProject = async (id: string) => {
    setSelectedProjectId(id);
    const h = await projectService.getProjectProgressHistory(id);
    setHistory(h);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <AppLayout>
      <PageHeader
        title="Project Physical & Financial Progress"
        subtitle="Real-time site execution tracking, PMC inspection logs, delay bottlenecks, and mitigation plans"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", href: "/projects" },
          { label: "Progress Tracking" },
        ]}
      />

      {/* Project Selector Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Select Active Project:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => handleSelectProject(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800 bg-slate-50 focus:ring-2 focus:ring-blue-600 max-w-md"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.projectNumber} - {p.projectName}
              </option>
            ))}
          </select>
        </div>
        {selectedProject && (
          <Link
            href={`/projects/${selectedProject.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"
          >
            Open Project Workspace <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {selectedProject && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Current Actual Progress</span>
              <div className="text-2xl font-bold text-blue-700 mt-1">
                {selectedProject.progressPercent}%
              </div>
              <div className="mt-2">
                <ProgressBar progress={selectedProject.progressPercent} size="sm" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Planned Baseline Target</span>
              <div className="text-2xl font-bold text-slate-700 mt-1">
                {selectedProject.plannedProgressPercent}%
              </div>
              <div className="mt-2">
                <ProgressBar progress={selectedProject.plannedProgressPercent} size="sm" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Schedule Variance</span>
              <div
                className={`text-2xl font-bold mt-1 ${
                  selectedProject.variancePercent >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {selectedProject.variancePercent >= 0
                  ? `+${selectedProject.variancePercent}%`
                  : `${selectedProject.variancePercent}%`}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {selectedProject.variancePercent >= 0
                  ? "On / Ahead of schedule"
                  : "Behind schedule - Attention needed"}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-medium text-slate-500">Project Manager</span>
              <div className="text-base font-bold text-slate-900 mt-1">
                {selectedProject.projectManager}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Client: {selectedProject.clientName}
              </span>
            </div>
          </div>

          {/* Historical Inspection Logs */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Inspection & Field Progress Logs
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {history.length} Recorded Verification(s)
              </span>
            </div>

            <div className="p-5 space-y-4">
              {history.length > 0 ? (
                history.map((log) => (
                  <div
                    key={log.id}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50/40 space-y-3"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Log Date: {formatDate(log.progressDate)}
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Achieved Progress: {log.progressPercent}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">
                          Work Accomplished:
                        </span>
                        <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                          {log.workCompleted}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block mb-1">
                          Current Active Tasks:
                        </span>
                        <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200">
                          {log.workInProgress}
                        </p>
                      </div>
                    </div>

                    {(log.issues || log.delays) && (
                      <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 space-y-1">
                        {log.issues && (
                          <div>
                            <span className="font-semibold">Issues Encountered:</span> {log.issues}
                          </div>
                        )}
                        {log.delays && (
                          <div>
                            <span className="font-semibold">Reason for Delay:</span> {log.delays}
                          </div>
                        )}
                      </div>
                    )}

                    {log.nextPlan && (
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                        <span className="font-semibold text-slate-900">Next Action Plan:</span>{" "}
                        {log.nextPlan}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-xs text-slate-500">
                  No site inspection logs submitted for this project yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
