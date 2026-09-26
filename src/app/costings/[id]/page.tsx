"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calculator,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Building2,
  DollarSign,
  Info,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailPageSkeleton } from "@/components/common/LoadingSkeleton";
import { getCostingById, saveCosting } from "@/services/costingService";
import { Costing, CostingItem } from "@/types";
import { formatINR, formatINRCrores, formatDate } from "@/utils/formatters";

export default function CostingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [costing, setCosting] = useState<Costing | null>(null);
  const [items, setItems] = useState<CostingItem[]>([]);
  const [marginPercent, setMarginPercent] = useState<number>(20);
  const [notes, setNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    getCostingById(resolvedParams.id).then((c) => {
      if (c) {
        setCosting(c);
        setItems(c.items);
        setMarginPercent(c.marginPercent);
        setNotes(c.notes || "");
      }
      setIsLoading(false);
    });
  }, [resolvedParams.id]);

  // Client-side dynamic cost calculations
  const baseCost = items.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const marginAmount = Math.round(baseCost * (marginPercent / 100));
  const subtotal = baseCost + marginAmount;
  const taxesAmount = Math.round(subtotal * 0.18);
  const finalQuotation = subtotal + taxesAmount;

  const handleItemChange = (
    id: string,
    field: "quantity" | "unitRate" | "description" | "unit" | "category",
    val: any
  ) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, [field]: val };
          if (field === "quantity" || field === "unitRate") {
            const q = field === "quantity" ? Number(val) : it.quantity;
            const r = field === "unitRate" ? Number(val) : it.unitRate;
            updated.total = Math.round(q * r);
          }
          return updated;
        }
        return it;
      })
    );
  };

  const handleAddItem = (category: CostingItem["category"]) => {
    const newItem: CostingItem = {
      id: `ci-${Date.now()}`,
      category,
      description: `New ${category} Item`,
      unit: category === "Manpower" ? "Man-Month" : "Lump Sum",
      quantity: 1,
      unitRate: 100000,
      total: 100000,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = async () => {
    if (!costing) return;
    setIsSaving(true);
    try {
      const updated = await saveCosting(costing.id, items, marginPercent, notes);
      setCosting(updated);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout title="Loading Costing...">
        <DetailPageSkeleton />
      </AppLayout>
    );
  }

  if (!costing) {
    return (
      <AppLayout title="Costing Not Found">
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500">Worksheet not found.</p>
          <Link href="/costings" className="mt-4 inline-block text-xs font-semibold text-blue-600">
            Back to Costings
          </Link>
        </div>
      </AppLayout>
    );
  }

  const categories: CostingItem["category"][] = [
    "Manpower",
    "Expert / Consultant",
    "Travel",
    "Vehicle",
    "Accommodation",
    "Subcontractor",
    "Other",
  ];

  return (
    <AppLayout title={`Costing Worksheet: ${costing.costingNumber}`}>
      <PageHeader
        title={`Costing Worksheet: ${costing.costingNumber}`}
        subtitle={`${costing.projectName} • ${costing.clientName}`}
        breadcrumbs={[
          { label: "Cost Preparation", href: "/costings" },
          { label: costing.costingNumber },
        ]}
      />

      {saveToast && (
        <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Worksheet calculations updated and saved to local state!</span>
        </div>
      )}

      {/* Advanced Costing Disclaimer Box (Section 18 requirement) */}
      <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold">Government Escalation & Overhead Policy Notice:</span>
          <p className="text-amber-800 leading-relaxed">
            Direct expenditures (Manpower, Vehicle, Travel, Subcontractor) are computed dynamically.
            Advanced overhead allocation, escalation formulas, and contingency percentages are
            designated as:{" "}
            <span className="font-bold text-amber-950 underline">
              &quot;TBD - Client Confirmation Required&quot;
            </span>{" "}
            pending board signoff.
          </p>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Cost Items by Category (Full Width) */}
        <div className="space-y-6">
          {categories.map((category) => {
            const catItems = items.filter((it) => it.category === category);
            const catTotal = catItems.reduce((sum, it) => sum + (it.total || 0), 0);

            return (
              <div
                key={category}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {category}
                    </span>
                    <span className="text-[11px] text-slate-400">({catItems.length} items)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900">{formatINR(catTotal)}</span>
                    <button
                      type="button"
                      onClick={() => handleAddItem(category)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                    >
                      <Plus className="h-3 w-3" /> Add Item
                    </button>
                  </div>
                </div>

                {catItems.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs divide-y divide-slate-100">
                      <thead className="text-[11px] text-slate-500 font-semibold bg-slate-50/50">
                        <tr>
                          <th className="px-3 py-2">Item Description</th>
                          <th className="px-2 py-2 w-28">Unit</th>
                          <th className="px-2 py-2 w-20 text-right">Qty</th>
                          <th className="px-2 py-2 w-32 text-right">Unit Rate (₹)</th>
                          <th className="px-3 py-2 w-36 text-right">Total Amount (₹)</th>
                          <th className="px-2 py-2 w-10 text-center"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {catItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleItemChange(item.id, "description", e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white text-slate-800"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="text"
                                value={item.unit}
                                onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white text-slate-800"
                              />
                            </td>
                            <td className="px-2 py-2 text-right">
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(item.id, "quantity", e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded text-right focus:bg-white text-slate-800"
                              />
                            </td>
                            <td className="px-2 py-2 text-right">
                              <input
                                type="number"
                                min={0}
                                value={item.unitRate}
                                onChange={(e) =>
                                  handleItemChange(item.id, "unitRate", e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded text-right focus:bg-white text-slate-800 font-mono"
                              />
                            </td>
                            <td className="px-3 py-2 text-right font-semibold text-slate-900 font-mono">
                              {formatINR(item.total)}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Remove line item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No items added in this category. Click &quot;Add Item&quot; to include line
                    rates.
                  </div>
                )}
              </div>
            );
          })}

          {/* Notes and Assumptions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs text-xs space-y-2">
            <h4 className="font-semibold text-slate-900">Costing Assumptions & Scope Basis</h4>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State basis of rates, consultant quotation validity, and site logistics notes..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
            />
          </div>
        </div>

        {/* Full-Width Commercial Summary & Quotation Calculation */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 md:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Commercial Summary & Final Quotation
              </span>
              <StatusBadge status={costing.status} size="sm" />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span><strong>Enquiry:</strong> {costing.enquiryNumber}</span>
              <span><strong>Client:</strong> {costing.clientName}</span>
              <span><strong>Updated:</strong> {formatDate(costing.updatedAt)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Base Direct Cost */}
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Base Direct Cost
              </span>
              <div className="mt-3">
                <span className="text-xl font-bold text-slate-900">{formatINR(baseCost)}</span>
                <p className="text-[10px] text-slate-400 mt-1">Aggregated line-item subtotal</p>
              </div>
            </div>

            {/* Profit Margin Controls */}
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Project Margin
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs bg-white border border-slate-300 rounded-md text-right font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-xs font-semibold text-slate-500">%</span>
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-slate-200/60 pt-2">
                <span className="text-xs text-slate-500">Margin Addition:</span>
                <span className="text-sm font-bold text-emerald-600">+{formatINR(marginAmount)}</span>
              </div>
            </div>

            {/* Subtotal & Statutory GST */}
            <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Subtotal (Pre-GST):</span>
                  <span className="font-semibold text-slate-800">{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">GST (Statutory 18%):</span>
                  <span className="font-semibold text-slate-800">+{formatINR(taxesAmount)}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">18% statutory tax compliance</p>
            </div>

            {/* Final Quotation Display */}
            <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Final Quotation Value
              </span>
              <div className="mt-2">
                <p className="text-2xl font-extrabold tracking-tight text-white">{formatINR(finalQuotation)}</p>
                <p className="text-xs text-blue-300 font-mono mt-0.5">
                  {formatINRCrores(finalQuotation)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="mt-8 flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
        <Link
          href="/costings"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
          <span>Back to Costings</span>
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all hover:shadow-md disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Saving..." : "Save Worksheet"}</span>
        </button>
      </div>
    </AppLayout>
  );
}
