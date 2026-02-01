"use client";

import { useState, useEffect } from "react";
import {
    Search,
    CheckCircle2,
    Clock,
    ExternalLink,
    XCircle,
    Play,
    Ban,
} from "lucide-react";
import { ownerApi } from "@/lib/api";

export default function TenantsPage() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        try {
            const res = await ownerApi.getTenants();
            setTenants((res as any).data || res || []);
        } catch (error) {
            console.error("Failed to load tenants", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(id);
        try {
            await ownerApi.updateTenantStatus(id, newStatus);
            await loadTenants();
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(null);
        }
    };

    const filteredTenants = tenants.filter((t) => {
        const matchesSearch = t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.subdomain?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Tenant Management</h2>
                    <p className="text-slate-400">Manage all registered institutions</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by name or subdomain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Total Tenants</div>
                        <div className="text-2xl font-bold text-white mt-1">{tenants.length}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Active</div>
                        <div className="text-2xl font-bold text-emerald-500 mt-1">
                            {tenants.filter(t => t.status === 'active').length}
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Pending</div>
                        <div className="text-2xl font-bold text-amber-500 mt-1">
                            {tenants.filter(t => t.status === 'pending').length}
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Suspended</div>
                        <div className="text-2xl font-bold text-red-500 mt-1">
                            {tenants.filter(t => t.status === 'suspended').length}
                        </div>
                    </div>
                </div>

                {/* Tenants Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Institution</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            Loading tenants...
                                        </td>
                                    </tr>
                                ) : filteredTenants.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No tenants found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTenants.map((tenant) => (
                                        <tr key={tenant.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{tenant.name}</div>
                                                <div className="text-slate-500 text-xs">
                                                    {tenant.subdomain}.eduvera.id
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${tenant.institution_type === 'hybrid'
                                                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                        : tenant.institution_type === 'pesantren'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {tenant.institution_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {tenant.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 size={12} /> Active
                                                    </span>
                                                ) : tenant.status === 'suspended' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                        <XCircle size={12} /> Suspended
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(tenant.created_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={`https://${tenant.subdomain}.eduvera.id`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Visit site"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    {tenant.status !== 'active' && (
                                                        <button
                                                            onClick={() => updateStatus(tenant.id, 'active')}
                                                            disabled={updating === tenant.id}
                                                            className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Activate"
                                                        >
                                                            <Play size={16} />
                                                        </button>
                                                    )}
                                                    {tenant.status === 'active' && (
                                                        <button
                                                            onClick={() => updateStatus(tenant.id, 'suspended')}
                                                            disabled={updating === tenant.id}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Suspend"
                                                        >
                                                            <Ban size={16} />
                                                        </button>
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
        </div>
    );
}
