export type BusinessType = "ADVISORY" | "PMC" | "O&M";

export type EnquiryStatus =
  "DRAFT" | "SUBMITTED" | "UNDER REVIEW" | "CONVERTED" | "REJECTED" | "CLOSED";

export type TenderStatus =
  | "Draft"
  | "Published"
  | "Applications Open"
  | "Applications Closed"
  | "Under Evaluation"
  | "Approved"
  | "Awarded"
  | "Closed";

export type PreQualificationStatus =
  "Draft" | "Submitted" | "Under Verification" | "Approved" | "Rejected" | "Returned";

export type EvaluationStatus =
  | "Pending"
  | "Technically Qualified"
  | "Technically Disqualified"
  | "Commercially Evaluated"
  | "Approved"
  | "Rejected"
  | "Returned";

export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Returned";

export type WorkOrderStatus = "Draft" | "Issued" | "Active" | "Completed" | "Cancelled";

export type ProjectStatus = "Not Started" | "In Progress" | "On Hold" | "Delayed" | "Completed";

export type MilestoneStatus = "Not Started" | "In Progress" | "Completed" | "Delayed";

export type PlantStatus = "Running" | "Stopped" | "Maintenance";

export type InvoiceStatus =
  "Draft" | "Submitted" | "Approved" | "Partially Paid" | "Paid" | "Overdue" | "Cancelled";

export type PaymentMode = "Bank Transfer" | "Cheque" | "NEFT" | "RTGS" | "Other";

export type UserRole =
  "ADMIN" | "COO" | "ADVISORY" | "PMC" | "OM" | "ACCOUNTS" | "HR" | "PROJECT_MANAGER" | "VIEWER";

export interface Client {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  activeProjectsCount: number;
  totalProjectsCount: number;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  enquiryDate: string;
  clientId: string;
  clientName: string;
  projectName: string;
  businessType: BusinessType;
  description: string;
  estimatedValue: number; // in INR
  expectedResponseDate: string;
  status: EnquiryStatus;
  relatedCostingId?: string;
  relatedTenderId?: string;
  assignedTo?: string;
  scopeOfWork?: string;
  documents?: { name: string; size: string; date: string }[];
  timeline?: { date: string; title: string; user: string; notes?: string }[];
  createdAt: string;
}

export interface CostingItem {
  id: string;
  category:
    | "Manpower"
    | "Expert / Consultant"
    | "Travel"
    | "Vehicle"
    | "Accommodation"
    | "Subcontractor"
    | "Other";
  description: string;
  unit: string;
  quantity: number;
  unitRate: number;
  total: number;
}

export interface Costing {
  id: string;
  costingNumber: string;
  enquiryId: string;
  enquiryNumber: string;
  projectName: string;
  clientId: string;
  clientName: string;
  businessType: BusinessType;
  items: CostingItem[];
  baseCost: number;
  marginPercent: number;
  marginAmount: number;
  taxesPercent: number;
  taxesAmount: number;
  finalQuotation: number;
  status: "Draft" | "Under Review" | "Approved" | "Finalized";
  notes?: string;
  disclaimer: string; // e.g. "TBD - Client Confirmation Required"
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalPerson {
  id: string;
  name: string;
  qualification: string;
  experienceYears: number;
  specialization: string;
}

export interface PastProjectExperience {
  id: string;
  clientName: string;
  projectName: string;
  projectDescription: string;
  projectValue: number;
  completionStatus: "Completed" | "In Progress";
  completionDate?: string;
  completionTestimonial?: string;
  workOrderNumber?: string;
}

export interface TurnoverRecord {
  financialYear: string;
  turnoverAmount: number; // in INR Crores/Lakhs
  auditedBalanceSheetUrl?: string;
  isAudited: boolean;
}

export interface EnclosureDoc {
  id: string;
  title: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  uploadedDate?: string;
  status: "Uploaded" | "Pending";
}

export interface PreQualificationData {
  id: string;
  vendorId: string;
  submissionDate: string;
  status: PreQualificationStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;

