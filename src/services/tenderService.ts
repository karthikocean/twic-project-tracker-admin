import { Tender, TenderStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getTenders(): Promise<Tender[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getTenders();
  }
  const res = await fetch("/api/tenders");
  return res.json();
}

export async function getTenderById(id: string): Promise<Tender | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getTenders().find((t) => t.id === id);
  }
  const res = await fetch(`/api/tenders/${id}`);
  return res.json();
}

export async function createTender(
  data: Omit<Tender, "id" | "tenderNumber" | "createdAt" | "applicationsCount">
): Promise<Tender> {
  if (USE_MOCK_DATA) {
    await delay();
    const tenders = mockStorage.getTenders();
    const nextNum = String(tenders.length + 1).padStart(3, "0");
    const newTender: Tender = {
      ...data,
      id: `tnd-${nextNum}`,
      tenderNumber: `TND-2025-${nextNum}`,
      applicationsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockStorage.saveTenders([newTender, ...tenders]);
    return newTender;
  }
  const res = await fetch("/api/tenders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTenderStatus(id: string, status: TenderStatus): Promise<Tender> {
  if (USE_MOCK_DATA) {
    await delay();
    const tenders = mockStorage.getTenders();
    const updated = tenders.map((t) => (t.id === id ? { ...t, status } : t));
    mockStorage.saveTenders(updated);
    return updated.find((t) => t.id === id)!;
  }
  const res = await fetch(`/api/tenders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export const tenderService = {
  getTenders,
  getTenderById,
  createTender,
  updateTenderStatus,
};
