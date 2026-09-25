import { AppNotification } from "@/types";

export const initialNotifications: AppNotification[] = [
  {
    id: "notif-001",
    title: "New Vendor Pre-Qualification Submitted",
    message:
      "Ion Exchange (India) Ltd submitted pre-qualification dossier PQ-004 for Water & Effluent Works.",
    type: "info",
    timestamp: "10 minutes ago",
    isRead: false,
    link: "/pre-qualification/pq-004",
  },
  {
    id: "notif-002",
    title: "Tender Deadline Approaching",
    message:
      "Tender TND-2025-001 (Thoothukudi 100 MLD EPC) bid evaluation completion deadline is within 10 days.",
    type: "warning",
    timestamp: "1 hour ago",
    isRead: false,
    link: "/tenders/tnd-001",
  },
  {
    id: "notif-003",
    title: "Approval Pending: Level 3 Board",
    message: "Work Order WO-2025-001 for Thoothukudi 100 MLD requires MD / Board final signoff.",
    type: "alert",
    timestamp: "3 hours ago",
    isRead: false,
    link: "/approvals",
  },
  {
    id: "notif-004",
    title: "Project Milestone Delayed",
    message:
      "Project PRJ-2024-004 (Sri City Bulk Pipeline) Milestone MLS-013 is delayed due to NHAI road crossing permit.",
    type: "warning",
    timestamp: "5 hours ago",
    isRead: true,
    link: "/projects/prj-004",
  },
  {
    id: "notif-005",
    title: "Invoice Overdue: APIIC Running Bill",
    message:
      "Invoice INV-CL-2025-004 (INR 2.12 Cr) from APIIC is overdue past 30 days credit term.",
    type: "alert",
    timestamp: "1 day ago",
    isRead: true,
    link: "/invoices",
  },
  {
    id: "notif-006",
    title: "Payment Received: CMWSSB",
    message: "Received RTGS credit of INR 1.50 Cr for Invoice INV-CL-2025-002 (Perungudi TTRO).",
    type: "success",
    timestamp: "2 days ago",
    isRead: true,
    link: "/payments",
  },
];