  // Section 1: Company Information
  companyName: string;
  registeredAddress: string;
  phone: string;
  email: string;
  website: string;

  // Section 2: Statutory Information
  panNumber: string;
  gstNumber: string;
  msmeCertificateNumber?: string;
  rocCertificateNumber: string;

  // Section 3: Contact Persons
  contactPersons: {
    id: string;
    name: string;
    mobile: string;
    email: string;
    designation: string;
  }[];

  // Section 4: Turnover
  turnovers: TurnoverRecord[];

  // Section 5 & 6: Technical Personnel & Employees
  numberOfTechnicalPersons: number;
  technicalPersonnel: TechnicalPerson[];
  technicalEmployeesCount: number;
  nonTechnicalEmployeesCount: number;

  // Section 7: Past Project Experience (Water & Wastewater Industries)
  pastProjects: PastProjectExperience[];

  // Section 8: Enclosures
  enclosures: EnclosureDoc[];

  // Section 9: Declaration
  contractorName: string;
  authorizedSignatory: string;
  designation: string;
  dateOfDeclaration: string;
  placeOfDeclaration: string;
  signatureUploaded: boolean;
  officeSealUploaded: boolean;
}

export interface Vendor {
  id: string;
  vendorCode: string;
  companyName: string;
  panNumber: string;
  gstNumber: string;
  msmeNumber?: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: "General Contractor" | "Equipment Supplier" | "Consultant" | "O&M Specialist";
  preQualificationStatus: PreQualificationStatus;
  preQualificationId?: string;
  activeProjectsCount: number;
  totalProjectsCount: number;
  rating: number; // 1-5
  status: "Active" | "Blacklisted" | "Under Review";
  createdAt: string;
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  tenderType: "Open Tender" | "Limited Tender" | "Single Source" | "RFP / EOI";
  estimatedValue: number;
  publishDate: string;
  submissionDeadline: string;
  scopeOfWork: string;
  documents: { name: string; size: string; date: string }[];
  status: TenderStatus;
  applicationsCount: number;
  awardedVendorId?: string;
  awardedVendorName?: string;
  createdAt: string;
}

export interface TenderApplication {
  id: string;
  applicationNumber: string;
  tenderId: string;
  tenderNumber: string;
  tenderTitle: string;
  vendorId: string;
  vendorName: string;
  submissionDate: string;
  technicalStatus: "Submitted" | "Passed" | "Failed" | "Under Review";
  commercialAmount: number;
  status: "Submitted" | "Qualified" | "Disqualified" | "Awarded" | "Rejected";
  remarks?: string;
  documentsCount: number;
}

export interface Evaluation {
  id: string;
  evaluationNumber: string;
  tenderId: string;
  tenderNumber: string;
  tenderTitle: string;
  vendorId: string;
  vendorName: string;
  technicalScore: number; // e.g. out of 100
  technicalStatus: "Passed" | "Failed" | "Pending";
  commercialAmount: number;
  commercialRank?: number; // L1, L2, L3...
  remarks: string;
  evaluatedBy: string;
  evaluationDate: string;
  status: EvaluationStatus;
  disclaimer: string; // "TBD - Client Confirmation Required"
}

export interface Approval {
  id: string;
  approvalCode: string;
  entityType: "Enquiry" | "Costing" | "Tender" | "Evaluation" | "Work Order" | "Invoice";
  entityReferenceId: string;
  entityReferenceCode: string;
  requestedBy: string;
  requestDate: string;
  currentLevel: "Level 1 - Project Manager" | "Level 2 - COO" | "Level 3 - MD / Board";
  status: ApprovalStatus;
  comments?: string;
  history: {
    level: string;
    action: "Approved" | "Rejected" | "Returned" | "Requested";
    user: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string;
  tenderId?: string;
  tenderNumber?: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  selectedVendorId: string;
  selectedVendorName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  scopeOfWork: string;
  documents: { name: string; size: string }[];
  status: WorkOrderStatus;
  createdAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  progressPercent: number;
  status: MilestoneStatus;
  weightagePercent: number;
}

export interface ProjectProgressHistory {
  id: string;
  projectId: string;
  progressDate: string;
  progressPercent: number;
  workCompleted: string;
  workInProgress: string;
  issues: string;
  delays: string;
  nextPlan: string;
  recordedBy: string;
}

export interface MonthlyReport {
  id: string;
  reportNumber: string;
  projectId: string;
  projectName: string;
  month: string; // e.g. "January 2026"
  progressPercent: number;
  submittedDate: string;
  submittedBy: string;
  executiveSummary: string;
  workCompleted: string;
  workInProgress: string;
  issues: string;
  nextMonthPlan: string;
  status: "Draft" | "Submitted" | "Reviewed" | "Approved";
  attachments: { name: string; size: string }[];
}

export interface SubcontractorAssignment {
  id: string;
  projectId: string;
  projectName: string;
  vendorId: string;
  vendorName: string;
  scopeOfWork: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  progressPercent: number;
  status: "Active" | "Completed" | "Terminated" | "Pending";
  invoicesCount: number;
}

export interface PlantOperationStatus {
  preTreatment: "Running" | "Stopped" | "Maintenance";
  ro: "Running" | "Stopped" | "Maintenance";
  crystallizer: "Running" | "Stopped" | "Maintenance";
  utilityAtfd: "Running" | "Stopped" | "Maintenance";
}

export interface Plant {
  id: string;
  plantCode: string;
  plantName: string;
  clientId: string;
  clientName: string;
  location: string;
  capacity: string; // e.g. "45 MLD"
  status: PlantStatus;
  operations: PlantOperationStatus;
  feedFlowRate: string; // e.g. "1,850 m3/hr"
  productWaterTds: string; // e.g. "< 200 ppm"
  dailyTreatedVolume: string; // e.g. "42,300 m3"
  uptimePercent: number;
  managerName: string;
  lastMaintenanceDate: string;
  nextScheduledMaintenance: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: "Client Invoice" | "Subcontractor Invoice";
  projectId: string;
  projectName: string;
  partyId: string; // ClientId or VendorId
  partyName: string; // Client Name or Subcontractor Name
  invoiceDate: string;
  dueDate: string;
  baseAmount: number;
  taxAmount: number; // 18% GST typical
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: InvoiceStatus;
  remarks?: string;
}

export interface Payment {
  id: string;
  paymentReference: string;
  invoiceId: string;
  invoiceNumber: string;
  projectId: string;
  projectName: string;
  payerOrPayee: string;
  paymentDate: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionReference: string;
  status: "Completed" | "Pending" | "Failed";
  notes?: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  projectName: string;
  clientId: string;
  clientName: string;
  projectType: BusinessType;
  contractValue: number;
  startDate: string;
  endDate: string;
  progressPercent: number;
  plannedProgressPercent: number;
  variancePercent: number; // actual - planned
  status: ProjectStatus;
  projectManager: string;
  workOrderNumber?: string;
  workOrderId?: string;
  description: string;
  location: string;
  milestonesCount: number;
  subcontractorsCount: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  status: "Active" | "Inactive";
  lastLogin: string;
  avatar?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "LOGIN" | "EXPORT";
  module: string;
  recordReference: string;
  description: string;
  ipAddress: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type:
    | "Enquiry Created"
    | "Vendor Submitted"
    | "Tender Published"
    | "Application Received"
    | "Evaluation Completed"
    | "Work Order Created"
    | "Project Progress Updated"
    | "Invoice Submitted"
    | "Payment Received";
  title: string;
  description: string;
  user: string;
  entityId?: string;
  entityLink?: string;
}

export interface DashboardKPIData {
  totalEnquiries: number;
  openEnquiries: number;
  activeTenders: number;
  pendingApprovals: number;
  qualifiedVendors: number;
  activeProjects: number;
  delayedProjects: number;
  outstandingInvoicesAmount: number;
  paymentsReceivedAmount: number;
  omPlantsRunning: number;
  omPlantsTotal: number;
}
