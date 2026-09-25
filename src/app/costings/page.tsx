"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Calculator, ArrowRight, AlertCircle } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getCostings } from "@/services/costingService";
import { Costing } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function CostingsPage() {
  const router = useRouter();
  const [costings, setCostings] = useState<Costing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCostings().then((data) => {
      setCostings(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Costing>[] = [
    {
      key: "costingNumber",
      header: "Costing Ref",
      sortable: true,
      width: "w-32",
      render: (c) => (
        <span className="font-semibold text-blue-600 hover:underline">{c.costingNumber}</span>
      ),
    },
    {
      key: "projectName",
      header: "Project Title",
      sortable: true,
      render: (c) => (
        <div>
          <p className="font-semibold text-slate-900 truncate max-w-sm">{c.projectName}</p>
          <p className="text-[11px] text-slate-500">{c.clientName}</p>
        </div>
      ),
    },
    {
      key: "businessType",
      header: "Type",
      sortable: true,
      render: (c) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
          {c.businessType}
        </span>
      ),
    },
    {
      key: "baseCost",
      header: "Base Direct Cost",
      sortable: true,
      render: (c) => formatINR(c.baseCost),
    },
    {
      key: "marginPercent",
      header: "Margin %",
      sortable: true,
      align: "center",
      render: (c) => (
        <span className="font-bold text-slate-700 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-xs">
          +{c.marginPercent}%
        </span>
      ),
    },
    {
      key: "finalQuotation",
      header: "Final Quotation (Incl. GST)",
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-bold text-slate-900 text-xs">{formatINR(c.finalQuotation)}</span>
          <span className="text-[10px] text-slate-400 block font-mono">
            ({formatINRCrores(c.finalQuotation)})
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (c) => <StatusBadge status={c.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (c) => (
        <Link
          href={`/costings/${c.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <span>Calculate</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Cost Preparation Worksheets">
      <PageHeader
        title="Cost Preparation & Estimation"
        subtitle="Manpower, expert advisory, logistics, subcontractor packages, and profit margin analysis."
        breadcrumbs={[{ label: "Cost Preparation" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              filename="TWIC_Cost_Estimates"
              data={costings}
              headers={[
                { key: "costingNumber", label: "Costing Ref" },
                { key: "projectName", label: "Project Name" },
                { key: "clientName", label: "Client" },
                { key: "baseCost", label: "Base Cost" },
                { key: "marginPercent", label: "Margin %" },
                { key: "finalQuotation", label: "Final Quotation" },
                { key: "status", label: "Status" },
              ]}
            />
            <Link
              href="/enquiries"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Convert Enquiry to Costing</span>
            </Link>
          </div>
        }
      />

      <div className="mb-4 p-3 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Government Schedule of Rates (SoR) Policy: </span>
          All baseline manpower rates and consultancy fees comply with TWAD/PWD 2024-25 guidelines.
          Advanced escalation formula and contingency allocations are marked:{" "}
          <span className="font-semibold underline">TBD - Client Confirmation Required</span>.
        </div>
      </div>

      <DataTable
        columns={columns}
        data={costings}
        isLoading={isLoading}
        searchPlaceholder="Search costings by project or client..."
        searchKeys={["costingNumber", "projectName", "clientName", "enquiryNumber"]}
        onRowClick={(c) => router.push(`/costings/${c.id}`)}
      />
    </AppLayout>
  );
}
