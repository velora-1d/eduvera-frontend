"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle2, Clock } from "lucide-react";
import { ownerApi } from "@/lib/api";

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadRegistrations();
    }, []);

    const loadRegistrations = async () => {
        try {
            const res = await ownerApi.getRegistrations();
            setRegistrations((res as any).data || res || []);
        } catch (error) {
            console.error("Failed to load registrations", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredRegistrations = registrations.filter((r) =>
        r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.subdomain?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Registration Logs</h2>
                    <p className="text-slate-400">Track all registration requests</p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search registrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Total Registrations</div>
                        <div className="text-2xl font-bold text-white mt-1">{registrations.length}</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Confirmed</div>
                        <div className="text-2xl font-bold text-emerald-500 mt-1">
                            {registrations.filter(r => r.status === 'active').length}
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="text-slate-400 text-sm">Pending Payment</div>
                        <div className="text-2xl font-bold text-amber-500 mt-1">
                            {registrations.filter(r => r.status === 'pending').length}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Institution</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Registered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No registrations found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{reg.name}</div>
                                                <div className="text-slate-500 text-xs">{reg.subdomain}</div>
                                            </td>
                                            <td className="px-6 py-4 capitalize">
                                                <span className="text-slate-300">{reg.institution_type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 size={12} /> Confirmed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(reg.created_at).toLocaleString('id-ID')}
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
