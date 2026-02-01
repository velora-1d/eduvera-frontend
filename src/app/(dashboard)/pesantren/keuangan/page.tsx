"use client";

import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, CreditCard, Plus } from "lucide-react";

export default function KeuanganPage() {
    const [activeTab, setActiveTab] = useState("dashboard");

    const stats = {
        saldo: 125000000,
        pemasukan: 45000000,
        pengeluaran: 32000000,
    };

    const transactions = [
        { id: 1, type: "pemasukan", desc: "SPP Santri - Ahmad Fulan", amount: 500000, date: "2024-01-15" },
        { id: 2, type: "pengeluaran", desc: "Pembelian Buku", amount: 1500000, date: "2024-01-14" },
        { id: 3, type: "pemasukan", desc: "SPP Santri - Muhammad Hasan", amount: 500000, date: "2024-01-14" },
        { id: 4, type: "pengeluaran", desc: "Bayar Listrik", amount: 2500000, date: "2024-01-13" },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
    };

    const tabs = ["dashboard", "pemasukan", "pengeluaran", "tabungan", "anggaran", "laporan"];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Keuangan</h2>
                        <p className="text-slate-400">Kelola keuangan pesantren</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Transaksi Baru
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Wallet className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Saldo Kas</div>
                                <div className="text-xl font-bold text-emerald-400">{formatCurrency(stats.saldo)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Pemasukan Bulan Ini</div>
                                <div className="text-xl font-bold text-white">{formatCurrency(stats.pemasukan)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <TrendingDown className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Pengeluaran Bulan Ini</div>
                                <div className="text-xl font-bold text-red-400">{formatCurrency(stats.pengeluaran)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <CreditCard className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Tunggakan SPP</div>
                                <div className="text-xl font-bold text-amber-400">15 Santri</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 flex-wrap border-b border-slate-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px capitalize ${activeTab === tab
                                    ? "text-emerald-500 border-emerald-500"
                                    : "text-slate-400 border-transparent hover:text-white"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="font-semibold text-white">Transaksi Terbaru</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Keterangan</th>
                                <th className="px-6 py-4 font-medium">Tipe</th>
                                <th className="px-6 py-4 font-medium">Jumlah</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-white">{tx.desc}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${tx.type === 'pemasukan' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                            }`}>{tx.type}</span>
                                    </td>
                                    <td className={`px-6 py-4 font-medium ${tx.type === 'pemasukan' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {tx.type === 'pemasukan' ? '+' : '-'}{formatCurrency(tx.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{tx.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
