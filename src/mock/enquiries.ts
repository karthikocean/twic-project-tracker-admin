import { Enquiry } from "@/types";

export const initialEnquiries: Enquiry[] = [
  {
    id: "enq-001",
    enquiryNumber: "ENQ-2025-001",
    enquiryDate: "2025-01-08",
    clientId: "cl-001",
    clientName: "Tamil Nadu Water Supply and Drainage Board (TWAD)",
    projectName: "Detailed Project Report for 100 MLD Desalination Plant at Thoothukudi",
    businessType: "ADVISORY",
    description:
      "Preparation of DPR, techno-economic feasibility study, marine intake modeling, and environmental clearances.",
    estimatedValue: 45000000, // 4.5 Cr
    expectedResponseDate: "2025-01-25",
    status: "CONVERTED",
    relatedCostingId: "cst-001",
    relatedTenderId: "tnd-001",
    assignedTo: "Er. Muralidharan (Advisory BU)",
    scopeOfWork:
      "Site survey, sea water quality profiling, RO membrane technology assessment, brine dispersion simulation, financial modeling under HAM mode.",
    documents: [
      { name: "TWAD_Expression_of_Interest_2025.pdf", size: "3.2 MB", date: "2025-01-08" },
      { name: "Preliminary_Site_Map_Thoothukudi.dwg", size: "14.5 MB", date: "2025-01-09" },
    ],
    timeline: [
      {
        date: "2025-01-08",
        title: "Enquiry Received",
        user: "Er. K. Sivakumar (TWAD)",
        notes: "RFQ received via e-Procurement portal.",
      },
      {
        date: "2025-01-12",
        title: "Preliminary Site Review Completed",
        user: "Er. Muralidharan",
        notes: "Field team inspected coastal zone setback.",
      },
      {
        date: "2025-01-20",
        title: "Converted to Costing",
        user: "Finance & Advisory Team",
        notes: "Draft costing generated as CST-2025-001.",
      },
    ],
    createdAt: "2025-01-08",
  },
  {
    id: "enq-002",
    enquiryNumber: "ENQ-2025-002",
    enquiryDate: "2025-01-15",
    clientId: "cl-002",
    clientName: "Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)",
    projectName: "Project Management Consultancy (PMC) for Perungudi 60 MLD TTRO Expansion",
    businessType: "PMC",
    description:
      "Supervision, quality monitoring, bill certification, and contractor milestone management for TTRO tertiary treatment plant.",
    estimatedValue: 62000000, // 6.2 Cr
    expectedResponseDate: "2025-02-05",
    status: "CONVERTED",
    relatedCostingId: "cst-002",
    relatedTenderId: "tnd-002",
    assignedTo: "Er. Rajesh Kumar (PMC Lead)",
    scopeOfWork:
      "Deputation of Resident Construction Manager, Safety Engineers, QA/QC specialists, weekly milestone reporting, and ERP progress sync.",
    documents: [{ name: "CMWSSB_PMC_Terms_of_Reference.pdf", size: "5.1 MB", date: "2025-01-15" }],
    createdAt: "2025-01-15",
  },
  {
    id: "enq-003",
    enquiryNumber: "ENQ-2025-003",
    enquiryDate: "2025-02-01",
    clientId: "cl-003",
    clientName: "State Industries Promotion Corporation of Tamil Nadu (SIPCOT)",
    projectName: "Comprehensive Operation & Maintenance of 15 MLD CETP at Cuddalore",
    businessType: "O&M",
    description:
      "Multi-year chemical dosing, membrane maintenance, crystallizer operation, sludge dewatering, and continuous effluent monitoring (OCEMS).",
    estimatedValue: 120000000, // 12 Cr
    expectedResponseDate: "2025-02-28",
    status: "UNDER REVIEW",
    relatedCostingId: "cst-003",
    assignedTo: "Mr. Suresh Chandran (O&M BU)",
    scopeOfWork:
      "24x7 3-shift plant operations, supply of RO cleaning chemicals, preventive maintenance of high pressure pumps, zero liquid discharge guarantee.",
    documents: [{ name: "SIPCOT_CETP_Specification_RFP.pdf", size: "4.8 MB", date: "2025-02-01" }],
    createdAt: "2025-02-01",
  },
  {
    id: "enq-004",
    enquiryNumber: "ENQ-2025-004",
    enquiryDate: "2025-02-10",
    clientId: "cl-004",
    clientName: "Karnataka Urban Water Supply and Drainage Board (KUWSDB)",
    projectName: "Transaction Advisory for 24x7 Water Supply in Belagavi Municipal Corporation",
    businessType: "ADVISORY",
    description:
      "Transaction advisory, RFP drafting, concession agreement formulation, and public-private partnership (PPP) bidding assistance.",
    estimatedValue: 38000000, // 3.8 Cr
    expectedResponseDate: "2025-03-01",
    status: "SUBMITTED",
    assignedTo: "Dr. K. Swamy (Transaction Advisory)",
    scopeOfWork:
      "Financial structuring, demand forecasting, NRW reduction framework, draft concessionaire agreements, bid evaluation matrix.",
    documents: [{ name: "Belagavi_Water_Reform_Study.pdf", size: "2.6 MB", date: "2025-02-10" }],
    createdAt: "2025-02-10",
  },
  {
    id: "enq-005",
    enquiryNumber: "ENQ-2025-005",
    enquiryDate: "2025-02-18",
    clientId: "cl-005",
    clientName: "Andhra Pradesh Industrial Infrastructure Corporation (APIIC)",
    projectName: "PMC for Sri City Industrial Water Transmission Main (45 km DI K9 Pipeline)",
    businessType: "PMC",
    description:
      "PMC inspection, hydrotesting supervision, pipe welding radiography verification, and SCADA telemetry validation.",
    estimatedValue: 54000000, // 5.4 Cr
    expectedResponseDate: "2025-03-10",
    status: "UNDER REVIEW",
    assignedTo: "Er. Rajesh Kumar",
    scopeOfWork:
      "Site supervision, alignment validation, valve chamber construction supervision, cathodic protection audit.",
    createdAt: "2025-02-18",
  },
  {
    id: "enq-006",
    enquiryNumber: "ENQ-2025-006",
    enquiryDate: "2025-02-22",
    clientId: "cl-006",
    clientName: "Kerala Water Authority (KWA)",
    projectName: "Feasibility Study for Solar Powered 20 MLD River Intake at Aluva",
    businessType: "ADVISORY",
    description:
      "Hydrological analysis, solar PV floating plant sizing, carbon credit estimation, and DPR for sustainable pumping.",
    estimatedValue: 22000000, // 2.2 Cr
    expectedResponseDate: "2025-03-15",
    status: "DRAFT",
    assignedTo: "Er. Muralidharan",
    scopeOfWork:
      "River discharge study during lean summer months, floating solar structural engineering, grid feed-in assessment.",
    createdAt: "2025-02-22",
  },
  {
    id: "enq-007",
    enquiryNumber: "ENQ-2025-007",
    enquiryDate: "2024-11-05",
    clientId: "cl-001",
    clientName: "Tamil Nadu Water Supply and Drainage Board (TWAD)",
    projectName: "Namakkal Sewerage Network Master Plan 2030",
    businessType: "ADVISORY",
    description: "Preparation of master plan for underground drainage network.",
    estimatedValue: 18000000,
    expectedResponseDate: "2024-11-30",
    status: "CLOSED",
    assignedTo: "Er. Muralidharan",
    createdAt: "2024-11-05",
  },
];
