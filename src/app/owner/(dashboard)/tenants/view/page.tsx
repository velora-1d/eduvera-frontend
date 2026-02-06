"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ownerApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Building2,
    Mail,
    Globe,
    Calendar,
    CreditCard,
    Users,
    Play,
    Ban,
    ExternalLink,
    UserCog,
} from "lucide-react";
import Link from "next/link";

interface TenantDetail {
    id: string;
    name: string;
    subdomain: string;
    institution_type: string;
    status: string;
    subscription_tier: string;
    address: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_holder: string;
    created_at: string;
    trial_ends_at: string;
    admin?: {
        id: string;
        name: string;
        email: string;
        whatsapp: string;
    };
}

function TenantDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const [tenant, setTenant] = useState<TenantDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTenant(id);
        } else {
            setLoading(false);
        }
    }, [id]);

    const fetchTenant = async (id: string) => {
        try {
            const response = await ownerApi.getTenantDetail(id);
            setTenant(response?.tenant || response);
        } catch (error) {
            console.error("Failed to fetch tenant", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!tenant) return;
        try {
            await ownerApi.updateTenantStatus(tenant.id, newStatus);
            fetchTenant(tenant.id);
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleImpersonate = async () => {
        if (!tenant) return;
        try {
            const response = await ownerApi.impersonate(tenant.id);
            if (response?.access_token) {
                // Store original owner token and flag
                localStorage.setItem("owner_original_token", localStorage.getItem("access_token") || "");
                localStorage.setItem("impersonating", "true");
                localStorage.setItem("impersonating_tenant", tenant.name);
                // Set new token for tenant access
                localStorage.setItem("access_token", response.access_token);
                localStorage.removeItem("is_owner");
                // Redirect to tenant dashboard
                const dashboardUrl = tenant.institution_type === "pesantren" ? "/pesantren" : "/sekolah";
                window.location.href = `https://${tenant.subdomain}.eduvera.ve-lora.my.id${dashboardUrl}`;
            }
        } catch (error) {
            console.error("Failed to impersonate", error);
            alert("Gagal masuk sebagai tenant");
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Tenant not found or ID missing</p>
                <Link href="/owner/tenants">
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tenants
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/owner/tenants">
                    <Button variant="ghost" size="sm" className="text-slate-400">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>
                <h2 className="text-2xl font-bold text-white">{tenant.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Institution Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">Type</p>
                                <p className="text-white capitalize">{tenant.institution_type}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Subscription</p>
                                <p className="text-white capitalize">{tenant.subscription_tier || "Basic"}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Subdomain</p>
                                <a
                                    href={`https://${tenant.subdomain}.eduvera.ve-lora.my.id`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    {tenant.subdomain}.eduvera.ve-lora.my.id
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Registered</p>
                                <p className="text-white">{formatDate(tenant.created_at)}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-slate-400 text-sm">Address</p>
                                <p className="text-white">{tenant.address || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Admin Info */}
                    {tenant.admin && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Admin Contact</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-slate-400 text-sm">Name</p>
                                    <p className="text-white">{tenant.admin.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">Email</p>
                                    <p className="text-white">{tenant.admin.email}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-sm">WhatsApp</p>
                                    <p className="text-white">{tenant.admin.whatsapp || "-"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bank Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Bank Account</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">Bank</p>
                                <p className="text-white">{tenant.bank_name || "-"}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Account Number</p>
                                <p className="text-white">{tenant.bank_account_number || "-"}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-slate-400 text-sm">Account Holder</p>
                                <p className="text-white">{tenant.bank_account_holder || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${tenant.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : tenant.status === "suspended"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}>
                            {tenant.status === "active" ? "Active" : tenant.status === "suspended" ? "Suspended" : "Pending"}
                        </div>

                        <div className="mt-4 space-y-2">
                            {tenant.status === "active" ? (
                                <Button
                                    variant="outline"
                                    className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                                    onClick={() => handleStatusChange("suspended")}
                                >
                                    <Ban className="w-4 h-4 mr-2" /> Suspend Tenant
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                                    onClick={() => handleStatusChange("active")}
                                >
                                    <Play className="w-4 h-4 mr-2" /> Activate Tenant
                                </Button>
                            )}

                            {tenant.status === "active" && (
                                <Button
                                    variant="outline"
                                    className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                                    onClick={handleImpersonate}
                                >
                                    <UserCog className="w-4 h-4 mr-2" /> Masuk sebagai Tenant
                                </Button>
                            )}
                        </div>
                    </div>

                    {tenant.trial_ends_at && (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Trial Period</h3>
                            <p className="text-slate-400 text-sm">Ends on</p>
                            <p className="text-white">{formatDate(tenant.trial_ends_at)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TenantDetailPage() {
    return (
        <Suspense fallback={<div className="text-center py-12 text-slate-400">Loading...</div>}>
            <TenantDetailContent />
        </Suspense>
    );
}
