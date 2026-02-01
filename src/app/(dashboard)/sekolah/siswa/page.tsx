"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Loader2, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { sekolahApi, exportApi } from "@/lib/api";
import FilterPanel, { FilterConfig } from "@/components/ui/FilterPanel";
import Modal from "@/components/ui/Modal";

interface Siswa {
    id: string | number;
    name: string;
    nisn: string;
    kelas: string;
    jenjang?: string;
    gender?: string;
    status: string;
}

// Filter configuration
const filterConfig: FilterConfig[] = [
    {
        key: "search",
        label: "Cari",
        type: "search",
        placeholder: "Cari nama atau NISN...",
    },
    {
        key: "status",
        label: "Status",
        type: "select",
        options: [
            { value: "aktif", label: "Aktif" },
            { value: "tidak_aktif", label: "Tidak Aktif" },
            { value: "lulus", label: "Lulus" },
            { value: "pindah", label: "Pindah" },
        ],
    },
    {
        key: "kelas",
        label: "Kelas",
        type: "select",
        options: [
            { value: "7A", label: "7A" },
            { value: "7B", label: "7B" },
            { value: "8A", label: "8A" },
            { value: "8B", label: "8B" },
            { value: "9A", label: "9A" },
            { value: "9B", label: "9B" },
        ],
    },
    {
        key: "jenjang",
        label: "Jenjang",
        type: "select",
        options: [
            { value: "sd", label: "SD" },
            { value: "smp", label: "SMP" },
            { value: "sma", label: "SMA" },
            { value: "smk", label: "SMK" },
        ],
    },
    {
        key: "gender",
        label: "Jenis Kelamin",
        type: "select",
        options: [
            { value: "L", label: "Laki-laki" },
            { value: "P", label: "Perempuan" },
        ],
    },
];

const initialFilters = {
    search: "",
    status: "all",
    kelas: "all",
    jenjang: "all",
    gender: "all",
};

export default function SiswaPage() {
    const [filters, setFilters] = useState<Record<string, string | string[]>>(initialFilters);
    const [siswaList, setSiswaList] = useState<Siswa[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);

    const handleExport = async (format: "pdf" | "xlsx") => {
        setExporting(true);
        try {
            const blob = await exportApi.exportStudents(format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `laporan_siswa.${format}`;
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

    useEffect(() => {
        const fetchSiswa = async () => {
            try {
                const res = await sekolahApi.getSiswaList();
                if (res.data) {
                    setSiswaList(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch siswa", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSiswa();
    }, []);

    const handleFilterChange = (key: string, value: string | string[]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterReset = () => {
        setFilters(initialFilters);
    };

    // Apply filters
    const filteredSiswa = siswaList.filter((s) => {
        const searchMatch =
            filters.search === "" ||
            s.name.toLowerCase().includes((filters.search as string).toLowerCase()) ||
            s.nisn.includes(filters.search as string);
        const statusMatch = filters.status === "all" || s.status.toLowerCase() === filters.status;
        const kelasMatch = filters.kelas === "all" || s.kelas === filters.kelas;
        const jenjangMatch = filters.jenjang === "all" || s.jenjang === filters.jenjang;
        const genderMatch = filters.gender === "all" || s.gender === filters.gender;

        return searchMatch && statusMatch && kelasMatch && jenjangMatch && genderMatch;
    });

    const handleViewDetail = (siswa: Siswa) => {
        setSelectedSiswa(siswa);
        setIsDetailModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Data Siswa</h2>
                        <p className="text-slate-400">Kelola data seluruh siswa sekolah</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                        <Link
                            href="/sekolah/siswa/tambah"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                        >
                            <Plus size={16} /> Tambah Siswa
                        </Link>
                    </div>
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
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Siswa</div>
                                <div className="text-xl font-bold text-white">{siswaList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Siswa Aktif</div>
                                <div className="text-xl font-bold text-white">
                                    {siswaList.filter(s => s.status === "Aktif").length}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Hasil Filter</div>
                                <div className="text-xl font-bold text-white">{filteredSiswa.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : filteredSiswa.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                            Tidak ada data siswa yang ditemukan
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">NISN</th>
                                    <th className="px-6 py-4 font-medium">Kelas</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredSiswa.map((siswa) => (
                                    <tr key={siswa.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{siswa.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{siswa.nisn}</td>
                                        <td className="px-6 py-4 text-slate-300">{siswa.kelas}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${siswa.status === 'Aktif'
                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {siswa.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetail(siswa)}
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4 text-slate-400" />
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
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
                title="Tambah Siswa Baru"
                size="lg"
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            placeholder="Masukkan nama lengkap"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">NISN</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="Nomor NISN"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Kelas</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                <option value="">Pilih Kelas</option>
                                <option value="7A">7A</option>
                                <option value="7B">7B</option>
                                <option value="8A">8A</option>
                                <option value="8B">8B</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Jenis Kelamin</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                <option value="">Pilih</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                            <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                <option value="aktif">Aktif</option>
                                <option value="tidak_aktif">Tidak Aktif</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Siswa"
                size="md"
            >
                {selectedSiswa && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {selectedSiswa.name.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{selectedSiswa.name}</h3>
                                <p className="text-slate-400">NISN: {selectedSiswa.nisn}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                            <div>
                                <div className="text-slate-400 text-sm">Kelas</div>
                                <div className="text-white font-medium">{selectedSiswa.kelas}</div>
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Status</div>
                                <span className={`inline-block px-2 py-1 rounded text-xs ${selectedSiswa.status === 'Aktif'
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-amber-500/10 text-amber-500'
                                    }`}>
                                    {selectedSiswa.status}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
