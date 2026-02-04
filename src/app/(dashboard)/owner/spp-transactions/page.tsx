"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Receipt, TrendingUp, Clock, Users, Eye, XCircle } from "lucide-react";
import { ownerApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Modal from "@/components/ui/Modal";

interface Transaction {
    id: string;
    tenant_name: string;
    student_name: string;
    amount: number;
    status: string;
    month: string;
    created_at: string;
}

interface DateRange {
    from: Date | null;
    to: Date | null;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
    {
        key: "search",
        label: "Cari",
        type: "search",
        placeholder: "Cari tenant atau siswa...",
    },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "success", label: "Success" },
            { value: "pending", label: "Pending" },
            { value: "failed", label: "Failed" },
        ],
    },
    {
        key: "month",
        label: "Bulan SPP",
        type: "select",
        options: [
            { value: "januari", label: "Januari" },
            { value: "februari", label: "Februari" },
            { value: "maret", label: "Maret" },
            { value: "april", label: "April" },
            { value: "mei", label: "Mei" },
            { value: "juni", label: "Juni" },
        ],
    },
];

const initialFilters = {
    search: "",
    status: "all",
    month: "all",
};

export default function SPPTransactionsPage() {
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const res = await ownerApi.getTransactions();
            const data = (res as any)?.data || res;
            setTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load transactions", error);
            setTransactions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterReset = () => {
        setFilters(initialFilters);
        setDateRange({ from: null, to: null });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount || 0);
    };

    // GUARD: Ensure transactions is always array
    const safeTransactions = Array.isArray(transactions) ? transactions : [];

    // Apply filters
    const filteredTransactions = safeTransactions.filter((t) => {
        const searchMatch =
            filters.search === "" ||
            t.tenant_name?.toLowerCase().includes((filters.search as string).toLowerCase()) ||
            t.student_name?.toLowerCase().includes((filters.search as string).toLowerCase());
        const statusMatch = filters.status === "all" || t.status === filters.status;
        const monthMatch = filters.month === "all" || t.month?.toLowerCase() === filters.month;

        let dateMatch = true;
        if (dateRange.from && dateRange.to) {
            const txDate = new Date(t.created_at);
            dateMatch = txDate >= dateRange.from && txDate <= dateRange.to;
        }

        return searchMatch && statusMatch && monthMatch && dateMatch;
    });

    const totalVolume = safeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const pendingCount = safeTransactions.filter(t => t.status === 'pending').length;
    const uniqueTenants = new Set(safeTransactions.map(t => t.tenant_name)).size;

    const handleViewDetail = (tx: Transaction) => {
        setSelectedTransaction(tx);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">SPP Transactions</h2>
                    <p className="text-slate-400">Monitor all SPP payments from parents</p>
                </div>

                {/* Filter Panel with DateRangePicker */}
                <FilterPanel
                    filters={filterConfig}
                    values={filters}
                    onChange={handleFilterChange}
                    onReset={handleFilterReset}
                >
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        placeholder="Filter tanggal"
                    />
                </FilterPanel>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Receipt className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Transactions</div>
                                <div className="text-xl font-bold text-white">{safeTransactions.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Volume</div>
                                <div className="text-xl font-bold text-white">{formatCurrency(totalVolume)}</div>
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
                                <div className="text-xl font-bold text-white">{pendingCount}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Tenants</div>
                                <div className="text-xl font-bold text-white">{uniqueTenants}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-400 text-sm">
                        ℹ️ SPP Transaction tracking menampilkan data agregat dari semua pembayaran SPP tenant.
                        Data ini akan terisi setelah modul pembayaran SPP di dashboard tenant aktif.
                    </p>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Tenant</th>
                                    <th className="px-6 py-4 font-medium">Student</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : filteredTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTransactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{tx.tenant_name}</td>
                                            <td className="px-6 py-4 text-slate-300">{tx.student_name}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-medium">
                                                {formatCurrency(tx.amount)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {tx.status === 'success' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 size={12} /> Success
                                                    </span>
                                                ) : tx.status === 'failed' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                        <XCircle size={12} /> Failed
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <Clock size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">
                                                {new Date(tx.created_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleViewDetail(tx)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Transaction Details"
                size="md"
            >
                {selectedTransaction && (
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                            <div className="text-emerald-400 text-sm mb-1">Amount</div>
                            <div className="text-white font-bold text-2xl">{formatCurrency(selectedTransaction.amount)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm">Tenant</div>
                                <div className="text-white font-medium">{selectedTransaction.tenant_name}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Student</div>
                                <div className="text-white font-medium">{selectedTransaction.student_name}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Status</div>
                                {selectedTransaction.status === 'success' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                        <CheckCircle2 size={12} /> Success
                                    </span>
                                ) : selectedTransaction.status === 'failed' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                        <XCircle size={12} /> Failed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                        <Clock size={12} /> Pending
                                    </span>
                                )}
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Date</div>
                                <div className="text-white font-medium">
                                    {new Date(selectedTransaction.created_at).toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-lg p-4">
                            <div className="text-slate-400 text-sm mb-1">Transaction ID</div>
                            <div className="text-white font-mono text-sm">{selectedTransaction.id}</div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
