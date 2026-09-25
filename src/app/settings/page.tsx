"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { resetDemoData } from "@/mock/state";
import {
  Settings as SettingsIcon,
  RefreshCw,
  Database,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Server,
} from "lucide-react";

export default function SettingsPage() {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [fyYear, setFyYear] = useState("2025-2026");
  const [defaultGst, setDefaultGst] = useState(18);

  const handleResetData = () => {
    if (
      confirm(
        "Are you sure you want to restore the pristine mock demo state? All in-memory/localStorage changes made during this session will be reverted."
      )
    ) {
      resetDemoData();
      setResetSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="System Administration & Demo Settings"
        subtitle="Manage client-side configuration, future API endpoint bindings, and mock sandbox controls"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Administration" },
          { label: "Settings" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Demo Sandbox Management */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Demo Mode & State Management</h3>
                <p className="text-xs text-slate-500">
                  Operates entirely on client-side mock services with browser session persistence
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2">
              <p>
                <strong>Current Status:</strong> Running in <strong>FRONTEND-ONLY DEMO MODE</strong>
                . All CRUD modifications, approvals, payments, and progress updates are safely
                cached in browser <code className="text-blue-700 font-mono">localStorage</code>.
              </p>
              <p className="text-slate-500">
                To present clean demonstrations to different client stakeholders, click below to
                revert all entities to their default baseline.
              </p>
            </div>

            {resetSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Demo state restored successfully! Reloading workspace...
              </div>
            )}

            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-md shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Demo Data to Baseline
            </button>
          </div>

          {/* Future Backend API Integration */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Server className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">External Backend API Layer</h3>
                <p className="text-xs text-slate-500">
                  Target endpoint configuration when connecting production REST services
                </p>
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Configured API Base URL (NEXT_PUBLIC_API_BASE_URL)
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    process.env.NEXT_PUBLIC_API_BASE_URL ||
                    "http://localhost:5000/api (Mock Fallback Active)"
                  }
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-100 border border-slate-300 rounded text-slate-700"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  When this environment variable is blank or unset, all services seamlessly fallback
                  to high-fidelity mock services.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Future Authentication Gateway
                </label>
                <input
                  type="text"
                  readOnly
                  value="Bearer JWT / OAuth2 Authorization Code Flow (Ready for backend implementation)"
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-100 border border-slate-300 rounded text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preferences */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              System Parameters
            </h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">Active Financial Year</label>
                <select
                  value={fyYear}
                  onChange={(e) => setFyYear(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 text-slate-800 font-medium"
                >
                  <option value="2025-2026">FY 2025-2026 (Current)</option>
                  <option value="2024-2025">FY 2024-2025</option>
                  <option value="2026-2027">FY 2026-2027</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Standard Consulting GST Rate</label>
                <select
                  value={defaultGst}
                  onChange={(e) => setDefaultGst(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-slate-50 text-slate-800 font-medium"
                >
                  <option value={18}>18% (Services GST)</option>
                  <option value={12}>12% (Concession)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 text-slate-500 text-[11px]">
                Currency: <strong className="text-slate-800">INR (₹) Lakhs / Crores</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
