# TWIC Project Tracker — Enterprise Government Admin Panel

> **IMPORTANT ARCHITECTURAL NOTICE:**  
> **This repository currently contains the FRONTEND / ADMIN PANEL ONLY.**  
> Backend APIs, database instances, and server workers will be integrated separately. No Node.js/Express backend, MongoDB, Prisma, Redis, or Server Actions for mutations are included in this project. All interactive features are powered by a structured frontend service abstraction layer with realistic mock state.

---

## 1. Project Overview

The **TWIC Project Tracker** is a production-quality, responsive enterprise web application built for government infrastructure oversight, water and wastewater projects, transaction advisory, project management consultancy (PMC), Zero Liquid Discharge (ZLD) plants, and specialized contractor management.

The platform models the complete public procurement and infrastructure project lifecycle:

```
Enquiry / RFQ ──► Cost Preparation ──► Tender Publication ──► Vendor Pre-Qualification
        │                                                               │
        ▼                                                               ▼
   Approvals ◄── Technical Evaluation ◄── Bid Submissions ◄─────────────┘
        │
        ▼
   Work Order (LOA) ──► Project Workspace (9-Tab Cockpit)
                               │
       ┌───────────────────────┼────────────────────────┐
       ▼                       ▼                        ▼
Milestones / Progress   Subcontractors           O&M Plants (ZLD/RO)
       │                       │                        │
       └───────────────────────┴────────────────────────┘
                               │
                               ▼
            Client & Subcontractor Invoices ──► Treasury Payments
```

---

## 2. Technology Stack

- **Framework:** Next.js 15 (App Router, Server Components with targeted Client Component boundaries)
- **Language:** TypeScript 5 (Strict Mode, zero `any` usage)
- **Styling:** Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Icons:** Lucide React
- **Data Visualization:** Recharts (Responsive containers, tooltips, multi-series area, bar, and pie charts)
- **Form Validation:** React Hook Form + Zod
- **Date Manipulation:** date-fns
- **Mock State Persistence:** Client-side LocalStorage cache with full CRUD simulation & Demo Reset capability

---

## 3. Demo Credentials & Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/karthikocean/twic-project-tracker-admin.git

# Enter project directory
cd twic-project-tracker-admin

# Install dependencies
npm install
```

### Running Locally

```bash
# Start local Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Demo Login Credentials

The application includes a professional login gateway with convenient autofill role presets:

| Role | Demo Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@twic-demo.com` | `Password@123` | Full enterprise oversight |
| **Chief Operating Officer (COO)** | `coo@twic-demo.com` | `Password@123` | Sanctions, executive approvals |
| **Advisory Division** | `advisory@twic-demo.com` | `Password@123` | DPR, cost preparation, RFP |
| **PMC / Resident Engineer** | `pmc@twic-demo.com` | `Password@123` | Site inspection logs, milestones |
| **Finance & Accounts** | `finance@twic-demo.com` | `Password@123` | Invoices, RTGS/NEFT payments |

*(Note: In accordance with the frontend-only requirement, authentication is simulated client-side via LocalStorage session tokens).*

---

## 4. Frontend Architecture & Mock Services

The UI components never make direct hardcoded data calls. Instead, they interact with dedicated service abstractions under `src/services/`:

```
src/
├── services/
│   ├── clientService.ts         # Government client directory
│   ├── enquiryService.ts        # Inward RFQs and advisory leads
│   ├── costingService.ts        # Manpower, expert, equipment costing
│   ├── tenderService.ts         # e-Procurement notices & tenders
│   ├── tenderApplicationService.ts # Bids submitted by vendors
│   ├── vendorService.ts         # Pre-qualification & vendor master
│   ├── evaluationService.ts     # Technical & commercial ranking
│   ├── approvalService.ts       # Multi-level administrative sanctions
│   ├── workOrderService.ts      # Letters of Award (LOA)
│   ├── projectService.ts        # Projects, progress logs & 9-tab workspace
│   ├── milestoneService.ts      # Schedule milestones & deliverables
│   ├── subcontractorService.ts  # Specialist subcontractor packages
│   ├── plantService.ts          # O&M ZLD plant operations & SCADA
│   ├── invoiceService.ts        # Client fee bills & contractor claims
│   ├── paymentService.ts        # Bank transfers & treasury settlements
│   └── dashboardService.ts      # Top-level KPIs and chart aggregation
```

### How to Connect Future Backend

Every service in `src/services/` evaluates `USE_MOCK_DATA`:

```typescript
// Example from src/services/projectService.ts
export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (USE_MOCK_DATA) {
      return getStoredProjects();
    }
    const res = await fetch(`${API_BASE_URL}/projects`);
    return res.json();
  },
  // ...
};
```

When a separate backend (e.g., Node.js / Express / MongoDB) is implemented:
1. Configure `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
2. Set `NEXT_PUBLIC_USE_MOCK_DATA=false`.
3. The entire frontend will switch to calling the REST API without rewriting any UI components, tables, or modals.

