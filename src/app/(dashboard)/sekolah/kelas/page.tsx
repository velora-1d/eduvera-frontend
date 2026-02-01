"use client";

import { useState, useEffect } from "react";
import { BookOpen, Users, Plus, Loader2 } from "lucide-react";
import { sekolahApi } from "@/lib/api";

interface Kelas {
    id: string | number;
    name: string;
    siswa: number;
    walikelas: string;
    ruang: string;
}

export default function KelasPage() {
    const [kelasList, setKelasList] = useState<Kelas[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKelas = async () => {
            try {
                const res = await sekolahApi.getKelasList();
                if (res.data) {
                    setKelasList(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch kelas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKelas();
    }, []);



    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Data Kelas</h2>
                        <p className="text-slate-400">Kelola kelas dan wali kelas</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Kelas
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Kelas</div>
                                <div className="text-xl font-bold text-white">{kelasList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Siswa</div>
                                <div className="text-xl font-bold text-white">{kelasList.reduce((sum, k) => sum + k.siswa, 0)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {kelasList.map((kelas) => (
                        <div key={kelas.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                            <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
                                <BookOpen className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">{kelas.name}</h3>
                            <p className="text-slate-400 text-sm mt-1">{kelas.walikelas}</p>
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Siswa</span>
                                    <span className="text-white">{kelas.siswa}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Ruang</span>
                                    <span className="text-slate-300">{kelas.ruang}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
