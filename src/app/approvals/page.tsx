"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  ShieldCheck,
  Calendar,
  User,
  Plus,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { getApprovals, processApproval } from "@/services/approvalService";
import { Approval, ApprovalStatus } from "@/types";
import { formatDate } from "@/utils/formatters";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "Approved" | "Rejected" | "Returned";
    title: string;
    message: string;
  }>({ open: false, action: "Approved", title: "", message: "" });

  useEffect(() => {
    getApprovals().then((data) => {
      setApprovals(data);
      setIsLoading(false);
    });
  }, []);

  const openReviewModal = (a: Approval) => {
    setSelectedApproval(a);
    setCommentText(a.comments || "");
    setIsModalOpen(true);
  };

  const handleProcessAction = async (action: "Approved" | "Rejected" | "Returned") => {
    if (!selectedApproval) return;
    try {
      const updated = await processApproval(
        selectedApproval.id,
        action,
        commentText || `Action processed: ${action}`
      );
      setSelectedApproval(updated);
      setApprovals((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setToastMessage(`Approval request marked as ${action}!`);
      setTimeout(() => setToastMessage(null), 3000);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    }
  };

  const columns: Column<Approval>[] = [
    {
      key: "approvalCode",
      header: "Approval ID",
      sortable: true,
      width: "w-28",
      render: (a) => (
        <span className="font-semibold text-blue-600 hover:underline">{a.approvalCode}</span>
      ),
    },
    {
      key: "entityType",
      header: "Entity",
      sortable: true,
      render: (a) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
          {a.entityType}
        </span>
      ),
    },
    {
      key: "entityReferenceCode",
      header: "Reference Scope",
      sortable: true,
      render: (a) => <span className="font-semibold text-slate-900">{a.entityReferenceCode}</span>,
    },
    {
      key: "requestedBy",
      header: "Requested By",
      sortable: true,
      render: (a) => <span className="text-slate-700 text-xs">{a.requestedBy}</span>,
    },
    {
      key: "requestDate",
      header: "Date",
      sortable: true,
      render: (a) => formatDate(a.requestDate),
    },
    {
      key: "currentLevel",
      header: "Current Level",
      sortable: true,
      render: (a) => <span className="font-medium text-slate-800 text-xs">{a.currentLevel}</span>,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (a) => <StatusBadge status={a.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (a) => (
        <button
          type="button"
          onClick={() => openReviewModal(a)}
          className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-100"
        >
          Review
        </button>
      ),
    },
  ];

  return (
    <AppLayout title="Multi-Level Approvals">
      <PageHeader
        title="Multi-Level Governance Approvals"
        subtitle="Tiered approval hierarchy: Level 1 (Project Manager), Level 2 (COO), and Level 3 (MD / Board)."
        breadcrumbs={[{ label: "Approvals" }]}
        actions={
          <Link
            href="/approvals/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Request Approval</span>
          </Link>
        }
      />

      {toastMessage && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={approvals}
        isLoading={isLoading}
        searchPlaceholder="Search approvals by reference, entity, or officer..."
        searchKeys={["approvalCode", "entityReferenceCode", "requestedBy", "entityType"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
              { label: "Returned", value: "Returned" },
            ],
          },
          {
            key: "entityType",
            label: "Entity",
            options: [
              { label: "Enquiry", value: "Enquiry" },
              { label: "Costing", value: "Costing" },
              { label: "Tender", value: "Tender" },
              { label: "Evaluation", value: "Evaluation" },
              { label: "Work Order", value: "Work Order" },
              { label: "Invoice", value: "Invoice" },
            ],
          },
        ]}
        onRowClick={(a) => openReviewModal(a)}
      />

      {/* Review Modal with Multi-Level Timeline & Action Controls */}
      {selectedApproval && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Review Approval: ${selectedApproval.approvalCode}`}
          subtitle={`${selectedApproval.entityType} • ${selectedApproval.entityReferenceCode}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 text-[11px] block">Entity Reference</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedApproval.entityReferenceCode}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Current Stage</span>
                <span className="font-semibold text-blue-700">{selectedApproval.currentLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Requested By</span>
                <span className="font-medium text-slate-800">{selectedApproval.requestedBy}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Date</span>
                <span className="font-medium text-slate-800">
                  {formatDate(selectedApproval.requestDate)}
                </span>
              </div>
            </div>

            {/* Approval Hierarchy Timeline */}
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-3">
                Approval Signoff Hierarchy & Audit History
              </h4>
              <div className="space-y-3">
                {selectedApproval.history?.map((step, idx) => (
                  <div key={idx} className="p-3 bg-white rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{step.level}</span>
                      <StatusBadge status={step.action} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>By {step.user}</span>
                      <span>•</span>
                      <span>{step.timestamp}</span>
                    </div>
                    {step.note && (
                      <p className="text-slate-600 text-[11px] pt-1 border-t border-slate-100">
                        {step.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Review Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Executive Action Comments *
              </label>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter notes for this approval decision..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    action: "Returned",
                    title: "Return for Clarification",
                    message: "Return this proposal back to previous officer?",
                  })
                }
                className="px-3 py-1.5 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md"
              >
                Return
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    action: "Rejected",
                    title: "Reject Request",
                    message: "Reject this approval request?",
                  })
                }
                className="px-3 py-1.5 font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    action: "Approved",
                    title: "Approve Proposal",
                    message: `Authorize signoff for ${selectedApproval.entityReferenceCode} at ${selectedApproval.currentLevel}?`,
                  })
                }
                className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs"
              >
                Approve Proposal
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={
          confirmDialog.action === "Approved"
            ? "primary"
            : confirmDialog.action === "Rejected"
              ? "danger"
              : "warning"
        }
        confirmText={confirmDialog.action}
        onConfirm={() => handleProcessAction(confirmDialog.action)}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      />
    </AppLayout>
  );
}
