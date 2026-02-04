"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, ArrowDownCircle, Banknote, Eye, AlertTriangle } from "lucide-react";
import { ownerApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";

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
        placeholder: "Cari tenant...",
    },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "rejected", label: "Rejected" },
        ],
    },
    {
        key: "bank",
        label: "Bank",
        type: "select",
        options: [
            { value: "bca", label: "BCA" },
            { value: "mandiri", label: "Mandiri" },
            { value: "bni", label: "BNI" },
            { value: "bri", label: "BRI" },
        ],
    },
];

const initialFilters = {
    search: "",
    status: "all",
    bank: "all",
};

export default function DisbursementsPage() {
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
    const [disbursements, setDisbursements] = useState<Disbursement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal states
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedDisbursement, setSelectedDisbursement] = useState<Disbursement | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

    useEffect(() => {
        loadDisbursements();
    }, []);

    const loadDisbursements = async () => {
        setIsLoading(true);
        try {
            const res = await ownerApi.getDisbursements();
            const data = (res as any)?.data || res;
            setDisbursements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load disbursements", error);
            setDisbursements([]);
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

    // GUARD: Ensure disbursements is always array
    const safeDisbursements = Array.isArray(disbursements) ? disbursements : [];

    // Apply filters
    const filteredDisbursements = safeDisbursements.filter((d) => {
        const searchMatch =
            filters.search === "" ||
            d.tenant_name.toLowerCase().includes((filters.search as string).toLowerCase());
        const statusMatch = filters.status === "all" || d.status === filters.status;
        const bankMatch = filters.bank === "all" || d.bank_name.toLowerCase().includes(filters.bank as string);

        let dateMatch = true;
        if (dateRange.from && dateRange.to) {
            const reqDate = new Date(d.requested_at);
            dateMatch = reqDate >= dateRange.from && reqDate <= dateRange.to;
        }

        return searchMatch && statusMatch && bankMatch && dateMatch;
    });

    const handleViewDetail = (d: Disbursement) => {
        setSelectedDisbursement(d);
        setIsDetailModalOpen(true);
    };

    const openConfirmModal = (d: Disbursement, action: 'approve' | 'reject') => {
        setSelectedDisbursement(d);
        setActionType(action);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedDisbursement) return;
        try {
            if (actionType === 'approve') {
                await ownerApi.approveDisbursement(selectedDisbursement.id);
            } else {
                await ownerApi.rejectDisbursement(selectedDisbursement.id);
            }
            setIsConfirmModalOpen(false);
            loadDisbursements();
        } catch (error) {
            console.error(`Failed to ${actionType}`, error);
            showToast(`Failed to ${actionType} disbursement`, "error");
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount || 0);
    };

    const pendingCount = safeDisbursements.filter(d => d.status === 'pending').length;
    const completedCount = safeDisbursements.filter(d => d.status === 'completed').length;
    const totalAmount = safeDisbursements.reduce((sum, d) => sum + (d.amount || 0), 0);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Disbursement Requests</h2>
                    <p className="text-slate-400">Manage withdrawal requests from tenants</p>
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
                                <ArrowDownCircle className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Requests</div>
                                <div className="text-xl font-bold text-white">{safeDisbursements.length}</div>
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
                                <div className="text-xl font-bold text-amber-500">{pendingCount}</div>
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
                                <div className="text-xl font-bold text-emerald-500">{completedCount}</div>
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
                                <div className="text-xl font-bold text-white">{formatCurrency(totalAmount)}</div>
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
                                ) : filteredDisbursements.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            No disbursement requests found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDisbursements.map((d) => (
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
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(d)}
                                                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4 text-slate-400" />
                                                    </button>
                                                    {d.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => openConfirmModal(d, 'approve')}
                                                                className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => openConfirmModal(d, 'reject')}
                                                                className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
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

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Disbursement Details"
                size="md"
            >
                {selectedDisbursement && (
                    <div className="space-y-4">
                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="text-slate-400 text-sm mb-1">Tenant</div>
                            <div className="text-white font-semibold text-lg">{selectedDisbursement.tenant_name}</div>
                        </div>

                        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                            <div className="text-emerald-400 text-sm mb-1">Amount</div>
                            <div className="text-white font-bold text-2xl">{formatCurrency(selectedDisbursement.amount)}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm">Bank</div>
                                <div className="text-white font-medium">{selectedDisbursement.bank_name}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Account Number</div>
                                <div className="text-white font-medium">{selectedDisbursement.account_number}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Account Holder</div>
                                <div className="text-white font-medium">{selectedDisbursement.account_holder}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Requested At</div>
                                <div className="text-white font-medium">
                                    {new Date(selectedDisbursement.requested_at).toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>

                        {selectedDisbursement.status === 'pending' && (
                            <div className="flex gap-3 pt-4 border-t border-slate-700">
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        openConfirmModal(selectedDisbursement, 'approve');
                                    }}
                                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        openConfirmModal(selectedDisbursement, 'reject');
                                    }}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Confirm Modal */}
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title={actionType === 'approve' ? 'Approve Disbursement' : 'Reject Disbursement'}
                size="sm"
                footer={
                    <>
                        <button
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmAction}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${actionType === 'approve'
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                        >
                            Confirm {actionType === 'approve' ? 'Approve' : 'Reject'}
                        </button>
                    </>
                }
            >
                {selectedDisbursement && (
                    <div className="space-y-4">
                        <div className={`flex items-center gap-3 p-4 rounded-xl ${actionType === 'approve'
                            ? 'bg-emerald-500/10 border border-emerald-500/30'
                            : 'bg-red-500/10 border border-red-500/30'
                            }`}>
                            <AlertTriangle className={`w-6 h-6 ${actionType === 'approve' ? 'text-emerald-400' : 'text-red-400'}`} />
                            <div className="text-white">
                                Are you sure you want to <strong>{actionType}</strong> this disbursement?
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Tenant:</span>
                                <span className="text-white font-medium">{selectedDisbursement.tenant_name}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-slate-400">Amount:</span>
                                <span className="text-emerald-400 font-bold">{formatCurrency(selectedDisbursement.amount)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
