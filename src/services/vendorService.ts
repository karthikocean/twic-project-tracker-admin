import { Vendor, PreQualificationData, PreQualificationStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getVendors(): Promise<Vendor[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getVendors();
  }
  const res = await fetch("/api/vendors");
  return res.json();
}

export async function getVendorById(id: string): Promise<Vendor | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getVendors().find((v) => v.id === id);
  }
  const res = await fetch(`/api/vendors/${id}`);
  return res.json();
}

export async function createVendor(
  data: Omit<
    Vendor,
    "id" | "vendorCode" | "createdAt" | "activeProjectsCount" | "totalProjectsCount" | "rating"
  >
): Promise<Vendor> {
  if (USE_MOCK_DATA) {
    await delay();
    const vendors = mockStorage.getVendors();
    const nextNum = String(vendors.length + 1).padStart(3, "0");
    const newVendor: Vendor = {
      ...data,
      id: `vn-${nextNum}`,
      vendorCode: `VND-2025-${nextNum}`,
      activeProjectsCount: 0,
      totalProjectsCount: 0,
      rating: 4.0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockStorage.saveVendors([newVendor, ...vendors]);
    return newVendor;
  }
  const res = await fetch("/api/vendors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor> {
  if (USE_MOCK_DATA) {
    await delay();
    const vendors = mockStorage.getVendors();
    const updated = vendors.map((v) => (v.id === id ? { ...v, ...data } : v));
    mockStorage.saveVendors(updated);
    return updated.find((v) => v.id === id)!;
  }
  const res = await fetch(`/api/vendors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPreQualifications(): Promise<PreQualificationData[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getPreQualifications();
  }
  const res = await fetch("/api/pre-qualifications");
  return res.json();
}

export async function getPreQualificationById(
  id: string
): Promise<PreQualificationData | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getPreQualifications().find((pq) => pq.id === id || pq.vendorId === id);
  }
  const res = await fetch(`/api/pre-qualifications/${id}`);
  return res.json();
}

export async function savePreQualification(
  data: Partial<PreQualificationData> & { vendorId: string }
): Promise<PreQualificationData> {
  if (USE_MOCK_DATA) {
    await delay();
    const pqs = mockStorage.getPreQualifications();
    const existingIndex = pqs.findIndex((p) => p.id === data.id || p.vendorId === data.vendorId);
    let result: PreQualificationData;

    if (existingIndex >= 0) {
      result = { ...pqs[existingIndex], ...data } as PreQualificationData;
      pqs[existingIndex] = result;
    } else {
      const nextId = `pq-${String(pqs.length + 1).padStart(3, "0")}`;
      result = {
        ...data,
        id: nextId,
        submissionDate: new Date().toISOString().split("T")[0],
        status: data.status || "Submitted",
      } as PreQualificationData;
      pqs.unshift(result);
    }
    mockStorage.savePreQualifications(pqs);

    // Sync vendor pre-qualification status
    const vendors = mockStorage.getVendors();
    const updatedVendors = vendors.map((v) =>
      v.id === data.vendorId
        ? { ...v, preQualificationStatus: result.status, preQualificationId: result.id }
        : v
    );
    mockStorage.saveVendors(updatedVendors);

    return result;
  }
  const res = await fetch("/api/pre-qualifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function setPreQualificationStatus(
  id: string,
  status: PreQualificationStatus,
  notes?: string
): Promise<PreQualificationData> {
  if (USE_MOCK_DATA) {
    await delay();
    const pqs = mockStorage.getPreQualifications();
    const target = pqs.find((p) => p.id === id);
    if (!target) throw new Error("Pre-qualification record not found");

    const updatedPqs = pqs.map((p) =>
      p.id === id
        ? {
            ...p,
            status,
            verificationNotes: notes || p.verificationNotes,
            verifiedBy: "Technical Verification Committee",
            verifiedAt: new Date().toISOString().split("T")[0],
          }
        : p
    );
    mockStorage.savePreQualifications(updatedPqs);

    // Update vendor
    const vendors = mockStorage.getVendors();
    const updatedVendors = vendors.map((v) =>
      v.id === target.vendorId ? { ...v, preQualificationStatus: status } : v
    );
    mockStorage.saveVendors(updatedVendors);

    return updatedPqs.find((p) => p.id === id)!;
  }
  const res = await fetch(`/api/pre-qualifications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
  return res.json();
}

export async function approveVendor(id: string, notes?: string): Promise<PreQualificationData> {
  const pq = (await getPreQualifications()).find((p) => p.id === id || p.vendorId === id);
  if (!pq) throw new Error("Pre-qualification not found");
  return setPreQualificationStatus(
    pq.id,
    "Approved",
    notes || "Approved by verification committee"
  );
}

export async function rejectVendor(id: string, notes: string): Promise<PreQualificationData> {
  const pq = (await getPreQualifications()).find((p) => p.id === id || p.vendorId === id);
  if (!pq) throw new Error("Pre-qualification not found");
  return setPreQualificationStatus(pq.id, "Rejected", notes);
}

export async function returnVendor(id: string, notes: string): Promise<PreQualificationData> {
  const pq = (await getPreQualifications()).find((p) => p.id === id || p.vendorId === id);
  if (!pq) throw new Error("Pre-qualification not found");
  return setPreQualificationStatus(pq.id, "Returned", notes);
}

export const vendorService = {
  getVendors,
  getVendorById,
  createVendor,
  getPreQualifications,
  getPreQualificationById,
  savePreQualification,
  setPreQualificationStatus,
  approveVendor,
  rejectVendor,
  returnVendor,
};
