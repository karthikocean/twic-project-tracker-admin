"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Briefcase,
  Building2,
  FileCheck2,
  FileText,
  Receipt,
  ArrowRight,
} from "lucide-react";
import { mockStorage } from "@/mock/state";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // toggle
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const projects = q
    ? mockStorage
        .getProjects()
        .filter(
          (p) =>
            p.projectName.toLowerCase().includes(q) ||
            p.projectNumber.toLowerCase().includes(q) ||
            p.clientName.toLowerCase().includes(q)
        )
    : [];

  const vendors = q
    ? mockStorage
        .getVendors()
        .filter(
          (v) =>
            v.companyName.toLowerCase().includes(q) ||
            v.vendorCode.toLowerCase().includes(q) ||
            v.panNumber.toLowerCase().includes(q)
        )
    : [];

  const tenders = q
    ? mockStorage
        .getTenders()
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.tenderNumber.toLowerCase().includes(q) ||
            t.clientName.toLowerCase().includes(q)
        )
    : [];

  const enquiries = q
    ? mockStorage
        .getEnquiries()
        .filter(
          (e) =>
            e.projectName.toLowerCase().includes(q) ||
            e.enquiryNumber.toLowerCase().includes(q) ||
            e.clientName.toLowerCase().includes(q)
        )
    : [];

  const invoices = q
    ? mockStorage
        .getInvoices()
        .filter(
          (i) =>
            i.invoiceNumber.toLowerCase().includes(q) ||
            i.partyName.toLowerCase().includes(q) ||
            i.projectName.toLowerCase().includes(q)
        )
    : [];

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  const totalResults =
    projects.length + vendors.length + tenders.length + enquiries.length + invoices.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, vendors, tenders, enquiries, invoices..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-200 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 text-xs divide-y divide-slate-100">
          {!query && (
            <div className="p-8 text-center text-slate-400">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium text-slate-600">Global Search</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Type a project code, vendor name, tender ID, or GST to search across modules.
              </p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="p-8 text-center text-slate-400">
              <p className="font-medium text-slate-600">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Try refining keywords or searching by entity reference code.
              </p>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="py-2.5">
              <h5 className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                Projects ({projects.length})
              </h5>
              <div className="space-y-1">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => navigateTo(`/projects/${p.id}`)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{p.projectName}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.projectNumber} • {p.clientName}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vendors */}
          {vendors.length > 0 && (
            <div className="py-2.5">
              <h5 className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-purple-600" />
                Vendors ({vendors.length})
              </h5>
              <div className="space-y-1">
                {vendors.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigateTo(`/vendors/${v.id}`)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{v.companyName}</div>
                      <div className="text-[11px] text-slate-500">
                        {v.vendorCode} • PAN: {v.panNumber} • Status: {v.preQualificationStatus}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tenders */}
          {tenders.length > 0 && (
            <div className="py-2.5">
              <h5 className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck2 className="h-3.5 w-3.5 text-cyan-600" />
                Tenders ({tenders.length})
              </h5>
              <div className="space-y-1">
                {tenders.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => navigateTo(`/tenders/${t.id}`)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{t.title}</div>
                      <div className="text-[11px] text-slate-500">
                        {t.tenderNumber} • {t.clientName}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enquiries */}
          {enquiries.length > 0 && (
            <div className="py-2.5">
              <h5 className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-500" />
                Enquiries ({enquiries.length})
              </h5>
              <div className="space-y-1">
                {enquiries.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => navigateTo(`/enquiries/${e.id}`)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{e.projectName}</div>
                      <div className="text-[11px] text-slate-500">
                        {e.enquiryNumber} • {e.clientName} • Status: {e.status}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {invoices.length > 0 && (
            <div className="py-2.5">
              <h5 className="px-2 pb-1.5 font-semibold text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5 text-emerald-600" />
                Invoices ({invoices.length})
              </h5>
              <div className="space-y-1">
                {invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => navigateTo(`/invoices`)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-md hover:bg-slate-50 text-slate-700 hover:text-slate-900 group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-slate-500">
                        {inv.partyName} • {inv.projectName} • {inv.paymentStatus}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Search across 5 enterprise modules</span>
          <span className="font-medium text-slate-700">TWIC Project Management Tracker</span>
        </div>
      </div>
    </div>
  );
}
