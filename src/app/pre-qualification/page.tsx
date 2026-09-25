"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileBadge2, Plus, Eye, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getPreQualifications } from "@/services/vendorService";
import { PreQualificationData } from "@/types";
import { formatDate } from "@/utils/formatters";

export default function PreQualificationListPage() {
  const router = useRouter();
  const [pqs, setPqs] = useState<PreQualificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPreQualifications().then((data) => {
      setPqs(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<PreQualificationData>[] = [
    {
      key: "id",
      header: "Dossier ID",
      sortable: true,
      width: "w-28",
      render: (p) => (
        <span className="font-semibold text-blue-600 hover:underline">{p.id.toUpperCase()}</span>
      ),
    },
    {
      key: "companyName",
      header: "Contractor / Vendor Name",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-semibold text-slate-900 truncate max-w-xs">{p.companyName}</p>
          <p className="text-[11px] text-slate-500">
            PAN: {p.panNumber} • GST: {p.gstNumber}
          </p>
        </div>
      ),
    },
    {
      key: "submissionDate",
      header: "Submission Date",
      sortable: true,
      render: (p) => formatDate(p.submissionDate),
    },
    {
      key: "numberOfTechnicalPersons",
      header: "Tech Staff",
      sortable: true,
      align: "center",
      render: (p) => (
        <span className="font-medium text-slate-800">{p.numberOfTechnicalPersons} Persons</span>
      ),
    },
    {
      key: "pastProjects",
      header: "Water Projects Experience",
      render: (p) => (
        <span className="text-xs text-slate-600">
          {p.pastProjects?.length || 0} Major Project(s)
        </span>
      ),
    },
    {
      key: "status",
      header: "Verification Status",
      sortable: true,
      render: (p) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Review",
      align: "right",
      render: (p) => (
        <Link
          href={`/pre-qualification/${p.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <span>Open Dossier</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Vendor Pre-Qualification Verification">
      <PageHeader
        title="Vendor Pre-Qualification Dossiers"
        subtitle="Verification of statutory criteria, 3-year audited turnovers, technical manpower, and water project credentials."
        breadcrumbs={[{ label: "Vendors", href: "/vendors" }, { label: "Pre-Qualification" }]}
        actions={
          <Link
            href="/pre-qualification/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Fill Pre-Qualification Form</span>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={pqs}
        isLoading={isLoading}
        searchPlaceholder="Search by company name, PAN or GST..."
        searchKeys={["companyName", "panNumber", "gstNumber"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Approved", value: "Approved" },
              { label: "Under Verification", value: "Under Verification" },
              { label: "Submitted", value: "Submitted" },
              { label: "Draft", value: "Draft" },
              { label: "Rejected", value: "Rejected" },
            ],
          },
        ]}
        onRowClick={(p) => router.push(`/pre-qualification/${p.id}`)}
      />
    </AppLayout>
  );
}
