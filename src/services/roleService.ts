import { USE_MOCK_DATA, delay } from "./config";

export interface RoleItem {
  id?: string;
  name: string;
  title?: string;
  desc: string;
  department?: string;
  status?: "Active" | "Inactive";
  createdAt?: string;
}

export interface ModulePermission {
  name: string;
  access: string[];
}

export const defaultRoles: RoleItem[] = [
  { name: "SUPER_ADMIN", title: "Super Admin", desc: "Super Administrator - Full access across all systems and root privileges", department: "Executive Directorate", status: "Active" },
  { name: "FRANCHISE_OWNER", title: "Franchise Owner", desc: "Regional Franchise Partner - Project commissioning, site reports and billing", department: "Operations & Governance", status: "Active" },
  { name: "ADMIN", title: "System Administrator", desc: "Enterprise Administrator - Full operational management", department: "Executive Directorate", status: "Active" },
  { name: "COO", title: "Chief Operating Officer", desc: "Chief Operating Officer - Approvals, executive oversight", department: "Operations & Governance", status: "Active" },
  { name: "ADVISORY", title: "Advisory & DPR Wing", desc: "Advisory & DPR division - Costing, RFQ, transaction advisory", department: "Advisory & DPR Wing", status: "Active" },
  { name: "PMC", title: "Project Management Consultant", desc: "Project Management Consultant - Site supervision, monthly reports", department: "Project Management Consultancy", status: "Active" },
  { name: "OM", title: "Plant Operations & Maintenance", desc: "Operations & Maintenance - Water plant monitoring, ZLD SCADA", department: "Plant Operations & Maintenance", status: "Active" },
  { name: "ACCOUNTS", title: "Finance & Accounts", desc: "Finance & Accounts - Invoicing, disbursements, treasury", department: "Finance & Accounts", status: "Active" },
  { name: "HR", title: "Human Resources Officer", desc: "Human Resources - Manpower allocation & personnel", department: "Human Resources & Admin", status: "Active" },
  { name: "PROJECT_MANAGER", title: "Project Manager / In-Charge", desc: "Resident Engineer / Project In-Charge", department: "Project Management Consultancy", status: "Active" },
  { name: "VIEWER", title: "Auditor / Read-Only", desc: "Audit & Read-Only inspection access", department: "Internal Audit", status: "Active" },
];

export const defaultModules: ModulePermission[] = [
  { name: "Enquiries & RFQ", access: ["SUPER_ADMIN", "ADMIN", "COO", "ADVISORY"] },
  { name: "Cost Preparation", access: ["SUPER_ADMIN", "ADMIN", "COO", "ADVISORY"] },
  { name: "Tenders & Applications", access: ["SUPER_ADMIN", "ADMIN", "COO", "ADVISORY", "PMC"] },
  { name: "Vendor Pre-Qualification", access: ["SUPER_ADMIN", "ADMIN", "COO", "PMC", "ADVISORY"] },
  { name: "Technical Evaluation", access: ["SUPER_ADMIN", "ADMIN", "COO", "ADVISORY", "PMC"] },
  { name: "Executive Approvals", access: ["SUPER_ADMIN", "ADMIN", "COO"] },
  { name: "Work Orders (LOA)", access: ["SUPER_ADMIN", "ADMIN", "COO", "ADVISORY", "FRANCHISE_OWNER"] },
  { name: "Projects & Milestones", access: ["SUPER_ADMIN", "ADMIN", "COO", "PMC", "PROJECT_MANAGER", "FRANCHISE_OWNER"] },
  { name: "Site Progress Logs", access: ["SUPER_ADMIN", "ADMIN", "COO", "PMC", "PROJECT_MANAGER", "FRANCHISE_OWNER"] },
  { name: "Subcontractor Allocations", access: ["SUPER_ADMIN", "ADMIN", "COO", "PMC", "PROJECT_MANAGER"] },
  { name: "O&M Plant Operations", access: ["SUPER_ADMIN", "ADMIN", "COO", "OM"] },
  { name: "Invoices & Billing", access: ["SUPER_ADMIN", "ADMIN", "COO", "ACCOUNTS", "FRANCHISE_OWNER"] },
  { name: "Payment Disbursements", access: ["SUPER_ADMIN", "ADMIN", "COO", "ACCOUNTS"] },
  { name: "Audit Trail & System Logs", access: ["SUPER_ADMIN", "ADMIN", "COO", "VIEWER"] },
];

const ROLES_STORAGE_KEY = "twic_tracker_v1_custom_roles";
const MODULES_STORAGE_KEY = "twic_tracker_v1_custom_modules";

export async function getRoles(): Promise<RoleItem[]> {
  if (USE_MOCK_DATA) {
    await delay(50);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ROLES_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultRoles;
  }
  const res = await fetch("/api/roles");
  return res.json();
}

export async function getModules(): Promise<ModulePermission[]> {
  if (USE_MOCK_DATA) {
    await delay(50);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(MODULES_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return defaultModules;
  }
  const res = await fetch("/api/roles/modules");
  return res.json();
}

export async function createRole(
  newRole: RoleItem,
  selectedModuleNames: string[] = []
): Promise<RoleItem> {
  if (USE_MOCK_DATA) {
    await delay(100);
    const existingRoles = await getRoles();
    const existingModules = await getModules();

    const formattedRoleName = newRole.name.toUpperCase().replace(/\s+/g, "_");
    const roleRecord: RoleItem = {
      ...newRole,
      id: `role-${Date.now()}`,
      name: formattedRoleName,
      status: newRole.status || "Active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedRoles = [...existingRoles, roleRecord];

    const updatedModules = existingModules.map((m) => {
      if (selectedModuleNames.includes(m.name) && !m.access.includes(formattedRoleName)) {
        return { ...m, access: [...m.access, formattedRoleName] };
      }
      return m;
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(updatedRoles));
      localStorage.setItem(MODULES_STORAGE_KEY, JSON.stringify(updatedModules));
    }

    return roleRecord;
  }

  const res = await fetch("/api/roles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...newRole, selectedModuleNames }),
  });
  return res.json();
}
