"use client";

import { useState } from "react";
import { Wallet, TrendingUp, TrendingDown, Receipt, Plus, Download, FileText, DollarSign, Loader2, Eye, Pencil } from "lucide-react";
import { exportApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import DateRangePicker from "@/components/ui/DateRangePicker";
import Modal from "@/components/ui/Modal";

// Filter configuration
const filterConfig: FilterConfig[] = [
    {
        key: "search",
        label: "Cari",
        type: "search",
        placeholder: "Cari nama atau NIS...",
    },
    {
        key: "status",
        label: "Status Bayar",
        type: "select",
        options: [
            { value: "lunas", label: "Lunas" },
            { value: "belum", label: "Belum Bayar" },
            { value: "cicil", label: "Cicilan" },
        ],
    },
    {
        key: "kelas",
        label: "Kelas",
        type: "select",
        options: [
            { value: "XII IPA 1", label: "XII IPA 1" },
            { value: "XII IPA 2", label: "XII IPA 2" },
            { value: "XII IPS 1", label: "XII IPS 1" },
            { value: "XII IPS 2", label: "XII IPS 2" },
        ],
    },
    {
        key: "bulan",
        label: "Bulan",
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
    kelas: "all",
    bulan: "all",
};

interface DateRange {
    from: Date | null;
    to: Date | null;
}

export default function KeuanganPage() {
    const [activeTab, setActiveTab] = useState("spp");
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
    const [exporting, setExporting] = useState(false);

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<typeof sppList[0] | null>(null);

    const handleExport = async (format: "pdf" | "xlsx") => {
        setExporting(true);
        try {
            const blob = await exportApi.exportPayments(format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `laporan_keuangan.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export", error);
        } finally {
            setExporting(false);
        }
    };

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

    const handleFilterChange = (key: string, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterReset = () => {
        setFilters(initialFilters);
        setDateRange({ from: null, to: null });
    };

    // Apply filters
    const filteredSpp = sppList.filter((item) => {
        const searchMatch =
            filters.search === "" ||
            item.nama.toLowerCase().includes((filters.search as string).toLowerCase()) ||
            item.nis.includes(filters.search as string);
        const statusMatch = filters.status === "all" || item.status.toLowerCase() === filters.status;
        const kelasMatch = filters.kelas === "all" || item.kelas === filters.kelas;
        const bulanMatch = filters.bulan === "all" || item.bulan.toLowerCase() === filters.bulan;

        return searchMatch && statusMatch && kelasMatch && bulanMatch;
    });

    const handleViewDetail = (item: typeof sppList[0]) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Keuangan Sekolah</h2>
                        <p className="text-slate-400">Kelola SPP, pemasukan, dan pengeluaran</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={exporting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            PDF
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            disabled={exporting}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            Excel
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                        >
                            <Plus size={16} /> Transaksi Baru
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
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
                                <div className="text-xl font-bold text-white">
                                    {sppList.filter(s => s.status === "Lunas").length}/{sppList.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-800">
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

                {/* Content */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {activeTab === "spp" && (
                        <>
                            {filteredSpp.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    Tidak ada data yang ditemukan
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-400">
                                            <th className="px-6 py-4 font-medium">NIS</th>
                                            <th className="px-6 py-4 font-medium">Nama Siswa</th>
                                            <th className="px-6 py-4 font-medium">Kelas</th>
                                            <th className="px-6 py-4 font-medium">Bulan</th>
                                            <th className="px-6 py-4 font-medium">Nominal</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Tanggal</th>
                                            <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredSpp.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/50">
                                                <td className="px-6 py-4 text-slate-300">{item.nis}</td>
                                                <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                                <td className="px-6 py-4 text-slate-300">{item.kelas}</td>
                                                <td className="px-6 py-4 text-slate-300">{item.bulan}</td>
                                                <td className="px-6 py-4 text-slate-300">{formatRupiah(item.nominal)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${item.status === "Lunas"
                                                            ? "bg-emerald-500/10 text-emerald-500"
                                                            : "bg-red-500/10 text-red-500"
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-300">{item.tanggal}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleViewDetail(item)}
                                                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4 text-slate-400" />
                                                        </button>
                                                        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                                            <Pencil className="w-4 h-4 text-slate-400" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
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

            {/* Add Transaction Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Transaksi Baru"
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Batal
                        </button>
                        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                            Simpan
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tipe Transaksi</label>
                        <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                            <option value="">Pilih tipe</option>
                            <option value="spp">Pembayaran SPP</option>
                            <option value="pemasukan">Pemasukan Lainnya</option>
                            <option value="pengeluaran">Pengeluaran</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nominal</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Masukkan nominal"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Keterangan</label>
                        <textarea
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Keterangan transaksi"
                            rows={3}
                        />
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Pembayaran"
                size="md"
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm">Nama</div>
                                <div className="text-white font-medium">{selectedItem.nama}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">NIS</div>
                                <div className="text-white font-medium">{selectedItem.nis}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Kelas</div>
                                <div className="text-white font-medium">{selectedItem.kelas}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Bulan</div>
                                <div className="text-white font-medium">{selectedItem.bulan}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Nominal</div>
                                <div className="text-white font-medium">{formatRupiah(selectedItem.nominal)}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Status</div>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${selectedItem.status === "Lunas"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-red-500/10 text-red-500"
                                    }`}>
                                    {selectedItem.status}
                                </span>
                            </div>
                        </div>
                        {selectedItem.status === "Belum" && (
                            <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                                Konfirmasi Pembayaran
                            </button>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
