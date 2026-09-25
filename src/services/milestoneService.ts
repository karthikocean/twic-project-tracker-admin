import { Milestone, MilestoneStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getMilestones(projectId?: string): Promise<Milestone[]> {
  if (USE_MOCK_DATA) {
    await delay();
    const milestones = mockStorage.getMilestones();
    if (projectId) {
      return milestones.filter((m) => m.projectId === projectId);
    }
    return milestones;
  }
  const url = projectId ? `/api/milestones?projectId=${projectId}` : "/api/milestones";
  const res = await fetch(url);
  return res.json();
}

export async function createMilestone(data: Omit<Milestone, "id">): Promise<Milestone> {
  if (USE_MOCK_DATA) {
    await delay();
    const milestones = mockStorage.getMilestones();
    const newMilestone: Milestone = {
      ...data,
      id: `mls-${String(milestones.length + 1).padStart(3, "0")}`,
    };
    mockStorage.saveMilestones([...milestones, newMilestone]);
    return newMilestone;
  }
  const res = await fetch("/api/milestones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone> {
  if (USE_MOCK_DATA) {
    await delay();
    const milestones = mockStorage.getMilestones();
    const updated = milestones.map((m) => (m.id === id ? { ...m, ...data } : m));
    mockStorage.saveMilestones(updated);
    return updated.find((m) => m.id === id)!;
  }
  const res = await fetch(`/api/milestones/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMilestonesByProjectId(projectId: string): Promise<Milestone[]> {
  return getMilestones(projectId);
}

export const milestoneService = {
  getMilestones,
  getMilestonesByProjectId,
  createMilestone,
  updateMilestone,
};
