"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, ArrowRight, Building2, Briefcase } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getWorkOrders } from "@/services/workOrderService";
import { WorkOrder } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function WorkOrdersPage() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWorkOrders().then((data) => {
      setWorkOrders(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<WorkOrder>[] = [
    {
      key: "workOrderNumber",
      header: "Work Order No.",
      sortable: true,
      width: "w-32",
      render: (w) => (
        <span className="font-semibold text-blue-600 hover:underline">{w.workOrderNumber}</span>
      ),
    },
    {
      key: "projectName",
      header: "Project Title",
      sortable: true,
      render: (w) => (
        <div>
          <span className="font-semibold text-slate-900 block truncate max-w-sm">
            {w.projectName}
          </span>
          <span className="text-[11px] text-slate-500">{w.clientName}</span>
        </div>
      ),
    },
    {
      key: "selectedVendorName",
      header: "Contractor Awarded",
      sortable: true,
      render: (w) => <span className="font-medium text-slate-800">{w.selectedVendorName}</span>,
    },
    {
      key: "contractValue",
      header: "Contract Value (₹)",
      sortable: true,
      render: (w) => (
        <div>
          <span className="font-bold text-slate-900 text-xs font-mono">
            {formatINR(w.contractValue)}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            ({formatINRCrores(w.contractValue)})
          </span>
        </div>
      ),
    },
    {
      key: "startDate",
      header: "Start Date",
      sortable: true,
      render: (w) => formatDate(w.startDate),
    },
    {
      key: "endDate",
      header: "Completion Date",
      sortable: true,
      render: (w) => formatDate(w.endDate),
    },
    {
      key: "status",
      header: "LOA Status",
      sortable: true,
      render: (w) => <StatusBadge status={w.status} size="sm" />,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      render: (w) => (
        <Link
          href={`/projects/${w.projectId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          <span>Project</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Letter of Award (LOA) & Work Orders">
      <PageHeader
        title="Work Orders & Letters of Award (LOA)"
        subtitle="Executed binding contracts for EPC execution, equipment supply, and multi-year plant O&M."
        breadcrumbs={[{ label: "Work Orders" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              filename="TWIC_Work_Orders"
              data={workOrders}
              headers={[
                { key: "workOrderNumber", label: "WO Number" },
                { key: "projectName", label: "Project" },
                { key: "clientName", label: "Client" },
                { key: "selectedVendorName", label: "Vendor" },
                { key: "contractValue", label: "Value" },
                { key: "startDate", label: "Start Date" },
                { key: "endDate", label: "End Date" },
                { key: "status", label: "Status" },
              ]}
            />
            <Link
              href="/work-orders/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Issue Work Order</span>
            </Link>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={workOrders}
        isLoading={isLoading}
        searchPlaceholder="Search work orders by number, project, or vendor..."
        searchKeys={["workOrderNumber", "projectName", "clientName", "selectedVendorName"]}
        filters={[
          {
            key: "status",
            label: "LOA Status",
            options: [
              { label: "Draft", value: "Draft" },
              { label: "Issued", value: "Issued" },
              { label: "Active", value: "Active" },
              { label: "Completed", value: "Completed" },
              { label: "Cancelled", value: "Cancelled" },
            ],
          },
        ]}
      />
    </AppLayout>
  );
}
