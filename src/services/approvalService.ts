import { Approval, ApprovalStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getApprovals(): Promise<Approval[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getApprovals();
  }
  const res = await fetch("/api/approvals");
  return res.json();
}

export async function getApprovalById(id: string): Promise<Approval | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getApprovals().find((a) => a.id === id);
  }
  const res = await fetch(`/api/approvals/${id}`);
  return res.json();
}

export async function processApproval(
  id: string,
  action: "Approved" | "Rejected" | "Returned",
  comments: string,
  user = "Current User"
): Promise<Approval> {
  if (USE_MOCK_DATA) {
    await delay();
    const approvals = mockStorage.getApprovals();
    const target = approvals.find((a) => a.id === id);
    if (!target) throw new Error("Approval record not found");

    const newStatus: ApprovalStatus =
      action === "Approved" ? "Approved" : action === "Rejected" ? "Rejected" : "Returned";

    const updatedHistory = [
      ...target.history,
      {
        level: target.currentLevel,
        action,
        user,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
        note: comments,
      },
    ];

    const updated = approvals.map((a) =>
      a.id === id
        ? {
            ...a,
            status: newStatus,
            comments,
            history: updatedHistory,
          }
        : a
    );
    mockStorage.saveApprovals(updated);
    return updated.find((a) => a.id === id)!;
  }
  const res = await fetch(`/api/approvals/${id}/process`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, comments, user }),
  });
  return res.json();
}

export async function createApproval(data: {
  entityType: "Enquiry" | "Costing" | "Tender" | "Evaluation" | "Work Order" | "Invoice";
  entityReferenceCode: string;
  requestedBy: string;
  requestDate?: string;
  currentLevel: "Level 1 - Project Manager" | "Level 2 - COO" | "Level 3 - MD / Board";
  comments?: string;
}): Promise<Approval> {
  if (USE_MOCK_DATA) {
    await delay();
    const approvals = mockStorage.getApprovals();
    const count = approvals.length + 1;
    const approvalCode = `APR-2025-${String(count).padStart(3, "0")}`;
    const id = `apr-${Date.now()}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const dateStr = data.requestDate || new Date().toISOString().split("T")[0];

    const newApproval: Approval = {
      id,
      approvalCode,
      entityType: data.entityType,
      entityReferenceId: `ref-${Date.now()}`,
      entityReferenceCode: data.entityReferenceCode,
      requestedBy: data.requestedBy || "Current Officer",
      requestDate: dateStr,
      currentLevel: data.currentLevel || "Level 1 - Project Manager",
      status: "Pending",
      comments: data.comments || "",
      history: [
        {
          level: data.currentLevel || "Level 1 - Project Manager",
          action: "Requested",
          user: data.requestedBy || "Current Officer",
          timestamp: now,
          note: data.comments || "Initial approval submission",
        },
      ],
    };

    const updated = [newApproval, ...approvals];
    mockStorage.saveApprovals(updated);
    return newApproval;
  }
  const res = await fetch("/api/approvals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
