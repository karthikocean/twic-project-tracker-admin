"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ExportButton } from "@/components/common/ExportButton";
import { Tabs, TabItem } from "@/components/common/Tabs";
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
  Zap,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

type UnitStatus = "Running" | "Stopped" | "Maintenance";

// Chart 1: Daily Water Production vs Design Capacity (MLD)
const waterProductionData = [
  { plant: "Thoothukudi Desal", design: 100, actual: 94.2 },
  { plant: "Perungudi TTRO", design: 60, actual: 54.5 },
  { plant: "Kodungaiyur STP", design: 40, actual: 38.0 },
  { plant: "Sri City WTP", design: 25, actual: 23.4 },
];

// Chart 2: Specific Energy Consumption (SEC - kWh / m³)
const energyConsumptionData = [
  { plant: "Thoothukudi Desal", actual: 3.42, benchmark: 3.50 },
  { plant: "Perungudi TTRO", actual: 1.85, benchmark: 2.00 },
  { plant: "Kodungaiyur STP", actual: 0.92, benchmark: 1.05 },
  { plant: "Sri City WTP", actual: 0.65, benchmark: 0.70 },
];

// Chart 3: Plant Sub-System Operational Health & Uptime
const uptimeData = [
  { name: "Running / Optimal", value: 82, color: "#16a34a" },
  { name: "Under Planned Maintenance", value: 12, color: "#f59e0b" },
  { name: "Standby / Stopped", value: 6, color: "#ef4444" },
];

// Chart 4: Chemical & Consumables Consumption Index (%)
const chemicalIndexData = [
  { consumable: "Antiscalant Dosing", actual: 98, benchmark: 100 },
  { consumable: "Sodium Hypochlorite", actual: 102, benchmark: 100 },
  { consumable: "Cartridge Filters", actual: 94, benchmark: 100 },
  { consumable: "Coagulant / Flocculant", actual: 96, benchmark: 100 },
];

