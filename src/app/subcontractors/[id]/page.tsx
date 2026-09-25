"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { subcontractorService } from "@/services/subcontractorService";
import { invoiceService } from "@/services/invoiceService";
import { SubcontractorAssignment, Invoice } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";
import {
  Building2,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

export default function SubcontractorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [assignment, setAssignment] = useState<SubcontractorAssignment | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const allSubs = await subcontractorService.getSubcontractors();
      const found = allSubs.find((s: SubcontractorAssignment) => s.id === id);
      setAssignment(found || null);

      if (found) {
        const allInvoices = await invoiceService.getInvoices();
        const linked = allInvoices.filter(
          (inv: Invoice) =>
            inv.invoiceType === "Subcontractor Invoice" &&
            inv.partyName.toLowerCase().includes(found.vendorName.toLowerCase())
        );
        setInvoices(linked);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-slate-500">Loading subcontractor package...</div>
      </AppLayout>
    );
  }

  if (!assignment) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-slate-600">
          <p className="text-lg font-semibold">Subcontractor assignment not found</p>
          <Link href="/subcontractors" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to Subcontractors
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title={`${assignment.vendorName} — Package Details`}
        subtitle={`Scope: ${assignment.scopeOfWork} • Assigned under ${assignment.projectName}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Subcontractors", href: "/subcontractors" },
          { label: assignment.id },
        ]}
        actions={
          <Link
            href="/subcontractors"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to List
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Assignment Overview */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Contract Package Overview
              </h3>
              <StatusBadge status={assignment.status} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Subcontractor Entity</span>
                <Link
                  href={`/vendors/${assignment.vendorId}`}
                  className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  {assignment.vendorName} <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Project</span>
                <Link
                  href={`/projects/${assignment.projectId}`}
                  className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                >
                  {assignment.projectName} <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
              <div>
                <span className="text-slate-500 block">Contract Package Value</span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatINR(assignment.contractValue)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 block mb-1">
                Detailed Scope of Work
              </span>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                {assignment.scopeOfWork}
              </p>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Certified Execution Progress</span>
                <span className="text-blue-700 font-bold">{assignment.progressPercent}%</span>
              </div>
              <ProgressBar progress={assignment.progressPercent} size="md" />
            </div>

            <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Execution Start: {formatDate(assignment.startDate)}</span>
              <span>Target Completion: {formatDate(assignment.endDate)}</span>
            </div>
          </div>

          {/* Subcontractor Invoices */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" /> Subcontractor Claims & Invoices
              </h3>
              <span className="text-xs text-slate-500">{invoices.length} Registered Bill(s)</span>
            </div>

            {invoices.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No subcontractor invoices logged under this package yet.
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Invoice No</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Claimed Amount</th>
                    <th className="px-4 py-3">Certified & Paid</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(inv.invoiceDate)}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatINR(inv.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">
                        {formatINR(inv.paidAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Statutory & Verification Summary */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verification & Compliance
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pre-Qualification:</span>
                <span className="font-semibold text-emerald-700">Verified & Approved</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Work Order Ref:</span>
                <span className="font-mono text-slate-800">TWIC-SC-PKG-{assignment.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Performance Guarantee:</span>
                <span className="font-semibold text-slate-800">5% Bank Guarantee Valid</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Retention Money:</span>
                <span className="font-semibold text-slate-800">5% Withheld per Milestone</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
