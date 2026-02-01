"use client";

import { useState, useEffect } from "react";
import { Building2, Users, Plus, Loader2 } from "lucide-react";
import { sekolahApi } from "@/lib/api";

interface Asrama {
    id: string | number;
    name: string;
    kapasitas: number;
    terisi: number;
    pengurus: string;
}

export default function AsramaPage() {
    const [asramaList, setAsramaList] = useState<Asrama[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAsrama = async () => {
            try {
                const res = await sekolahApi.getAsramaList();
                if (res.data) {
                    setAsramaList(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch asrama", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAsrama();
    }, []);

    const totalKapasitas = asramaList.reduce((sum, a) => sum + (a.kapasitas || 0), 0);
    const totalTerisi = asramaList.reduce((sum, a) => sum + (a.terisi || 0), 0);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Manajemen Asrama</h2>
                        <p className="text-slate-400">Kelola asrama dan penempatan santri</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Asrama
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Building2 className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Asrama</div>
                                <div className="text-xl font-bold text-white">{asramaList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Kapasitas</div>
                                <div className="text-xl font-bold text-white">{totalKapasitas}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Terisi</div>
                                <div className="text-xl font-bold text-white">{totalTerisi}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : asramaList.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center text-slate-400">
                        Belum ada data asrama. Klik &quot;Tambah Asrama&quot; untuk menambahkan.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {asramaList.map((asrama) => (
                            <div key={asrama.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <Building2 className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded">
                                        {asrama.kapasitas > 0 ? Math.round((asrama.terisi / asrama.kapasitas) * 100) : 0}% Terisi
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-white">{asrama.name}</h3>
                                <p className="text-slate-400 text-sm mt-1">{asrama.pengurus}</p>
                                <div className="mt-4 flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Kapasitas</span>
                                    <span className="text-white">{asrama.terisi}/{asrama.kapasitas}</span>
                                </div>
                                <div className="mt-2 bg-slate-800 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 rounded-full h-2"
                                        style={{ width: `${asrama.kapasitas > 0 ? (asrama.terisi / asrama.kapasitas) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
