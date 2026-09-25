"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileCheck2, ArrowRight, Calendar, Users2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getTenders } from "@/services/tenderService";
import { Tender } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function TendersPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTenders().then((data) => {
      setTenders(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Tender>[] = [
    {
      key: "tenderNumber",
      header: "Tender NIT No.",
      sortable: true,
      width: "w-32",
      render: (t) => (
        <span className="font-semibold text-blue-600 hover:underline">{t.tenderNumber}</span>
      ),
    },
    {
      key: "title",
      header: "Tender Subject & Scope",
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-semibold text-slate-900 block truncate max-w-sm">{t.title}</span>
          <span className="text-[11px] text-slate-500">{t.clientName}</span>
        </div>
      ),
    },
    {
      key: "tenderType",
      header: "Type",
      sortable: true,
      render: (t) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
          {t.tenderType}
        </span>
      ),
    },
    {
      key: "estimatedValue",
      header: "Est. Value (₹)",
      sortable: true,
      render: (t) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{formatINR(t.estimatedValue)}</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            ({formatINRCrores(t.estimatedValue)})
          </span>
        </div>
      ),
    },
    {
      key: "submissionDeadline",
      header: "Bid Deadline",
      sortable: true,
      render: (t) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800">{formatDate(t.submissionDeadline)}</span>
        </div>
      ),
    },
    {
      key: "applicationsCount",
      header: "Bids In",
      sortable: true,
      align: "center",
      render: (t) => (
        <span className="font-bold text-slate-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
          {t.applicationsCount} Bids
        </span>
      ),
    },
    {
      key: "status",
      header: "Tender Status",
      sortable: true,
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (t) => (
        <Link
          href={`/tenders/${t.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <span>Manage</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Tenders & Bidding Workspace">
      <PageHeader
        title="Public Works Tenders & NIT Register"
        subtitle="Notice Inviting Tenders (NIT), EPC contracts, equipment bidding, and application evaluations."
        breadcrumbs={[{ label: "Tenders" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              filename="TWIC_Tenders_Register"
              data={tenders}
              headers={[
                { key: "tenderNumber", label: "Tender No" },
                { key: "title", label: "Title" },
                { key: "clientName", label: "Client" },
                { key: "tenderType", label: "Type" },
                { key: "estimatedValue", label: "Est Value" },
                { key: "submissionDeadline", label: "Deadline" },
                { key: "status", label: "Status" },
              ]}
            />
            <Link
              href="/tenders/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publish New Tender</span>
            </Link>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={tenders}
        isLoading={isLoading}
        searchPlaceholder="Search tenders by NIT, title, client..."
        searchKeys={["tenderNumber", "title", "clientName", "tenderType"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Draft", value: "Draft" },
              { label: "Published", value: "Published" },
              { label: "Applications Open", value: "Applications Open" },
              { label: "Applications Closed", value: "Applications Closed" },
              { label: "Under Evaluation", value: "Under Evaluation" },
              { label: "Awarded", value: "Awarded" },
              { label: "Closed", value: "Closed" },
            ],
          },
        ]}
        onRowClick={(t) => router.push(`/tenders/${t.id}`)}
      />
    </AppLayout>
  );
}
