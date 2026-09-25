"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Eye, FileText, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getEnquiries } from "@/services/enquiryService";
import { Enquiry } from "@/types";
import { formatINRCrores, formatDate } from "@/utils/formatters";

export default function EnquiriesPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getEnquiries().then((data) => {
      setEnquiries(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Enquiry>[] = [
    {
      key: "enquiryNumber",
      header: "Enquiry No.",
      sortable: true,
      width: "w-28",
      render: (e) => (
        <span className="font-semibold text-blue-600 hover:underline">{e.enquiryNumber}</span>
      ),
    },
    {
      key: "enquiryDate",
      header: "Date",
      sortable: true,
      render: (e) => formatDate(e.enquiryDate),
    },
    {
      key: "clientName",
      header: "Client",
      sortable: true,
      render: (e) => (
        <span className="font-medium text-slate-800 truncate block max-w-xs">{e.clientName}</span>
      ),
    },
    {
      key: "projectName",
      header: "Project Scope",
      sortable: true,
      render: (e) => (
        <div className="max-w-md">
          <p className="font-semibold text-slate-900 truncate">{e.projectName}</p>
          <p className="text-[11px] text-slate-500 truncate">{e.description}</p>
        </div>
      ),
    },
    {
      key: "businessType",
      header: "Business Type",
      sortable: true,
      render: (e) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
          {e.businessType}
        </span>
      ),
    },
    {
      key: "estimatedValue",
      header: "Est. Value",
      sortable: true,
      render: (e) => (
        <span className="font-semibold text-slate-900">{formatINRCrores(e.estimatedValue)}</span>
      ),
    },
    {
      key: "expectedResponseDate",
      header: "Due Date",
      sortable: true,
      render: (e) => formatDate(e.expectedResponseDate),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (e) => <StatusBadge status={e.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (e) => (
        <Link
          href={`/enquiries/${e.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <span>View</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Enquiries & RFQ Pipeline">
      <PageHeader
        title="Business Development & Enquiries"
        subtitle="Tracking customer RFQs, feasibility studies, DPR expressions of interest, and conversions."
        breadcrumbs={[{ label: "Enquiries" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              filename="TWIC_Enquiries_Register"
              data={enquiries}
              headers={[
                { key: "enquiryNumber", label: "Enquiry No" },
                { key: "enquiryDate", label: "Date" },
                { key: "clientName", label: "Client" },
                { key: "projectName", label: "Project Name" },
                { key: "businessType", label: "Type" },
                { key: "estimatedValue", label: "Est Value" },
                { key: "status", label: "Status" },
              ]}
            />
            <Link
              href="/enquiries/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Enquiry</span>
            </Link>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={enquiries}
        isLoading={isLoading}
        searchPlaceholder="Search enquiries by project, client, or number..."
        searchKeys={["enquiryNumber", "clientName", "projectName", "description"]}
        filters={[
          {
            key: "businessType",
            label: "Business Type",
            options: [
              { label: "ADVISORY", value: "ADVISORY" },
              { label: "PMC", value: "PMC" },
              { label: "O&M", value: "O&M" },
            ],
          },
          {
            key: "status",
            label: "Status",
            options: [
              { label: "DRAFT", value: "DRAFT" },
              { label: "SUBMITTED", value: "SUBMITTED" },
              { label: "UNDER REVIEW", value: "UNDER REVIEW" },
              { label: "CONVERTED", value: "CONVERTED" },
              { label: "REJECTED", value: "REJECTED" },
              { label: "CLOSED", value: "CLOSED" },
            ],
          },
        ]}
        onRowClick={(e) => router.push(`/enquiries/${e.id}`)}
      />
    </AppLayout>
  );
}
