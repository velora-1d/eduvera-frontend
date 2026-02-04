"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Building2, School, BookOpen, ArrowLeft } from "lucide-react";

interface SwitchAccountDropdownProps {
    currentMode?: "owner" | "sekolah" | "pesantren" | "hybrid";
}

export function SwitchAccountDropdown({ currentMode }: SwitchAccountDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Auto-detect current mode from pathname if not provided
    const detectMode = (): "owner" | "sekolah" | "pesantren" | "hybrid" => {
        if (currentMode) return currentMode;
        if (pathname.startsWith("/sekolah")) return "sekolah";
        if (pathname.startsWith("/pesantren")) return "pesantren";
        if (pathname.startsWith("/hybrid")) return "hybrid";
        return "owner";
    };

    const activeMode = detectMode();
    const isInPreviewMode = activeMode !== "owner";

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navigateTo = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    const getModeIcon = () => {
        switch (activeMode) {
            case "sekolah": return <School size={16} />;
            case "pesantren": return <BookOpen size={16} />;
            case "hybrid": return <BookOpen size={16} />;
            default: return <Building2 size={16} />;
        }
    };

    const getModeLabel = () => {
        switch (activeMode) {
            case "sekolah": return "Preview Sekolah";
            case "pesantren": return "Preview Pesantren";
            case "hybrid": return "Preview Hybrid";
            default: return "Owner Dashboard";
        }
    };

    const dashboardOptions = [
        { key: "owner", label: "Owner Dashboard", icon: Building2, path: "/owner", color: "red" },
        { key: "sekolah", label: "Dashboard Sekolah", icon: School, path: "/sekolah", color: "blue" },
        { key: "pesantren", label: "Dashboard Pesantren", icon: BookOpen, path: "/pesantren", color: "emerald" },
        { key: "hybrid", label: "Dashboard Hybrid", icon: BookOpen, path: "/hybrid", color: "purple" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isInPreviewMode
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
            >
                {getModeIcon()}
                <span className="max-w-[150px] truncate">{getModeLabel()}</span>
                <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Back to Owner (if in preview mode) */}
                    {isInPreviewMode && (
                        <button
                            onClick={() => navigateTo("/owner")}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 border-b border-slate-700"
                        >
                            <ArrowLeft size={18} />
                            Kembali ke Owner
                        </button>
                    )}

                    {/* Header */}
                    <div className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider border-b border-slate-700">
                        Switch Dashboard
                    </div>

                    {/* Dashboard Options */}
                    {dashboardOptions.map((option) => {
                        const isActive = activeMode === option.key;
                        const Icon = option.icon;

                        return (
                            <button
                                key={option.key}
                                onClick={() => navigateTo(option.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive
                                    ? `bg-${option.color}-500/10 text-${option.color}-400`
                                    : "text-slate-300 hover:bg-slate-700"
                                    }`}
                            >
                                <Icon size={18} />
                                <div>
                                    <div className="text-sm font-medium">{option.label}</div>
                                    {option.key !== "owner" && (
                                        <div className="text-xs text-slate-500">Preview Mode</div>
                                    )}
                                </div>
                                {isActive && (
                                    <span className="ml-auto text-xs bg-slate-700 px-2 py-0.5 rounded">Active</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
