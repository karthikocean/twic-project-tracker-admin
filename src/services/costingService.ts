import { Costing, CostingItem } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getCostings(): Promise<Costing[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getCostings();
  }
  const res = await fetch("/api/costings");
  return res.json();
}

export async function getCostingById(id: string): Promise<Costing | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getCostings().find((c) => c.id === id);
  }
  const res = await fetch(`/api/costings/${id}`);
  return res.json();
}

export async function saveCosting(
  id: string,
  items: CostingItem[],
  marginPercent: number,
  notes?: string
): Promise<Costing> {
  if (USE_MOCK_DATA) {
    await delay();
    const costings = mockStorage.getCostings();
    const baseCost = items.reduce((sum, it) => sum + it.total, 0);
    const marginAmount = Math.round(baseCost * (marginPercent / 100));
    const subtotal = baseCost + marginAmount;
    const taxesPercent = 18;
    const taxesAmount = Math.round(subtotal * (taxesPercent / 100));
    const finalQuotation = subtotal + taxesAmount;

    const updated = costings.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          items,
          baseCost,
          marginPercent,
          marginAmount,
          taxesPercent,
          taxesAmount,
          finalQuotation,
          notes: notes !== undefined ? notes : c.notes,
          updatedAt: new Date().toISOString().split("T")[0],
        };
      }
      return c;
    });
    mockStorage.saveCostings(updated);
    return updated.find((c) => c.id === id)!;
  }
  const res = await fetch(`/api/costings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, marginPercent, notes }),
  });
  return res.json();
}
