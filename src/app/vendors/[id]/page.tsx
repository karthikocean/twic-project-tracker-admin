"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  FileBadge2,
  Briefcase,
  FileCheck2,
  FileText,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabItem } from "@/components/common/Tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DetailPageSkeleton } from "@/components/common/LoadingSkeleton";
import { getVendorById, getPreQualificationById } from "@/services/vendorService";
import { getTenderApplications } from "@/services/tenderApplicationService";
import { getSubcontractors } from "@/services/subcontractorService";
import { Vendor, PreQualificationData, TenderApplication, SubcontractorAssignment } from "@/types";
import { formatINRCrores, formatINR, formatDate } from "@/utils/formatters";

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [pq, setPq] = useState<PreQualificationData | null>(null);
  const [applications, setApplications] = useState<TenderApplication[]>([]);
  const [assignments, setAssignments] = useState<SubcontractorAssignment[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const v = await getVendorById(resolvedParams.id);
        if (v) {
          setVendor(v);
          const [pqRes, allApps, allSubs] = await Promise.all([
            v.preQualificationId
              ? getPreQualificationById(v.preQualificationId)
              : Promise.resolve(undefined),
            getTenderApplications(),
            getSubcontractors(),
          ]);
          if (pqRes) setPq(pqRes);
          setApplications(allApps.filter((a) => a.vendorId === v.id));
          setAssignments(allSubs.filter((s) => s.vendorId === v.id));
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <AppLayout title="Loading Vendor...">
        <DetailPageSkeleton />
      </AppLayout>
    );
  }

  if (!vendor) {
    return (
      <AppLayout title="Vendor Not Found">
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <p className="text-slate-500">Vendor record not found.</p>
          <Link href="/vendors" className="mt-4 inline-block text-xs font-semibold text-blue-600">
            Back to Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  const tabs: TabItem[] = [
    { id: "overview", label: "Company Overview" },
    { id: "statutory", label: "Statutory & Financials" },
    { id: "prequal", label: "Pre-Qualification Dossier", count: pq ? 1 : 0 },
    { id: "tenders", label: "Tender Applications", count: applications.length },
    { id: "assignments", label: "Project Assignments", count: assignments.length },
  ];

  return (
    <AppLayout title={`Vendor: ${vendor.companyName}`}>
      <PageHeader
        title={vendor.companyName}
        subtitle={`${vendor.vendorCode} • Category: ${vendor.category}`}
        breadcrumbs={[{ label: "Vendors", href: "/vendors" }, { label: vendor.companyName }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/vendors"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            {vendor.preQualificationId && (
              <Link
                href={`/pre-qualification/${vendor.preQualificationId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
              >
                <FileBadge2 className="h-3.5 w-3.5" />
                <span>Review PQ Dossier</span>
              </Link>
            )}
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Empanelment Status
              </span>
              <StatusBadge status={vendor.status} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Vendor Code</span>
                <span className="font-semibold text-slate-900 text-sm">{vendor.vendorCode}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Pre-Qualification Status</span>
                <div className="mt-1">
                  <StatusBadge status={vendor.preQualificationStatus} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Category</span>
                <span className="font-semibold text-slate-800">{vendor.category}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Quality Rating</span>
                <div className="flex items-center gap-1 font-bold text-amber-600 mt-0.5">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>{vendor.rating} / 5.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Nodal Contact Coordinates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Contact Person</span>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">
                  {vendor.contactPerson}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Official Email</span>
                <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                    {vendor.email}
                  </a>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Telephone</span>
                <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{vendor.phone}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Active Execution Contracts</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  {vendor.activeProjectsCount} Ongoing Projects
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "statutory" && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4 max-w-2xl text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Statutory Compliance Numbers
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[11px] block">
                Permanent Account Number (PAN)
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">{vendor.panNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[11px] block">GST Identification Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{vendor.gstNumber}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[11px] block">MSME Registration</span>
              <span className="font-mono font-semibold text-slate-800">
                {vendor.msmeNumber || "Not Applicable / Large Enterprise"}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-400 text-[11px] block">Empanelment Date</span>
              <span className="font-semibold text-slate-800">{formatDate(vendor.createdAt)}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "prequal" && (
        <div className="space-y-4">
          {pq ? (
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Verified Pre-Qualification Record ({pq.id.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Submitted: {formatDate(pq.submissionDate)} • Status: {pq.status}
                  </p>
                </div>
                <Link
                  href={`/pre-qualification/${pq.id}`}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
                >
                  Open Full 9-Section Dossier →
                </Link>
              </div>

              {pq.verificationNotes && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-800">Committee Remarks:</span>
                  <p className="text-slate-600 mt-0.5">{pq.verificationNotes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400 text-xs">
              No pre-qualification dossier submitted by this vendor yet.
            </div>
          )}
        </div>
      )}

      {activeTab === "tenders" && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Tender Bids Submitted by Vendor ({applications.length})
          </h3>
          {applications.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {applications.map((app) => (
                <div key={app.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-blue-600">{app.applicationNumber}</span>
                    <p className="font-medium text-slate-900">{app.tenderTitle}</p>
                    <p className="text-[11px] text-slate-500">
                      Tender Ref: {app.tenderNumber} • Bid Amount:{" "}
                      <strong>{formatINR(app.commercialAmount)}</strong>
                    </p>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3">No active bids for this vendor.</p>
          )}
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Subcontractor Project Assignments ({assignments.length})
          </h3>
          {assignments.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {assignments.map((sub) => (
                <div key={sub.id} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900">{sub.projectName}</span>
                    <p className="text-slate-600">{sub.scopeOfWork}</p>
                    <p className="text-[11px] text-slate-500">
                      Contract Value: <strong>{formatINR(sub.contractValue)}</strong> • Progress:{" "}
                      <strong>{sub.progressPercent}%</strong>
                    </p>
                  </div>
                  <StatusBadge status={sub.status} size="sm" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3">No active subcontractor assignments.</p>
          )}
        </div>
      )}
    </AppLayout>
  );
}
