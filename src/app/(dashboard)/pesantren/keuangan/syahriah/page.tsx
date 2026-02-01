"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle2, Clock, AlertTriangle, Wallet, Loader2, Receipt, Crown, Banknote } from "lucide-react";
import { pesantrenApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import Modal from "@/components/ui/Modal";

declare global {
    interface Window {
        snap: {
            pay: (token: string, options: {
                onSuccess: (result: any) => void;
                onPending: (result: any) => void;
                onError: (result: any) => void;
                onClose: () => void;
            }) => void;
        };
    }
}

interface SyahriahBill {
    id: string;
    santri_id: string;
    santri_name: string;
    amount: number;
    period: string;
    due_date: string;
    status: string;
    paid_at?: string;
    proof_url?: string;
}

interface SyahriahStats {
    total_bills: number;
    paid_count: number;
    pending_count: number;
    overdue_count: number;
    total_paid: number;
    total_pending: number;
}

const filterConfig: FilterConfig[] = [
    { key: "search", label: "Cari", type: "search", placeholder: "Cari nama santri..." },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "pending", label: "Belum Bayar" },
            { value: "paid", label: "Lunas" },
            { value: "overdue", label: "Terlambat" },
        ],
    },
    {
        key: "period",
        label: "Bulan",
        type: "select",
        options: [
            { value: "2024-01", label: "Muharram 1445" },
            { value: "2024-02", label: "Safar 1445" },
            { value: "2024-03", label: "Rabiul Awal 1445" },
            { value: "2024-04", label: "Rabiul Akhir 1445" },
            { value: "2024-05", label: "Jumadil Awal 1445" },
            { value: "2024-06", label: "Jumadil Akhir 1445" },
        ],
    },
];

const initialFilters = { search: "", status: "all", period: "all" };

