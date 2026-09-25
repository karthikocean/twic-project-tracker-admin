import { ActivityItem, AuditLog } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getActivities(): Promise<ActivityItem[]> {
  if (USE_MOCK_DATA) {
    await delay(60);
    return mockStorage.getActivities();
  }
  const res = await fetch("/api/activities");
  return res.json();
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getAuditLogs();
  }
  const res = await fetch("/api/audit-logs");
  return res.json();
}

export async function logAuditAction(
  entry: Omit<AuditLog, "id" | "timestamp" | "ipAddress">
): Promise<void> {
  if (USE_MOCK_DATA) {
    const logs = mockStorage.getAuditLogs();
    const newLog: AuditLog = {
      ...entry,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      ipAddress: "127.0.0.1",
    };
    mockStorage.saveAuditLogs([newLog, ...logs]);
    return;
  }
  await fetch("/api/audit-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
}
