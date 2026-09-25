import { Enquiry, EnquiryStatus } from "@/types";
import { mockStorage } from "@/mock/state";
import { USE_MOCK_DATA, delay } from "./config";

export async function getEnquiries(): Promise<Enquiry[]> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getEnquiries();
  }
  const res = await fetch("/api/enquiries");
  return res.json();
}

export async function getEnquiryById(id: string): Promise<Enquiry | undefined> {
  if (USE_MOCK_DATA) {
    await delay();
    return mockStorage.getEnquiries().find((e) => e.id === id);
  }
  const res = await fetch(`/api/enquiries/${id}`);
  return res.json();
}

export async function createEnquiry(
  data: Omit<Enquiry, "id" | "enquiryNumber" | "createdAt" | "status">
): Promise<Enquiry> {
  if (USE_MOCK_DATA) {
    await delay();
    const enquiries = mockStorage.getEnquiries();
    const nextNum = String(enquiries.length + 1).padStart(3, "0");
    const newEnquiry: Enquiry = {
      ...data,
      id: `enq-${nextNum}`,
      enquiryNumber: `ENQ-2025-${nextNum}`,
      status: "DRAFT",
      createdAt: new Date().toISOString().split("T")[0],
      timeline: [
        {
          date: new Date().toISOString().split("T")[0],
          title: "Enquiry Created",
          user: "Current User",
          notes: "Initial draft generated in system.",
        },
      ],
    };
    mockStorage.saveEnquiries([newEnquiry, ...enquiries]);
    return newEnquiry;
  }
  const res = await fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateEnquiryStatus(
  id: string,
  status: EnquiryStatus,
  notes?: string
): Promise<Enquiry> {
  if (USE_MOCK_DATA) {
    await delay();
    const enquiries = mockStorage.getEnquiries();
    const updated = enquiries.map((e) => {
      if (e.id === id) {
        const timeline = [
          ...(e.timeline || []),
          {
            date: new Date().toISOString().split("T")[0],
            title: `Status changed to ${status}`,
            user: "Current User",
            notes,
          },
        ];
        return { ...e, status, timeline };
      }
      return e;
    });
    mockStorage.saveEnquiries(updated);
    return updated.find((e) => e.id === id)!;
  }
  const res = await fetch(`/api/enquiries/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
  return res.json();
}

export async function convertEnquiryToCosting(
  id: string
): Promise<{ enquiry: Enquiry; costingId: string }> {
  if (USE_MOCK_DATA) {
    await delay();
    const enquiries = mockStorage.getEnquiries();
    const enquiry = enquiries.find((e) => e.id === id);
    if (!enquiry) throw new Error("Enquiry not found");

    const costings = mockStorage.getCostings();
    const costingNum = String(costings.length + 1).padStart(3, "0");
    const newCostingId = `cst-${costingNum}`;

    // Update enquiry
    const updatedEnquiries = enquiries.map((e) =>
      e.id === id
        ? {
            ...e,
            status: "CONVERTED" as EnquiryStatus,
            relatedCostingId: newCostingId,
            timeline: [
              ...(e.timeline || []),
              {
                date: new Date().toISOString().split("T")[0],
                title: "Converted to Costing",
                user: "Current User",
                notes: `Costing reference CST-2025-${costingNum} initialized.`,
              },
            ],
          }
        : e
    );
    mockStorage.saveEnquiries(updatedEnquiries);

    // Create costing stub
    const newCosting = {
      id: newCostingId,
      costingNumber: `CST-2025-${costingNum}`,
      enquiryId: enquiry.id,
      enquiryNumber: enquiry.enquiryNumber,
      projectName: enquiry.projectName,
      clientId: enquiry.clientId,
      clientName: enquiry.clientName,
      businessType: enquiry.businessType,
      items: [
        {
          id: `ci-${Date.now()}-1`,
          category: "Manpower" as const,
          description: "Technical Project Lead",
          unit: "Man-Month",
          quantity: 3,
          unitRate: 300000,
          total: 900000,
        },
        {
          id: `ci-${Date.now()}-2`,
          category: "Expert / Consultant" as const,
          description: "Subject Matter Specialist",
          unit: "Lump Sum",
          quantity: 1,
          unitRate: 1500000,
          total: 1500000,
        },
      ],
      baseCost: 2400000,
      marginPercent: 20,
      marginAmount: 480000,
      taxesPercent: 18,
      taxesAmount: 518400,
      finalQuotation: 3398400,
      status: "Draft" as const,
      disclaimer: "Advanced overheads and indexation: TBD - Client Confirmation Required",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    mockStorage.saveCostings([newCosting, ...costings]);

    return { enquiry: updatedEnquiries.find((e) => e.id === id)!, costingId: newCostingId };
  }
  const res = await fetch(`/api/enquiries/${id}/convert-costing`, { method: "POST" });
  return res.json();
}

export const enquiryService = {
  getEnquiries,
  getEnquiryById,
  createEnquiry,
  updateEnquiryStatus,
  convertEnquiryToCosting,
};
