import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`space-y-1.5 mb-3.5 ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-0.5 text-[11px]" />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-snug">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
      </div>

      {children}
    </div>
  );
}
