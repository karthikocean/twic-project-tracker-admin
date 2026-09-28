import { SubcontractorAssignment } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getSubcontractors(projectId?: string): Promise<SubcontractorAssignment[]> {
  if (USE_MOCK_DATA) {
    await delay();
    const list = mockStorage.getSubcontractors();
    if (projectId) {
      return list.filter((s) => s.projectId === projectId);
    }
    return list;
  }
  const url = projectId ? `/api/subcontractors?projectId=${projectId}` : "/api/subcontractors";
  const res = await fetch(url);
  return res.json();
}

export async function getSubcontractorById(
  id: string
): Promise<SubcontractorAssignment | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getSubcontractors().find((s) => s.id === id);
  }
  const res = await fetch(`/api/subcontractors/${id}`);
  return res.json();
}

export async function getSubcontractorsByProjectId(
  projectId: string
): Promise<SubcontractorAssignment[]> {
  return getSubcontractors(projectId);
}

export async function updateSubcontractorProgress(
  id: string,
  progressPercent: number,
  status?: "Active" | "Completed" | "Terminated" | "Pending"
): Promise<SubcontractorAssignment> {
  if (USE_MOCK_DATA) {
    await delay();
    const list = mockStorage.getSubcontractors();
    const updated = list.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          progressPercent,
          status: status || (progressPercent >= 100 ? "Completed" : s.status),
        };
      }
      return s;
    });
    mockStorage.saveSubcontractors(updated);
    const target = updated.find((s) => s.id === id);
    if (!target) throw new Error("Subcontractor assignment not found");
    return target;
  }
  const res = await fetch(`/api/subcontractors/${id}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progressPercent, status }),
  });
  return res.json();
}

export async function createSubcontractorAssignment(
  data: Omit<SubcontractorAssignment, "id" | "invoicesCount">
): Promise<SubcontractorAssignment> {
  if (USE_MOCK_DATA) {
    await delay();
    const list = mockStorage.getSubcontractors();
    const newSub: SubcontractorAssignment = {
      ...data,
      id: `sub-${Date.now()}`,
      invoicesCount: 0,
    };
    mockStorage.saveSubcontractors([newSub, ...list]);
    return newSub;
  }
  const res = await fetch("/api/subcontractors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const subcontractorService = {
  getSubcontractors,
  getSubcontractorById,
  getSubcontractorsByProjectId,
  updateSubcontractorProgress,
  createSubcontractorAssignment,
};
