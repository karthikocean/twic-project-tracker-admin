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
