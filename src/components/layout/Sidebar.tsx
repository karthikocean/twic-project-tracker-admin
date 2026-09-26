"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileQuestion,
  Calculator,
  Compass,
  FileCheck2,
  Inbox,
  Award,
  Users2,
  FileBadge2,
  Briefcase,
  Flag,
  TrendingUp,
  FileBarChart2,
  Network,
  Cpu,
  Receipt,
  CreditCard,
  CheckCircle,
  FileText,
  UserCheck,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Workflow,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const navigationSections: NavSection[] = [
    {
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Lifecycle Map",
          href: "/overview",
          icon: Workflow,
          badge: "Process",
        },
      ],
    },
    {
      title: "Business Development",
      items: [
        {
          title: "Enquiries / RFQ",
          href: "/enquiries",
          icon: FileQuestion,
        },
        {
          title: "Cost Preparation",
          href: "/costings",
          icon: Calculator,
        },
      ],
    },
    {
      title: "Advisory & PMC",
      items: [
        {
          title: "Advisory (DPR & PPP)",
          href: "/advisory",
          icon: Compass,
        },
        {
          title: "PMC Module",
          href: "/pmc",
          icon: Briefcase,
        },
      ],
    },
    {
      title: "Tender Management",
      items: [
        {
          title: "Tenders",
          href: "/tenders",
          icon: FileCheck2,
        },
        {
          title: "Tender Applications",
          href: "/tender-applications",
          icon: Inbox,
        },
        {
          title: "Evaluation",
          href: "/evaluations",
          icon: Award,
        },
      ],
    },
    {
      title: "Vendors & Contractors",
      items: [
        {
          title: "Vendors Directory",
          href: "/vendors",
          icon: Users2,
        },
        {
          title: "Pre-Qualification",
          href: "/pre-qualification",
          icon: FileBadge2,
        },
      ],
    },
    {
      title: "Projects Execution",
      items: [
        {
          title: "Work Orders (LOA)",
          href: "/work-orders",
          icon: FileText,
        },
        {
          title: "Projects",
          href: "/projects",
          icon: Briefcase,
        },
        {
          title: "Milestones",
          href: "/milestones",
          icon: Flag,
        },
        {
          title: "Project Progress",
          href: "/progress",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Subcontractors",
      items: [
        {
          title: "Subcontractors",
          href: "/subcontractors",
          icon: Network,
        },
      ],
    },
    {
      title: "Plant Operations (O&M)",
      items: [
        {
          title: "O&M Plants",
          href: "/plants",
          icon: Cpu,
        },
      ],
    },
    {
      title: "Finance & Accounts",
      items: [
        {
          title: "Invoices",
          href: "/invoices",
          icon: Receipt,
        },
        {
          title: "Payments",
          href: "/payments",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Governance & Reports",
      items: [
        {
          title: "Approvals",
          href: "/approvals",
          icon: CheckCircle,
        },
        {
          title: "Reports & Analytics",
          href: "/reports",
          icon: FileBarChart2,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Clients Directory",
          href: "/clients",
          icon: Users2,
        },
        {
          title: "Users Management",
          href: "/users",
          icon: UserCheck,
        },
        {
          title: "Roles & Permissions",
          href: "/roles",
          icon: ShieldAlert,
        },
        {
          title: "Audit Logs",
          href: "/audit-logs",
          icon: ShieldAlert,
        },
        {
          title: "Settings",
          href: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static ${isCollapsed ? "lg:w-18" : "lg:w-64"} w-72`}
      >
        {/* Logo / Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-base shadow-sm">
              <Droplets className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold text-white text-sm tracking-wide block">
                  TWIC TRACKER
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Water & Infra Project ERP
                </span>
              </div>
            )}
          </div>

          {/* Close mobile button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-md lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop Collapse toggle button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Scrollable Navigation items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && !isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                    }`}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    {!isCollapsed && <span className="truncate flex-1">{item.title}</span>}
                    {!isCollapsed && item.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-800 text-blue-400 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
