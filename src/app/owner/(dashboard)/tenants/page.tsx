"use client";

import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api";
import Link from "next/link";
import {
    Search,
    Building2,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Eye,
    Ban,
    Play,
    Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    institution_type: string;
    status: string;
    subscription_tier: string;
    created_at: string;
    admin_email?: string;
}

export default function TenantsPage() {
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            const response = await ownerApi.getTenants();
            setTenants(response?.tenants || []);
        } catch (error) {
            console.error("Failed to fetch tenants", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (tenantId: string, newStatus: string) => {
        try {
            await ownerApi.updateTenantStatus(tenantId, newStatus);
            fetchTenants();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Active
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case "suspended":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        <XCircle className="w-3 h-3" /> Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-400">
                        <AlertCircle className="w-3 h-3" /> {status}
                    </span>
                );
        }
    };

    const filteredTenants = tenants.filter((tenant) => {
        const matchesSearch =
            tenant.name.toLowerCase().includes(search.toLowerCase()) ||
            tenant.subdomain.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Tenant Management</h2>
                <div className="flex items-center gap-2 text-slate-400">
                    <Building2 className="w-5 h-5" />
                    <span>{tenants.length} total</span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                        placeholder="Search by name or subdomain..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                </select>
            </div>

            {/* Tenants Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Institution</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Type</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Subdomain</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Tier</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Registered</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTenants.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                        No tenants found
                                    </td>
                                </tr>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <tr key={tenant.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{tenant.name}</p>
                                                {tenant.admin_email && (
                                                    <p className="text-slate-500 text-sm">{tenant.admin_email}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 capitalize">{tenant.institution_type}</td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`https://${tenant.subdomain}.eduvera.ve-lora.my.id`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-400 hover:underline"
                                            >
                                                {tenant.subdomain}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 capitalize">{tenant.subscription_tier || "basic"}</td>
                                        <td className="px-6 py-4">{getStatusBadge(tenant.status)}</td>
                                        <td className="px-6 py-4 text-slate-400">{formatDate(tenant.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link href={`/owner/tenants/${tenant.id}`}>
                                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                {tenant.status === "active" ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => handleStatusChange(tenant.id, "suspended")}
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-emerald-400 hover:text-emerald-300"
                                                        onClick={() => handleStatusChange(tenant.id, "active")}
                                                    >
                                                        <Play className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
