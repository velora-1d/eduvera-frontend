"use client";

import { useState } from "react";
import { GraduationCap, Users, School, Plus, Settings, ChevronRight } from "lucide-react";

export default function JenjangPage() {
    const [selectedJenjang, setSelectedJenjang] = useState<string | null>(null);

    const jenjangList = [
        {
            id: "paud",
            nama: "PAUD / TK",
            icon: "🎒",
            color: "pink",
            tingkat: [
                { nama: "Kelompok Bermain (KB)", siswa: 25 },
                { nama: "TK A", siswa: 30 },
                { nama: "TK B", siswa: 32 },
            ],
            totalSiswa: 87,
            totalKelas: 3,
            kurikulum: "Kurikulum Merdeka PAUD"
        },
        {
            id: "sd",
            nama: "SD",
            icon: "📚",
            color: "blue",
            tingkat: [
                { nama: "Kelas 1", siswa: 64 },
                { nama: "Kelas 2", siswa: 62 },
                { nama: "Kelas 3", siswa: 58 },
                { nama: "Kelas 4", siswa: 60 },
                { nama: "Kelas 5", siswa: 55 },
                { nama: "Kelas 6", siswa: 52 },
            ],
            totalSiswa: 351,
            totalKelas: 12,
            kurikulum: "Kurikulum Merdeka"
        },
        {
            id: "mi",
            nama: "MI (Madrasah Ibtidaiyah)",
            icon: "🕌",
            color: "emerald",
            tingkat: [
                { nama: "Kelas 1", siswa: 45 },
                { nama: "Kelas 2", siswa: 42 },
                { nama: "Kelas 3", siswa: 40 },
                { nama: "Kelas 4", siswa: 38 },
                { nama: "Kelas 5", siswa: 35 },
                { nama: "Kelas 6", siswa: 32 },
            ],
            totalSiswa: 232,
            totalKelas: 6,
            kurikulum: "Kurikulum Kemenag + Merdeka"
        },
        {
            id: "smp",
            nama: "SMP",
            icon: "🎓",
            color: "purple",
            tingkat: [
                { nama: "Kelas VII", siswa: 120 },
                { nama: "Kelas VIII", siswa: 115 },
                { nama: "Kelas IX", siswa: 110 },
            ],
            totalSiswa: 345,
            totalKelas: 9,
            kurikulum: "Kurikulum Merdeka"
        },
        {
            id: "mts",
            nama: "MTs (Madrasah Tsanawiyah)",
            icon: "🕋",
            color: "teal",
            tingkat: [
                { nama: "Kelas VII", siswa: 80 },
                { nama: "Kelas VIII", siswa: 75 },
                { nama: "Kelas IX", siswa: 70 },
            ],
            totalSiswa: 225,
            totalKelas: 6,
            kurikulum: "Kurikulum Kemenag + Merdeka"
        },
        {
            id: "sma",
            nama: "SMA",
            icon: "🏫",
            color: "amber",
            tingkat: [
                { nama: "Kelas X", siswa: 150 },
                { nama: "Kelas XI IPA", siswa: 60 },
                { nama: "Kelas XI IPS", siswa: 55 },
                { nama: "Kelas XII IPA", siswa: 58 },
                { nama: "Kelas XII IPS", siswa: 52 },
            ],
            totalSiswa: 375,
            totalKelas: 10,
            kurikulum: "Kurikulum Merdeka"
        },
        {
            id: "ma",
            nama: "MA (Madrasah Aliyah)",
            icon: "☪️",
            color: "cyan",
            tingkat: [
                { nama: "Kelas X", siswa: 90 },
                { nama: "Kelas XI Agama", siswa: 30 },
                { nama: "Kelas XI IPA", siswa: 25 },
                { nama: "Kelas XI IPS", siswa: 25 },
                { nama: "Kelas XII", siswa: 70 },
            ],
            totalSiswa: 240,
            totalKelas: 8,
            kurikulum: "Kurikulum Kemenag + Merdeka"
        },
        {
            id: "smk",
            nama: "SMK",
            icon: "⚙️",
            color: "orange",
            tingkat: [
                { nama: "Kelas X", siswa: 200 },
                { nama: "Kelas XI RPL", siswa: 35 },
                { nama: "Kelas XI TKJ", siswa: 40 },
                { nama: "Kelas XI MM", siswa: 30 },
                { nama: "Kelas XII RPL", siswa: 32 },
                { nama: "Kelas XII TKJ", siswa: 38 },
                { nama: "Kelas XII MM", siswa: 28 },
            ],
            totalSiswa: 403,
            totalKelas: 14,
            kurikulum: "Kurikulum Merdeka SMK"
        },
    ];

    const selectedData = jenjangList.find(j => j.id === selectedJenjang);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Tingkat & Jenjang</h2>
                        <p className="text-slate-400">Kelola tingkat dan jenjang pendidikan nasional</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Settings size={16} /> Pengaturan Jenjang
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <School className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Jenjang Aktif</div>
                                <div className="text-xl font-bold text-white">{jenjangList.length}</div>
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
                                <div className="text-xl font-bold text-white">{jenjangList.reduce((a, b) => a + b.totalSiswa, 0).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Kelas</div>
                                <div className="text-xl font-bold text-white">{jenjangList.reduce((a, b) => a + b.totalKelas, 0)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <School className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Tingkat</div>
                                <div className="text-xl font-bold text-white">{jenjangList.reduce((a, b) => a + b.tingkat.length, 0)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold text-white">Daftar Jenjang</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jenjangList.map((jenjang) => (
                                <button
                                    key={jenjang.id}
                                    onClick={() => setSelectedJenjang(jenjang.id)}
                                    className={`bg-slate-900 border rounded-xl p-4 text-left transition-all hover:border-blue-500 ${selectedJenjang === jenjang.id ? 'border-blue-500' : 'border-slate-800'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{jenjang.icon}</span>
                                            <div>
                                                <h4 className="font-medium text-white">{jenjang.nama}</h4>
                                                <p className="text-sm text-slate-400">{jenjang.totalSiswa} siswa • {jenjang.totalKelas} kelas</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Detail Tingkat</h3>
                        {selectedData ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{selectedData.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-white">{selectedData.nama}</h4>
                                        <p className="text-sm text-slate-400">{selectedData.kurikulum}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {selectedData.tingkat.map((t, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                                            <span className="text-slate-300">{t.nama}</span>
                                            <span className="text-slate-500">{t.siswa} siswa</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-500">
                                <School className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Pilih jenjang untuk melihat detail tingkat</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
