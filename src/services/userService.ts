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

export async function createUser(data: {
  name: string;
  email: string;
  department: string;
  role: UserRole;
  status?: "Active" | "Inactive";
}): Promise<User> {
  if (USE_MOCK_DATA) {
    await delay();
    const users = mockStorage.getUsers();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      department: data.department,
      role: data.role,
      status: data.status || "Active",
      lastLogin: "",
    };
    const updated = [newUser, ...users];
    mockStorage.saveUsers(updated);
    return newUser;
  }
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const userService = {
  getUsers,
  updateUserRole,
  createUser,
};

