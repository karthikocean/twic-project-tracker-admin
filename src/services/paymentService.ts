import { Payment } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getPayments(): Promise<Payment[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getPayments();
  }
  const res = await fetch("/api/payments");
  return res.json();
}

export async function recordPayment(
  data: Omit<Payment, "id" | "paymentReference">
): Promise<Payment> {
  if (USE_MOCK_DATA) {
    await delay();
    const payments = mockStorage.getPayments();
    const nextNum = String(payments.length + 1).padStart(3, "0");
    const newPayment: Payment = {
      ...data,
      id: `pay-${nextNum}`,
      paymentReference: `PAY-2025-${nextNum}`,
    };
    mockStorage.savePayments([newPayment, ...payments]);

    // Update associated invoice state
    const invoices = mockStorage.getInvoices();
    const invoice = invoices.find((i) => i.id === data.invoiceId);
    if (invoice && data.status === "Completed") {
      const newPaid = invoice.paidAmount + data.amount;
      const newOutstanding = Math.max(0, invoice.totalAmount - newPaid);
      const newStatus =
        newOutstanding === 0 ? "Paid" : newPaid > 0 ? "Partially Paid" : invoice.paymentStatus;

      const updatedInvoices = invoices.map((i) =>
        i.id === data.invoiceId
          ? {
              ...i,
              paidAmount: newPaid,
              outstandingAmount: newOutstanding,
              paymentStatus: newStatus,
            }
          : i
      );
      mockStorage.saveInvoices(updatedInvoices);
    }

    return newPayment;
  }
  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPaymentsByProjectId(projectId: string): Promise<Payment[]> {
  const all = await getPayments();
  return all.filter((p) => p.projectId === projectId);
}

export const paymentService = {
  getPayments,
  getPaymentsByProjectId,
  recordPayment,
};
