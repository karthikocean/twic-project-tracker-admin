import { TenderApplication } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getTenderApplications(tenderId?: string): Promise<TenderApplication[]> {
  if (USE_MOCK_DATA) {
    await delay();
    const apps = mockStorage.getTenderApplications();
    if (tenderId) {
      return apps.filter((a) => a.tenderId === tenderId);
    }
    return apps;
  }
  const url = tenderId
    ? `/api/tender-applications?tenderId=${tenderId}`
    : "/api/tender-applications";
  const res = await fetch(url);
  return res.json();
}

export async function getTenderApplicationById(id: string): Promise<TenderApplication | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getTenderApplications().find((a) => a.id === id);
  }
  const res = await fetch(`/api/tender-applications/${id}`);
  return res.json();
}
