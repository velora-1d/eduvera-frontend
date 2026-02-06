"use client";

import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api";
import { CreditCard, Search, CheckCircle, Clock, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Transaction {
    id: string;
    tenant_name: string;
    student_name: string;
    amount: number;
    type: string;
    status: string;
    created_at: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await ownerApi.getTransactions();
            setTransactions(response?.transactions || []);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
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
            case "paid":
            case "success":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        <XCircle className="w-3 h-3" /> Failed
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

    const filteredTransactions = transactions.filter(
        (t) =>
            t.tenant_name?.toLowerCase().includes(search.toLowerCase()) ||
            t.student_name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = transactions
        .filter((t) => t.status === "paid" || t.status === "success")
        .reduce((sum, t) => sum + t.amount, 0);

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
                <h2 className="text-2xl font-bold text-white">Transactions</h2>
                <div className="text-right">
                    <p className="text-slate-400 text-sm">Total Revenue</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                    placeholder="Search by tenant or student..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700"
                />
            </div>

            {/* Transactions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Tenant</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Student</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Type</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Amount</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white">{tx.tenant_name}</td>
                                        <td className="px-6 py-4 text-slate-300">{tx.student_name}</td>
                                        <td className="px-6 py-4 text-slate-300 capitalize">{tx.type}</td>
                                        <td className="px-6 py-4 text-white font-medium">{formatCurrency(tx.amount)}</td>
                                        <td className="px-6 py-4">{getStatusBadge(tx.status)}</td>
                                        <td className="px-6 py-4 text-slate-400">{formatDate(tx.created_at)}</td>
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
