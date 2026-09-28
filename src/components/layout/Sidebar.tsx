"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Layers,
} from "lucide-react";
import { useModule, ModuleType } from "@/context/ModuleContext";

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
  const { activeModule, setActiveModule } = useModule();

  // Dynamically filter sidebar sections based on selected active module ("others no need")
  const getSectionsForActiveModule = (): NavSection[] => {
    const dashboardSection: NavSection = {
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Master Flow Map",
          href: "/overview",
          icon: Workflow,
          badge: "Flow",
        },
      ],
    };

    if (activeModule === "ADVISORY") {
      return [
        dashboardSection,
        {
          title: "Advisory Flow (DFR / DPR)",
          items: [
            {
              title: "DFR: Enquiry / RFQ",
              href: "/enquiries",
              icon: FileQuestion,
            },
            {
              title: "DFR: Preparation of Costing",
              href: "/costings",
              icon: Calculator,
            },
            {
              title: "DPR: RFP & Tenders",
              href: "/tenders",
              icon: FileCheck2,
            },
            {
              title: "DPR: Client LOA / Work Order",
              href: "/work-orders",
              icon: FileText,
            },
            {
              title: "DPR+RFP: Approval Notes",
              href: "/approvals",
              icon: CheckCircle,
            },
            {
              title: "DPR+RFP: Bid Evaluation",
              href: "/evaluations",
              icon: Award,
            },
            {
              title: "Deliverables & Milestones",
              href: "/milestones",
              icon: Flag,
            },
            {
              title: "Transaction Advisory",
              href: "/advisory",
              icon: Compass,
            },
          ],
        },
      ];
    }

    if (activeModule === "PMC") {
      return [
        dashboardSection,
        {
          title: "PMC Operations Flow",
          items: [
            {
              title: "Enquiry / RFQ",
              href: "/enquiries",
              icon: FileQuestion,
            },
            {
              title: "Preparation of Costing",
              href: "/costings",
              icon: Calculator,
            },
            {
              title: "RFP / Tender Status",
              href: "/tenders",
              icon: FileCheck2,
            },
            {
              title: "Client LOA & Work Orders",
              href: "/work-orders",
              icon: FileText,
            },
            {
              title: "PMC Operations & Site",
              href: "/pmc",
              icon: Briefcase,
            },
            {
              title: "Milestone Tracking",
              href: "/milestones",
              icon: Flag,
            },
          ],
        },
      ];
    }

    if (activeModule === "PROJECT_MONITORING") {
      return [
        dashboardSection,
        {
          title: "Project Monitoring",
          items: [
            {
              title: "Work Progress",
              href: "/progress",
              icon: TrendingUp,
            },
            {
              title: "Report Preparation",
              href: "/reports",
              icon: FileBarChart2,
            },
          ],
        },
      ];
    }

    if (activeModule === "SUBCONTRACTOR") {
      return [
        dashboardSection,
        {
          title: "Subcontractor",
          items: [
            {
              title: "Work Progress",
              href: "/subcontractors/progress",
              icon: TrendingUp,
            },
            {
              title: "Subcontractors Directory",
              href: "/subcontractors",
              icon: Network,
            },
          ],
        },
      ];
    }

    if (activeModule === "INVOICING_PAYMENTS") {
      return [
        dashboardSection,
        {
          title: "Invoicing & Payments",
          items: [
            {
              title: "Client Invoices",
              href: "/invoices/client",
              icon: Receipt,
            },
            {
              title: "Subcontractor Invoices",
              href: "/invoices/subcontractor",
              icon: FileText,
            },
            {
              title: "Payment Status",
              href: "/payments",
              icon: CreditCard,
            },
          ],
        },
      ];
    }

    if (activeModule === "OM") {
      return [
        dashboardSection,
        {
          title: "O&M Plant Operations Flow",
          items: [
            {
              title: "Water Treatment Plants",
              href: "/plants",
              icon: Cpu,
            },
            {
              title: "Pre-Treatment Facilities",
              href: "/plants?tab=pretreatment",
              icon: Droplets,
            },
            {
              title: "RO Stages",
              href: "/plants?tab=ro",
              icon: Layers,
            },
            {
              title: "Crystallizer Units",
              href: "/plants?tab=crystallizer",
              icon: Cpu,
            },
            {
              title: "Utility Services / ATFD",
              href: "/plants?tab=atfd",
              icon: Workflow,
            },
          ],
        },
      ];
    }

    if (activeModule === "USER_MANAGEMENT") {
      return [
        dashboardSection,
        {
          title: "User Management Module",
          items: [
            {
              title: "User Management Hub",
              href: "/user-management",
              icon: Users2,
              badge: "Hub",
            },
            {
              title: "Users Directory",
              href: "/users",
              icon: UserCheck,
            },
            {
              title: "Roles & Permissions",
              href: "/roles",
              icon: ShieldAlert,
            },
            {
              title: "Audit Trail & Logs",
              href: "/audit-logs",
              icon: FileText,
            },
            {
              title: "Settings & Configurations",
              href: "/settings",
              icon: Settings,
            },
          ],
        },
      ];
    }

    // Default fallback to Advisory
    return [dashboardSection];
  };

  const navigationSections = getSectionsForActiveModule();

  const getModuleLabel = () => {
    switch (activeModule) {
      case "ADVISORY":
        return "Advisory Module";
      case "PMC":
        return "PMC Module";
      case "PROJECT_MONITORING":
        return "Project Monitoring";
      case "SUBCONTRACTOR":
        return "Subcontractor Module";
      case "INVOICING_PAYMENTS":
        return "Invoicing & Payments";
      case "OM":
        return "Plant Operations (O&M)";
      case "USER_MANAGEMENT":
        return "User Management";
      default:
        return "General Workspace";
    }
  };

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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white p-1 text-white shadow-xs">
              <Image
                src="/twic-logo.png"
                alt="TWIC Project ERP"
                width={36}
                height={36}
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <span className="font-bold text-white text-sm tracking-wide block">
                  TWIC Project ERP
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Water &amp; Infra Project ERP
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-white rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Collapse/Expand Toggle (Desktop only) */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Current Active Module Context Indicator */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="bg-slate-950/90 border border-blue-900/60 rounded-xl px-3 py-2 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-blue-400 block">
                  Active Scope
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {getModuleLabel()}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* Navigation Items (Filtered ONLY to active module) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && !isCollapsed && (
                <div className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href.split("?")[0]));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    } ${isCollapsed ? "justify-center px-0" : ""}`}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.title}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-950 text-blue-300 border border-blue-800"
                        }`}
                      >
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
