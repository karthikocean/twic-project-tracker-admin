"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { plantService } from "@/services/plantService";
import { Plant, PlantOperationStatus } from "@/types";
import {
  Activity,
  Droplets,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Wrench,
  ArrowUpRight,
} from "lucide-react";

type UnitStatus = "Running" | "Stopped" | "Maintenance";

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    plantService.getPlants().then((data) => {
      setPlants(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateUnitStatus = async (
    plantId: string,
    unit: keyof PlantOperationStatus,
    newStatus: UnitStatus
  ) => {
    const updated = await plantService.updatePlantOperation(plantId, unit, newStatus);
    if (updated) {
      setPlants(plants.map((p) => (p.id === plantId ? updated : p)));
    }
  };

  const getStatusIcon = (status: UnitStatus) => {
    switch (status) {
      case "Running":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case "Maintenance":
        return <Wrench className="w-3.5 h-3.5 text-amber-500" />;
      case "Stopped":
        return <XCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBg = (status: UnitStatus) => {
    switch (status) {
      case "Running":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Maintenance":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Stopped":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="O&M Plant Operations & ZLD Control"
        subtitle="Real-time monitoring of Zero Liquid Discharge (ZLD) plants, RO stages, Multi-Effect Evaporators, and ATFD units"
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "O&M Plants" }]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={plants}
              filename="TWIC_OM_Plants_Directory"
              label="Export Plant Inventory"
            />
          </div>
        }
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total O&M Plants</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{plants.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Government & Industrial CETPs</div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Fully Running</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {plants.filter((p) => p.status === "Running").length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            Operating within regulatory limits
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Under Maintenance</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {plants.filter((p) => p.status === "Maintenance").length}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            Scheduled membrane CIP or overhaul
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Cumulative Capacity</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">43.5 MLD</div>
          <div className="text-[11px] text-blue-600 mt-0.5">Treated wastewater output</div>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="space-y-6">
        {plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Header Strip */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{plant.plantName}</h3>
                  <StatusBadge status={plant.status} />
                </div>
                <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span>
                    Client: <strong className="text-slate-700">{plant.clientName}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Location: <strong className="text-slate-700">{plant.location}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Hydraulic Capacity: <strong className="text-blue-700">{plant.capacity}</strong>
                  </span>
                </div>
              </div>

              <Link
                href={`/plants/${plant.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-xs"
              >
                Telemetry & Stage Details <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Stage Unit Operation Cards */}
            <div className="p-5">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Unit Operations Status & Subsystem Control
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Pre-Treatment */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">1. Pre-Treatment</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBg(
                        plant.operations.preTreatment
                      )}`}
                    >
                      {getStatusIcon(plant.operations.preTreatment)}
                      {plant.operations.preTreatment}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Clariflocculator, Dual Media & Activated Carbon Filters
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Quick Set:</span>
                    {(["Running", "Maintenance", "Stopped"] as UnitStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateUnitStatus(plant.id, "preTreatment", st)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          plant.operations.preTreatment === st
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Reverse Osmosis (RO) */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">2. Reverse Osmosis</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBg(
                        plant.operations.ro
                      )}`}
                    >
                      {getStatusIcon(plant.operations.ro)}
                      {plant.operations.ro}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    High Pressure SWRO & Brackish Multi-stage Passes
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Quick Set:</span>
                    {(["Running", "Maintenance", "Stopped"] as UnitStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateUnitStatus(plant.id, "ro", st)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          plant.operations.ro === st
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Additional Crystallizer */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">3. Crystallizer</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBg(
                        plant.operations.crystallizer
                      )}`}
                    >
                      {getStatusIcon(plant.operations.crystallizer)}
                      {plant.operations.crystallizer}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Multi-Effect Evaporator (MEE) brine salt separation
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Quick Set:</span>
                    {(["Running", "Maintenance", "Stopped"] as UnitStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateUnitStatus(plant.id, "crystallizer", st)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          plant.operations.crystallizer === st
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Utility Services / ATFD */}
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">4. Utility / ATFD</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBg(
                        plant.operations.utilityAtfd
                      )}`}
                    >
                      {getStatusIcon(plant.operations.utilityAtfd)}
                      {plant.operations.utilityAtfd}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Agitated Thin Film Dryer & Centrifugal Salt Bagging
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Quick Set:</span>
                    {(["Running", "Maintenance", "Stopped"] as UnitStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateUnitStatus(plant.id, "utilityAtfd", st)}
                        className={`text-[10px] px-1.5 py-0.5 rounded ${
                          plant.operations.utilityAtfd === st
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {st[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
