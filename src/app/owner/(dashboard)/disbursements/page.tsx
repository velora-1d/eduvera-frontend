"use client";

import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api";
import { Banknote, CheckCircle, Clock, XCircle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Disbursement {
    id: string;
    tenant_name: string;
    amount: number;
    bank_name: string;
    account_number: string;
    account_holder: string;
    status: string;
    created_at: string;
}

export default function DisbursementsPage() {
    const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchDisbursements();
    }, []);

    const fetchDisbursements = async () => {
        try {
            const response = await ownerApi.getDisbursements();
            setDisbursements(response?.disbursements || []);
        } catch (error) {
            console.error("Failed to fetch disbursements", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await ownerApi.approveDisbursement(id);
            fetchDisbursements();
        } catch (error) {
            console.error("Failed to approve", error);
        }
    };

    const handleReject = async (id: string) => {
        const note = prompt("Alasan penolakan:");
        if (note === null) return;
        try {
            await ownerApi.rejectDisbursement(id, note);
            fetchDisbursements();
        } catch (error) {
            console.error("Failed to reject", error);
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
            case "approved":
            case "completed":
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

    const filteredDisbursements = disbursements.filter((d) => {
        if (filter === "all") return true;
        return d.status === filter;
    });

    const pendingTotal = disbursements
        .filter((d) => d.status === "pending")
        .reduce((sum, d) => sum + d.amount, 0);

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
                    <h2 className="text-2xl font-bold text-white">Disbursements</h2>
                    {pendingTotal > 0 && (
                        <p className="text-amber-400 text-sm mt-1">
                            {formatCurrency(pendingTotal)} pending approval
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400">{disbursements.length} total</span>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
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

            {/* Disbursements Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Tenant</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Amount</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Bank Account</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Date</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDisbursements.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No disbursements found
                                    </td>
                                </tr>
                            ) : (
                                filteredDisbursements.map((d) => (
                                    <tr key={d.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white font-medium">{d.tenant_name}</td>
                                        <td className="px-6 py-4 text-emerald-400 font-medium">{formatCurrency(d.amount)}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white">{d.bank_name} - {d.account_number}</p>
                                                <p className="text-slate-500 text-sm">{d.account_holder}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                                        <td className="px-6 py-4 text-slate-400">{formatDate(d.created_at)}</td>
                                        <td className="px-6 py-4">
                                            {d.status === "pending" && (
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700"
                                                        onClick={() => handleApprove(d.id)}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                                                        onClick={() => handleReject(d.id)}
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
