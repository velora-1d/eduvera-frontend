"use client";

import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api";
import {
    UserPlus,
    CheckCircle,
    Clock,
    XCircle,
    Check,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Registration {
    id: string;
    institution_name: string;
    subdomain: string;
    institution_type: string;
    status: string;
    admin_name: string;
    admin_email: string;
    admin_whatsapp: string;
    created_at: string;
}

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await ownerApi.getRegistrations();
            setRegistrations(response?.registrations || []);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await ownerApi.updateTenantStatus(id, "active");
            fetchRegistrations();
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await ownerApi.updateTenantStatus(id, "rejected");
            fetchRegistrations();
        } catch (error) {
            console.error("Failed to reject", error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Approved
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-400">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredRegistrations = registrations.filter((reg) => {
        if (filter === "all") return true;
        return reg.status === filter;
    });

    const pendingCount = registrations.filter((r) => r.status === "pending").length;

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
                <div>
                    <h2 className="text-2xl font-bold text-white">Registrations</h2>
                    {pendingCount > 0 && (
                        <p className="text-amber-400 text-sm mt-1">
                            {pendingCount} pending approval
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400">{registrations.length} total</span>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {["all", "pending", "active", "rejected"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${filter === status
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                : "bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600"
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Registrations Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Institution</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Admin</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Type</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Date</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No registrations found
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{reg.institution_name}</p>
                                                <p className="text-slate-500 text-sm">{reg.subdomain}.eduvera.id</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white">{reg.admin_name}</p>
                                                <p className="text-slate-500 text-sm">{reg.admin_email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300 capitalize">{reg.institution_type}</td>
                                        <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                                        <td className="px-6 py-4 text-slate-400">{formatDate(reg.created_at)}</td>
                                        <td className="px-6 py-4">
                                            {reg.status === "pending" && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700"
                                                        onClick={() => handleApprove(reg.id)}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                        onClick={() => handleReject(reg.id)}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
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
