"use client";

import { useState, useEffect } from "react";
import { BookOpen, Award, Users, Loader2 } from "lucide-react";
import { sekolahApi } from "@/lib/api";

interface SantriTahfidz {
    id: string | number;
    name: string;
    juz: number;
    halaman: number;
    target: number;
    pengajar: string;
}

export default function TahfidzPage() {
    const [santriTahfidz, setSantriTahfidz] = useState<SantriTahfidz[]>([]);
    const [loading, setLoading] = useState(true);

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

    const totalJuz = santriTahfidz.reduce((sum, s) => sum + (s.juz || 0), 0);
    const khatamCount = santriTahfidz.filter(s => s.juz >= 30).length;

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Program Tahfidz</h2>
                        <p className="text-slate-400">Pantau perkembangan hafalan Al-Quran santri</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    ) : santriTahfidz.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            Belum ada data santri tahfidz.
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama Santri</th>
                                    <th className="px-6 py-4 font-medium">Hafalan</th>
                                    <th className="px-6 py-4 font-medium">Progress</th>
                                    <th className="px-6 py-4 font-medium">Pengajar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {santriTahfidz.map((santri) => (
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
                                                <span className="text-xs text-slate-400">{santri.target > 0 ? Math.round((santri.juz / santri.target) * 100) : 0}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{santri.pengajar}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
