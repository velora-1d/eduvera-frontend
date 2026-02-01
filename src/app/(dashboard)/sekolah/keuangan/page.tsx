"use client";

import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Receipt, Plus, Search, Download, FileText, DollarSign } from "lucide-react";

export default function KeuanganPage() {
    const [activeTab, setActiveTab] = useState("spp");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBulan, setSelectedBulan] = useState("januari");

    const [sppList] = useState([
        { id: 1, nis: "12345", nama: "Ahmad Fauzi", kelas: "XII IPA 1", bulan: "Januari", nominal: 500000, status: "Lunas", tanggal: "05 Jan 2025" },
        { id: 2, nis: "12346", nama: "Siti Aminah", kelas: "XII IPA 1", bulan: "Januari", nominal: 500000, status: "Lunas", tanggal: "03 Jan 2025" },
        { id: 3, nis: "12347", nama: "Budi Santoso", kelas: "XII IPA 1", bulan: "Januari", nominal: 500000, status: "Belum", tanggal: "-" },
        { id: 4, nis: "12348", nama: "Dewi Lestari", kelas: "XII IPA 1", bulan: "Januari", nominal: 500000, status: "Lunas", tanggal: "10 Jan 2025" },
    ]);

    const [pengeluaranList] = useState([
        { id: 1, kategori: "Gaji", deskripsi: "Gaji Guru Januari 2025", nominal: 45000000, tanggal: "27 Jan 2025" },
        { id: 2, kategori: "Operasional", deskripsi: "Listrik dan Air", nominal: 5500000, tanggal: "20 Jan 2025" },
        { id: 3, kategori: "Sarpras", deskripsi: "Perbaikan AC Ruang Kelas", nominal: 2500000, tanggal: "15 Jan 2025" },
    ]);

    const tabs = [
        { id: "spp", label: "SPP Siswa", icon: Receipt },
        { id: "pemasukan", label: "Pemasukan", icon: TrendingUp },
        { id: "pengeluaran", label: "Pengeluaran", icon: TrendingDown },
        { id: "laporan", label: "Laporan", icon: FileText },
    ];

    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Keuangan Sekolah</h2>
                        <p className="text-slate-400">Kelola SPP, pemasukan, dan pengeluaran</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">
                            <Download size={16} /> Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                            <Plus size={16} /> Transaksi Baru
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Wallet className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Saldo Kas</div>
                                <div className="text-xl font-bold text-white">Rp 125.500.000</div>
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
                                <div className="text-xl font-bold text-white">Rp 75.000.000</div>
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
                                <div className="text-xl font-bold text-white">Rp 53.000.000</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Receipt className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">SPP Terbayar</div>
                                <div className="text-xl font-bold text-white">85%</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex gap-2 border-b border-slate-800 flex-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                    ? "text-blue-500 border-blue-500"
                                    : "text-slate-400 border-transparent hover:text-white"
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <select
                        value={selectedBulan}
                        onChange={(e) => setSelectedBulan(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="januari">Januari 2025</option>
                        <option value="februari">Februari 2025</option>
                        <option value="maret">Maret 2025</option>
                    </select>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {activeTab === "spp" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">NIS</th>
                                    <th className="px-6 py-4 font-medium">Nama Siswa</th>
                                    <th className="px-6 py-4 font-medium">Kelas</th>
                                    <th className="px-6 py-4 font-medium">Bulan</th>
                                    <th className="px-6 py-4 font-medium">Nominal</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Tanggal Bayar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {sppList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-slate-300">{item.nis}</td>
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.kelas}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.bulan}</td>
                                        <td className="px-6 py-4 text-slate-300">{formatRupiah(item.nominal)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === "Lunas" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{item.tanggal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "pengeluaran" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Tanggal</th>
                                    <th className="px-6 py-4 font-medium">Kategori</th>
                                    <th className="px-6 py-4 font-medium">Deskripsi</th>
                                    <th className="px-6 py-4 font-medium">Nominal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {pengeluaranList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-slate-300">{item.tanggal}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{item.kategori}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-white">{item.deskripsi}</td>
                                        <td className="px-6 py-4 text-red-400">{formatRupiah(item.nominal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {(activeTab === "pemasukan" || activeTab === "laporan") && (
                        <div className="p-8 text-center text-slate-400">
                            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>{activeTab === "pemasukan" ? "Detail pemasukan" : "Laporan keuangan"} akan ditampilkan di sini</p>
                            <p className="text-sm mt-2">Data akan diambil dari database</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
