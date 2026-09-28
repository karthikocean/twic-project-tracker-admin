"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
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
  Lock,
  KeyRound,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { userService } from "@/services/userService";
import { getRoles, RoleItem } from "@/services/roleService";
import { User } from "@/types";

// Chart 1: User Distribution by Security Role
const roleDistributionData = [
  { name: "Super Admin", value: 2, color: "#ef4444" },
  { name: "Project Manager", value: 4, color: "#2563eb" },
  { name: "Site Resident Eng.", value: 3, color: "#0d9488" },
  { name: "Finance & Accounts", value: 2, color: "#f59e0b" },
  { name: "Auditor / Read-Only", value: 1, color: "#8b5cf6" },
];

// Chart 2: Departmental Officer Allocation
const departmentAllocationData = [
  { department: "PMC Operations", officers: 4, fill: "#2563eb" },
  { department: "Advisory Services", officers: 3, fill: "#3b82f6" },
  { department: "O&M Water Works", officers: 2, fill: "#0284c7" },
  { department: "Finance & Treasury", officers: 2, fill: "#0d9488" },
  { department: "Secretariat & MD Office", officers: 1, fill: "#16a34a" },
];

// Chart 3: Weekly System Activity & Audit Trail Velocity
const auditActivityData = [
  { day: "Mon", logins: 48, updates: 32, approvals: 14, exports: 8 },
  { day: "Tue", logins: 52, updates: 38, approvals: 18, exports: 11 },
  { day: "Wed", logins: 60, updates: 45, approvals: 22, exports: 15 },
  { day: "Thu", logins: 55, updates: 40, approvals: 19, exports: 12 },
  { day: "Fri", logins: 64, updates: 48, approvals: 25, exports: 19 },
];

// Chart 4: Account Security & Compliance Status
const securityComplianceData = [
  { category: "Active Accounts", count: 12, fill: "#16a34a" },
  { category: "2FA Enforced", count: 12, fill: "#2563eb" },
  { category: "Password Standard", count: 12, fill: "#0d9488" },
  { category: "Suspended / Inactive", count: 0, fill: "#94a3b8" },
];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const tabs: TabItem[] = [
    { id: "dashboard", label: "User Governance & Security Dashboard", count: 4 },
    { id: "hub", label: "Governance Hub & Modules", count: 3 },
  ];

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
      id: "audit",
      title: "Audit Trail & Logs",
      code: "AUDIT_SECURITY",
      desc: "Immutable system activity logs, access history, IP coordinates and sign-ins.",
      countLabel: "1,480 Logged Events",
      btnText: "Security Logs",
      href: "/audit-logs",
      addHref: "/settings",
      addText: "Settings",
      icon: FileText,
    },
  ];

  return (
    <AppLayout title="User Management Dashboard | TWIC Project ERP">
      <PageHeader
        title="User Governance & Security Directorate"
        subtitle="Role-Based Access Control (RBAC), multi-factor authorization, officer directories, and cryptographic audit log monitoring."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "User Management", href: "/user-management" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/users/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002b5f] hover:bg-[#001f44] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Officer Account</span>
            </Link>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD (MIN 4 CHARTS) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Registered Officers</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{users.length || 12} Officers</div>
              <p className="text-xs text-slate-500 mt-1">Designated government engineers & directors</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <span>100% active state credentials</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">RBAC Security Roles</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{roles.length || 6} Defined Roles</div>
              <p className="text-xs text-slate-500 mt-1">Granular read/write authorization keys</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero authorization conflicts</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Audit Trail Events</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">1,480 Actions</div>
              <p className="text-xs text-slate-500 mt-1">Immutable forensic activity log entries</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span>100% event accountability</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Security Compliance</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">100% Enforced</div>
              <p className="text-xs text-slate-500 mt-1">2FA & strict password policy active</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>Zero unauthorized intrusions</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: User Distribution by Security Role */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    User Accounts by Security Role
                  </h3>
                  <p className="text-xs text-slate-500">Distribution across administrative and operational roles</p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  Role Matrix
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {roleDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val} Accounts`, "Total"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
                {roleDistributionData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Departmental Officer Allocation */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Departmental Officer Allocation
                  </h3>
                  <p className="text-xs text-slate-500">Staffing count across executive and site engineering wings</p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Departments
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentAllocationData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 6]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      dataKey="department"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val} Officers`, "Assigned"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="officers" name="Officers" fill="#2563eb" radius={[0, 4, 4, 0]}>
                      {departmentAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Weekly Activity & Audit Trail */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Weekly System Activity & Audit Trail
                  </h3>
                  <p className="text-xs text-slate-500">Logins, data updates, approvals, and report export volume</p>
                </div>
                <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  Activity Logs
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={auditActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Area
                      type="monotone"
                      dataKey="logins"
                      name="User Logins"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="#dbeafe"
                      fillOpacity={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="updates"
                      name="Data Updates"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fill="#dcfce7"
                      fillOpacity={0.4}
                    />
                    <Area
                      type="monotone"
                      dataKey="approvals"
                      name="Approvals Cleared"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fill="#fef3c7"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Account Security & Compliance Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Account Security & MFA Compliance
                  </h3>
                  <p className="text-xs text-slate-500">Security posture, two-factor authentication & password compliance</p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  MFA / RBAC
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={securityComplianceData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 15]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis
                      dataKey="category"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val} Accounts`, "Status"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="count" name="Accounts" radius={[0, 4, 4, 0]}>
                      {securityComplianceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GOVERNANCE HUB & MODULES */}
      {activeTab === "hub" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userModules.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                        {mod.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{mod.title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mod.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{mod.countLabel}</span>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={mod.href}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <span>{mod.btnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={mod.addHref}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
                    >
                      {mod.addText}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
