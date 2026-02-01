"use client";

import { useState, useEffect } from "react";
import { GraduationCap, Search, Plus, Loader2 } from "lucide-react";
import { sekolahApi } from "@/lib/api";

interface Guru {
    id: string | number;
    name: string;
    nip: string;
    mapel: string;
    status: string;
}

export default function GuruPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [guruList, setGuruList] = useState<Guru[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuru = async () => {
            try {
                const res = await sekolahApi.getGuruList();
                if (res.data) {
                    setGuruList(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch guru", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGuru();
    }, []);



    const filteredGuru = guruList.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.nip.includes(searchTerm)
    );

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Data Guru</h2>
                        <p className="text-slate-400">Kelola data guru dan tenaga pengajar</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Guru
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari nama atau NIP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-fit">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-slate-400 text-sm">Total Guru</div>
                            <div className="text-xl font-bold text-white">{guruList.length}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Nama</th>
                                <th className="px-6 py-4 font-medium">NIP</th>
                                <th className="px-6 py-4 font-medium">Mata Pelajaran</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredGuru.map((guru) => (
                                <tr key={guru.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{guru.name}</td>
                                    <td className="px-6 py-4 text-slate-300">{guru.nip}</td>
                                    <td className="px-6 py-4 text-slate-300">{guru.mapel}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${guru.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>{guru.status}</span>
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
