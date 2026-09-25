"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./LoadingSkeleton";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

interface FilterOption {
  key: string;
  label: string;
  options: { label: string; value: string }[];
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: FilterOption[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
  initialPageSize?: number;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKeys,
  filters,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search query or clear any active filters.",
  onRowClick,
  actions,
  initialPageSize = 10,
  className = "",
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((c) => c.key));
  const [showColMenu, setShowColMenu] = useState(false);

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches = searchKeys
          ? searchKeys.some((k) =>
              String(row[k] || "")
                .toLowerCase()
                .includes(query)
            )
          : Object.values(row).some((val) =>
              String(val || "")
                .toLowerCase()
                .includes(query)
            );
        if (!matches) return false;
      }

      // Dropdown filters
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && value !== "ALL") {
          if (String(row[key]) !== value) return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, searchKeys, activeFilters]);

  // Sort logic
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      return sortDir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilters({});
    setCurrentPage(1);
  };

  const toggleColumn = (key: string) => {
    if (visibleColumns.includes(key)) {
      if (visibleColumns.length > 1) {
        setVisibleColumns(visibleColumns.filter((k) => k !== key));
      }
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  if (isLoading) {
    return <TableSkeleton rows={pageSize} cols={columns.length} />;
  }

  const displayedCols = columns.filter((c) => visibleColumns.includes(c.key));

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top Controls: Search, Filters, Column Toggle, Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
        <div className="flex flex-1 items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
          </div>

          {filters &&
            filters.map((f) => (
              <select
                key={f.key}
                value={activeFilters[f.key] || "ALL"}
                onChange={(e) => handleFilterChange(f.key, e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-slate-900 font-medium"
              >
                <option value="ALL">All {f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ))}

          {(searchTerm || Object.values(activeFilters).some((v) => v && v !== "ALL")) && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Column Visibility Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColMenu(!showColMenu)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50"
              title="Show / Hide Columns"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Columns</span>
            </button>
            {showColMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-20 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-500 border-b border-slate-100 text-[11px]">
                  Toggle Columns
                </div>
                {columns.map((c) => (
                  <label
                    key={c.key}
                    className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(c.key)}
                      onChange={() => toggleColumn(c.key)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-0 h-3.5 w-3.5"
                    />
                    <span className="text-slate-700 truncate">{c.header}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 font-semibold tracking-wider uppercase text-[11px]">
              <tr>
                {displayedCols.map((col) => {
                  const isSorted = sortKey === col.key;
                  return (
                    <th
                      key={col.key}
                      onClick={() => col.sortable !== false && handleSort(col.key)}
                      className={`px-4 py-3 select-none ${
                        col.sortable !== false
                          ? "cursor-pointer hover:bg-slate-100 transition-colors"
                          : ""
                      } ${col.width || ""}`}
                      style={{ textAlign: col.align || "left" }}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          col.align === "right"
                            ? "justify-end"
                            : col.align === "center"
                              ? "justify-center"
                              : "justify-start"
                        }`}
                      >
                        <span>{col.header}</span>
                        {col.sortable !== false && (
                          <span className="text-slate-400">
                            {isSorted ? (
                              sortDir === "asc" ? (
                                <ChevronUp className="h-3.5 w-3.5 text-slate-900" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-slate-900" />
                              )
                            ) : (
                              <ChevronsUpDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors ${
                      onRowClick ? "cursor-pointer hover:bg-slate-50/80" : "hover:bg-slate-50/50"
                    }`}
                  >
                    {displayedCols.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 whitespace-nowrap text-slate-800"
                        style={{ textAlign: col.align || "left" }}
                      >
                        {col.render ? col.render(row) : (row[col.key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={displayedCols.length} className="p-0">
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      secondaryActionText="Reset Filters"
                      onSecondaryAction={clearFilters}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {sortedData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="py-1 px-2 text-xs bg-white border border-slate-200 rounded-md"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span>
                per page • Showing{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900">
                  {Math.min(currentPage * pageSize, sortedData.length)}
                </span>{" "}
                of <span className="font-semibold text-slate-900">{sortedData.length}</span> records
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
