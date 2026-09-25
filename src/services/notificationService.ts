import { AppNotification } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getNotifications(): Promise<AppNotification[]> {
  if (USE_MOCK_DATA) {
    await delay(50);
    return mockStorage.getNotifications();
  }
  const res = await fetch("/api/notifications");
  return res.json();
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    const notifs = mockStorage.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    mockStorage.saveNotifications(updated);
    return;
  }
  await fetch(`/api/notifications/${id}/read`, { method: "POST" });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  if (USE_MOCK_DATA) {
    const notifs = mockStorage.getNotifications();
    const updated = notifs.map((n) => ({ ...n, isRead: true }));
    mockStorage.saveNotifications(updated);
    return;
  }
  await fetch("/api/notifications/read-all", { method: "POST" });
}
