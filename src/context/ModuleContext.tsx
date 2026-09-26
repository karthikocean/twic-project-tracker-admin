"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type ModuleType = "ADVISORY" | "PMC" | "OM" | "USER_MANAGEMENT" | "MONITORING" | "DASHBOARD";

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
      pathname.startsWith("/pmc") ||
      pathname.startsWith("/progress") ||
      pathname.startsWith("/reports")
    ) {
      setActiveModuleState("PMC");
    } else if (pathname.startsWith("/plants")) {
      setActiveModuleState("OM");
    } else if (
      pathname.startsWith("/advisory") ||
      pathname.startsWith("/enquiries") ||
      pathname.startsWith("/costings") ||
      pathname.startsWith("/tenders") ||
      pathname.startsWith("/tender-applications") ||
      pathname.startsWith("/evaluations") ||
      pathname.startsWith("/work-orders") ||
      pathname.startsWith("/milestones") ||
      pathname.startsWith("/approvals")
    ) {
      setActiveModuleState("ADVISORY");
    } else if (
      pathname.startsWith("/subcontractors") ||
      pathname.startsWith("/pre-qualification") ||
      pathname.startsWith("/vendors") ||
      pathname.startsWith("/invoices") ||
      pathname.startsWith("/payments")
    ) {
      // Default to ADVISORY or keep active
      setActiveModuleState((prev) => (prev === "PMC" ? "PMC" : "ADVISORY"));
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
