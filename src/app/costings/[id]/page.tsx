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
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/costings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Saving..." : "Save Worksheet"}</span>
            </button>
          </div>
        }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Cost Items by Section */}
        <div className="lg:col-span-2 space-y-6">
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

        {/* Right Column: Dynamic Price Summary Card (Section 18 Display) */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs sticky top-20 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Commercial Summary
              </span>
              <StatusBadge status={costing.status} size="sm" />
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Base Direct Cost (Total)</span>
                <span className="font-semibold text-slate-900 text-sm">{formatINR(baseCost)}</span>
              </div>

              {/* Profit Margin Controls */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-700">Project Margin (%)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={marginPercent}
                      onChange={(e) => setMarginPercent(Number(e.target.value))}
                      className="w-16 px-2 py-1 text-xs border border-slate-300 rounded text-right font-bold text-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-500">%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-slate-600">
                  <span>Margin Addition</span>
                  <span className="font-semibold text-emerald-600">+{formatINR(marginAmount)}</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-semibold text-slate-800">
                <span>Subtotal (Before GST)</span>
                <span>{formatINR(subtotal)}</span>
              </div>

              {/* Taxes (18% GST typical for Gov contracts) */}
              <div className="flex justify-between items-center text-slate-600">
                <span>GST (Statutory 18%)</span>
                <span>+{formatINR(taxesAmount)}</span>
              </div>

              {/* Final Quotation */}
              <div className="p-4 bg-slate-900 text-white rounded-lg space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Final Quotation
                </span>
                <p className="text-xl font-bold tracking-tight">{formatINR(finalQuotation)}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {formatINRCrores(finalQuotation)}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 space-y-1 border-t border-slate-100">
                <p>
                  <strong>Linked Enquiry:</strong> {costing.enquiryNumber}
                </p>
                <p>
                  <strong>Client:</strong> {costing.clientName}
                </p>
                <p>
                  <strong>Last Updated:</strong> {formatDate(costing.updatedAt)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-3 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save Quotation"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
