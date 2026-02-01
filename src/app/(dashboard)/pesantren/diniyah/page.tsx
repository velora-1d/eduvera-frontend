"use client";

import { useState, useEffect } from "react";
import { BookOpen, Users, GraduationCap, Loader2 } from "lucide-react";
import { sekolahApi } from "@/lib/api";

interface KelasDiniyah {
    id: string | number;
    name: string;
    santri: number;
    pengajar: string;
    jadwal: string;
}

export default function DiniyahPage() {
    const [kelasList, setKelasList] = useState<KelasDiniyah[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiniyah = async () => {
            try {
                const res = await sekolahApi.getDiniyahKitabList();
                if (res.data) {
                    setKelasList(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch diniyah", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDiniyah();
    }, []);

    const totalSantri = kelasList.reduce((sum, k) => sum + (k.santri || 0), 0);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Program Diniyah</h2>
                    <p className="text-slate-400">Kelola kelas dan kurikulum Madrasah Diniyah</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
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
                                <div className="text-slate-400 text-sm">Total Santri</div>
                                <div className="text-xl font-bold text-white">{totalSantri}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Mata Pelajaran</div>
                                <div className="text-xl font-bold text-white">-</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                ) : kelasList.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400">
                        Belum ada data kelas diniyah.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {kelasList.map((kelas) => (
                            <div key={kelas.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                                <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4">
                                    <GraduationCap className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">{kelas.name}</h3>
                                <p className="text-slate-400 text-sm mt-1">{kelas.pengajar}</p>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Santri</span>
                                        <span className="text-white">{kelas.santri}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Jadwal</span>
                                        <span className="text-slate-300">{kelas.jadwal}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
