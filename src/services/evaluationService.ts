import { Evaluation, EvaluationStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getEvaluations(): Promise<Evaluation[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getEvaluations();
  }
  const res = await fetch("/api/evaluations");
  return res.json();
}

export async function getEvaluationById(id: string): Promise<Evaluation | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getEvaluations().find((e) => e.id === id);
  }
  const res = await fetch(`/api/evaluations/${id}`);
  return res.json();
}

export async function updateEvaluation(
  id: string,
  data: {
    status: EvaluationStatus;
    remarks?: string;
    technicalScore?: number;
    commercialAmount?: number;
  }
): Promise<Evaluation> {
  if (USE_MOCK_DATA) {
    await delay();
    const evals = mockStorage.getEvaluations();
    const updated = evals.map((e) => (e.id === id ? { ...e, ...data } : e));
    mockStorage.saveEvaluations(updated);
    return updated.find((e) => e.id === id)!;
  }
  const res = await fetch(`/api/evaluations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
