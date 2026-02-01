"use client";

import { useState, useEffect } from "react";
import { BookOpen, Award, Users, Loader2, Plus, Eye, BookMarked } from "lucide-react";
import { sekolahApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import Modal from "@/components/ui/Modal";

interface SantriTahfidz {
    id: string | number;
    name: string;
    juz: number;
    halaman: number;
    target: number;
    pengajar: string;
    asrama?: string;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
    {
        key: "search",
        label: "Cari",
        type: "search",
        placeholder: "Cari nama santri...",
    },
    {
        key: "progress",
        label: "Progress",
        type: "select",
        options: [
            { value: "belum", label: "Belum Mulai (0 Juz)" },
            { value: "proses", label: "Dalam Proses (1-29 Juz)" },
            { value: "khatam", label: "Khatam (30 Juz)" },
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
        key: "pengajar",
        label: "Pengajar",
        type: "select",
        options: [
            { value: "ustadz_ahmad", label: "Ustadz Ahmad" },
            { value: "ustadz_ibrahim", label: "Ustadz Ibrahim" },
            { value: "ustadzah_fatimah", label: "Ustadzah Fatimah" },
        ],
    },
];

const initialFilters = {
    search: "",
    progress: "all",
    asrama: "all",
    pengajar: "all",
};

export default function TahfidzPage() {
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [santriTahfidz, setSantriTahfidz] = useState<SantriTahfidz[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isSetoranModalOpen, setIsSetoranModalOpen] = useState(false);
    const [selectedSantri, setSelectedSantri] = useState<SantriTahfidz | null>(null);

    useEffect(() => {
        const fetchTahfidz = async () => {
            try {
                const res = await sekolahApi.getTahfidzSetoranList();
                if (res.data) {
                    setSantriTahfidz(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch tahfidz", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTahfidz();
    }, []);

    const handleFilterChange = (key: string, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterReset = () => {
        setFilters(initialFilters);
    };

    // Apply filters
    const filteredSantri = santriTahfidz.filter((s) => {
        const searchMatch =
            filters.search === "" ||
            s.name.toLowerCase().includes((filters.search as string).toLowerCase());

        let progressMatch = true;
        if (filters.progress !== "all") {
            if (filters.progress === "belum") progressMatch = s.juz === 0;
            else if (filters.progress === "proses") progressMatch = s.juz > 0 && s.juz < 30;
            else if (filters.progress === "khatam") progressMatch = s.juz >= 30;
        }

        const asramaMatch = filters.asrama === "all" || s.asrama === filters.asrama;
        const pengajarMatch = filters.pengajar === "all" || s.pengajar.includes(filters.pengajar as string);

        return searchMatch && progressMatch && asramaMatch && pengajarMatch;
    });

    const totalJuz = santriTahfidz.reduce((sum, s) => sum + (s.juz || 0), 0);
    const khatamCount = santriTahfidz.filter(s => s.juz >= 30).length;

    const handleViewDetail = (santri: SantriTahfidz) => {
        setSelectedSantri(santri);
        setIsDetailModalOpen(true);
    };

    const handleAddSetoran = (santri: SantriTahfidz) => {
        setSelectedSantri(santri);
        setIsSetoranModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Program Tahfidz</h2>
                        <p className="text-slate-400">Pantau perkembangan hafalan Al-Quran santri</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium"
                    >
                        <Plus size={16} /> Tambah Santri Tahfidz
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
                                <div className="text-slate-400 text-sm">Santri Tahfidz</div>
                                <div className="text-xl font-bold text-white">{santriTahfidz.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Hafalan</div>
                                <div className="text-xl font-bold text-white">{totalJuz} Juz</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Award className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Khatam 30 Juz</div>
                                <div className="text-xl font-bold text-white">{khatamCount}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookMarked className="w-5 h-5 text-blue-500" />
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
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    ) : filteredSantri.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            Tidak ada data yang ditemukan
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama Santri</th>
                                    <th className="px-6 py-4 font-medium">Hafalan</th>
                                    <th className="px-6 py-4 font-medium">Progress</th>
                                    <th className="px-6 py-4 font-medium">Pengajar</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredSantri.map((santri) => (
                                    <tr key={santri.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{santri.name}</td>
                                        <td className="px-6 py-4 text-purple-400 font-medium">{santri.juz} Juz</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-slate-800 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-purple-500 rounded-full h-2"
                                                        style={{ width: `${santri.target > 0 ? (santri.juz / santri.target) * 100 : 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {santri.target > 0 ? Math.round((santri.juz / santri.target) * 100) : 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{santri.pengajar}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(santri)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Detail"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <button
                                                    onClick={() => handleAddSetoran(santri)}
                                                    className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-colors"
                                                >
                                                    + Setoran
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

            {/* Add Santri Tahfidz Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Santri Tahfidz"
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Batal
                        </button>
                        <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                            Simpan
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Pilih Santri</label>
                        <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                            <option value="">Pilih santri</option>
                            <option value="1">Ahmad Fauzan</option>
                            <option value="2">Muhammad Ali</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Pengajar</label>
                        <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                            <option value="">Pilih pengajar</option>
                            <option value="ustadz_ahmad">Ustadz Ahmad</option>
                            <option value="ustadz_ibrahim">Ustadz Ibrahim</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Target (Juz)</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="30"
                            defaultValue={30}
                        />
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Hafalan"
                size="md"
            >
                {selectedSantri && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{selectedSantri.name}</h3>
                                <p className="text-purple-400 font-medium">{selectedSantri.juz} dari {selectedSantri.target} Juz</p>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 text-sm">Progress</span>
                                <span className="text-white font-medium">
                                    {selectedSantri.target > 0 ? Math.round((selectedSantri.juz / selectedSantri.target) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-3 transition-all"
                                    style={{ width: `${selectedSantri.target > 0 ? (selectedSantri.juz / selectedSantri.target) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-slate-400 text-sm">Pengajar</div>
                                <div className="text-white font-medium">{selectedSantri.pengajar}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Halaman Terakhir</div>
                                <div className="text-white font-medium">{selectedSantri.halaman || 0}</div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsDetailModalOpen(false);
                                setIsSetoranModalOpen(true);
                            }}
                            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Tambah Setoran Baru
                        </button>
                    </div>
                )}
            </Modal>

            {/* Setoran Modal */}
            <Modal
                isOpen={isSetoranModalOpen}
                onClose={() => setIsSetoranModalOpen(false)}
                title="Input Setoran Hafalan"
                size="md"
                footer={
                    <>
                        <button
                            onClick={() => setIsSetoranModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Batal
                        </button>
                        <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
                            Simpan Setoran
                        </button>
                    </>
                }
            >
                {selectedSantri && (
                    <div className="space-y-4">
                        <div className="bg-slate-800 rounded-lg p-3">
                            <div className="text-slate-400 text-sm">Santri</div>
                            <div className="text-white font-medium">{selectedSantri.name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Juz</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="1"
                                    min={1}
                                    max={30}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Halaman</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                    placeholder="1-20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nilai</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                                <option value="mumtaz">Mumtaz (Sangat Baik)</option>
                                <option value="jayyid_jiddan">Jayyid Jiddan (Baik Sekali)</option>
                                <option value="jayyid">Jayyid (Baik)</option>
                                <option value="maqbul">Maqbul (Cukup)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Catatan</label>
                            <textarea
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                placeholder="Catatan setoran..."
                                rows={2}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