---

## 5. Key Modules Implemented

1. **Dashboard:**
   - 10 Top-level KPI cards (Total Enquiries, Active Tenders, Delayed Projects, Outstanding Billing, etc.)
   - 6 Interactive Recharts visualizations: Project Progress, Tender Status, Invoice Realization, Payment Trajectory, Business Pipeline, and O&M Plant Status.
   - Active Projects table with progress bars and recent audit activity feed.

2. **Pre-Qualification Form (The Actual 9-Section Statutory Form):**
   - Section 1: Company Information
   - Section 2: Statutory Information (PAN, GST, MSME, ROC)
   - Section 3: Contact Persons (Dynamic row addition)
   - Section 4: 3-Year Audited Turnover (2025-26, 2024-25, 2023-24)
   - Section 5: Technical Personnel Count & Qualifications
   - Section 6: Employee Details (Technical vs Non-technical)
   - Section 7: Past Project Experience in Water & Wastewater (Capacity, client, value, testimonials)
   - Section 8: Enclosures & Document Upload simulation
   - Section 9: Declaration, Signature & Seal
   - Full read-only review page with Approve, Reject, and Return actions.

3. **Project Workspace (9 Integrated Tabs):**
   - **Overview:** Scope, Planned vs Actual progress, Variance calculation, Financial summary.
   - **Milestones:** Schedule tracking, weightage, and status badges.
   - **Progress Tracking:** Resident Engineer field logs, issues, delays, next period plans.
   - **Subcontractors:** Appointed specialist packages and physical completion.
   - **Monthly Reports:** Executive summaries and statutory submissions.
   - **Invoices:** Client bills and subcontractor claims.
   - **Payments:** Disbursed treasury settlements.
   - **Documents:** DPR, tender specifications, and test certificates.
   - **Activity Log:** Audit trail for project events.

4. **Finance & Invoicing:**
   - Tabbed views for Client PMC Billing and Subcontractor Invoices.
   - Record Payment modal that automatically decrements outstanding balances and updates status to "Paid" or "Partially Paid".

5. **O&M Zero Liquid Discharge (ZLD) Plants:**
   - Real-time status cards for:
     1. Pre-Treatment (Clariflocculator / Dual Media Filters)
     2. Reverse Osmosis (RO passes)
     3. Additional Crystallizer (MEE)
     4. Utility Services / ATFD
   - Live status toggling (`Running`, `Maintenance`, `Stopped`) and SCADA telemetry.

6. **Interactive Lifecycle Map (`/overview`):**
   - Flowchart visualizing the 14-stage journey from Enquiry down to Payment.

7. **Reports & Client-Side CSV Export:**
   - Multi-category reports with instant client-side CSV downloads for Projects, Tenders, Invoices, Vendors, and Payments.

---

## 6. Directory Structure

```
twic-project-tracker-admin/
├── public/
├── src/
│   ├── app/                    # Next.js App Router Pages
│   │   ├── (auth)/login/
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── enquiries/
│   │   ├── costings/
│   │   ├── advisory/
│   │   ├── pmc/
│   │   ├── tenders/
│   │   ├── tender-applications/
│   │   ├── evaluations/
│   │   ├── pre-qualification/
│   │   ├── vendors/
│   │   ├── approvals/
│   │   ├── work-orders/
│   │   ├── projects/
│   │   ├── milestones/
│   │   ├── progress/
│   │   ├── subcontractors/
│   │   ├── plants/
│   │   ├── invoices/
│   │   ├── payments/
│   │   ├── reports/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── audit-logs/
│   │   ├── settings/
│   │   └── overview/
│   │
│   ├── components/
│   │   ├── common/             # DataTable, StatusBadge, ProgressBar, Modal, ExportButton, etc.
│   │   ├── dashboard/          # Responsive Recharts Charts
│   │   └── layout/             # Sidebar, Header, Breadcrumbs, AppLayout
│   │
│   ├── mock/                   # Comprehensive realistic datasets & localStorage manager
│   ├── services/               # Mock service layer ready for future REST API endpoints
│   ├── types/                  # Strict TypeScript data models
│   └── utils/                  # Indian Rupee (₹) formatters, dates, and CSV generators
```

---

## 7. Build, Validation & Production Scripts

```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Format Check
npm run format:check

# Production Build
npm run build

# Start Production Server
npm start
```

---

## 8. Deployment Options

This application is optimized for containerized or serverless frontend hosting:
- **Vercel / Netlify / Cloudflare Pages:** Connect Git repository and trigger automatic deployment.
- **Docker / Self-Hosted:** Run `npm run build` followed by `npm run start` within a lightweight Node.js Alpine container.
- **AWS Amplify / Azure Static Web Apps:** Deploy with Node.js 20+ runtime.

---

## 9. License

Government Enterprise Demonstration Prototype — Developed for TWIC (Tamil Nadu Water Investment Company).
