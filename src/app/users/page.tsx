"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Users,
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Shield,
  Building,
  CheckCircle2,
  X,
  LayoutGrid,
  List,
  ExternalLink,
} from "lucide-react";
import { userService } from "@/services/userService";
import { User, UserRole } from "@/types";
import { formatDate } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, Column } from "@/components/common/DataTable";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  useEffect(() => {
    userService.getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase().trim();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

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
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
          {row.role}
        </span>
      ),
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
  ];

  return (
    <AppLayout>
      <div className="w-full space-y-6">
        {/* Top Header Bar matching reference design */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
              <Users className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                User & Personnel Directory
              </h1>
              <p className="text-xs text-slate-500">
                Government officers, PMC consultants, engineering teams, and administrative credentials
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search officers or roles..."
                className="w-full md:w-64 pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Roles Matrix link */}
            <Link
              href="/roles"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Shield className="w-4 h-4 text-slate-600" />
              <span>Roles Matrix</span>
            </Link>

            {/* + Add User Button */}
            <Link
              href="/users/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#032b5f] hover:bg-[#021f45] rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </Link>
          </div>
        </div>

        <div className="border-b border-slate-200" />

        {/* View Content */}
        {viewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUsers.map((user) => {
              const isMenuOpen = activeMenuUserId === user.id;

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between relative"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-100">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 leading-tight">
                            {user.name}
                          </h3>
                          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                            {user.email}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuUserId(isMenuOpen ? null : user.id)}
                          className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {isMenuOpen && (
                          <div
                            className="absolute right-0 top-8 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs animate-in fade-in slide-in-from-top-1"
                            onMouseLeave={() => setActiveMenuUserId(null)}
                          >
                            <Link
                              href={`/roles?highlight=${user.role}`}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                            >
                              <Shield className="w-3.5 h-3.5 text-blue-600" />
                              <span>View Role Scope</span>
                            </Link>
                            <Link
                              href="/audit-logs"
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Activity Log</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-2 font-mono">
                      Role code: <span className="font-semibold text-slate-700">{user.role}</span>
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{user.department}</span>
                    </p>
                  </div>

                  <div>
                    <div className="border-b border-slate-100 my-4" />
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                        {user.status || "Active"}
                      </span>

                      <Link
                        href={`/roles?highlight=${user.role}`}
                        className="px-4 py-1 text-xs font-bold text-[#032b5f] border border-[#032b5f] rounded-full hover:bg-blue-50 transition-colors shadow-2xs"
                      >
                        Permissions
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <DataTable
            data={filteredUsers}
            columns={columns}
            isLoading={loading}
            searchPlaceholder="Filter table records..."
          />
        )}
      </div>
    </AppLayout>
  );
}
