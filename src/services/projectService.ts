import { Project, ProjectProgressHistory, Milestone } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getProjects(): Promise<Project[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getProjects();
  }
  const res = await fetch("/api/projects");
  return res.json();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getProjects().find((p) => p.id === id);
  }
  const res = await fetch(`/api/projects/${id}`);
  return res.json();
}

export async function updateProjectProgress(
  id: string,
  progressPercent: number,
  notes: {
    workCompleted: string;
    workInProgress: string;
    issues?: string;
    delays?: string;
    nextPlan?: string;
    recordedBy?: string;
  }
): Promise<Project> {
  if (USE_MOCK_DATA) {
    await delay();
    const projects = mockStorage.getProjects();
    const target = projects.find((p) => p.id === id);
    if (!target) throw new Error("Project not found");

    const variancePercent = progressPercent - target.plannedProgressPercent;

    const updated = projects.map((p) =>
      p.id === id ? { ...p, progressPercent, variancePercent } : p
    );
    mockStorage.saveProjects(updated);

    // Record in history
    const history = mockStorage.getProgressHistory();
    const newEntry: ProjectProgressHistory = {
      id: `prg-${Date.now()}`,
      projectId: id,
      progressDate: new Date().toISOString().split("T")[0],
      progressPercent,
      workCompleted: notes.workCompleted,
      workInProgress: notes.workInProgress,
      issues: notes.issues || "None reported.",
      delays: notes.delays || "On schedule.",
      nextPlan: notes.nextPlan || "Continue phase deliverables.",
      recordedBy: notes.recordedBy || "Current User",
    };
    mockStorage.saveProgressHistory([newEntry, ...history]);

    return updated.find((p) => p.id === id)!;
  }
  const res = await fetch(`/api/projects/${id}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ progressPercent, ...notes }),
  });
  return res.json();
}

export async function getProjectProgressHistory(
  projectId: string
): Promise<ProjectProgressHistory[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getProgressHistory().filter((p) => p.projectId === projectId);
  }
  const res = await fetch(`/api/projects/${projectId}/progress-history`);
  return res.json();
}

export const projectService = {
  getProjects,
  getProjectById,
  updateProjectProgress,
  getProjectProgressHistory,
};
