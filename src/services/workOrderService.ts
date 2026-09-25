import { WorkOrder } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getWorkOrders(): Promise<WorkOrder[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getWorkOrders();
  }
  const res = await fetch("/api/work-orders");
  return res.json();
}

export async function getWorkOrderById(id: string): Promise<WorkOrder | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getWorkOrders().find((w) => w.id === id);
  }
  const res = await fetch(`/api/work-orders/${id}`);
  return res.json();
}

export async function createWorkOrder(
  data: Omit<WorkOrder, "id" | "workOrderNumber" | "createdAt">
): Promise<WorkOrder> {
  if (USE_MOCK_DATA) {
    await delay();
    const workOrders = mockStorage.getWorkOrders();
    const nextNum = String(workOrders.length + 1).padStart(3, "0");
    const newWo: WorkOrder = {
      ...data,
      id: `wo-${nextNum}`,
      workOrderNumber: `WO-2025-${nextNum}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockStorage.saveWorkOrders([newWo, ...workOrders]);
    return newWo;
  }
  const res = await fetch("/api/work-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
