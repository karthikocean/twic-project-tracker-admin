"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { plantService } from "@/services/plantService";
import { Plant, PlantOperationStatus } from "@/types";
import {
  Droplets,
  Activity,
  Gauge,
  Zap,
  CheckCircle2,
  Wrench,
  XCircle,
  ArrowLeft,
  Thermometer,
  ShieldCheck,
} from "lucide-react";

type UnitStatus = "Running" | "Stopped" | "Maintenance";

export default function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    plantService.getPlantById(id).then((data) => {
      setPlant(data || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-slate-500">Loading plant telemetry...</div>
      </AppLayout>
    );
  }

  if (!plant) {
    return (
      <AppLayout>
        <div className="py-20 text-center text-slate-600">
          <p className="text-lg font-semibold">Plant facility not found</p>
          <Link href="/plants" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to O&M Plants
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleStatusChange = async (unit: keyof PlantOperationStatus, status: UnitStatus) => {
    const updated = await plantService.updatePlantOperation(plant.id, unit, status);
    if (updated) setPlant({ ...updated });
  };

  return (
    <AppLayout>
      <PageHeader
        title={plant.plantName}
        subtitle={`${plant.location} • Hydraulic Rating: ${plant.capacity} • Client: ${plant.clientName}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "O&M Plants", href: "/plants" },
          { label: plant.plantName },
        ]}
        actions={
          <Link
            href="/plants"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Plants
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left 2 Cols: Telemetry & Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Sensor Telemetry */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" /> Continuous SCADA / Online Telemetry
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Inlet Feed Flow</span>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {plant.feedFlowRate || "420 m³/hr"}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">● Normal range</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Raw Water TDS</span>
                <div className="text-lg font-bold text-slate-900 mt-1">6,450 ppm</div>
                <span className="text-[10px] text-slate-500">Conductivity: 9.8 mS/cm</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Permeate Product TDS</span>
                <div className="text-lg font-bold text-emerald-700 mt-1">
                  {plant.productWaterTds || "< 200 ppm"}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  98.2% Salt Rejection
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Daily Treated Volume</span>
                <div className="text-lg font-bold text-blue-700 mt-1">
                  {plant.dailyTreatedVolume || "42,300 m³"}
                </div>
                <span className="text-[10px] text-blue-600">Zero Liquid Discharge (ZLD)</span>
              </div>
            </div>
          </div>

          {/* Unit Operations Detail */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" /> Operational Subsystem Control &
              Diagnostics
            </h3>

            <div className="space-y-3">
              {/* Unit 1 */}
              <div className="p-3.5 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="text-xs font-bold text-slate-900">1. Pre-Treatment Stage</div>
                  <div className="text-[11px] text-slate-600">
                    Flash Mixer, Coagulation Dosing, Clariflocculator & Dual Media Filtration
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {plant.operations.preTreatment}
                  </span>
                  <select
                    value={plant.operations.preTreatment}
                    onChange={(e) =>
                      handleStatusChange("preTreatment", e.target.value as UnitStatus)
                    }
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Stopped">Stopped</option>
                  </select>
                </div>
              </div>

              {/* Unit 2 */}
              <div className="p-3.5 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    2. Reverse Osmosis (RO Unit)
                  </div>
                  <div className="text-[11px] text-slate-600">
                    High Pressure Booster Pumps, Cartridge Microfilters, Stage 1 & 2 Polishing
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {plant.operations.ro}
                  </span>
                  <select
                    value={plant.operations.ro}
                    onChange={(e) => handleStatusChange("ro", e.target.value as UnitStatus)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Stopped">Stopped</option>
                  </select>
                </div>
              </div>

              {/* Unit 3 */}
              <div className="p-3.5 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="text-xs font-bold text-slate-900">3. Additional Crystallizer</div>
                  <div className="text-[11px] text-slate-600">
                    Multi-Effect Evaporator (MEE), Thermo-Compressor & Forced Circulation Heat
                    Exchangers
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {plant.operations.crystallizer}
                  </span>
                  <select
                    value={plant.operations.crystallizer}
                    onChange={(e) =>
                      handleStatusChange("crystallizer", e.target.value as UnitStatus)
                    }
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Stopped">Stopped</option>
                  </select>
                </div>
              </div>

              {/* Unit 4 */}
              <div className="p-3.5 border border-slate-200 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="text-xs font-bold text-slate-900">4. Utility Services / ATFD</div>
                  <div className="text-[11px] text-slate-600">
                    Agitated Thin Film Dryer, Salt Centrifuge, Cooling Towers, Boiler Steam Header
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {plant.operations.utilityAtfd}
                  </span>
                  <select
                    value={plant.operations.utilityAtfd}
                    onChange={(e) =>
                      handleStatusChange("utilityAtfd", e.target.value as UnitStatus)
                    }
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Stopped">Stopped</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Facility Specifications */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Facility Specifications
            </h3>
            <div className="text-xs space-y-3">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Overall Status:</span>
                <StatusBadge status={plant.status} />
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Installed Capacity:</span>
                <span className="font-bold text-slate-900">{plant.capacity}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Client / Authority:</span>
                <span className="font-semibold text-slate-800">{plant.clientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Operating Uptime:</span>
                <span className="font-semibold text-emerald-700">{plant.uptimePercent}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Resident O&M Manager:</span>
                <span className="font-semibold text-slate-800">{plant.managerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
