import { DashboardKPIData } from "@/types";

export const initialDashboardKPIs: DashboardKPIData = {
  totalEnquiries: 7,
  openEnquiries: 4,
  activeTenders: 4,
  pendingApprovals: 3,
  qualifiedVendors: 8,
  activeProjects: 4,
  delayedProjects: 1,
  outstandingInvoicesAmount: 84938000, // ~8.49 Cr
  paymentsReceivedAmount: 127690000, // ~12.76 Cr
  omPlantsRunning: 4,
  omPlantsTotal: 5,
};

export const initialEnquiryPipelineData = [
  { name: "Draft", count: 1, value: 2.2 },
  { name: "Submitted", count: 1, value: 3.8 },
  { name: "Under Review", count: 2, value: 17.4 },
  { name: "Converted", count: 2, value: 10.7 },
  { name: "Closed", count: 1, value: 1.8 },
];

export const initialTenderStatusData = [
  { name: "Published", value: 1, color: "#3b82f6" },
  { name: "Applications Open", value: 1, color: "#06b6d4" },
  { name: "Applications Closed", value: 1, color: "#8b5cf6" },
  { name: "Under Evaluation", value: 1, color: "#f59e0b" },
  { name: "Awarded", value: 1, color: "#10b981" },
  { name: "Closed", value: 1, color: "#64748b" },
];

export const initialProjectProgressChartData = [
  { name: "Thoothukudi 100 MLD", planned: 15, actual: 12 },
  { name: "Perungudi 60 MLD TTRO", planned: 72, actual: 68 },
  { name: "Sri City Pipeline Grid", planned: 68, actual: 52 },
  { name: "Cuddalore CETP O&M", planned: 5, actual: 5 },
  { name: "Belagavi Advisory", planned: 25, actual: 28 },
  { name: "Tirupur ZLD Upgradation", planned: 100, actual: 100 },
];

export const initialInvoiceStatusData = [
  { name: "Paid", amount: 165.79, count: 5, color: "#10b981" },
  { name: "Partially Paid", amount: 73.16, count: 2, color: "#0ea5e9" },
  { name: "Approved", amount: 11.21, count: 1, color: "#6366f1" },
  { name: "Submitted", amount: 17.81, count: 2, color: "#f59e0b" },
  { name: "Overdue", amount: 37.76, count: 2, color: "#ef4444" },
];

export const initialPaymentSummaryData = [
  { month: "Oct 2024", received: 18.5, disbursed: 9.2 },
  { month: "Nov 2024", received: 24.0, disbursed: 14.5 },
  { month: "Dec 2024", received: 53.1, disbursed: 31.0 },
  { month: "Jan 2025", received: 37.7, disbursed: 24.8 },
  { month: "Feb 2025", received: 36.8, disbursed: 49.5 },
  { month: "Mar 2025 (MTD)", received: 15.0, disbursed: 31.2 },
];

export const initialPlantStatusData = [
  { name: "Kodungaiyur 45 MLD TTRO", status: "Running", uptime: 98.6 },
  { name: "SIPCOT Cuddalore CETP", status: "Running", uptime: 95.2 },
  { name: "Tirupur CETP ZLD", status: "Running", uptime: 99.1 },
  { name: "Ramanathapuram Desal", status: "Maintenance", uptime: 89.4 },
  { name: "Sri City Water Recycling", status: "Running", uptime: 97.8 },
];
