"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { userService } from "@/services/userService";
import { User, UserRole } from "@/types";
import { formatDate } from "@/utils/formatters";
import { Mail, AlertCircle, UserPlus } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const getRoleBadge = (role: UserRole) => {
    const roleColors: Record<UserRole, string> = {
      ADMIN: "bg-red-50 text-red-800 border-red-200",
      COO: "bg-purple-50 text-purple-800 border-purple-200",
      ADVISORY: "bg-blue-50 text-blue-800 border-blue-200",
      PMC: "bg-indigo-50 text-indigo-800 border-indigo-200",
      OM: "bg-teal-50 text-teal-800 border-teal-200",
      ACCOUNTS: "bg-emerald-50 text-emerald-800 border-emerald-200",
      HR: "bg-pink-50 text-pink-800 border-pink-200",
      PROJECT_MANAGER: "bg-sky-50 text-sky-800 border-sky-200",
      VIEWER: "bg-slate-50 text-slate-700 border-slate-200",
    };

    return (
      <span
        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
          roleColors[role] || "bg-slate-50 text-slate-700"
        }`}
      >
        {role}
      </span>
    );
  };

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User Details",
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs block leading-tight">
            {row.name}
          </span>
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-slate-400" />
            {row.email}
          </span>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      sortable: true,
      render: (row) => <span className="text-xs font-medium text-slate-700">{row.department}</span>,
    },
    {
      key: "role",
      header: "Assigned Role",
      sortable: true,
      render: (row) => getRoleBadge(row.role),
    },
    {
      key: "lastLogin",
      header: "Last Login",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.lastLogin ? formatDate(row.lastLogin) : "Never"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Account Status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <button
          onClick={() =>
            alert(`User profile for ${row.name} (${row.role}). Mock permissions active.`)
          }
          className="text-xs font-semibold text-blue-700 hover:underline"
        >
          Manage Access
        </button>
      ),
    },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="User & Access Directory"
        subtitle="Manage government personnel, engineering teams, finance officers, and external consultants"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Administration" },
          { label: "Users" },
        ]}
        actions={
          <Link
            href="/users/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Add New User</span>
          </Link>
        }
      />

      {/* Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Enterprise Role-Based Access Control (RBAC) Notice:</span>
          <p className="mt-0.5 text-amber-800">
            This frontend UI demonstrates role allocations for TWIC leadership (COO, Advisory, PMC,
            OM, Accounts, Project Managers). Real cryptographic authentication, session validation,
            and JWT token enforcement will be backed by the external production authentication API
            layer.
          </p>
        </div>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={loading}
        searchPlaceholder="Search users by name, email, or department..."
        filters={[
          {
            key: "role",
            label: "Role",
            options: [
              { label: "ADMIN", value: "ADMIN" },
              { label: "COO", value: "COO" },
              { label: "PROJECT_MANAGER", value: "PROJECT_MANAGER" },
              { label: "PMC", value: "PMC" },
              { label: "ADVISORY", value: "ADVISORY" },
              { label: "OM", value: "OM" },
              { label: "ACCOUNTS", value: "ACCOUNTS" },
            ],
          },
        ]}
      />
    </AppLayout>
  );
}
