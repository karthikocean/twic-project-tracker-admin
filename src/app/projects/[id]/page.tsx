"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { Tabs } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { FileUpload } from "@/components/common/FileUpload";
import { projectService } from "@/services/projectService";
import { milestoneService } from "@/services/milestoneService";
import { subcontractorService } from "@/services/subcontractorService";
import { invoiceService } from "@/services/invoiceService";
import { paymentService } from "@/services/paymentService";
import {
  Project,
  Milestone,
  ProjectProgressHistory,
  MonthlyReport,
  SubcontractorAssignment,
  Invoice,
  Payment,
} from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  Briefcase,
  Calendar,
  Building,
  FileText,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock,
  Download,
  DollarSign,
  Layers,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progressHistory, setProgressHistory] = useState<ProjectProgressHistory[]>([]);
  const [subcontractors, setSubcontractors] = useState<SubcontractorAssignment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Modals
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);

  // New Progress Form State
  const [newProgress, setNewProgress] = useState({
    progressPercent: 65,
    workCompleted: "",
    workInProgress: "",
    issues: "",
    delays: "",
    nextPlan: "",
  });

  // New Milestone Form State
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    plannedStartDate: "2026-04-01",
    plannedEndDate: "2026-06-30",
    weightagePercent: 10,
  });

  useEffect(() => {
    async function loadData() {
      const [projData, mlData, subData, invData, payData, histData] = await Promise.all([
        projectService.getProjectById(projectId),
        milestoneService.getMilestonesByProjectId(projectId),
        subcontractorService.getSubcontractorsByProjectId(projectId),
        invoiceService.getInvoicesByProjectId(projectId),
        paymentService.getPaymentsByProjectId(projectId),
        projectService.getProjectProgressHistory(projectId),
      ]);

      setProject(projData || null);
      setMilestones(mlData);
      setSubcontractors(subData);
      setInvoices(invData);
      setPayments(payData);
      setProgressHistory(histData);
      setLoading(false);
    }
    loadData();
  }, [projectId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-slate-500">Loading project workspace...</div>
      </AppLayout>
    );
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-slate-600">
          <p className="text-lg font-semibold">Project not found</p>
          <Link href="/projects" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to Projects
          </Link>
        </div>
      </AppLayout>
    );
  }

  const variance = project.progressPercent - project.plannedProgressPercent;

  const handleUpdateProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await projectService.updateProjectProgress(
      project.id,
      newProgress.progressPercent,
      {
        workCompleted:
          newProgress.workCompleted || "Civil structural works completed as scheduled.",
        workInProgress: newProgress.workInProgress || "Electromechanical piping in progress.",
        issues: newProgress.issues,
        delays: newProgress.delays,
        nextPlan: newProgress.nextPlan || "Proceed to dry run testing next week.",
        recordedBy: "Current Engineer",
      }
    );
    if (updated) {
      setProject({ ...updated });
      const refreshedHist = await projectService.getProjectProgressHistory(project.id);
      setProgressHistory(refreshedHist);
    }
    setIsUpdateProgressOpen(false);
  };

  const handleAddMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const created = await milestoneService.createMilestone({
      projectId: project.id,
      projectName: project.projectName,
      title: newMilestone.title,
      description: newMilestone.title,
      plannedStartDate: newMilestone.plannedStartDate,
      plannedEndDate: newMilestone.plannedEndDate,
      progressPercent: 0,
      status: "Not Started",
      weightagePercent: newMilestone.weightagePercent,
    });
    setMilestones([...milestones, created]);
    setIsAddMilestoneOpen(false);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "milestones", label: `Milestones (${milestones.length})` },
    { id: "progress", label: "Progress Tracking" },
    { id: "subcontractors", label: `Subcontractors (${subcontractors.length})` },
    { id: "invoices", label: `Invoices (${invoices.length})` },
    { id: "payments", label: `Payments (${payments.length})` },
    { id: "documents", label: "Documents" },
    { id: "activity", label: "Activity Log" },
  ];

  return (
    <AppLayout>
      <PageHeader
        title={project.projectName}
        subtitle={`${project.projectNumber} • ${project.clientName} • PMC/Advisory Execution`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Projects", href: "/projects" },
          { label: project.projectNumber },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUpdateProgressOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" /> Update Progress
            </button>
            <button
              onClick={() => setIsAddMilestoneOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-md border border-slate-300 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>
        }
      />

      {/* Top Banner Summary Strip */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 mb-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Status
            </span>
            <div className="pt-1">
              <StatusBadge status={project.status} />
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Project Type:{" "}
              <span className="font-semibold text-slate-700">{project.projectType}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Contract Value
            </span>
            <div className="text-lg font-bold text-slate-900 pt-0.5">
              {formatINR(project.contractValue)}
            </div>
            <div className="text-[11px] text-slate-500">
              WO Ref:{" "}
              {project.workOrderId ? (
                <Link href={`/work-orders`} className="text-blue-600 hover:underline font-mono">
                  {project.workOrderId}
                </Link>
              ) : (
                "Direct PMC Assignment"
              )}
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <div className="flex justify-between items-center text-xs font-medium text-slate-700">
              <span className="uppercase tracking-wider text-slate-500">Execution Progress</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-700">{project.progressPercent}% Actual</span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">{project.plannedProgressPercent}% Planned</span>
                <span
                  className={`text-xs font-semibold px-1.5 py-0.2 rounded ${
                    variance >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}
                >
                  {variance >= 0 ? `+${variance}%` : `${variance}% Variance`}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <ProgressBar
                progress={project.progressPercent}
                planned={project.plannedProgressPercent}
                size="md"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
              <span>Start: {formatDate(project.startDate)}</span>
              <span>Target End: {formatDate(project.endDate)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Project Leadership
            </span>
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pt-0.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              {project.projectManager}
            </div>
            <div className="text-[11px] text-slate-500">TWIC Lead PMC / Resident Engineer</div>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Scope & Description */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Project Scope & Objectives
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Client Entity</span>
                    <Link
                      href={`/clients/${project.clientId}`}
                      className="font-semibold text-blue-600 hover:underline"
                    >
                      {project.clientName}
                    </Link>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Work Order Reference</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {project.workOrderId || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Implementation Model</span>
                    <span className="font-semibold text-slate-800">
                      {project.projectType} Model
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestones Snapshot */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" /> Key Milestone Progress
                  </h3>
                  <button
                    onClick={() => setActiveTab("milestones")}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View All ({milestones.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {milestones.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="border border-slate-100 rounded-md p-3 bg-slate-50/50"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <span className="text-xs font-semibold text-slate-900">{m.title}</span>
                          <span className="text-[11px] text-slate-500 ml-2">
                            Weightage: {m.weightagePercent}%
                          </span>
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <ProgressBar progress={m.progressPercent} size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Financial Snapshot */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Financial Progress
                </h3>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500">Total Sanctioned</span>
                    <span className="text-xs font-bold text-slate-900">
                      {formatINR(project.contractValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500">Client Invoices Billed</span>
                    <span className="text-xs font-bold text-blue-700">
                      {formatINR(invoices.reduce((acc, i) => acc + i.totalAmount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-xs text-slate-500">Collections Received</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {formatINR(payments.reduce((acc, p) => acc + p.amount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Outstanding Receivable</span>
                    <span className="text-xs font-bold text-amber-700">
                      {formatINR(invoices.reduce((acc, i) => acc + i.outstandingAmount, 0))}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setActiveTab("invoices")}
                    className="w-full text-center text-xs font-medium text-blue-600 hover:underline py-1"
                  >
                    Go to Invoices & Billing →
                  </button>
                </div>
              </div>

              {/* Linked Subcontractor summary */}
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-600" /> Appointed Subcontractors
                </h3>
                {subcontractors.length === 0 ? (
                  <p className="text-xs text-slate-500">No external subcontractors assigned.</p>
                ) : (
                  <div className="space-y-3">
                    {subcontractors.map((s) => (
                      <div key={s.id} className="p-2.5 rounded border border-slate-200 text-xs">
                        <div className="font-semibold text-slate-900">{s.vendorName}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {s.scopeOfWork}
                        </div>
                        <div className="mt-1 flex justify-between text-[11px]">
                          <span className="font-medium text-slate-700">
                            {formatINR(s.contractValue)}
                          </span>
                          <span className="font-semibold text-blue-600">
                            {s.progressPercent}% Done
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === "milestones" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Milestone Schedule</h3>
              <p className="text-xs text-slate-500">
                Tracks planned baseline vs actual execution dates and deliverables
              </p>
            </div>
            <button
              onClick={() => setIsAddMilestoneOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add Milestone
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Milestone Title</th>
                  <th className="px-4 py-3">Planned Schedule</th>
                  <th className="px-4 py-3">Actual Schedule</th>
                  <th className="px-4 py-3">Weightage</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">{m.title}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {formatDate(m.plannedStartDate)} → {formatDate(m.plannedEndDate)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {m.actualStartDate ? formatDate(m.actualStartDate) : "—"} →{" "}
                      {m.actualEndDate ? formatDate(m.actualEndDate) : "In Progress"}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{m.weightagePercent}%</td>
                    <td className="px-4 py-3 w-40">
                      <ProgressBar progress={m.progressPercent} size="sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Progress Tracking */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Physical & Operational Progress Logs
              </h3>
              <p className="text-xs text-slate-500">
                Detailed site reporting submitted by Resident Engineers
              </p>
            </div>
            <button
              onClick={() => setIsUpdateProgressOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md"
            >
              <TrendingUp className="w-3.5 h-3.5" /> Submit New Progress Log
            </button>
          </div>

          <div className="space-y-4">
            {progressHistory && progressHistory.length > 0 ? (
              progressHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Log Date: {formatDate(item.progressDate)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      Progress: {item.progressPercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        Work Completed:
                      </span>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                        {item.workCompleted}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">
                        Work In Progress:
                      </span>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                        {item.workInProgress}
                      </p>
                    </div>
                  </div>

                  {(item.issues || item.delays) && (
                    <div className="bg-amber-50/70 border border-amber-200 p-3 rounded text-xs space-y-1 text-amber-900">
                      {item.issues && (
                        <div>
                          <span className="font-semibold">Issues / Bottlenecks:</span> {item.issues}
                        </div>
                      )}
                      {item.delays && (
                        <div>
                          <span className="font-semibold">Delay Assessment:</span> {item.delays}
                        </div>
                      )}
                    </div>
                  )}

                  {item.nextPlan && (
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Plan for Next Period:</span>{" "}
                      {item.nextPlan}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-xs text-slate-500">
                No detailed site progress logs submitted yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Subcontractors */}
      {activeTab === "subcontractors" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subcontractor Allocations</h3>
              <p className="text-xs text-slate-500">
                Specialized vendors appointed under TWIC oversight
              </p>
            </div>
            <Link
              href="/subcontractors"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage All Subcontractors →
            </Link>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Vendor / Partner</th>
                <th className="px-4 py-3">Assigned Scope</th>
                <th className="px-4 py-3">Contract Value</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {subcontractors.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <Link
                      href={`/vendors/${sub.vendorId}`}
                      className="font-semibold text-blue-700 hover:underline"
                    >
                      {sub.vendorName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700 max-w-xs">{sub.scopeOfWork}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {formatINR(sub.contractValue)}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {formatDate(sub.startDate)} → {formatDate(sub.endDate)}
                  </td>
                  <td className="px-4 py-3 w-32">
                    <ProgressBar progress={sub.progressPercent} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={sub.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Invoices */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Billing & Invoices</h3>
              <p className="text-xs text-slate-500">
                Both Client PMC Claims and Subcontractor Bills
              </p>
            </div>
            <Link href="/invoices" className="text-xs font-semibold text-blue-600 hover:underline">
              Open Invoice Module →
            </Link>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Invoice No</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Party</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Outstanding</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        inv.invoiceType === "Client Invoice"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {inv.invoiceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-800">{inv.partyName}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {formatDate(inv.invoiceDate)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {formatINR(inv.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-emerald-700 font-medium">
                    {formatINR(inv.paidAmount)}
                  </td>
                  <td className="px-4 py-3 text-amber-700 font-semibold">
                    {formatINR(inv.outstandingAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 6: Payments */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Payment Settlements</h3>
              <p className="text-xs text-slate-500">
                Bank transfers and clearing records linked to this project
              </p>
            </div>
            <Link href="/payments" className="text-xs font-semibold text-blue-600 hover:underline">
              View Payment Register →
            </Link>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Payment Reference</th>
                <th className="px-4 py-3">Invoice Ref</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                    {p.paymentReference}
                  </td>
                  <td className="px-4 py-3 text-blue-600">{p.invoiceNumber}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-3 font-bold text-emerald-700">{formatINR(p.amount)}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{p.paymentMode}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 7: Documents */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Project Document Repository</h3>
            <p className="text-xs text-slate-500">
              DPRs, Technical Specs, Work Orders, Quality Certs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Detailed_Project_Report_Final.pdf
                  </div>
                  <div className="text-[11px] text-slate-500">Technical Report • 14.2 MB</div>
                </div>
              </div>
              <button
                onClick={() => alert("Simulated Download")}
                className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-slate-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3.5 rounded border border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Work_Order_Signed_Copy.pdf
                  </div>
                  <div className="text-[11px] text-slate-500">Contract Agreement • 4.8 MB</div>
                </div>
              </div>
              <button
                onClick={() => alert("Simulated Download")}
                className="p-1.5 text-slate-600 hover:text-blue-700 rounded hover:bg-slate-100"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-semibold text-slate-700 mb-2">
              Upload Supplementary Technical Record
            </h4>
            <FileUpload
              label="Attach Site Test Reports or Inspection Notes"
              onFilesChange={(files) => {
                alert(`Uploaded ${files.length} document(s) to project record`);
              }}
            />
          </div>
        </div>
      )}

      {/* Tab 8: Activity Log */}
      {activeTab === "activity" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-4">
            Project Audit & Progression Trail
          </h3>
          <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-2">
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white" />
              <div className="text-xs font-bold text-slate-900">
                Current Execution Phase in Progress
              </div>
              <div className="text-[11px] text-slate-500">
                Actual progress verified at {project.progressPercent}%
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 bg-slate-400 rounded-full border-2 border-white" />
              <div className="text-xs font-bold text-slate-800">Work Order Issued and Accepted</div>
              <div className="text-[11px] text-slate-500">
                {project.workOrderId || "Contract Execution"} • {formatDate(project.startDate)}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 bg-slate-400 rounded-full border-2 border-white" />
              <div className="text-xs font-bold text-slate-800">
                Project Sanctioned & Kick-Off Initiated
              </div>
              <div className="text-[11px] text-slate-500">
                Assigned Project Manager: {project.projectManager}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Progress */}
      <Modal
        isOpen={isUpdateProgressOpen}
        onClose={() => setIsUpdateProgressOpen(false)}
        title="Update Site Progress Log"
      >
        <form onSubmit={handleUpdateProgressSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Overall Actual Progress Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={newProgress.progressPercent}
              onChange={(e) =>
                setNewProgress({ ...newProgress, progressPercent: Number(e.target.value) })
              }
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Completed This Period
            </label>
            <textarea
              rows={2}
              value={newProgress.workCompleted}
              onChange={(e) => setNewProgress({ ...newProgress, workCompleted: e.target.value })}
              placeholder="e.g. Completed foundation civil casting for clarifier #2..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work In Progress
            </label>
            <textarea
              rows={2}
              value={newProgress.workInProgress}
              onChange={(e) => setNewProgress({ ...newProgress, workInProgress: e.target.value })}
              placeholder="e.g. Laying 400mm MS pipe header along zone 3..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issues / Bottlenecks
              </label>
              <input
                type="text"
                value={newProgress.issues}
                onChange={(e) => setNewProgress({ ...newProgress, issues: e.target.value })}
                placeholder="Optional"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delays Experienced
              </label>
              <input
                type="text"
                value={newProgress.delays}
                onChange={(e) => setNewProgress({ ...newProgress, delays: e.target.value })}
                placeholder="Optional"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Next Period Plan
            </label>
            <input
              type="text"
              value={newProgress.nextPlan}
              onChange={(e) => setNewProgress({ ...newProgress, nextPlan: e.target.value })}
              placeholder="e.g. Hydraulic pressure testing and hydro-jetting..."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsUpdateProgressOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800"
            >
              Save Progress Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Milestone */}
      <Modal
        isOpen={isAddMilestoneOpen}
        onClose={() => setIsAddMilestoneOpen(false)}
        title="Add Project Milestone"
      >
        <form onSubmit={handleAddMilestoneSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Milestone Title
            </label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              placeholder="e.g. Commissioning of Pre-treatment Dual Media Filters"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
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
                value={newMilestone.plannedStartDate}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, plannedStartDate: e.target.value })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Planned End</label>
              <input
                type="date"
                value={newMilestone.plannedEndDate}
                onChange={(e) =>
                  setNewMilestone({ ...newMilestone, plannedEndDate: e.target.value })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Weightage Allocation (%)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={newMilestone.weightagePercent}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, weightagePercent: Number(e.target.value) })
              }
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsAddMilestoneOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded hover:bg-blue-800"
            >
              Add Milestone
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
