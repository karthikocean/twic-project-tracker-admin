"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type ModuleType =
  | "ADVISORY"
  | "PMC"
  | "PROJECT_MONITORING"
  | "SUBCONTRACTOR"
  | "INVOICING_PAYMENTS"
  | "OM"
  | "USER_MANAGEMENT"
  | "MONITORING"
  | "DASHBOARD";

interface ModuleContextType {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
}

const ModuleContext = createContext<ModuleContextType>({
  activeModule: "ADVISORY",
  setActiveModule: () => {},
});

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeModule, setActiveModuleState] = useState<ModuleType>("ADVISORY");

  // Determine module based on pathname
  useEffect(() => {
    if (
      pathname.startsWith("/users") ||
      pathname.startsWith("/roles") ||
      pathname.startsWith("/user-management") ||
      pathname.startsWith("/settings") ||
      pathname.startsWith("/audit-logs")
    ) {
      setActiveModuleState("USER_MANAGEMENT");
    } else if (
      pathname.startsWith("/progress") ||
      pathname.startsWith("/reports")
    ) {
      setActiveModuleState("PROJECT_MONITORING");
    } else if (pathname.startsWith("/subcontractors")) {
      setActiveModuleState("SUBCONTRACTOR");
    } else if (
      pathname.startsWith("/invoices") ||
      pathname.startsWith("/payments")
    ) {
      setActiveModuleState("INVOICING_PAYMENTS");
    } else if (pathname.startsWith("/plants")) {
      setActiveModuleState("OM");
    } else if (pathname.startsWith("/pmc")) {
      setActiveModuleState("PMC");
    } else if (
      pathname.startsWith("/advisory") ||
      pathname.startsWith("/enquiries") ||
      pathname.startsWith("/costings") ||
      pathname.startsWith("/tenders") ||
      pathname.startsWith("/tender-applications") ||
      pathname.startsWith("/evaluations") ||
      pathname.startsWith("/work-orders") ||
      pathname.startsWith("/milestones") ||
      pathname.startsWith("/approvals") ||
      pathname.startsWith("/clients") ||
      pathname.startsWith("/vendors") ||
      pathname.startsWith("/pre-qualification") ||
      pathname.startsWith("/projects")
    ) {
      setActiveModuleState("ADVISORY");
    } else if (pathname === "/dashboard" || pathname === "/overview") {
      const saved = localStorage.getItem("twic_active_module");
      if (saved) {
        setActiveModuleState(saved as ModuleType);
      } else {
        setActiveModuleState("ADVISORY");
      }
    }
  }, [pathname]);

  const setActiveModule = (mod: ModuleType) => {
    setActiveModuleState(mod);
    if (typeof window !== "undefined") {
      localStorage.setItem("twic_active_module", mod);
    }
  };

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  return useContext(ModuleContext);
}
