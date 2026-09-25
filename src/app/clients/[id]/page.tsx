"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileQuestion,
  FileCheck2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { DetailPageSkeleton } from "@/components/common/LoadingSkeleton";
import { getClientById } from "@/services/clientService";
import { getProjects } from "@/services/projectService";
import { getEnquiries } from "@/services/enquiryService";
import { Client, Project, Enquiry } from "@/types";
import { formatDate } from "@/utils/formatters";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const c = await getClientById(resolvedParams.id);
        if (c) {
          setClient(c);
          const [allProjects, allEnquiries] = await Promise.all([getProjects(), getEnquiries()]);
          setProjects(allProjects.filter((p) => p.clientId === c.id));
          setEnquiries(allEnquiries.filter((e) => e.clientId === c.id));
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <AppLayout title="Loading Client...">
        <DetailPageSkeleton />
      </AppLayout>
    );
  }

  if (!client) {
    return (
      <AppLayout title="Client Not Found">
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <Building2 className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h2 className="text-base font-semibold text-slate-900">Client Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">The requested client record does not exist.</p>
          <Link
            href="/clients"
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md"
          >
            Back to Clients Directory
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`Client: ${client.code}`}>
      <PageHeader
        title={client.name}
        subtitle={`${client.code} • Registered Government Client & Statutory Authority`}
        breadcrumbs={[{ label: "Clients", href: "/clients" }, { label: client.code }]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/clients"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </Link>
            <Link
              href="/enquiries/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Enquiry</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Organization Summary & Contact Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Organization Profile
              </span>
              <StatusBadge status={client.status} size="sm" />
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Official Code</p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{client.code}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px]">Nodal Officer</p>
                <p className="font-semibold text-slate-900 mt-0.5">{client.contactPerson}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[11px]">Email</p>
                <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                    {client.email}
                  </a>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[11px]">Official Phone</p>
                <div className="flex items-center gap-1.5 text-slate-700 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[11px]">Headquarters Address</p>
                <div className="flex items-start gap-1.5 text-slate-700 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {client.address}, {client.city}, {client.state}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Registered In Portal</span>
                <span className="font-medium text-slate-700">{formatDate(client.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Active Projects & Enquiries linked to this Client */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Associated Infrastructure Projects ({projects.length})
                </h3>
              </div>
              <Link
                href="/projects"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                All Projects →
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/projects/${p.id}`)}
                    className="py-3 hover:bg-slate-50 cursor-pointer rounded-md px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-blue-600">
                            {p.projectNumber}
                          </span>
                          <StatusBadge status={p.status} size="sm" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{p.projectName}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-semibold text-slate-800">
                          {p.progressPercent}%
                        </span>
                        <div className="w-24 mt-1">
                          <ProgressBar
                            progress={p.progressPercent}
                            planned={p.plannedProgressPercent}
                            showText={false}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No projects assigned to this client yet.
              </p>
            )}
          </div>

          {/* Enquiries / RFQ */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileQuestion className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Enquiries & DPR Studies ({enquiries.length})
                </h3>
              </div>
              <Link
                href="/enquiries"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                All Enquiries →
              </Link>
            </div>

            {enquiries.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {enquiries.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => router.push(`/enquiries/${e.id}`)}
                    className="py-3 hover:bg-slate-50 cursor-pointer rounded-md px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">
                            {e.enquiryNumber}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                            {e.businessType}
                          </span>
                          <StatusBadge status={e.status} size="sm" />
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">{e.projectName}</p>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {formatDate(e.enquiryDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No enquiries logged for this client yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
