import {
  Client,
  Enquiry,
  Costing,
  Vendor,
  PreQualificationData,
  Tender,
  TenderApplication,
  Evaluation,
  Approval,
  WorkOrder,
  Project,
  Milestone,
  ProjectProgressHistory,
  MonthlyReport,
  SubcontractorAssignment,
  Plant,
  Invoice,
  Payment,
  User,
  AuditLog,
  AppNotification,
  ActivityItem,
} from "@/types";

import { initialClients } from "./clients";
import { initialVendors } from "./vendors";
import { initialPreQualifications } from "./preQualifications";
import { initialEnquiries } from "./enquiries";
import { initialCostings } from "./costings";
import { initialTenders } from "./tenders";
import { initialTenderApplications } from "./tenderApplications";
import { initialEvaluations } from "./evaluations";
import { initialApprovals } from "./approvals";
import { initialWorkOrders } from "./workOrders";
import { initialProjects } from "./projects";
import { initialMilestones } from "./milestones";
import { initialProgressHistory } from "./progress";
import { initialSubcontractors } from "./subcontractors";
import { initialMonthlyReports } from "./reports";
import { initialPlants } from "./plants";
import { initialInvoices } from "./invoices";
import { initialPayments } from "./payments";
import { initialUsers } from "./users";
import { initialAuditLogs } from "./auditLogs";
import { initialNotifications } from "./notifications";
import { initialActivities } from "./activities";

const STORAGE_KEY_PREFIX = "twic_tracker_v1_";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function getStored<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const item = window.localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to persist to localStorage:", e);
  }
}

// In-memory fallback for SSR
let clients = [...initialClients];
let vendors = [...initialVendors];
let preQualifications = [...initialPreQualifications];
let enquiries = [...initialEnquiries];
let costings = [...initialCostings];
let tenders = [...initialTenders];
let tenderApplications = [...initialTenderApplications];
let evaluations = [...initialEvaluations];
let approvals = [...initialApprovals];
let workOrders = [...initialWorkOrders];
let projects = [...initialProjects];
let milestones = [...initialMilestones];
let progressHistory = [...initialProgressHistory];
let subcontractors = [...initialSubcontractors];
let monthlyReports = [...initialMonthlyReports];
let plants = [...initialPlants];
let invoices = [...initialInvoices];
let payments = [...initialPayments];
let users = [...initialUsers];
let auditLogs = [...initialAuditLogs];
let notifications = [...initialNotifications];
let activities = [...initialActivities];

