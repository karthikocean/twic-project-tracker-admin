import { Plant, PlantStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getPlants(): Promise<Plant[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getPlants();
  }
  const res = await fetch("/api/plants");
  return res.json();
}

export async function getPlantById(id: string): Promise<Plant | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getPlants().find((p) => p.id === id);
  }
  const res = await fetch(`/api/plants/${id}`);
  return res.json();
}

export async function updatePlantOperations(
  id: string,
  operations: Plant["operations"],
  status: PlantStatus
): Promise<Plant> {
  if (USE_MOCK_DATA) {
    await delay();
    const plants = mockStorage.getPlants();
    const updated = plants.map((p) => (p.id === id ? { ...p, operations, status } : p));
    mockStorage.savePlants(updated);
    return updated.find((p) => p.id === id)!;
  }
  const res = await fetch(`/api/plants/${id}/operations`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operations, status }),
  });
  return res.json();
}

export async function updatePlantOperation(
  id: string,
  unit: keyof Plant["operations"],
  unitStatus: "Running" | "Stopped" | "Maintenance"
): Promise<Plant> {
  const plant = await getPlantById(id);
  if (!plant) throw new Error("Plant not found");
  const newOps = { ...plant.operations, [unit]: unitStatus };
  const allRunning = Object.values(newOps).every((s) => s === "Running");
  const anyStopped = Object.values(newOps).some((s) => s === "Stopped");
  const newPlantStatus = allRunning ? "Running" : anyStopped ? "Stopped" : "Maintenance";
  return updatePlantOperations(id, newOps, newPlantStatus);
}

export const plantService = {
  getPlants,
  getPlantById,
  updatePlantOperations,
  updatePlantOperation,
};
