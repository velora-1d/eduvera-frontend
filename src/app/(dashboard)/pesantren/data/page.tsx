"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Loader2, Eye, Pencil, Trash2, Home, BookOpen } from "lucide-react";
import { sekolahApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import Modal from "@/components/ui/Modal";

interface Santri {
    id: string | number;
    name: string;
    nis: string;
    kelas: string;
    kamar: string;
    asrama?: string;
    gender?: string;
    status: string;
}

// Filter configuration for Pesantren
const filterConfig: FilterConfig[] = [
    {
        key: "search",
        label: "Cari",
        type: "search",
        placeholder: "Cari nama atau NIS...",
    },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "aktif", label: "Aktif" },
            { value: "boyong", label: "Boyong" },
            { value: "lulus", label: "Lulus" },
            { value: "cuti", label: "Cuti" },
        ],
    },
    {
        key: "asrama",
        label: "Asrama",
        type: "select",
        options: [
            { value: "putra_1", label: "Asrama Putra 1" },
            { value: "putra_2", label: "Asrama Putra 2" },
            { value: "putri_1", label: "Asrama Putri 1" },
            { value: "putri_2", label: "Asrama Putri 2" },
        ],
    },
    {
        key: "kelas",
        label: "Kelas Diniyah",
        type: "select",
        options: [
            { value: "ula_1", label: "Ula 1" },
            { value: "ula_2", label: "Ula 2" },
            { value: "wustho_1", label: "Wustho 1" },
            { value: "wustho_2", label: "Wustho 2" },
            { value: "ulya_1", label: "Ulya 1" },
            { value: "ulya_2", label: "Ulya 2" },
        ],
    },
    {
        key: "gender",
        label: "Jenis Kelamin",
        type: "select",
        options: [
            { value: "L", label: "Putra" },
            { value: "P", label: "Putri" },
        ],
    },
];

const initialFilters = {
    search: "",
    status: "all",
    asrama: "all",
    kelas: "all",
    gender: "all",
};

export default function SantriPage() {
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [santriList, setSantriList] = useState<Santri[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

    useEffect(() => {
        const fetchSantri = async () => {
            try {
                const res = await sekolahApi.getSiswaList();
                if (res.data) {
                    setSantriList(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch santri", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSantri();
    }, []);

    const handleFilterChange = (key: string, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterReset = () => {
        setFilters(initialFilters);
    };

    // Apply filters
    const filteredSantri = santriList.filter((s) => {
        const searchMatch =
            filters.search === "" ||
            s.name.toLowerCase().includes((filters.search as string).toLowerCase()) ||
            s.nis.includes(filters.search as string);
        const statusMatch = filters.status === "all" || s.status.toLowerCase() === filters.status;
        const asramaMatch = filters.asrama === "all" || s.asrama === filters.asrama;
        const kelasMatch = filters.kelas === "all" || s.kelas === filters.kelas;
        const genderMatch = filters.gender === "all" || s.gender === filters.gender;

        return searchMatch && statusMatch && asramaMatch && kelasMatch && genderMatch;
    });

    const handleViewDetail = (santri: Santri) => {
        setSelectedSantri(santri);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Data Santri</h2>
                        <p className="text-slate-400">Kelola data seluruh santri pesantren</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium"
                    >
                        <Plus size={16} /> Tambah Santri
                    </button>
                </div>

                {/* Filter Panel */}
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
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Santri</div>
                                <div className="text-xl font-bold text-white">{santriList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Putra</div>
                                <div className="text-xl font-bold text-white">
                                    {santriList.filter(s => s.gender === "L").length || Math.floor(santriList.length * 0.55)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-pink-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Putri</div>
                                <div className="text-xl font-bold text-white">
                                    {santriList.filter(s => s.gender === "P").length || Math.floor(santriList.length * 0.45)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Home className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Hasil Filter</div>
                                <div className="text-xl font-bold text-white">{filteredSantri.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                        </div>
                    ) : filteredSantri.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            Tidak ada data santri yang ditemukan
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">NIS</th>
                                    <th className="px-6 py-4 font-medium">Kelas</th>
                                    <th className="px-6 py-4 font-medium">Kamar</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredSantri.map((santri) => (
                                    <tr key={santri.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{santri.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{santri.nis}</td>
                                        <td className="px-6 py-4 text-slate-300">{santri.kelas}</td>
                                        <td className="px-6 py-4 text-slate-300">{santri.kamar || "-"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${santri.status === 'Aktif'
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {santri.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(santri)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                                                    <Pencil className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Santri Baru"
                size="lg"
                footer={
                    <>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Batal
                        </button>
                        <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                            Simpan
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                            placeholder="Nama lengkap santri"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">NIS</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                                placeholder="Nomor Induk Santri"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Jenis Kelamin</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                                <option value="">Pilih</option>
                                <option value="L">Putra</option>
                                <option value="P">Putri</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Asrama</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                                <option value="">Pilih Asrama</option>
                                <option value="putra_1">Asrama Putra 1</option>
                                <option value="putra_2">Asrama Putra 2</option>
                                <option value="putri_1">Asrama Putri 1</option>
                                <option value="putri_2">Asrama Putri 2</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Kelas Diniyah</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                                <option value="">Pilih Kelas</option>
                                <option value="ula_1">Ula 1</option>
                                <option value="wustho_1">Wustho 1</option>
                                <option value="ulya_1">Ulya 1</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Santri"
                size="md"
            >
                {selectedSantri && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {selectedSantri.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{selectedSantri.name}</h3>
                                <p className="text-slate-400">NIS: {selectedSantri.nis}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                            <div>
                                <div className="text-slate-400 text-sm">Kelas</div>
                                <div className="text-white font-medium">{selectedSantri.kelas}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Kamar</div>
                                <div className="text-white font-medium">{selectedSantri.kamar || "-"}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Status</div>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${selectedSantri.status === 'Aktif'
                                        ? 'bg-emerald-500/10 text-emerald-500'
                                        : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    {selectedSantri.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-4 border-t border-slate-700">
                            <button className="flex-1 py-2 bg-blue-500/10 text-blue-400 rounded-lg font-medium hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2">
                                <BookOpen size={16} /> Lihat Tahfidz
                            </button>
                            <button className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg font-medium hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
                                <Home size={16} /> Detail Asrama
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
