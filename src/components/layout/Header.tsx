"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { NotificationDropdown } from "@/components/common/NotificationDropdown";
import { SearchModal } from "@/components/common/SearchModal";
import { mockStorage } from "@/mock/state";
import { UserRole } from "@/types";

interface HeaderProps {
  onToggleSidebar?: () => void;
  title?: string;
}

export function Header({ onToggleSidebar, title = "TWIC Project ERP" }: HeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("ADMIN");
  const [userName, setUserName] = useState("Dr. K. R. Narayanan");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("twic_demo_role") as UserRole;
      if (storedRole) setCurrentRole(storedRole);
      const storedName = localStorage.getItem("twic_demo_user");
      if (storedName) setUserName(storedName);
    }
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("twic_demo_role", role);
    }
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("twic_demo_auth");
    }
    router.push("/login");
  };

  const handleResetData = () => {
    if (confirm("Reset all demo data back to default factory state?")) {
      mockStorage.resetDemoData();
      window.location.reload();
    }
  };

  const rolesList: UserRole[] = [
    "ADMIN",
    "COO",
    "ADVISORY",
    "PMC",
    "OM",
    "ACCOUNTS",
    "HR",
    "PROJECT_MANAGER",
    "VIEWER",
  ];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 md:px-6 backdrop-blur-xs shadow-2xs">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block font-bold text-slate-900 text-sm tracking-tight border-r border-slate-200 pr-3 mr-1">
              TWIC
            </span>
            <span className="font-semibold text-slate-700 text-xs md:text-sm truncate">
              {title}
            </span>
          </div>
        </div>

        {/* Center: Search Trigger Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-400 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search projects, tenders, vendors...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right: Quick actions, notifications, user profile */}
        <div className="flex items-center gap-2">
          {/* Mobile search icon */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Reset Demo Data button */}
          <button
            type="button"
            onClick={handleResetData}
            title="Reset Demo Data to default"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="h-3 w-3 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs tracking-wider shadow-xs">
                {userName.charAt(0)}
              </div>
              <div className="hidden text-left xl:block">
                <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                  {userName}
                </p>
                <p className="text-[10px] font-medium text-blue-600">{currentRole}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-3.5 border-b border-slate-100 bg-slate-50">
                    <p className="font-semibold text-slate-900">{userName}</p>
                    <p className="text-[11px] text-slate-500">admin@twic-demo.com</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-semibold">
                      <ShieldCheck className="h-3 w-3" />
                      Role: {currentRole}
                    </div>
                  </div>

                  {/* Demo Role Switcher */}
                  <div className="p-2 border-b border-slate-100">
                    <p className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo Role Switcher (Mock UI)
                    </p>
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {rolesList.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleRoleChange(r)}
                          className={`px-2 py-1 text-[10px] rounded text-left font-medium transition-colors ${
                            currentRole === r
                              ? "bg-slate-900 text-white font-semibold"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md text-left"
                    >
                      <Settings className="h-3.5 w-3.5 text-slate-400" />
                      Settings & Preferences
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push("/overview");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md text-left"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                      Project Lifecycle Map
                    </button>
                    <button
                      type="button"
                      onClick={handleResetData}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-md text-left sm:hidden"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                      Reset Demo Data
                    </button>
                  </div>

                  <div className="p-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-md text-left font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5 text-rose-600" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
