"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Tabs, TabItem } from "@/components/common/Tabs";
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
  Plus,
  Activity,
  Layers,
  Building,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Modal } from "@/components/common/Modal";
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

// Chart 1: Cross-Project Physical Progress Comparison
const crossProjectData = [
  { name: "Thoothukudi Desal", planned: 72, actual: 68, variance: -4 },
  { name: "Perungudi TTRO", planned: 70, actual: 68, variance: -2 },
  { name: "Sri City Pipeline", planned: 60, actual: 52, variance: -8 },
  { name: "Hosur CETP Ph-2", planned: 45, actual: 48, variance: 3 },
  { name: "Kodungaiyur STP", planned: 30, actual: 32, variance: 2 },
];

// Chart 2: Cumulative Program S-Curve Progress Trend
const programSCurveData = [
  { month: "Sep 2025", baseline: 28, actual: 29 },
  { month: "Oct 2025", baseline: 36, actual: 35 },
  { month: "Nov 2025", baseline: 44, actual: 43 },
  { month: "Dec 2025", baseline: 52, actual: 50 },
  { month: "Jan 2026", baseline: 60, actual: 58 },
  { month: "Feb 2026", baseline: 68, actual: 64 },
];

// Chart 3: Delay & Constraint Distribution
const delayCauseData = [
  { name: "Right-of-Way / Land Access", value: 35, color: "#ef4444" },
  { name: "Material & High-Pressure Pipe Delivery", value: 25, color: "#f59e0b" },
  { name: "Statutory & Highway NOCs", value: 20, color: "#3b82f6" },
  { name: "Monsoon & High Tide Surges", value: 12, color: "#06b6d4" },
  { name: "Engineering Drawing Revisions", value: 8, color: "#8b5cf6" },
];

