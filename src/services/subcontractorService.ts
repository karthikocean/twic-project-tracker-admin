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

export const subcontractorService = {
  getSubcontractors,
  getSubcontractorById,
  getSubcontractorsByProjectId,
};
