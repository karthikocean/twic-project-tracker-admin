"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Droplets,
  Menu,
  X,
  Shield,
  Layers,
  User,
  KeyRound,
  LogOut,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useModule, ModuleType } from "@/context/ModuleContext";

interface ChildModule {
  title: string;
  href: string;
}

interface SubParentSection {
  title: string;
  href?: string;
  children: ChildModule[];
}

interface TopMenuSection {
  id: ModuleType;
  title: string;
  defaultHref: string;
  subParents: SubParentSection[];
}

export function TopNavigationBar({
  onToggleSidebar,
  sidebarCollapsed,
}: {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
} = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeModule, setActiveModule } = useModule();
  const [hoveredMenu, setHoveredMenu] = useState<ModuleType | null>(null);
  const [activeSubParentTitle, setActiveSubParentTitle] = useState<string>("DFR");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Authentication & Profile state
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState("Dr. K. R. Narayanan");
  const [userRole, setUserRole] = useState("SUPER_ADMIN");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Load user session from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("twic_demo_auth");
      const storedUser = localStorage.getItem("twic_demo_user");
      const storedRole = localStorage.getItem("twic_demo_role");
      if (auth === "false") {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        if (storedUser) setUserName(storedUser);
        if (storedRole) setUserRole(storedRole);
      }
    }
  }, [pathname]);

  // Exact 2-level menu hierarchy based on Image 1 (MCA style) & user flowchart (Image 2)
  const menuSections: TopMenuSection[] = [
    {
      id: "ADVISORY",
      title: "ADVISORY",
      defaultHref: "/advisory",
      subParents: [
        {
          title: "DFR",
          children: [
            { title: "Enquiry / RFQ", href: "/enquiries" },
            { title: "Preparation of Costing", href: "/costings" },
          ],
        },
        {
          title: "DPR",
          children: [
            { title: "RFP / Tender Upload Status", href: "/tenders" },
            { title: "LOA / Work Order received from Client", href: "/work-orders" },
            { title: "Project Deliverables / Milestone", href: "/milestones" },
          ],
        },
        {
          title: "DPR + RFP",
          children: [
            { title: "Approval Note for engaging the Expert / Subcontractor", href: "/approvals" },
            { title: "Technical Bid Evaluation", href: "/evaluations" },
            { title: "Note for Approval", href: "/approvals" },
            { title: "Milestone Status", href: "/milestones" },
            { title: "Payment Note", href: "/payments" },
          ],
        },
        {
          title: "Transaction Advisory",
          children: [
            { title: "Transaction Advisory & PPP Scopes", href: "/advisory" },
            { title: "Feasibility Studies & Approvals", href: "/advisory" },
          ],
        },

      ],
    },
    {
      id: "PMC",
      title: "PMC",
      defaultHref: "/pmc",
      subParents: [
        {
          title: "Pre-Contract & Procurement",
          children: [
            { title: "Enquiry / RFQ", href: "/enquiries" },
            { title: "Preparation of Costing", href: "/costings" },
            { title: "RFP / Tender Upload Status", href: "/tenders" },
            { title: "LOA / Work Order received from Client", href: "/work-orders" },
          ],
        },
        {
          title: "Consultancy Logistics",
          children: [
            { title: "Approval Note for engaging Expert / Manpower & Vehicle / Guesthouse", href: "/pmc" },
            { title: "Monthly Report", href: "/reports" },
            { title: "Milestone Status", href: "/milestones" },
          ],
        },
        {
          title: "Work / Project Monitoring Status",
          children: [
            { title: "Work Progress / Report Preparation Status", href: "/progress" },
            { title: "Invoice Status - Subcontractor", href: "/invoices" },
            { title: "Invoice Status - Client", href: "/invoices" },
            { title: "Payment Status", href: "/payments" },
          ],
        },
      ],
    },
    {
      id: "OM",
      title: "O&M",
      defaultHref: "/plants",
      subParents: [
        {
          title: "Plant Details",
          children: [
            { title: "Water Treatment Facilities Directory", href: "/plants" },
            { title: "Asset Specifications & Capacities", href: "/plants" },
          ],
        },
        {
          title: "Plant Operation Status",
          children: [
            { title: "Pre-treatment", href: "/plants?tab=pretreatment" },
            { title: "RO (Reverse Osmosis)", href: "/plants?tab=ro" },
            { title: "Additional Crystallizer", href: "/plants?tab=crystallizer" },
            { title: "Utility Services / ATFD", href: "/plants?tab=atfd" },
          ],
        },
      ],
    },
    {
      id: "USER_MANAGEMENT",
      title: "USER MANAGEMENT",
      defaultHref: "/user-management",
      subParents: [
        {
          title: "Users Management",
          children: [
            { title: "Users Directory", href: "/users" },
            { title: "Add New User Account", href: "/users/new" },
          ],
        },
        {
          title: "Roles & Permissions",
          children: [
            { title: "Role & Authorization Matrix", href: "/roles" },
            { title: "Create New Security Role", href: "/roles/new" },
          ],
        },
        {
          title: "Governance & Settings",
          children: [
            { title: "User Management Hub", href: "/user-management" },
            { title: "Audit Trail & System Logs", href: "/audit-logs" },
            { title: "System Settings", href: "/settings" },
          ],
        },
      ],
    },
  ];

  // Set default active sub-parent when menu is hovered
  const handleMenuHover = (sec: TopMenuSection) => {
    setHoveredMenu(sec.id);
    if (sec.subParents.length > 0) {
      setActiveSubParentTitle(sec.subParents[0].title);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setHoveredMenu(null);
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setHoveredMenu(null);
    setIsProfileOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSelectModule = (modId: ModuleType, defaultHref: string) => {
    setActiveModule(modId);
    setHoveredMenu(null);
    router.push(defaultHref);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("twic_demo_auth");
      localStorage.removeItem("twic_demo_role");
      localStorage.removeItem("twic_demo_user");
    }
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    router.push("/login");
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsSubmittingPassword(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("twic_user_password", newPassword);
      }
      setIsSubmittingPassword(false);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordSuccess(false);
        setIsChangePasswordOpen(false);
      }, 1500);
    }, 600);
  };

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  // Find currently active section and sub-parent for flyout
  const currentSection = menuSections.find((s) => s.id === hoveredMenu);
  const currentSubParent = currentSection?.subParents.find(
    (sp) => sp.title === activeSubParentTitle
  ) || currentSection?.subParents[0];

  return (
    <header ref={navRef} className="relative z-50 w-full select-none">
      {/* Top Banner (Government Identification Header) */}
      <div className="bg-[#001733] border-b border-[#00264d] text-white px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-wide uppercase text-slate-100 flex items-center gap-2">
                <span>TWIC Project Tracker</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-800/80 text-blue-200 rounded font-mono font-normal">
                  Govt. of Tamil Nadu
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-normal leading-none hidden sm:block">
                Water & Infrastructure Project Management ERP
              </div>
            </div>
          </Link>
        </div>

        {/* Right Info: Profile, Login, Logout, Change Password */}
        <div className="flex items-center gap-3 text-xs">
          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Avatar & Name Trigger Button */}
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-blue-900/60 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-400/40 flex items-center justify-center text-[11px] font-black text-white shadow-xs">
                  {userInitials || "TW"}
                </div>
                <div className="text-left hidden sm:block leading-tight">
                  <span className="text-white text-xs font-bold block truncate max-w-[140px]">
                    {userName}
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono block">
                    {userRole === "SUPER_ADMIN" ? "Super Admin" : userRole}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Popover Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-11 bg-white text-slate-800 shadow-2xl border border-slate-200 rounded-2xl w-64 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center">
                        {userInitials || "TW"}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {userName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          admin@twic-demo.com
                        </div>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-blue-100 text-blue-800 rounded">
                        {userRole}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 rounded">
                        Authenticated
                      </span>
                    </div>
                  </div>

                  <div className="py-1 text-xs">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-medium transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span>My Profile & Coordinates</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsChangePasswordOpen(true);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-medium transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-slate-500" />
                      <span>Change Password</span>
                    </button>

                    <Link
                      href="/audit-logs"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-medium transition-colors"
                    >
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span>Security & Session Logs</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100 px-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Login</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Primary Horizontal Government Menu Bar (Exact MCA Style with vertical separators '|') */}
      <nav className="bg-[#002244] border-b border-[#003366] text-white hidden md:block">
        <div className="flex items-stretch overflow-visible">
          {/* HOME Tab */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold tracking-wide transition-all whitespace-nowrap uppercase ${
              pathname === "/dashboard"
                ? "bg-[#003870] text-white border-b-2 border-amber-400"
                : "text-slate-200 hover:bg-[#002c59] hover:text-white"
            }`}
          >
            <span>HOME</span>
          </Link>

          {/* Vertical Divider */}
          <div className="w-[1px] bg-[#003870] my-2" />

          {/* Module Tabs (ADVISORY, PMC, O&M, USER MANAGEMENT) */}
          {menuSections.map((sec, idx) => {
            const isSelected = activeModule === sec.id;
            const isHovered = hoveredMenu === sec.id;

            return (
              <React.Fragment key={sec.id}>
                {idx > 0 && <div className="w-[1px] bg-[#003870] my-2" />}

                <div
                  className="relative group"
                  onMouseEnter={() => handleMenuHover(sec)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectModule(sec.id, sec.defaultHref)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold tracking-wide transition-all whitespace-nowrap uppercase cursor-pointer ${
                      isSelected
                        ? "bg-[#003870] text-white border-b-2 border-amber-400"
                        : "text-slate-200 hover:bg-[#002c59] hover:text-white"
                    }`}
                  >
                    <span>{sec.title}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isHovered || isSelected ? "rotate-180 text-amber-400" : "text-slate-400"
                      }`}
                    />
                  </button>

                  {/* Cascading Sub-parent & Child Flyout Menu (aligned directly next to active base parent) */}
                  {isHovered && (
                    <div
                      className="absolute left-0 top-full bg-[#f8f9fa] border border-slate-300 shadow-xl rounded-b-md w-64 py-0.5 z-50 animate-in fade-in slide-in-from-top-1"
                    >
                      {sec.subParents.map((sp) => {
                        const isActive = activeSubParentTitle === sp.title;

                        return (
                          <div
                            key={sp.title}
                            onMouseEnter={() => setActiveSubParentTitle(sp.title)}
                            className="relative group/parent"
                          >
                            <div
                              className={`px-4 py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-between border-b border-slate-200/70 last:border-b-0 transition-colors ${
                                isActive
                                  ? "bg-[#002b5f] text-white font-bold shadow-xs"
                                  : "text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                              }`}
                            >
                              <span className="truncate">{sp.title}</span>
                              <ChevronRight
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isActive ? "text-white" : "text-slate-400"
                                }`}
                              />
                            </div>

                            {/* Child Flyout Menu positioned directly adjacent to this base parent item */}
                            {isActive && sp.children && sp.children.length > 0 && (
                              <div className="absolute left-full top-0 w-auto min-w-[240px] max-w-md bg-white border border-slate-300 shadow-xl rounded-r-md rounded-bl-md py-0.5 flex flex-col z-50 animate-in fade-in slide-in-from-left-1">
                                <div className="divide-y divide-slate-100">
                                  {sp.children.map((child) => (
                                    <Link
                                      key={child.title}
                                      href={child.href}
                                      onClick={() => {
                                        setActiveModule(sec.id);
                                        setHoveredMenu(null);
                                      }}
                                      className="block px-4 py-2.5 text-xs font-medium text-slate-800 hover:bg-slate-100 hover:text-[#002244] transition-colors whitespace-nowrap"
                                    >
                                      {child.title}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* Master Flow Map Link */}
          <div className="w-[1px] bg-[#003870] my-2" />
          <Link
            href="/overview"
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold tracking-wide transition-all whitespace-nowrap uppercase ${
              pathname === "/overview"
                ? "bg-[#003870] text-white border-b-2 border-amber-400"
                : "text-slate-300 hover:bg-[#002c59] hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Flow Map</span>
          </Link>
        </div>
      </nav>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">Change Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-5 space-y-4">
              {passwordError && (
                <div className="flex items-center gap-2 p-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="flex items-center gap-2 p-2.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password successfully updated!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 text-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 text-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-600 text-slate-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#032b5f] hover:bg-[#021f45] rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingPassword ? "Updating..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#001733] border-b border-blue-900 text-white p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <Link
            href="/dashboard"
            className="block px-2 py-1.5 text-sm font-bold text-slate-100 hover:bg-white/10 rounded"
          >
            HOME / DASHBOARD
          </Link>

          {menuSections.map((sec) => (
            <div key={sec.id} className="space-y-1 pt-2 border-t border-blue-950">
              <button
                onClick={() => handleSelectModule(sec.id, sec.defaultHref)}
                className="w-full text-left font-bold text-xs uppercase tracking-wider text-amber-400 px-2 py-1 flex items-center justify-between"
              >
                <span>{sec.title}</span>
                {activeModule === sec.id && (
                  <span className="text-[10px] bg-blue-700 text-white px-2 py-0.2 rounded font-mono">
                    ACTIVE
                  </span>
                )}
              </button>

              <div className="pl-3 space-y-2">
                {sec.subParents.map((sp) => (
                  <div key={sp.title} className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      {sp.title}
                    </div>
                    <div className="pl-2 space-y-0.5">
                      {sp.children.map((ch) => (
                        <Link
                          key={ch.title}
                          href={ch.href}
                          onClick={() => {
                            setActiveModule(sec.id);
                            setMobileMenuOpen(false);
                          }}
                          className="block px-2 py-1 text-xs text-slate-300 hover:text-white"
                        >
                          • {ch.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Mobile Profile & Logout */}
          <div className="pt-3 border-t border-blue-900">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-1.5 text-xs text-slate-200 font-semibold"
            >
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-2 py-1.5 text-xs text-rose-400 font-semibold cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