// Chart 4: Milestone Delivery Velocity & Schedule Health
const milestoneVelocityData = [
  { status: "Completed On-Time", count: 18, fill: "#16a34a" },
  { status: "In-Progress (On-Track)", count: 14, fill: "#2563eb" },
  { status: "Minor Delay (<15d)", count: 6, fill: "#f59e0b" },
  { status: "Critical Path Delay (>30d)", count: 2, fill: "#ef4444" },
];

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [history, setHistory] = useState<ProjectProgressHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form State for Logging Work Progress
  const [formData, setFormData] = useState({
    projectId: "",
    progressPercent: 50,
    progressDate: new Date().toISOString().split("T")[0],
    workCompleted: "",
    workInProgress: "",
    issues: "",
    delays: "",
    nextPlan: "",
    recordedBy: "Site Inspection Engineer",
  });

  useEffect(() => {
    projectService.getProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) {
        setSelectedProjectId(data[0].id);
        setFormData((prev) => ({
          ...prev,
          projectId: data[0].id,
          progressPercent: data[0].progressPercent,
        }));
        projectService.getProjectProgressHistory(data[0].id).then((h) => setHistory(h));
      }
      setLoading(false);
    });
  }, []);

  const handleSelectProject = async (id: string) => {
    setSelectedProjectId(id);
    setFormData((prev) => {
      const p = projects.find((item) => item.id === id);
      return {
        ...prev,
        projectId: id,
        progressPercent: p?.progressPercent ?? prev.progressPercent,
      };
    });
    const h = await projectService.getProjectProgressHistory(id);
    setHistory(h);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectId) return;

    await projectService.updateProjectProgress(formData.projectId, Number(formData.progressPercent), {
      workCompleted: formData.workCompleted || "Scheduled work executed according to approved specs.",
      workInProgress: formData.workInProgress || "Structural and MEP works progressing on site.",
      issues: formData.issues,
      delays: formData.delays,
      nextPlan: formData.nextPlan,
      recordedBy: formData.recordedBy,
    });

    // Refresh projects and history
    const updatedProjects = await projectService.getProjects();
    setProjects(updatedProjects);
    const updatedHistory = await projectService.getProjectProgressHistory(formData.projectId);
    setHistory(updatedHistory);
    setIsLogModalOpen(false);
  };

  const tabs: TabItem[] = [
    { id: "dashboard", label: "Project Monitoring Dashboard", count: 4 },
    { id: "detail", label: "Single Project Inspection & Field Logs", count: projects.length },
  ];

  return (
    <AppLayout title="Project Monitoring Dashboard | TWIC Project ERP">
      <PageHeader
        title="Project Monitoring & Site Progress Directorate"
        subtitle="Cross-project physical milestone tracking, multi-site S-curve velocity, bottleneck root cause analysis, and field inspection audits."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Project Monitoring", href: "/progress" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002b5f] hover:bg-[#001f44] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Site Progress</span>
            </button>
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
                <span className="text-xs font-bold uppercase tracking-wider">Monitored Portfolio</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Building className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">5 Mega Works</div>
              <p className="text-xs text-slate-500 mt-1">₹1,560 Cr infrastructure under execution</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <span>Desal, TTRO, CETP & Pipeline Networks</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Physical Progress</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">53.6%</div>
              <p className="text-xs text-slate-500 mt-1">Weighted physical completion rate</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>3 of 5 projects within schedule margin</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Milestone Schedule Health</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">80.0%</div>
              <p className="text-xs text-slate-500 mt-1">32 of 40 milestones delivered on track</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span>2 Critical Path delays under mitigation</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Field Inspection Officers</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">32 Engineers</div>
              <p className="text-xs text-slate-500 mt-1">Daily geo-tagged milestone verification</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>100% inspections documented</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Multi-Project Physical Progress (Planned vs Actual %) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cross-Project Physical Progress Comparison (%)
                  </h3>
                  <p className="text-xs text-slate-500">Planned Target vs Actual Site Progress across mega works</p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Progress Variance
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crossProjectData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
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
                    <Bar dataKey="planned" name="Planned Baseline %" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Physical %" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Cumulative Program S-Curve Progress Trend */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cumulative Program S-Curve Trajectory (%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Weighted portfolio planned baseline trajectory vs actual site achievements
                  </p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Portfolio Curve
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={programSCurveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, ""]}
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
                      dataKey="baseline"
                      name="Planned Program Baseline"
                      stroke="#94a3b8"
                      strokeDasharray="4 4"
                      fill="#f1f5f9"
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      name="Actual Progress Trajectory"
                      stroke="#16a34a"
                      strokeWidth={2.5}
                      fill="#dcfce7"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Delay & Constraint Distribution */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Field Delay & Constraint Distribution
                  </h3>
                  <p className="text-xs text-slate-500">Root cause classification of critical path schedule slippages</p>
                </div>
                <span className="text-[11px] font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded font-semibold">
                  Risk Analysis
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={delayCauseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {delayCauseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, "Share of Delays"]}
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
                {delayCauseData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Milestone Delivery Velocity & Schedule Health */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Milestone Delivery Velocity & Health
                  </h3>
                  <p className="text-xs text-slate-500">Breakdown of 40 contractual project milestone gates</p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Gates Status
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={milestoneVelocityData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 22]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      dataKey="status"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val} Milestones`, "Total"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" name="Milestones" radius={[0, 4, 4, 0]}>
                      {milestoneVelocityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SINGLE PROJECT DETAIL & FIELD LOGS */}
      {activeTab === "detail" && (
        <div className="space-y-6">
          {/* Project Selector Bar */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
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
                                <span className="font-semibold">Issues:</span> {log.issues}
                              </div>
                            )}
                            {log.delays && (
                              <div>
                                <span className="font-semibold">Delays & Bottlenecks:</span>{" "}
                                {log.delays}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                          <span>Recorded by: {log.recordedBy}</span>
                          <span>Recorded on: {formatDate(log.progressDate)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No inspection progress logs recorded yet for this project.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Log Progress Modal */}
      {isLogModalOpen && (
        <Modal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          title="Log Project Progress & Inspection Data"
        >
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Project</label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Date</label>
                <input
                  type="date"
                  value={formData.progressDate}
                  onChange={(e) => setFormData({ ...formData, progressDate: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Achieved Progress %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progressPercent}
                  onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Accomplished</label>
              <textarea
                rows={2}
                value={formData.workCompleted}
                onChange={(e) => setFormData({ ...formData, workCompleted: e.target.value })}
                placeholder="Details of physical deliverables completed during this period..."
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work In Progress</label>
              <textarea
                rows={2}
                value={formData.workInProgress}
                onChange={(e) => setFormData({ ...formData, workInProgress: e.target.value })}
                placeholder="Currently ongoing site activities and active packages..."
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issues Encountered</label>
                <input
                  type="text"
                  value={formData.issues}
                  onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                  placeholder="Material, design or environmental issues..."
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bottlenecks & Delays</label>
                <input
                  type="text"
                  value={formData.delays}
                  onChange={(e) => setFormData({ ...formData, delays: e.target.value })}
                  placeholder="Right of Way, approvals or contractor delays..."
                  className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Next Period Plan</label>
              <input
                type="text"
                value={formData.nextPlan}
                onChange={(e) => setFormData({ ...formData, nextPlan: e.target.value })}
                placeholder="Target milestones for upcoming 30 days..."
                className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#002b5f] text-white rounded hover:bg-[#001f44] cursor-pointer"
              >
                Submit Inspection Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}