export default function PlantsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
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
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Stopped":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const tabs: TabItem[] = [
    { id: "dashboard", label: "O&M Performance Dashboard", count: 4 },
    { id: "operations", label: "Plant Operational Controls & Live Units", count: plants.length },
  ];

  return (
    <AppLayout title="O&M Dashboard | TWIC Project ERP">
      <PageHeader
        title="Operations & Maintenance (O&M) Directorate"
        subtitle="Live telemetry monitoring, water production volume, specific power consumption, RO membrane health, and chemical dosing compliance."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "O&M Module", href: "/plants" },
          { label: "Executive Dashboard" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <ExportButton
              data={plants}
              filename="TWIC_Plant_Operations_Status"
              label="Export O&M Metrics"
            />
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD (MIN 4 CHARTS) */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Installed Capacity</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">160.0 MLD</div>
              <p className="text-xs text-slate-500 mt-1">Design daily water treatment capacity</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <span>Desalination, TTRO & CETPs</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Daily Water Delivered</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Gauge className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">148.5 MLD</div>
              <p className="text-xs text-slate-500 mt-1">92.8% Average capacity utilization</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Exceeding state supply mandate</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Specific Energy (SEC)</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">3.28 kWh/m³</div>
              <p className="text-xs text-slate-500 mt-1">Energy recovery device (ERD) active</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                <span>Better than 3.50 design threshold</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Water Quality Index</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">100% Meets</div>
              <p className="text-xs text-slate-500 mt-1">TDS, pH, Heavy Metals & Turbidity</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700">
                <span>CPCB & TNPCB online telemetry</span>
              </div>
            </div>
          </div>

          {/* 4 CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Daily Water Production vs Design Capacity */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Daily Water Production vs Design Capacity (MLD)
                  </h3>
                  <p className="text-xs text-slate-500">Rated design throughput vs actual daily treated volume</p>
                </div>
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                  MLD Output
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterProductionData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="plant"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" MLD" />
                    <Tooltip
                      formatter={(val: any) => [`${val} MLD`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="design" name="Design Rated Capacity" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" name="Actual Daily Output" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Specific Energy Consumption (SEC) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Specific Energy Consumption (kWh / m³ treated)
                  </h3>
                  <p className="text-xs text-slate-500">Operational energy consumption vs efficiency benchmark</p>
                </div>
                <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                  Power Efficiency
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyConsumptionData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="plant"
                      tick={{ fontSize: 10, fill: "#64748b" }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" kWh" />
                    <Tooltip
                      formatter={(val: any) => [`${val} kWh/m³`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                    <Bar dataKey="actual" name="Actual Energy (kWh/m³)" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="benchmark" name="Benchmark Max Limit" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Plant Sub-System Operational Health & Uptime */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Sub-System Operational Health & Uptime
                  </h3>
                  <p className="text-xs text-slate-500">Pre-treatment, RO High Pressure, Crystallizer, and ATFD units</p>
                </div>
                <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">
                  System Uptime
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={uptimeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {uptimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, "System Availability"]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-slate-100 text-xs">
                {uptimeData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 truncate">{d.name}:</span>
                    <span className="font-bold text-slate-900">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Chemical & Treatment Consumables Index */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Chemical & Consumables Consumption Index (%)
                  </h3>
                  <p className="text-xs text-slate-500">Actual dosing dosage vs water treatment process benchmark (100%)</p>
                </div>
                <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                  Consumables
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chemicalIndexData}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 45, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                    <YAxis
                      dataKey="consumable"
                      type="category"
                      tick={{ fontSize: 10, fill: "#334155" }}
                      width={130}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val}%`, ""]}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                    <Bar dataKey="actual" name="Actual Consumption %" fill="#0284c7" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="benchmark" name="Standard Norm (100%)" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE OPERATIONAL CONTROLS & SYSTEM UNITS */}
      {activeTab === "operations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plants.map((plant) => (
              <div
                key={plant.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{plant.plantName}</h3>
                    <p className="text-xs text-slate-500">
                      {plant.location} • Client: <span className="font-semibold">{plant.clientName}</span>
                    </p>
                  </div>
                  <StatusBadge status={plant.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-500 block">Design Capacity:</span>
                    <span className="font-bold text-slate-900 text-sm">{plant.capacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Last Maintenance:</span>
                    <span className="font-medium text-slate-800">{plant.lastMaintenanceDate}</span>
                  </div>
                </div>

                {/* Sub-System Operations Control */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Sub-System Operation Controls
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { key: "preTreatment", label: "Pre-Treatment" },
                        { key: "ro", label: "RO High Pressure" },
                        { key: "crystallizer", label: "Crystallizer" },
                        { key: "utilityAtfd", label: "ATFD / Utility" },
                      ] as const
                    ).map(({ key, label }) => {
                      const status = plant.operations?.[key] || "Running";
                      return (
                        <div
                          key={key}
                          className={`p-2.5 rounded-lg border flex flex-col justify-between gap-1.5 ${getStatusBg(
                            status
                          )}`}
                        >
                          <div className="text-[11px] font-bold truncate" title={label}>
                            {label}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-semibold">
                            {getStatusIcon(status)}
                            <span>{status}</span>
                          </div>
                          {/* Unit status switch */}
                          <div className="flex items-center gap-1 pt-1 border-t border-slate-200/50">
                            <button
                              type="button"
                              onClick={() => handleUpdateUnitStatus(plant.id, key, "Running")}
                              title="Set Running"
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                status === "Running"
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 hover:bg-emerald-200 text-slate-600"
                              }`}
                            >
                              R
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateUnitStatus(plant.id, key, "Maintenance")}
                              title="Set Maintenance"
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                status === "Maintenance"
                                  ? "bg-amber-600 text-white"
                                  : "bg-slate-200 hover:bg-amber-200 text-slate-600"
                              }`}
                            >
                              M
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateUnitStatus(plant.id, key, "Stopped")}
                              title="Set Stopped"
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                status === "Stopped"
                                  ? "bg-red-600 text-white"
                                  : "bg-slate-200 hover:bg-red-200 text-slate-600"
                              }`}
                            >
                              S
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Asset ID: {plant.id}</span>
                  <Link
                    href={`/plants/${plant.id}`}
                    className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                  >
                    <span>Full Plant SCADA & Logs</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
