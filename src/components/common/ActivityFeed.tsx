import React from "react";
import Link from "next/link";
import {
  FilePlus2,
  Building2,
  FileCheck2,
  Inbox,
  Award,
  FileSpreadsheet,
  TrendingUp,
  Receipt,
  CreditCard,
} from "lucide-react";
import { ActivityItem } from "@/types";

interface ActivityFeedProps {
  activities: ActivityItem[];
  limit?: number;
  className?: string;
}

export function ActivityFeed({ activities, limit = 10, className = "" }: ActivityFeedProps) {
  const displayed = activities.slice(0, limit);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "Enquiry Created":
        return <FilePlus2 className="h-4 w-4 text-blue-600" />;
      case "Vendor Submitted":
        return <Building2 className="h-4 w-4 text-purple-600" />;
      case "Tender Published":
        return <FileCheck2 className="h-4 w-4 text-cyan-600" />;
      case "Application Received":
        return <Inbox className="h-4 w-4 text-indigo-600" />;
      case "Evaluation Completed":
        return <Award className="h-4 w-4 text-amber-600" />;
      case "Work Order Created":
        return <FileSpreadsheet className="h-4 w-4 text-teal-600" />;
      case "Project Progress Updated":
        return <TrendingUp className="h-4 w-4 text-emerald-600" />;
      case "Invoice Submitted":
        return <Receipt className="h-4 w-4 text-orange-600" />;
      case "Payment Received":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      default:
        return <FilePlus2 className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="-mb-8">
        {displayed.map((activity, idx) => {
          const isLast = idx === displayed.length - 1;
          return (
            <li key={activity.id}>
              <div className="relative pb-6">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
                    {getIcon(activity.type)}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900">{activity.title}</p>
                      <time className="text-[11px] text-slate-400 whitespace-nowrap ml-2">
                        {activity.timestamp}
                      </time>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>By {activity.user}</span>
                      {activity.entityLink && (
                        <>
                          <span>•</span>
                          <Link
                            href={activity.entityLink}
                            className="font-medium text-blue-600 hover:text-blue-800 underline"
                          >
                            View Record
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