export const mockStorage = {
  // Clients
  getClients: (): Client[] => getStored("clients", clients),
  saveClients: (data: Client[]) => {
    clients = data;
    setStored("clients", data);
  },

  // Vendors
  getVendors: (): Vendor[] => getStored("vendors", vendors),
  saveVendors: (data: Vendor[]) => {
    vendors = data;
    setStored("vendors", data);
  },

  // Pre-qualifications
  getPreQualifications: (): PreQualificationData[] =>
    getStored("preQualifications", preQualifications),
  savePreQualifications: (data: PreQualificationData[]) => {
    preQualifications = data;
    setStored("preQualifications", data);
  },

  // Enquiries
  getEnquiries: (): Enquiry[] => getStored("enquiries", enquiries),
  saveEnquiries: (data: Enquiry[]) => {
    enquiries = data;
    setStored("enquiries", data);
  },

  // Costings
  getCostings: (): Costing[] => getStored("costings", costings),
  saveCostings: (data: Costing[]) => {
    costings = data;
    setStored("costings", data);
  },

  // Tenders
  getTenders: (): Tender[] => getStored("tenders", tenders),
  saveTenders: (data: Tender[]) => {
    tenders = data;
    setStored("tenders", data);
  },

  // Tender Applications
  getTenderApplications: (): TenderApplication[] =>
    getStored("tenderApplications", tenderApplications),
  saveTenderApplications: (data: TenderApplication[]) => {
    tenderApplications = data;
    setStored("tenderApplications", data);
  },

  // Evaluations
  getEvaluations: (): Evaluation[] => getStored("evaluations", evaluations),
  saveEvaluations: (data: Evaluation[]) => {
    evaluations = data;
    setStored("evaluations", data);
  },

  // Approvals
  getApprovals: (): Approval[] => getStored("approvals", approvals),
  saveApprovals: (data: Approval[]) => {
    approvals = data;
    setStored("approvals", data);
  },

  // Work Orders
  getWorkOrders: (): WorkOrder[] => getStored("workOrders", workOrders),
  saveWorkOrders: (data: WorkOrder[]) => {
    workOrders = data;
    setStored("workOrders", data);
  },

  // Projects
  getProjects: (): Project[] => getStored("projects", projects),
  saveProjects: (data: Project[]) => {
    projects = data;
    setStored("projects", data);
  },

  // Milestones
  getMilestones: (): Milestone[] => getStored("milestones", milestones),
  saveMilestones: (data: Milestone[]) => {
    milestones = data;
    setStored("milestones", data);
  },

  // Progress History
  getProgressHistory: (): ProjectProgressHistory[] => getStored("progressHistory", progressHistory),
  saveProgressHistory: (data: ProjectProgressHistory[]) => {
    progressHistory = data;
    setStored("progressHistory", data);
  },

  // Subcontractors
  getSubcontractors: (): SubcontractorAssignment[] => getStored("subcontractors", subcontractors),
  saveSubcontractors: (data: SubcontractorAssignment[]) => {
    subcontractors = data;
    setStored("subcontractors", data);
  },

  // Monthly Reports
  getMonthlyReports: (): MonthlyReport[] => getStored("monthlyReports", monthlyReports),
  saveMonthlyReports: (data: MonthlyReport[]) => {
    monthlyReports = data;
    setStored("monthlyReports", data);
  },

  // Plants
  getPlants: (): Plant[] => getStored("plants", plants),
  savePlants: (data: Plant[]) => {
    plants = data;
    setStored("plants", data);
  },

  // Invoices
  getInvoices: (): Invoice[] => getStored("invoices", invoices),
  saveInvoices: (data: Invoice[]) => {
    invoices = data;
    setStored("invoices", data);
  },

  // Payments
  getPayments: (): Payment[] => getStored("payments", payments),
  savePayments: (data: Payment[]) => {
    payments = data;
    setStored("payments", data);
  },

  // Users
  getUsers: (): User[] => getStored("users", users),
  saveUsers: (data: User[]) => {
    users = data;
    setStored("users", data);
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => getStored("auditLogs", auditLogs),
  saveAuditLogs: (data: AuditLog[]) => {
    auditLogs = data;
    setStored("auditLogs", data);
  },

  // Notifications
  getNotifications: (): AppNotification[] => getStored("notifications", notifications),
  saveNotifications: (data: AppNotification[]) => {
    notifications = data;
    setStored("notifications", data);
  },

  // Activities
  getActivities: (): ActivityItem[] => getStored("activities", activities),
  saveActivities: (data: ActivityItem[]) => {
    activities = data;
    setStored("activities", data);
  },

  // Reset Demo Data
  resetDemoData: () => {
    if (isBrowser()) {
      const keys = [
        "clients",
        "vendors",
        "preQualifications",
        "enquiries",
        "costings",
        "tenders",
        "tenderApplications",
        "evaluations",
        "approvals",
        "workOrders",
        "projects",
        "milestones",
        "progressHistory",
        "subcontractors",
        "monthlyReports",
        "plants",
        "invoices",
        "payments",
        "users",
        "auditLogs",
        "notifications",
        "activities",
      ];
      keys.forEach((k) => window.localStorage.removeItem(STORAGE_KEY_PREFIX + k));
    }
    clients = [...initialClients];
    vendors = [...initialVendors];
    preQualifications = [...initialPreQualifications];
    enquiries = [...initialEnquiries];
    costings = [...initialCostings];
    tenders = [...initialTenders];
    tenderApplications = [...initialTenderApplications];
    evaluations = [...initialEvaluations];
    approvals = [...initialApprovals];
    workOrders = [...initialWorkOrders];
    projects = [...initialProjects];
    milestones = [...initialMilestones];
    progressHistory = [...initialProgressHistory];
    subcontractors = [...initialSubcontractors];
    monthlyReports = [...initialMonthlyReports];
    plants = [...initialPlants];
    invoices = [...initialInvoices];
    payments = [...initialPayments];
    users = [...initialUsers];
    auditLogs = [...initialAuditLogs];
    notifications = [...initialNotifications];
    activities = [...initialActivities];
  },
};

export const resetDemoData = () => mockStorage.resetDemoData();
