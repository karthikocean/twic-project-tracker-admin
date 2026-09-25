import { ProjectProgressHistory } from "@/types";

export const initialProgressHistory: ProjectProgressHistory[] = [
  {
    id: "prg-001",
    projectId: "prj-002",
    progressDate: "2025-02-28",
    progressPercent: 68,
    workCompleted:
      "Erection of 4 out of 6 RO skid racks finished. Cable tray routing inside membrane hall completed. Transformer foundation testing cleared by CEIG.",
    workInProgress:
      "Hydrostatic testing of inter-stage stainless steel piping. PLC cabinet wiring.",
    issues: "Minor delay in delivery of variable frequency drives (VFD) from Schneider France.",
    delays: "7 days delay due to port customs clearance.",
    nextPlan:
      "Energize 11 kV transformer yard and commence dry-run testing of primary high-pressure booster pumps.",
    recordedBy: "Er. S. Balamurugan (PMC Engineer)",
  },
  {
    id: "prg-002",
    projectId: "prj-002",
    progressDate: "2025-01-31",
    progressPercent: 62,
    workCompleted:
      "Ultrafiltration hollow fiber modules unloaded and rack assembly completed. Dual media filter backwash pumps positioned.",
    workInProgress: "Equalization basin epoxy coating and leak tightness testing.",
    issues: "Heavy intermittent rains slowed external yard paving.",
    delays: "No critical path delay.",
    nextPlan: "Commence RO rack assembly and chemical dosing tank piping.",
    recordedBy: "Er. S. Balamurugan",
  },
  {
    id: "prg-003",
    projectId: "prj-004",
    progressDate: "2025-02-25",
    progressPercent: 52,
    workCompleted:
      "DI K9 pipe laying completed up to Chainage 28.5 km. Air release valve chambers 1 to 14 constructed.",
    workInProgress: "Micro-tunneling at NH-16 Tada crossing; boring rig mobilized.",
    issues:
      "Delay in obtaining revised railway crossing traffic block permit from Southern Railways.",
    delays: "18 days cumulative delay against baseline schedule.",
    nextPlan:
      "Coordinate with Divisional Railway Manager, Vijayawada for night track possession permit.",
    recordedBy: "Er. V. R. Rao (PMC Pipeline Lead)",
  },
  {
    id: "prg-004",
    projectId: "prj-001",
    progressDate: "2025-02-20",
    progressPercent: 12,
    workCompleted:
      "Preliminary bathymetry survey along 2.5 km offshore alignment completed. Coastal Regulation Zone (CRZ) clearance dossier vetted.",
    workInProgress:
      "Geotechnical onshore boreholes at intake pump house location (4 out of 10 drilled).",
    issues: "Rough sea conditions temporarily halted offshore pontoon drilling for 3 days.",
    delays: "Minor weather downtime.",
    nextPlan: "Complete remaining 6 boreholes and submit draft layout to TWAD Board.",
    recordedBy: "Er. Rajesh Kumar",
  },
];
