"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface DateRange {
    from: Date | null;
    to: Date | null;
}

interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    placeholder?: string;
}

const presets = [
    { label: "Hari ini", getValue: () => ({ from: new Date(), to: new Date() }) },
    {
        label: "7 hari terakhir",
        getValue: () => {
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - 7);
            return { from, to };
        },
    },
    {
        label: "30 hari terakhir",
        getValue: () => {
            const to = new Date();
            const from = new Date();
            from.setDate(from.getDate() - 30);
            return { from, to };
        },
    },
    {
        label: "Bulan ini",
        getValue: () => {
            const now = new Date();
            const from = new Date(now.getFullYear(), now.getMonth(), 1);
            const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return { from, to };
        },
    },
    {
        label: "Bulan lalu",
        getValue: () => {
            const now = new Date();
            const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const to = new Date(now.getFullYear(), now.getMonth(), 0);
            return { from, to };
        },
    },
];

function formatDate(date: Date | null): string {
    if (!date) return "";
    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function DateRangePicker({
    value,
    onChange,
    placeholder = "Pilih tanggal",
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showCustom, setShowCustom] = useState(false);
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayValue =
        value.from && value.to
            ? `${formatDate(value.from)} - ${formatDate(value.to)}`
            : placeholder;

    const handlePresetClick = (getValue: () => DateRange) => {
        onChange(getValue());
        setIsOpen(false);
        setShowCustom(false);
    };

    const handleCustomApply = () => {
        if (customFrom && customTo) {
            onChange({
                from: new Date(customFrom),
                to: new Date(customTo),
            });
            setIsOpen(false);
            setShowCustom(false);
        }
    };

    const handleClear = () => {
        onChange({ from: null, to: null });
        setCustomFrom("");
        setCustomTo("");
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors min-w-[200px] text-left"
            >
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={`flex-1 text-sm ${value.from ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                    {displayValue}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
                    <div className="p-2">
                        {/* Presets */}
                        {presets.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => handlePresetClick(preset.getValue)}
                                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                {preset.label}
                            </button>
                        ))}

                        {/* Custom toggle */}
                        <button
                            onClick={() => setShowCustom(!showCustom)}
                            className="w-full px-3 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
                        >
                            Custom Range
                        </button>

                        {/* Custom inputs */}
                        {showCustom && (
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700 mt-2">
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="date"
                                        value={customFrom}
                                        onChange={(e) => setCustomFrom(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                                    />
                                    <input
                                        type="date"
                                        value={customTo}
                                        onChange={(e) => setCustomTo(e.target.value)}
                                        className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                                    />
                                </div>
                                <button
                                    onClick={handleCustomApply}
                                    disabled={!customFrom || !customTo}
                                    className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Terapkan
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Clear button */}
                    {value.from && (
                        <div className="px-2 pb-2">
                            <button
                                onClick={handleClear}
                                className="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                Hapus Filter Tanggal
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
