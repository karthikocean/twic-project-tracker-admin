import { Client } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getClients(): Promise<Client[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getClients();
  }
  const res = await fetch("/api/clients");
  return res.json();
}

export async function getClientById(id: string): Promise<Client | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getClients().find((c) => c.id === id);
  }
  const res = await fetch(`/api/clients/${id}`);
  return res.json();
}

export async function createClient(
  data: Omit<Client, "id" | "createdAt" | "activeProjectsCount" | "totalProjectsCount">
): Promise<Client> {
  if (USE_MOCK_DATA) {
    await delay();
    const clients = mockStorage.getClients();
    const newClient: Client = {
      ...data,
      id: `cl-${String(clients.length + 1).padStart(3, "0")}`,
      activeProjectsCount: 0,
      totalProjectsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockStorage.saveClients([newClient, ...clients]);
    return newClient;
  }
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateClient(id: string, data: Partial<Client>): Promise<Client> {
  if (USE_MOCK_DATA) {
    await delay();
    const clients = mockStorage.getClients();
    const updated = clients.map((c) => (c.id === id ? { ...c, ...data } : c));
    mockStorage.saveClients(updated);
    return updated.find((c) => c.id === id)!;
  }
  const res = await fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const clientService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
};