export default function SyahriahPaymentPage() {
    const [bills, setBills] = useState<SyahriahBill[]>([]);
    const [stats, setStats] = useState<SyahriahStats | null>(null);
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState<string | null>(null);
    const [isPremium, setIsPremium] = useState(false);

    // Modals
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [isManualPayModalOpen, setIsManualPayModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState<SyahriahBill | null>(null);

    // Manual payment form
    const [manualPayment, setManualPayment] = useState({
        payment_method: "cash",
        amount: 0,
        note: "",
        proof_url: "",
    });

    useEffect(() => {
        loadData();
        checkTier();
    }, []);

    const checkTier = async () => {
        try {
            const profile = await pesantrenApi.getProfil();
            setIsPremium(profile?.tenant?.subscription_tier === "premium");

            if (profile?.tenant?.subscription_tier === "premium") {
                loadMidtransScript();
            }
        } catch (error) {
            console.error("Failed to check tier", error);
            setIsPremium(false);
        }
    };

    const loadMidtransScript = () => {
        if (document.querySelector('script[src*="midtrans"]')) return;

        const script = document.createElement("script");
        script.src = process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
        document.head.appendChild(script);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [billsRes, statsRes] = await Promise.all([
                pesantrenApi.getSPPList(),
                pesantrenApi.getSPPStats(),
            ]);
            // Map SPP to Syahriah naming
            const mappedBills = ((billsRes as any).data || billsRes || []).map((b: any) => ({
                ...b,
                santri_id: b.student_id || b.santri_id,
                santri_name: b.student_name || b.santri_name,
            }));
            setBills(mappedBills);
            setStats((statsRes as any).data || statsRes);
        } catch (error) {
            console.error("Failed to load Syahriah data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterReset = () => setFilters(initialFilters);

    const filteredBills = bills.filter((b) => {
        const searchMatch = filters.search === "" || b.santri_name.toLowerCase().includes((filters.search as string).toLowerCase());
        const statusMatch = filters.status === "all" || b.status === filters.status;
        const periodMatch = filters.period === "all" || b.period === filters.period;
        return searchMatch && statusMatch && periodMatch;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
    };

    const handlePayClick = (bill: SyahriahBill) => {
        setSelectedBill(bill);
        setIsPayModalOpen(true);
    };

    const handlePayWithMidtrans = async () => {
        if (!selectedBill) return;

        if (!isPremium) {
            setIsPayModalOpen(false);
            setIsUpgradeModalOpen(true);
            return;
        }

        setPayingId(selectedBill.id);

        try {
            const response = await pesantrenApi.createSyahriahPayment({
                spp_id: selectedBill.id,
                amount: selectedBill.amount,
                santri_name: selectedBill.santri_name,
            });

            if (response.snap_token && window.snap) {
                window.snap.pay(response.snap_token, {
                    onSuccess: () => {
                        setIsPayModalOpen(false);
                        loadData();
                    },
                    onPending: () => {
                        setIsPayModalOpen(false);
                    },
                    onError: () => {
                        alert("Pembayaran gagal. Silakan coba lagi.");
                    },
                    onClose: () => { },
                });
            }
        } catch (error: any) {
            console.error("Failed to initiate payment", error);
            if (error?.response?.status === 403) {
                setIsPayModalOpen(false);
                setIsUpgradeModalOpen(true);
            } else {
                alert("Gagal memulai pembayaran. " + (error?.userMessage || ""));
            }
        } finally {
            setPayingId(null);
        }
    };

    const handleManualPayClick = (bill: SyahriahBill) => {
        setSelectedBill(bill);
        setManualPayment({
            payment_method: "cash",
            amount: bill.amount,
            note: "",
            proof_url: "",
        });
        setIsManualPayModalOpen(true);
    };

    const handleManualPaymentSubmit = async () => {
        if (!selectedBill) return;
        setPayingId(selectedBill.id);

        try {
            await pesantrenApi.recordPayment(selectedBill.id, {
                method: manualPayment.payment_method,
                amount: manualPayment.amount,
                note: manualPayment.note,
                proof_url: manualPayment.proof_url,
            });

            alert("Pembayaran berhasil dicatat!");
            setIsManualPayModalOpen(false);
            loadData();
        } catch (error: any) {
            console.error("Failed to record payment", error);
            alert("Gagal mencatat pembayaran. " + (error?.userMessage || ""));
        } finally {
            setPayingId(null);
        }
    };

    const handleViewDetail = (bill: SyahriahBill) => {
        setSelectedBill(bill);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Pembayaran Syahriah</h2>
                        <p className="text-slate-400">Kelola tagihan dan pembayaran bulanan santri</p>
                    </div>
                    {isPremium && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium">
                            <Crown size={14} /> Premium
                        </span>
                    )}
                </div>

                {/* Filter */}
                <FilterPanel
                    filters={filterConfig}
                    values={filters}
                    onChange={handleFilterChange}
                    onReset={handleFilterReset}
                />

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Receipt className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Tagihan</div>
                                <div className="text-xl font-bold text-white">{stats?.total_bills || 0}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Lunas</div>
                                <div className="text-xl font-bold text-emerald-500">{formatCurrency(stats?.total_paid || 0)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Belum Bayar</div>
                                <div className="text-xl font-bold text-amber-500">{formatCurrency(stats?.total_pending || 0)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Terlambat</div>
                                <div className="text-xl font-bold text-red-500">{stats?.overdue_count || 0}</div>
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
                                    <th className="px-6 py-4 font-medium">Santri</th>
                                    <th className="px-6 py-4 font-medium">Periode</th>
                                    <th className="px-6 py-4 font-medium">Tagihan</th>
                                    <th className="px-6 py-4 font-medium">Jatuh Tempo</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : filteredBills.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Tidak ada tagihan ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBills.map((bill) => (
                                        <tr key={bill.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{bill.santri_name}</td>
                                            <td className="px-6 py-4 text-slate-300">{bill.period}</td>
                                            <td className="px-6 py-4 text-emerald-400 font-medium">{formatCurrency(bill.amount)}</td>
                                            <td className="px-6 py-4 text-slate-400">{bill.due_date}</td>
                                            <td className="px-6 py-4">
                                                {bill.status === "paid" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <CheckCircle2 size={12} /> Lunas
                                                    </span>
                                                ) : bill.status === "overdue" ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                        <AlertTriangle size={12} /> Terlambat
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                        <Clock size={12} /> Belum Bayar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetail(bill)}
                                                        className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        Detail
                                                    </button>
                                                    {bill.status !== "paid" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleManualPayClick(bill)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                                            >
                                                                <Banknote size={14} /> Manual
                                                            </button>
                                                            <button
                                                                onClick={() => handlePayClick(bill)}
                                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isPremium
                                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                                                    }`}
                                                                title={!isPremium ? "Upgrade ke Premium untuk Payment Gateway" : ""}
                                                            >
                                                                <CreditCard size={14} />
                                                                {isPremium ? "Bayar Online" : (
                                                                    <span className="flex items-center gap-1">
                                                                        Online <Crown size={10} />
                                                                    </span>
                                                                )}
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

            {/* Online Pay Modal */}
            <Modal
                isOpen={isPayModalOpen}
                onClose={() => setIsPayModalOpen(false)}
                title="Pembayaran Online"
                size="md"
                footer={
                    <>
                        <button onClick={() => setIsPayModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                            Batal
                        </button>
                        <button
                            onClick={handlePayWithMidtrans}
                            disabled={payingId !== null || !isPremium}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {payingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                            Bayar Sekarang
                        </button>
                    </>
                }
            >
                {selectedBill && (
                    <div className="space-y-4">
                        {!isPremium && (
                            <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <Crown className="w-5 h-5 text-amber-500" />
                                <div>
                                    <p className="text-amber-400 font-medium text-sm">Fitur Premium</p>
                                    <p className="text-slate-400 text-xs">Upgrade untuk menggunakan Payment Gateway</p>
                                </div>
                            </div>
                        )}
                        <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-4 border border-emerald-500/30">
                            <div className="text-emerald-400 text-sm mb-1">Total Tagihan</div>
                            <div className="text-white font-bold text-3xl">{formatCurrency(selectedBill.amount)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm">Santri</div>
                                <div className="text-white font-medium">{selectedBill.santri_name}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Periode</div>
                                <div className="text-white font-medium">{selectedBill.period}</div>
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-lg p-3 text-sm text-slate-300">
                            <p>💳 Pembayaran akan diproses melalui Midtrans dengan berbagai metode:</p>
                            <ul className="mt-2 ml-4 list-disc text-slate-400">
                                <li>Transfer Bank (BCA, Mandiri, BNI, BRI)</li>
                                <li>E-Wallet (GoPay, OVO, Dana, ShopeePay)</li>
                                <li>QRIS</li>
                            </ul>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Manual Payment Modal */}
            <Modal
                isOpen={isManualPayModalOpen}
                onClose={() => setIsManualPayModalOpen(false)}
                title="Pembayaran Manual"
                size="md"
                footer={
                    <>
                        <button onClick={() => setIsManualPayModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                            Batal
                        </button>
                        <button
                            onClick={handleManualPaymentSubmit}
                            disabled={payingId !== null}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {payingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Konfirmasi Pembayaran
                        </button>
                    </>
                }
            >
                {selectedBill && (
                    <div className="space-y-4">
                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Tagihan</span>
                                <span className="text-emerald-400 font-bold text-xl">{formatCurrency(selectedBill.amount)}</span>
                            </div>
                            <div className="text-white mt-1">{selectedBill.santri_name} - {selectedBill.period}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Metode Pembayaran</label>
                            <select
                                value={manualPayment.payment_method}
                                onChange={(e) => setManualPayment({ ...manualPayment, payment_method: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="cash">Tunai</option>
                                <option value="transfer">Transfer Bank</option>
                                <option value="debit">Kartu Debit</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Jumlah Bayar</label>
                            <input
                                type="number"
                                value={manualPayment.amount}
                                onChange={(e) => setManualPayment({ ...manualPayment, amount: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Catatan (opsional)</label>
                            <textarea
                                value={manualPayment.note}
                                onChange={(e) => setManualPayment({ ...manualPayment, note: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                                placeholder="Nomor referensi, keterangan, dll"
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Tagihan Syahriah"
                size="md"
            >
                {selectedBill && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <Receipt className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{selectedBill.santri_name}</h3>
                                <p className="text-slate-400">Periode: {selectedBill.period}</p>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Tagihan</span>
                                <span className="text-emerald-400 font-bold text-xl">{formatCurrency(selectedBill.amount)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm">Jatuh Tempo</div>
                                <div className="text-white font-medium">{selectedBill.due_date}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Status</div>
                                {selectedBill.status === "paid" ? (
                                    <span className="text-emerald-400 font-medium">Lunas</span>
                                ) : selectedBill.status === "overdue" ? (
                                    <span className="text-red-400 font-medium">Terlambat</span>
                                ) : (
                                    <span className="text-amber-400 font-medium">Belum Bayar</span>
                                )}
                            </div>
                        </div>

                        {selectedBill.paid_at && (
                            <div>
                                <div className="text-slate-400 text-sm">Tanggal Bayar</div>
                                <div className="text-white font-medium">{selectedBill.paid_at}</div>
                            </div>
                        )}

                        {selectedBill.status !== "paid" && (
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        handleManualPayClick(selectedBill);
                                    }}
                                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Banknote className="w-5 h-5" /> Bayar Manual
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        handlePayClick(selectedBill);
                                    }}
                                    className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${isPremium
                                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                            : "bg-slate-800 text-slate-500"
                                        }`}
                                >
                                    <CreditCard className="w-5 h-5" />
                                    {isPremium ? "Bayar Online" : <><span>Online</span> <Crown size={14} /></>}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Upgrade Modal */}
            <Modal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                title="Upgrade ke Premium"
                size="md"
            >
                <div className="space-y-4 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Fitur Premium</h3>
                    <p className="text-slate-400">
                        Payment Gateway (Midtrans) hanya tersedia untuk paket Premium.
                        Upgrade sekarang untuk menikmati:
                    </p>
                    <ul className="text-left space-y-2 bg-slate-800 rounded-xl p-4">
                        <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Pembayaran Online (Midtrans)
                        </li>
                        <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Notifikasi WhatsApp Otomatis
                        </li>
                        <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Dashboard Analytics Advanced
                        </li>
                        <li className="flex items-center gap-2 text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Support Prioritas
                        </li>
                    </ul>
                    <button
                        onClick={() => window.location.href = "/pesantren/pengaturan?tab=langganan"}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-lg font-medium transition-colors"
                    >
                        Upgrade Sekarang
                    </button>
                </div>
            </Modal>
        </div>
    );
}
