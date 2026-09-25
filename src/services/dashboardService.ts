import { DashboardKPIData } from "@/types";
import { mockStorage } from "@/mock/state";
import {
  initialDashboardKPIs,
  initialEnquiryPipelineData,
  initialTenderStatusData,
  initialProjectProgressChartData,
  initialInvoiceStatusData,
  initialPaymentSummaryData,
  initialPlantStatusData,
} from "@/mock/dashboard";
import { USE_MOCK_DATA, delay } from "./config";

export async function getDashboardKPIs(): Promise<DashboardKPIData> {
  if (USE_MOCK_DATA) {
    await delay();
    const enquiries = mockStorage.getEnquiries();
    const tenders = mockStorage.getTenders();
    const approvals = mockStorage.getApprovals();
    const vendors = mockStorage.getVendors();
    const projects = mockStorage.getProjects();
    const invoices = mockStorage.getInvoices();
    const payments = mockStorage.getPayments();
    const plants = mockStorage.getPlants();

    const openEnquiries = enquiries.filter(
      (e) => e.status !== "CLOSED" && e.status !== "REJECTED"
    ).length;

    const activeTenders = tenders.filter(
      (t) => t.status !== "Closed" && t.status !== "Awarded"
    ).length;

    const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;

    const qualifiedVendors = vendors.filter((v) => v.preQualificationStatus === "Approved").length;

    const activeProjects = projects.filter(
      (p) => p.status === "In Progress" || p.status === "Delayed"
    ).length;

    const delayedProjects = projects.filter((p) => p.status === "Delayed").length;

    const outstandingInvoicesAmount = invoices.reduce((sum, i) => sum + i.outstandingAmount, 0);

    const paymentsReceivedAmount = payments.reduce(
      (sum, p) => (p.status === "Completed" ? sum + p.amount : sum),
      0
    );

    const omPlantsRunning = plants.filter((p) => p.status === "Running").length;

    return {
      totalEnquiries: enquiries.length,
      openEnquiries,
      activeTenders,
      pendingApprovals,
      qualifiedVendors,
      activeProjects,
      delayedProjects,
      outstandingInvoicesAmount,
      paymentsReceivedAmount,
      omPlantsRunning,
      omPlantsTotal: plants.length,
    };
  }
  const res = await fetch("/api/dashboard/kpis");
  return res.json();
}

export async function getDashboardCharts() {
  if (USE_MOCK_DATA) {
    await delay();
    return {
      enquiryPipeline: initialEnquiryPipelineData,
      tenderStatus: initialTenderStatusData,
      projectProgress: initialProjectProgressChartData,
      invoiceStatus: initialInvoiceStatusData,
      paymentSummary: initialPaymentSummaryData,
      plantStatus: initialPlantStatusData,
    };
  }
  const res = await fetch("/api/dashboard/charts");
  return res.json();
}
