"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, ArrowDownCircle, Banknote } from "lucide-react";
import { ownerApi } from "@/lib/api";

interface Disbursement {
    id: string;
    tenant_name: string;
    amount: number;
    bank_name: string;
    account_number: string;
    account_holder: string;
    status: string;
    requested_at: string;
}

export default function DisbursementsPage() {
    const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDisbursements();
    }, []);

    const loadDisbursements = async () => {
        setIsLoading(true);
        try {
            const res = await ownerApi.getDisbursements();
            setDisbursements((res as any).data || res || []);
        } catch (error) {
            console.error("Failed to load disbursements", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm("Are you sure you want to approve this disbursement?")) return;
        try {
            await ownerApi.approveDisbursement(id);
            loadDisbursements();
        } catch (error) {
            console.error("Failed to approve", error);
            alert("Failed to approve disbursement");
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this disbursement?")) return;
        try {
            await ownerApi.rejectDisbursement(id);
            loadDisbursements();
        } catch (error) {
            console.error("Failed to reject", error);
            alert("Failed to reject disbursement");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount || 0);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Disbursement Requests</h2>
                    <p className="text-slate-400">Manage withdrawal requests from tenants</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <ArrowDownCircle className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Requests</div>
                                <div className="text-xl font-bold text-white">{disbursements.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Pending</div>
                                <div className="text-xl font-bold text-amber-500">
                                    {disbursements.filter(d => d.status === 'pending').length}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Completed</div>
                                <div className="text-xl font-bold text-emerald-500">
                                    {disbursements.filter(d => d.status === 'completed').length}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Banknote className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Amount</div>
                                <div className="text-xl font-bold text-white">
                                    {formatCurrency(disbursements.reduce((sum, d) => sum + (d.amount || 0), 0))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Tenant</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Bank Account</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Requested</th>
                                    <th className="px-6 py-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : disbursements.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No disbursement requests yet
                                        </td>
                                    </tr>
                                ) : (
                                    disbursements.map((d) => (
                                        <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{d.tenant_name}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-medium">
                                                {formatCurrency(d.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white">{d.bank_name} - {d.account_number}</div>
                                                <div className="text-slate-500 text-xs">{d.account_holder}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {d.status === 'completed' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 size={12} /> Completed
                                                    </span>
                                                ) : d.status === 'rejected' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                        <XCircle size={12} /> Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(d.requested_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                {d.status === 'pending' && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleApprove(d.id)}
                                                            className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(d.id)}
                                                            className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
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
        </div>
    );
}
