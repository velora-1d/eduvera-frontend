"use client";

import { useState, useEffect } from "react";
import { Search, Users, Plus, Filter, Loader2, Download } from "lucide-react";
import { sekolahApi, exportApi } from "@/lib/api";

interface Siswa {
    id: string | number;
    name: string;
    nisn: string;
    kelas: string;
    status: string;
}

export default function SiswaPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [siswaList, setSiswaList] = useState<Siswa[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

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



    const filteredSiswa = siswaList.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nisn.includes(searchTerm)
    );

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Data Siswa</h2>
                        <p className="text-slate-400">Kelola data seluruh siswa sekolah</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button
                                onClick={() => handleExport("pdf")}
                                disabled={exporting}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium disabled:opacity-50"
                            >
                                {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                PDF
                            </button>
                        </div>
                        <button
                            onClick={() => handleExport("xlsx")}
                            disabled={exporting}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            Excel
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                            <Plus size={16} /> Tambah Siswa
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NISN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:text-white">
                        <Filter size={16} /> Filter
                    </button>
                </div>

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
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Nama</th>
                                <th className="px-6 py-4 font-medium">NISN</th>
                                <th className="px-6 py-4 font-medium">Kelas</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredSiswa.map((siswa) => (
                                <tr key={siswa.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{siswa.name}</td>
                                    <td className="px-6 py-4 text-slate-300">{siswa.nisn}</td>
                                    <td className="px-6 py-4 text-slate-300">{siswa.kelas}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${siswa.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>{siswa.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
