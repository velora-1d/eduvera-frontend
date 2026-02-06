"use client";

import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api";
import {
    Building2,
    Users,
    CreditCard,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Stats {
    total_tenants: number;
    active_tenants: number;
    pending_tenants: number;
    suspended_tenants: number;
    total_revenue: number;
    pending_disbursements: number;
}

interface Registration {
    id: string;
    institution_name: string;
    subdomain: string;
    institution_type: string;
    status: string;
    created_at: string;
}

export default function OwnerDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, regsRes] = await Promise.all([
                ownerApi.getDashboardStats(),
                ownerApi.getRegistrations(),
            ]);
            setStats(statsRes);
            setRegistrations(regsRes?.registrations || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Tenants</p>
                            <p className="text-2xl font-bold text-white">{stats?.total_tenants || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Active Tenants</p>
                            <p className="text-2xl font-bold text-white">{stats?.active_tenants || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <Clock className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Pending</p>
                            <p className="text-2xl font-bold text-white">{stats?.pending_tenants || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Revenue</p>
                            <p className="text-xl font-bold text-white">{formatCurrency(stats?.total_revenue || 0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Recent Registrations</h3>
                    <Link href="/owner/registrations" className="text-emerald-400 hover:text-emerald-300 text-sm">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Institution</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Type</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Subdomain</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No registrations yet
                                    </td>
                                </tr>
                            ) : (
                                registrations.slice(0, 5).map((reg) => (
                                    <tr key={reg.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white font-medium">{reg.institution_name}</td>
                                        <td className="px-6 py-4 text-slate-300 capitalize">{reg.institution_type}</td>
                                        <td className="px-6 py-4 text-slate-400">{reg.subdomain}.eduvera.id</td>
                                        <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                                        <td className="px-6 py-4 text-slate-400">{formatDate(reg.created_at)}</td>
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
