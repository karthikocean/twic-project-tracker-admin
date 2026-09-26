"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Users,
  Shield,
  Settings,
  FileText,
  Search,
  Plus,
  MoreHorizontal,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Clock,
  Layers,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { userService } from "@/services/userService";
import { getRoles, RoleItem } from "@/services/roleService";
import { User } from "@/types";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [u, r] = await Promise.all([
          userService.getUsers(),
          getRoles(),
        ]);
        setUsers(u);
        setRoles(r);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const userModules = [
    {
      id: "users",
      title: "Users Directory",
      code: "USER_DIRECTORY",
      desc: "Manage officer accounts, employee designations, and department placements.",
      countLabel: `${users.length} Active Officers`,
      btnText: "Manage Users",
      href: "/users",
      addHref: "/users/new",
      addText: "+ Add User",
      icon: Users,
    },
    {
      id: "roles",
      title: "Roles & Permissions",
      code: "ROLES_PERMISSIONS",
      desc: "Define RBAC security keys, SoD policies, and assign module authorizations.",
      countLabel: `${roles.length} Defined Roles`,
      btnText: "Permissions",
      href: "/roles",
      addHref: "/roles/new",
      addText: "+ Add Role",
      icon: Shield,
    },
    {
      id: "logs",
      title: "Audit Trail & System Logs",
      code: "AUDIT_LOGS",
      desc: "Immutable activity records, login timestamps, and forensic audit footprints.",
      countLabel: "Real-time Tracking",
      btnText: "Inspect Logs",
      href: "/audit-logs",
      icon: FileText,
    },
    {
      id: "settings",
      title: "System Settings",
      code: "SYSTEM_SETTINGS",
      desc: "Configure API endpoints, backend connection protocols, and global notifications.",
      countLabel: "ERP Configuration",
      btnText: "Open Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const filteredModules = userModules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="w-full space-y-6">
        {/* Header Bar matching reference design */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50/90 border border-blue-100 flex items-center justify-center text-blue-700 shadow-2xs">
              <Users className="w-5 h-5 text-blue-800" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                User Management Module
              </h1>
              <p className="text-xs text-slate-500">
                Centralized administration for Users, Security Roles, System Audit Logs, and Global Settings
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user modules..."
                className="w-full md:w-64 pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 shadow-2xs"
              />
            </div>

            <Link
              href="/users/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              <span>+ Add User</span>
            </Link>

            <Link
              href="/roles/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#032b5f] hover:bg-[#021f45] rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Role</span>
            </Link>
          </div>
        </div>

        <div className="border-b border-slate-200" />

        {/* 4 Pillar Cards Grid matching reference design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredModules.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {item.title}
                      </h3>
                    </div>

                    <Link
                      href={item.href}
                      className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                      title="Open Module"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 font-mono">
                    Module code: <span className="font-medium text-slate-600">{item.code}</span>
                  </p>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {item.desc}
                  </p>
                </div>

                <div>
                  <div className="border-b border-slate-100 my-4" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 rounded-full bg-slate-50/60 shadow-2xs">
                      {item.countLabel}
                    </span>

                    <Link
                      href={item.href}
                      className="px-4 py-1 text-xs font-bold text-[#032b5f] border border-[#032b5f] rounded-full hover:bg-blue-50 transition-colors shadow-2xs"
                    >
                      {item.btnText}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Access Overview: User Directory Preview and Role Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
          {/* Active Officers Directory Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Registered Personnel Directory
                </h3>
              </div>
              <Link
                href="/users"
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>View All ({users.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {users.slice(0, 5).map((user) => (
                <div key={user.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {user.role}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {user.status || "Active"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Roles & Matrix Breakdown Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Security Roles & Governance Remit
                </h3>
              </div>
              <Link
                href="/roles"
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>View Matrix ({roles.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
              {roles.slice(0, 6).map((role) => (
                <div
                  key={role.name}
                  className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{role.title || role.name}</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                      {role.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{role.department}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
