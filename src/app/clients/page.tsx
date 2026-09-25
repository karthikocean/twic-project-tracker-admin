"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Building2, Eye, Mail, Phone, MapPin } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { getClients } from "@/services/clientService";
import { Client } from "@/types";

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getClients().then((data) => {
      setClients(data);
      setIsLoading(false);
    });
  }, []);

  const columns: Column<Client>[] = [
    {
      key: "code",
      header: "Code",
      sortable: true,
      width: "w-24",
      render: (c) => (
        <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
          {c.code}
        </span>
      ),
    },
    {
      key: "name",
      header: "Client Name",
      sortable: true,
      render: (c) => (
        <div>
          <span className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer">
            {c.name}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
            <MapPin className="h-3 w-3" />
            <span>
              {c.city}, {c.state}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "contactPerson",
      header: "Contact Person",
      sortable: true,
      render: (c) => (
        <div className="text-slate-700">
          <p className="font-medium text-xs">{c.contactPerson}</p>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (c) => (
        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
          <Mail className="h-3.5 w-3.5 text-slate-400" />
          <a href={`mailto:${c.email}`} className="hover:underline">
            {c.email}
          </a>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (c) => (
        <div className="flex items-center gap-1.5 text-slate-600 text-xs">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          <span>{c.phone}</span>
        </div>
      ),
    },
    {
      key: "activeProjectsCount",
      header: "Active Projects",
      sortable: true,
      align: "center",
      render: (c) => (
        <span className="font-semibold text-slate-900 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
          {c.activeProjectsCount} / {c.totalProjectsCount}
        </span>
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
      header: "Actions",
      align: "right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/clients/${c.id}`}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <AppLayout title="Clients Directory">
      <PageHeader
        title="Clients & Municipal Water Boards"
        subtitle="Government boards, industrial corporations, and municipal bodies executing infrastructure works."
        breadcrumbs={[{ label: "Clients" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              filename="TWIC_Clients_Directory"
              data={clients}
              headers={[
                { key: "code", label: "Code" },
                { key: "name", label: "Client Name" },
                { key: "contactPerson", label: "Contact Person" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "city", label: "City" },
                { key: "state", label: "State" },
                { key: "status", label: "Status" },
              ]}
            />
            <Link
              href="/clients/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Client</span>
            </Link>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={clients}
        isLoading={isLoading}
        searchPlaceholder="Search clients by name, code, contact or state..."
        searchKeys={["name", "code", "contactPerson", "email", "city", "state"]}
        filters={[
          {
            key: "status",
            label: "Status",
            options: [
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
        ]}
        onRowClick={(c) => router.push(`/clients/${c.id}`)}
      />
    </AppLayout>
  );
}
