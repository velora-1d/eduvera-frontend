"use client";

import { useState, ReactNode } from "react";
import { Search, ChevronDown, ChevronUp, X, Filter } from "lucide-react";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterConfig {
    key: string;
    label: string;
    type: "select" | "multi-select" | "search";
    options?: FilterOption[];
    placeholder?: string;
}

interface FilterPanelProps {
    filters: FilterConfig[];
    values: Record<string, string | string[]>;
    onChange: (key: string, value: string | string[]) => void;
    onReset: () => void;
    children?: ReactNode; // For additional filter slots like DateRangePicker
    showAdvanced?: boolean;
}

export default function FilterPanel({
    filters,
    values,
    onChange,
    onReset,
    children,
    showAdvanced = true,
}: FilterPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Separate quick filters (search + first 2 selects) from advanced
    const searchFilter = filters.find((f) => f.type === "search");
    const selectFilters = filters.filter((f) => f.type === "select" || f.type === "multi-select");
    const quickFilters = selectFilters.slice(0, 2);
    const advancedFilters = selectFilters.slice(2);

    const hasActiveFilters = Object.values(values).some((v) =>
        Array.isArray(v) ? v.length > 0 : v !== "" && v !== "all"
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            {/* Quick Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                {searchFilter && (
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={searchFilter.placeholder || "Cari..."}
                            value={(values[searchFilter.key] as string) || ""}
                            onChange={(e) => onChange(searchFilter.key, e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                )}

                {/* Quick Select Filters */}
                {quickFilters.map((filter) => (
                    <div key={filter.key} className="relative min-w-[140px]">
                        <select
                            value={(values[filter.key] as string) || "all"}
                            onChange={(e) => onChange(filter.key, e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        >
                            <option value="all">{filter.label}</option>
                            {filter.options?.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                ))}

                {/* Additional slots (DateRangePicker, etc) */}
                {children}

                {/* Advanced Filters Toggle */}
                {showAdvanced && advancedFilters.length > 0 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        More Filters
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                )}

                {/* Reset Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onReset}
                        className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Reset
                    </button>
                )}
            </div>

            {/* Advanced Filters (Collapsible) */}
            {showAdvanced && isExpanded && advancedFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {advancedFilters.map((filter) => (
                        <div key={filter.key} className="relative min-w-[140px]">
                            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                                {filter.label}
                            </label>
                            <select
                                value={(values[filter.key] as string) || "all"}
                                onChange={(e) => onChange(filter.key, e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                            >
                                <option value="all">Semua</option>
                                {filter.options?.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 bottom-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Export types for use in pages
export type { FilterConfig, FilterOption };
