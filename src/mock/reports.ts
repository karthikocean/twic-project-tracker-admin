import { MonthlyReport } from "@/types";

export const initialMonthlyReports: MonthlyReport[] = [
  {
    id: "rep-001",
    reportNumber: "MR-2025-02-001",
    projectId: "prj-002",
    projectName: "Perungudi 60 MLD TTRO Recycling Plant",
    month: "February 2025",
    progressPercent: 68,
    submittedDate: "2025-03-02",
    submittedBy: "Er. S. Balamurugan (PMC Lead)",
    executiveSummary:
      "Overall physical progress achieved 68% against revised planned milestone of 72%. RO rack installation is in advanced stage. Main focus for next month is HT substation charging and pressure piping hydrotest.",
    workCompleted:
      "Erection of 4 RO skids, cable tray laying in main hall, installation of CEIG approved 33 kV breaker panels.",
    workInProgress: "Hydrostatic testing of high-pressure 316L piping, PLC automation programming.",
    issues:
      "Delivery of VFD drives from OEM delayed by 1 week; resolved via expedited air freight.",
    nextMonthPlan:
      "Energization of electrical substation, wet testing of pre-treatment clarifiers, mobilization of commissioning chemists.",
    status: "Approved",
    attachments: [
      { name: "Monthly_Progress_Report_Perungudi_Feb2025.pdf", size: "6.8 MB" },
      { name: "Site_Photo_Progress_Index_Feb.pdf", size: "12.4 MB" },
    ],
  },
  {
    id: "rep-002",
    reportNumber: "MR-2025-01-001",
    projectId: "prj-002",
    projectName: "Perungudi 60 MLD TTRO Recycling Plant",
    month: "January 2025",
    progressPercent: 62,
    submittedDate: "2025-02-02",
    submittedBy: "Er. S. Balamurugan",
    executiveSummary:
      "All civil works for membrane building roof completed. Secondary equalization tank water-tightness test certified.",
    workCompleted: "Ultrafiltration module skids positioned. Backwash blower alignment completed.",
    workInProgress: "Internal lighting and civil finishing.",
    issues: "Intermittent rain caused 2 days downtime.",
    nextMonthPlan: "Begin RO racks erection and cable pulling.",
    status: "Approved",
    attachments: [{ name: "Monthly_Report_Perungudi_Jan2025.pdf", size: "5.4 MB" }],
  },
  {
    id: "rep-003",
    reportNumber: "MR-2025-02-002",
    projectId: "prj-004",
    projectName: "Sri City Bulk Industrial Water Grid",
    month: "February 2025",
    progressPercent: 52,
    submittedDate: "2025-03-01",
    submittedBy: "Er. V. R. Rao",
    executiveSummary:
      "Physical progress stands at 52% against planned 68%. The delay is primarily attributed to pending statutory approval for NH-16 highway crossing.",
    workCompleted:
      "Pipe laying completed up to Chainage 28.5 km. Valve chambers completed at 14 locations.",
    workInProgress: "HDD microtunneling equipment positioned at NH crossing.",
    issues: "Awaiting NHAI regional office safety signoff for trenchless pipe push.",
    nextMonthPlan:
      "Expedite NHAI permit through joint coordination meeting with APIIC Chief Engineer.",
    status: "Reviewed",
    attachments: [{ name: "SriCity_Pipeline_Feb2025_Report.pdf", size: "4.7 MB" }],
  },
  {
    id: "rep-004",
    reportNumber: "MR-2025-02-003",
    projectId: "prj-006",
    projectName: "Belagavi City 24x7 Water Supply Transaction Advisory",
    month: "February 2025",
    progressPercent: 28,
    submittedDate: "2025-02-28",
    submittedBy: "Dr. K. Swamy",
    executiveSummary:
      "Inception report and stakeholder consultation workshops concluded successfully. Tariff affordability matrix drafted.",
    workCompleted: "Completed sample survey of 1,200 households across 10 municipal wards.",
    workInProgress: "Drafting draft concession agreement based on hybrid annuity model (HAM).",
    issues: "None. Work is ahead of schedule.",
    nextMonthPlan:
      "Present draft RFP and draft concession agreement to Urban Development Department.",
    status: "Submitted",
    attachments: [{ name: "Belagavi_Advisory_Feb2025.pdf", size: "3.2 MB" }],
  },
];
