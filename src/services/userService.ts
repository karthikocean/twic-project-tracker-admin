import { User, UserRole } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getUsers(): Promise<User[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getUsers();
  }
  const res = await fetch("/api/users");
  return res.json();
}

export async function updateUserRole(id: string, role: UserRole): Promise<User> {
  if (USE_MOCK_DATA) {
    await delay();
    const users = mockStorage.getUsers();
    const updated = users.map((u) => (u.id === id ? { ...u, role } : u));
    mockStorage.saveUsers(updated);
    return updated.find((u) => u.id === id)!;
  }
  const res = await fetch(`/api/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  return res.json();
}

export const userService = {
  getUsers,
  updateUserRole,
};
