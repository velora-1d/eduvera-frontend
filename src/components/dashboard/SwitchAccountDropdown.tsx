"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Building2, School, BookOpen, Eye, ArrowLeft } from "lucide-react";

interface Tenant {
    id: string;
    name: string;
    plan_type: "sekolah" | "pesantren" | "hybrid";
    status: string;
}

interface SwitchAccountDropdownProps {
    currentMode: "owner" | "sekolah" | "pesantren";
    isImpersonating?: boolean;
    tenantName?: string;
}

export function SwitchAccountDropdown({
    currentMode,
    isImpersonating = false,
    tenantName = ""
}: SwitchAccountDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    // Fetch tenants when dropdown opens
    useEffect(() => {
        if (isOpen && tenants.length === 0) {
            fetchTenants();
        }
    }, [isOpen]);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("owner_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/owner/tenants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setTenants(data.data || []);
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = async (tenant: Tenant) => {
        try {
            const token = localStorage.getItem("owner_token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/owner/impersonate`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tenant_id: tenant.id,
                    view_mode: tenant.plan_type
                })
            });
            const data = await res.json();

            if (data.impersonate_token) {
                // Store impersonate token and redirect
                localStorage.setItem("access_token", data.impersonate_token); // Swap active token
                localStorage.setItem("impersonate_token", data.impersonate_token);
                localStorage.setItem("impersonate_tenant", JSON.stringify(data.tenant));
                localStorage.setItem("is_impersonating", "true");

                // Redirect based on plan type
                if (tenant.plan_type === "sekolah") {
                    router.push("/sekolah");
                } else if (tenant.plan_type === "pesantren") {
                    router.push("/pesantren");
                } else {
                    router.push("/hybrid");
                }
            }
        } catch (error) {
            console.error("Failed to impersonate:", error);
        }
        setIsOpen(false);
    };

    const handleBackToOwner = () => {
        // Restore owner token
        const ownerToken = localStorage.getItem("owner_token");
        if (ownerToken) {
            localStorage.setItem("access_token", ownerToken);
        }

        localStorage.removeItem("impersonate_token");
        localStorage.removeItem("impersonate_tenant");
        localStorage.removeItem("is_impersonating");
        router.push("/owner");
    };

    const getModeIcon = () => {
        switch (currentMode) {
            case "sekolah": return <School size={16} />;
            case "pesantren": return <BookOpen size={16} />;
            default: return <Building2 size={16} />;
        }
    };

    const getModeLabel = () => {
        if (isImpersonating && tenantName) {
            return `Viewing: ${tenantName}`;
        }
        switch (currentMode) {
            case "sekolah": return "Dashboard Sekolah";
            case "pesantren": return "Dashboard Pesantren";
            default: return "Owner Dashboard";
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isImpersonating
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
                    {/* Back to Owner (if impersonating) */}
                    {isImpersonating && (
                        <button
                            onClick={handleBackToOwner}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 border-b border-slate-700"
                        >
                            <ArrowLeft size={18} />
                            Kembali ke Owner Dashboard
                        </button>
                    )}

                    {/* Owner Dashboard Option */}
                    <button
                        onClick={() => { router.push("/owner"); setIsOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left ${currentMode === "owner" && !isImpersonating
                            ? "bg-red-500/10 text-red-400"
                            : "text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        <Building2 size={18} />
                        Owner Dashboard
                    </button>

                    {/* Divider */}
                    <div className="border-t border-slate-700 my-1" />
                    <div className="px-4 py-2 text-xs text-slate-500 uppercase tracking-wider">
                        Preview Tenant
                    </div>

                    {/* Tenants List */}
                    <div className="max-h-60 overflow-y-auto">
                        {loading ? (
                            <div className="px-4 py-3 text-sm text-slate-400">Loading...</div>
                        ) : tenants.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-slate-400">Tidak ada tenant</div>
                        ) : (
                            tenants.filter(t => t.status === "active").map((tenant) => (
                                <button
                                    key={tenant.id}
                                    onClick={() => handleImpersonate(tenant)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-300 hover:bg-slate-700"
                                >
                                    <Eye size={16} className="text-slate-500" />
                                    <div>
                                        <div className="text-sm font-medium truncate max-w-[180px]">{tenant.name}</div>
                                        <div className="text-xs text-slate-500 capitalize">{tenant.plan_type}</div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
