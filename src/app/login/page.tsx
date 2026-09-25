"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Droplets, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Info } from "lucide-react";
import { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@twic-demo.com");
  const [password, setPassword] = useState("Password@123");
  const [selectedRole, setSelectedRole] = useState<UserRole>("ADMIN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Frontend demo mock auth validation
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        if (typeof window !== "undefined") {
          localStorage.setItem("twic_demo_auth", "true");
          localStorage.setItem("twic_demo_role", selectedRole);
          localStorage.setItem(
            "twic_demo_user",
            selectedRole === "ADMIN"
              ? "Dr. K. R. Narayanan"
              : selectedRole === "COO"
                ? "Mr. V. Sundaramurthy, IAS"
                : selectedRole === "PMC"
                  ? "Er. Rajesh Kumar"
                  : "Officer in Charge"
          );
        }
        router.push("/dashboard");
      } else {
        setError("Please enter both email and password.");
        setIsLoading(false);
      }
    }, 400);
  };

  const handleAutofill = (role: UserRole = "ADMIN") => {
    setSelectedRole(role);
    if (role === "ADMIN") {
      setEmail("admin@twic-demo.com");
    } else if (role === "COO") {
      setEmail("coo@twic-demo.com");
    } else if (role === "PMC") {
      setEmail("pmc.lead@twic-demo.com");
    } else {
      setEmail(`${role.toLowerCase()}@twic-demo.com`);
    }
    setPassword("Password@123");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-8 text-center text-white border-b border-slate-800">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-md mb-3">
            <Droplets className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">TWIC PROJECT TRACKER</h1>
          <p className="text-xs text-slate-400 mt-1">
            Government Water & Infrastructure Management ERP
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-[10px] text-blue-300 font-medium">
            <ShieldCheck className="h-3 w-3" />
            Frontend Demo Instance (Mock Services Ready)
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@twic-demo.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => alert("Mock demo password is: Password@123")}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Simulated User Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-slate-900"
              >
                <option value="ADMIN">ADMIN - Executive Directorate</option>
                <option value="COO">COO - Operations & Approvals</option>
                <option value="ADVISORY">ADVISORY - DPR & Transaction</option>
                <option value="PMC">PMC - Field Project Management</option>
                <option value="OM">OM - Plant Operations</option>
                <option value="ACCOUNTS">ACCOUNTS - Finance & Billing</option>
                <option value="PROJECT_MANAGER">PROJECT_MANAGER - Site In-Charge</option>
                <option value="VIEWER">VIEWER - Auditor / Read-Only</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Mock Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mb-2.5">
              <Info className="h-3.5 w-3.5 text-blue-600" />
              <span className="font-semibold text-slate-700">Quick Demo Presets:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleAutofill("ADMIN")}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Admin (Director)
              </button>
              <button
                type="button"
                onClick={() => handleAutofill("COO")}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                COO
              </button>
              <button
                type="button"
                onClick={() => handleAutofill("PMC")}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                PMC Lead
              </button>
              <button
                type="button"
                onClick={() => handleAutofill("ACCOUNTS")}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Accounts
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          This system is configured for client presentation. Authentication is frontend-simulated.
        </div>
      </div>
    </div>
  );
}
