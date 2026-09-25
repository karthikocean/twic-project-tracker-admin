"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inbox, FileCheck2, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getTenderApplications } from "@/services/tenderApplicationService";
import { TenderApplication } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function TenderApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<TenderApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTenderApplications().then((data) => {
      setApplications(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<TenderApplication>[] = [
    {
      key: "applicationNumber",
      header: "Application No.",
      sortable: true,
      width: "w-32",
      render: (a) => (
        <span className="font-semibold text-blue-600 hover:underline">{a.applicationNumber}</span>
      ),
    },
    {
      key: "tenderTitle",
      header: "Tender Name & NIT Ref",
      sortable: true,
      render: (a) => (
        <div>
          <span className="font-semibold text-slate-900 block truncate max-w-sm">
            {a.tenderTitle}
          </span>
          <span className="text-[11px] text-slate-500">{a.tenderNumber}</span>
        </div>
      ),
    },
    {
      key: "vendorName",
      header: "Bidding Contractor",
      sortable: true,
      render: (a) => <span className="font-medium text-slate-800">{a.vendorName}</span>,
    },
    {
      key: "submissionDate",
      header: "Submission Date",
      sortable: true,
      render: (a) => formatDate(a.submissionDate),
    },
    {
      key: "technicalStatus",
      header: "Technical Status",
      sortable: true,
      render: (a) => <StatusBadge status={a.technicalStatus} size="sm" />,
    },
    {
      key: "commercialAmount",
      header: "Commercial Bid (₹)",
      sortable: true,
      render: (a) => (
        <div>
          <span className="font-bold text-slate-900 text-xs font-mono">
            {formatINR(a.commercialAmount)}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            ({formatINRCrores(a.commercialAmount)})
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Bid Status",
      sortable: true,
      render: (a) => <StatusBadge status={a.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (a) => (
        <Link
          href={`/evaluations`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <span>Evaluate</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Tender Bids & Contractor Applications">
      <PageHeader
        title="Tender Applications & Bid Box"
        subtitle="Repository of commercial proposals and technical qualification submissions by empaneled vendors."
        breadcrumbs={[{ label: "Tenders", href: "/tenders" }, { label: "Tender Applications" }]}
        actions={
          <ExportButton
            filename="TWIC_Tender_Applications"
            data={applications}
            headers={[
              { key: "applicationNumber", label: "App No" },
              { key: "tenderNumber", label: "Tender No" },
              { key: "vendorName", label: "Vendor" },
              { key: "technicalStatus", label: "Technical Status" },
              { key: "commercialAmount", label: "Commercial Bid" },
              { key: "status", label: "Status" },
            ]}
          />
        }
      />

      <DataTable
        columns={columns}
        data={applications}
        isLoading={isLoading}
        searchPlaceholder="Search bids by application, contractor, or tender..."
        searchKeys={["applicationNumber", "tenderTitle", "vendorName", "tenderNumber"]}
        filters={[
          {
            key: "status",
            label: "Bid Status",
            options: [
              { label: "Submitted", value: "Submitted" },
              { label: "Qualified", value: "Qualified" },
              { label: "Disqualified", value: "Disqualified" },
              { label: "Awarded", value: "Awarded" },
            ],
          },
          {
            key: "technicalStatus",
            label: "Technical Status",
            options: [
              { label: "Passed", value: "Passed" },
              { label: "Under Review", value: "Under Review" },
              { label: "Failed", value: "Failed" },
            ],
          },
        ]}
      />
    </AppLayout>
  );
}
