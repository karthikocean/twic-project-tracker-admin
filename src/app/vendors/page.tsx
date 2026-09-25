"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Building2, Eye, FileBadge2, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getVendors } from "@/services/vendorService";
import { Vendor } from "@/types";

export default function VendorsPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getVendors().then((data) => {
      setVendors(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Vendor>[] = [
    {
      key: "vendorCode",
      header: "Vendor Code",
      sortable: true,
      width: "w-28",
      render: (v) => (
        <span className="font-semibold text-blue-600 hover:underline">{v.vendorCode}</span>
      ),
    },
    {
      key: "companyName",
      header: "Company Name",
      sortable: true,
      render: (v) => (
        <div>
          <span className="font-semibold text-slate-900 block truncate max-w-xs">
            {v.companyName}
          </span>
          <span className="text-[11px] text-slate-400">{v.category}</span>
        </div>
      ),
    },
    {
      key: "panNumber",
      header: "PAN",
      sortable: true,
      render: (v) => <span className="font-mono text-xs">{v.panNumber}</span>,
    },
    {
      key: "gstNumber",
      header: "GSTIN",
      sortable: true,
      render: (v) => <span className="font-mono text-xs text-slate-600">{v.gstNumber}</span>,
    },
    {
      key: "msmeNumber",
      header: "MSME Reg.",
      render: (v) => <span className="text-[11px] text-slate-500">{v.msmeNumber || "N/A"}</span>,
    },
    {
      key: "contactPerson",
      header: "Contact",
      render: (v) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{v.contactPerson}</p>
          <p className="text-[10px] text-slate-400">{v.phone}</p>
        </div>
      ),
    },
    {
      key: "preQualificationStatus",
      header: "Pre-Qual Status",
      sortable: true,
      render: (v) => <StatusBadge status={v.preQualificationStatus} size="sm" />,
    },
    {
      key: "activeProjectsCount",
      header: "Active Projects",
      sortable: true,
      align: "center",
      render: (v) => (
        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">
          {v.activeProjectsCount}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (v) => (
        <div className="flex items-center justify-end gap-2">
          {v.preQualificationId && (
            <Link
              href={`/pre-qualification/${v.preQualificationId}`}
              className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold"
              title="Review Pre-Qualification Dossier"
            >
              PQ Review
            </Link>
          )}
          <Link
            href={`/vendors/${v.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppLayout title="Vendors Directory & Pre-Qualification">
      <PageHeader
        title="Vendors & Contractors Register"
        subtitle="Empaneled contractors, EPC bidders, equipment OEMs, and specialized wastewater sub-vendors."
        breadcrumbs={[{ label: "Vendors" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              filename="TWIC_Vendors_Empanelment"
              data={vendors}
              headers={[
                { key: "vendorCode", label: "Vendor Code" },
                { key: "companyName", label: "Company Name" },
                { key: "panNumber", label: "PAN" },
                { key: "gstNumber", label: "GSTIN" },
                { key: "category", label: "Category" },
                { key: "preQualificationStatus", label: "PQ Status" },
                { key: "activeProjectsCount", label: "Active Projects" },
              ]}
            />
            <Link
              href="/pre-qualification/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <FileBadge2 className="h-3.5 w-3.5" />
              <span>Fill Pre-Qualification Form</span>
            </Link>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={vendors}
        isLoading={isLoading}
        searchPlaceholder="Search vendors by company, PAN, GST, or code..."
        searchKeys={["vendorCode", "companyName", "panNumber", "gstNumber", "contactPerson"]}
        filters={[
          {
            key: "preQualificationStatus",
            label: "PQ Status",
            options: [
              { label: "Approved", value: "Approved" },
              { label: "Under Verification", value: "Under Verification" },
              { label: "Submitted", value: "Submitted" },
              { label: "Draft", value: "Draft" },
              { label: "Returned", value: "Returned" },
            ],
          },
          {
            key: "category",
            label: "Category",
            options: [
              { label: "General Contractor", value: "General Contractor" },
              { label: "Equipment Supplier", value: "Equipment Supplier" },
              { label: "Consultant", value: "Consultant" },
              { label: "O&M Specialist", value: "O&M Specialist" },
            ],
          },
        ]}
        onRowClick={(v) => router.push(`/vendors/${v.id}`)}
      />
    </AppLayout>
  );
}
