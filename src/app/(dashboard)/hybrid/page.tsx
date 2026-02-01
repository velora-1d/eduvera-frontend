"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    Building2,
    BookOpen,
    GraduationCap,
    Bell,
    ArrowRight,
    RefreshCw
} from "lucide-react";

export default function HybridDashboardPage() {
    const [activeMode, setActiveMode] = useState<"pesantren" | "sekolah">("pesantren");

    const pesantrenStats = {
        total_santri: 320,
        total_asrama: 8,
        total_ustadz: 25,
        hafalan_rate: 78,
    };

    const sekolahStats = {
        total_siswa: 450,
        total_kelas: 18,
        total_guru: 35,
        kehadiran: 95,
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header with Mode Switcher */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Hybrid</h1>
                    <p className="text-slate-400">Kelola pesantren dan sekolah dalam satu platform</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Mode Switcher */}
                    <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
                        <button
                            onClick={() => setActiveMode("pesantren")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === "pesantren"
                                    ? "bg-emerald-500 text-white"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Pesantren
                        </button>
                        <button
                            onClick={() => setActiveMode("sekolah")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeMode === "sekolah"
                                    ? "bg-blue-500 text-white"
                                    : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Sekolah
                        </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            {/* Mode Indicator */}
            <div className={`p-4 rounded-xl border ${activeMode === "pesantren"
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-blue-500/10 border-blue-500/30"
                }`}>
                <div className="flex items-center gap-3">
                    <RefreshCw className={`w-5 h-5 ${activeMode === "pesantren" ? "text-emerald-500" : "text-blue-500"}`} />
                    <div>
                        <p className={`text-sm font-medium ${activeMode === "pesantren" ? "text-emerald-400" : "text-blue-400"}`}>
                            Mode Aktif: {activeMode === "pesantren" ? "Pesantren" : "Sekolah"}
                        </p>
                        <p className="text-xs text-slate-400">
                            Klik tombol di atas untuk beralih mode dashboard
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats - Dynamic based on mode */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">
                    Ringkasan {activeMode === "pesantren" ? "Pesantren" : "Sekolah"}
                </h2>
                {activeMode === "pesantren" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/pesantren/data" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-emerald-500/10 text-emerald-500">
                                <Users size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{pesantrenStats.total_santri}</h3>
                            <p className="text-slate-400 text-sm mt-1">Total Santri</p>
                        </Link>
                        <Link href="/pesantren/asrama" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-blue-500/10 text-blue-500">
                                <Building2 size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{pesantrenStats.total_asrama}</h3>
                            <p className="text-slate-400 text-sm mt-1">Asrama Aktif</p>
                        </Link>
                        <Link href="/pesantren/sdm" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-purple-500/10 text-purple-500">
                                <GraduationCap size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{pesantrenStats.total_ustadz}</h3>
                            <p className="text-slate-400 text-sm mt-1">Total Ustadz</p>
                        </Link>
                        <Link href="/pesantren/tahfidz" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-amber-500/10 text-amber-500">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{pesantrenStats.hafalan_rate}%</h3>
                            <p className="text-slate-400 text-sm mt-1">Target Hafalan</p>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/sekolah/siswa" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-blue-500/10 text-blue-500">
                                <Users size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{sekolahStats.total_siswa}</h3>
                            <p className="text-slate-400 text-sm mt-1">Total Siswa</p>
                        </Link>
                        <Link href="/sekolah/kelas" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-emerald-500/10 text-emerald-500">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{sekolahStats.total_kelas}</h3>
                            <p className="text-slate-400 text-sm mt-1">Total Kelas</p>
                        </Link>
                        <Link href="/sekolah/guru" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-purple-500/10 text-purple-500">
                                <GraduationCap size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{sekolahStats.total_guru}</h3>
                            <p className="text-slate-400 text-sm mt-1">Total Guru</p>
                        </Link>
                        <Link href="/sekolah/jadwal" className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
                            <div className="p-2 rounded-lg w-fit bg-amber-500/10 text-amber-500">
                                <Building2 size={20} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mt-4">{sekolahStats.kehadiran}%</h3>
                            <p className="text-slate-400 text-sm mt-1">Kehadiran</p>
                        </Link>
                    </div>
                )}
            </section>

            {/* Quick Access */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Akses Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeMode === "pesantren" ? (
                        <>
                            <Link href="/pesantren/kepesantrenan" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Kepesantrenan</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                            <Link href="/pesantren/keuangan" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Keuangan</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                            <Link href="/pesantren/tahfidz" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Tahfidz</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                            <Link href="/pesantren/diniyah" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Diniyah</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/sekolah/siswa" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Data Siswa</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                            <Link href="/sekolah/jadwal" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Jadwal KBM</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                            <Link href="/sekolah/guru" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Data Guru</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                            <Link href="/sekolah/kelas" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                                <span className="text-slate-300 font-medium group-hover:text-white">Data Kelas</span>
                                <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
