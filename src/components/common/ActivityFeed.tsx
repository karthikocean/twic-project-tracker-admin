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

export function ActivityFeed({ activities, limit = 5, className = "" }: ActivityFeedProps) {
  const displayed = activities.slice(0, limit);

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "Enquiry Created":
        return <FilePlus2 className="h-3.5 w-3.5 text-blue-600" />;
      case "Vendor Submitted":
        return <Building2 className="h-3.5 w-3.5 text-purple-600" />;
      case "Tender Published":
        return <FileCheck2 className="h-3.5 w-3.5 text-cyan-600" />;
      case "Application Received":
        return <Inbox className="h-3.5 w-3.5 text-indigo-600" />;
      case "Evaluation Completed":
        return <Award className="h-3.5 w-3.5 text-amber-600" />;
      case "Work Order Created":
        return <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" />;
      case "Project Progress Updated":
        return <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />;
      case "Invoice Submitted":
        return <Receipt className="h-3.5 w-3.5 text-orange-600" />;
      case "Payment Received":
        return <CreditCard className="h-3.5 w-3.5 text-emerald-600" />;
      default:
        return <FilePlus2 className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div className={`flow-root ${className}`}>
      <ul className="divide-y divide-slate-100">
        {displayed.map((activity) => (
          <li key={activity.id} className="py-2.5 first:pt-0 last:pb-0 group">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 mt-0.5 group-hover:border-blue-300 transition-colors">
                {getIcon(activity.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                    {activity.title}
                  </p>
                  <time className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                    {activity.timestamp}
                  </time>
                </div>
                <p className="text-[11px] text-slate-500 truncate leading-snug mt-0.5">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span className="truncate">By {activity.user}</span>
                  {activity.entityLink && (
                    <Link
                      href={activity.entityLink}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline shrink-0 ml-2"
                    >
                      View Record
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
