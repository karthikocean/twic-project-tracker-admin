import { Invoice, InvoiceStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getInvoices(
  type?: "Client Invoice" | "Subcontractor Invoice"
): Promise<Invoice[]> {
  if (USE_MOCK_DATA) {
    await delay();
    const invoices = mockStorage.getInvoices();
    if (type) {
      return invoices.filter((i) => i.invoiceType === type);
    }
    return invoices;
  }
  const url = type ? `/api/invoices?type=${encodeURIComponent(type)}` : "/api/invoices";
  const res = await fetch(url);
  return res.json();
}

export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getInvoices().find((i) => i.id === id);
  }
  const res = await fetch(`/api/invoices/${id}`);
  return res.json();
}

export async function createInvoice(
  data: Omit<
    Invoice,
    "id" | "invoiceNumber" | "taxAmount" | "totalAmount" | "outstandingAmount" | "paidAmount"
  >
): Promise<Invoice> {
  if (USE_MOCK_DATA) {
    await delay();
    const invoices = mockStorage.getInvoices();
    const nextNum = String(invoices.length + 1).padStart(3, "0");
    const prefix = data.invoiceType === "Client Invoice" ? "INV-CL-2025-" : "INV-SUB-2025-";
    const taxAmount = Math.round(data.baseAmount * 0.18);
    const totalAmount = data.baseAmount + taxAmount;

    const newInvoice: Invoice = {
      ...data,
      id: `inv-${nextNum}`,
      invoiceNumber: `${prefix}${nextNum}`,
      taxAmount,
      totalAmount,
      paidAmount: 0,
      outstandingAmount: totalAmount,
    };
    mockStorage.saveInvoices([newInvoice, ...invoices]);
    return newInvoice;
  }
  const res = await fetch("/api/invoices", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
  if (USE_MOCK_DATA) {
    await delay();
    const invoices = mockStorage.getInvoices();
    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, paymentStatus: status } : inv
    );
    mockStorage.saveInvoices(updated);
    return updated.find((i) => i.id === id)!;
  }
  const res = await fetch(`/api/invoices/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function getInvoicesByProjectId(projectId: string): Promise<Invoice[]> {
  const all = await getInvoices();
  return all.filter((inv) => inv.projectId === projectId);
}

export const invoiceService = {
  getInvoices,
  getInvoiceById,
  getInvoicesByProjectId,
  createInvoice,
  updateInvoiceStatus,
};
