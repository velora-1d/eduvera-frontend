"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    Building2,
    ExternalLink,
    Search,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { ownerApi } from "@/lib/api";

export default function OwnerDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [tenants, setTenants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Load data independently so one failure doesn't block others
        try {
            const tenantsRes = await ownerApi.getTenants();
            setTenants((tenantsRes as any).data || tenantsRes || []);
        } catch (error) {
            console.error("Failed to load tenants", error);
        }

        try {
            const statsRes = await ownerApi.getDashboardStats();
            setStats(statsRes);
        } catch (error) {
            console.error("Failed to load stats", error);
            // Set default stats if API fails
            setStats({ total_tenants: 0, active_tenants: 0, total_revenue: 0 });
        }

        setIsLoading(false);
    };

    const filteredTenants = tenants.filter(
        (t) =>
            t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                    <div className="text-slate-400 text-sm">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                <Building2 size={24} />
                            </div>
                            <span className="text-slate-400 text-sm">Total Tenants</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {stats?.total_tenants || 0}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="text-slate-400 text-sm">Active Tenants</span>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {stats?.active_tenants || 0}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                                <CreditCard size={24} />
                            </div>
                            <span className="text-slate-400 text-sm">Est. Revenue</span>
                        </div>
                        <div className="text-3xl font-bold text-emerald-400">
                            {formatCurrency(stats?.total_revenue || 0)}
                        </div>
                    </motion.div>
                </div>

                {/* Tenants Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-white">Recent Registrations</h3>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search tenant..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-red-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Institution</th>
                                    <th className="px-6 py-4 font-medium">Plan</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            Loading data...
                                        </td>
                                    </tr>
                                ) : filteredTenants.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No tenants found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTenants.map((tenant) => (
                                        <tr
                                            key={tenant.id}
                                            className="hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{tenant.name}</div>
                                                <div className="text-slate-500 text-xs">
                                                    {tenant.subdomain}.eduvera.id
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${tenant.institution_type === "hybrid"
                                                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                                        }`}
                                                >
                                                    {tenant.institution_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {tenant.status === "active" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 size={12} /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(tenant.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={`https://${tenant.subdomain}.eduvera.id/login`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
