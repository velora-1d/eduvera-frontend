"use client";

import { useState } from "react";
import { Users, BookOpen, Plus, Search, Edit, UserCheck, GraduationCap } from "lucide-react";

export default function RombelPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJenjang, setSelectedJenjang] = useState("all");
    const [selectedTahun, setSelectedTahun] = useState("2024/2025");

    const [rombelList] = useState([
        { id: 1, nama: "XII IPA 1", jenjang: "SMA", tingkat: "XII", jurusan: "IPA", siswa: 32, waliKelas: "Drs. Ahmad Hidayat", ruang: "R-301" },
        { id: 2, nama: "XII IPA 2", jenjang: "SMA", tingkat: "XII", jurusan: "IPA", siswa: 30, waliKelas: "Sri Wahyuni, S.Pd", ruang: "R-302" },
        { id: 3, nama: "XII IPS 1", jenjang: "SMA", tingkat: "XII", jurusan: "IPS", siswa: 28, waliKelas: "Muh. Farhan, M.Pd", ruang: "R-303" },
        { id: 4, nama: "XI IPA 1", jenjang: "SMA", tingkat: "XI", jurusan: "IPA", siswa: 34, waliKelas: "Dewi Safitri, S.Pd", ruang: "R-201" },
        { id: 5, nama: "XI IPA 2", jenjang: "SMA", tingkat: "XI", jurusan: "IPA", siswa: 32, waliKelas: "Hadi Susanto, S.Pd", ruang: "R-202" },
        { id: 6, nama: "X-1", jenjang: "SMA", tingkat: "X", jurusan: "-", siswa: 36, waliKelas: "Rina Kartika, S.Pd", ruang: "R-101" },
        { id: 7, nama: "X-2", jenjang: "SMA", tingkat: "X", jurusan: "-", siswa: 35, waliKelas: "Eko Prasetyo, S.Pd", ruang: "R-102" },
        { id: 8, nama: "XII RPL", jenjang: "SMK", tingkat: "XII", jurusan: "RPL", siswa: 30, waliKelas: "Andi Wijaya, S.Kom", ruang: "Lab-1" },
        { id: 9, nama: "XII TKJ", jenjang: "SMK", tingkat: "XII", jurusan: "TKJ", siswa: 32, waliKelas: "Budi Santoso, S.T", ruang: "Lab-2" },
    ]);

    const [penugasanList] = useState([
        { id: 1, guru: "Drs. Ahmad Hidayat", mapel: "Matematika", kelas: ["XII IPA 1", "XII IPA 2", "XI IPA 1"], jam: 12 },
        { id: 2, guru: "Sri Wahyuni, S.Pd", mapel: "Bahasa Indonesia", kelas: ["XII IPA 1", "XII IPA 2", "XII IPS 1"], jam: 15 },
        { id: 3, guru: "Muh. Farhan, M.Pd", mapel: "Fisika", kelas: ["XII IPA 1", "XI IPA 1", "XI IPA 2"], jam: 12 },
        { id: 4, guru: "Dewi Safitri, S.Pd", mapel: "Bahasa Inggris", kelas: ["X-1", "X-2", "XI IPA 1"], jam: 9 },
    ]);

    const [activeTab, setActiveTab] = useState("rombel");

    const jenjangOptions = ["all", "SMA", "SMK", "SMP", "SD"];

    const filteredRombel = rombelList.filter(r => {
        const matchSearch = r.nama.toLowerCase().includes(searchTerm.toLowerCase()) || r.waliKelas.toLowerCase().includes(searchTerm.toLowerCase());
        const matchJenjang = selectedJenjang === "all" || r.jenjang === selectedJenjang;
        return matchSearch && matchJenjang;
    });

    const tabs = [
        { id: "rombel", label: "Rombongan Belajar", icon: Users },
        { id: "penugasan", label: "Penugasan Guru", icon: UserCheck },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Rombel & Penugasan</h2>
                        <p className="text-slate-400">Kelola rombongan belajar dan penugasan guru</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> {activeTab === "rombel" ? "Tambah Rombel" : "Tambah Penugasan"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Rombel</div>
                                <div className="text-xl font-bold text-white">{rombelList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Siswa</div>
                                <div className="text-xl font-bold text-white">{rombelList.reduce((a, b) => a + b.siswa, 0)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Guru Mengajar</div>
                                <div className="text-xl font-bold text-white">{penugasanList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Tahun Ajaran</div>
                                <div className="text-xl font-bold text-white">{selectedTahun}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex gap-2 border-b border-slate-800 flex-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                    ? "text-blue-500 border-blue-500"
                                    : "text-slate-400 border-transparent hover:text-white"
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {activeTab === "rombel" && (
                        <select
                            value={selectedJenjang}
                            onChange={(e) => setSelectedJenjang(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        >
                            {jenjangOptions.map(j => (
                                <option key={j} value={j}>{j === "all" ? "Semua Jenjang" : j}</option>
                            ))}
                        </select>
                    )}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {activeTab === "rombel" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama Rombel</th>
                                    <th className="px-6 py-4 font-medium">Jenjang</th>
                                    <th className="px-6 py-4 font-medium">Tingkat</th>
                                    <th className="px-6 py-4 font-medium">Jurusan</th>
                                    <th className="px-6 py-4 font-medium text-center">Siswa</th>
                                    <th className="px-6 py-4 font-medium">Wali Kelas</th>
                                    <th className="px-6 py-4 font-medium">Ruang</th>
                                    <th className="px-6 py-4 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredRombel.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{item.jenjang}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{item.tingkat}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jurusan}</td>
                                        <td className="px-6 py-4 text-center text-white">{item.siswa}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.waliKelas}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.ruang}</td>
                                        <td className="px-6 py-4">
                                            <button className="p-1 hover:bg-slate-700 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "penugasan" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama Guru</th>
                                    <th className="px-6 py-4 font-medium">Mata Pelajaran</th>
                                    <th className="px-6 py-4 font-medium">Kelas Mengajar</th>
                                    <th className="px-6 py-4 font-medium text-center">Jam/Minggu</th>
                                    <th className="px-6 py-4 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {penugasanList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.guru}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.mapel}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.kelas.map((k, i) => (
                                                    <span key={i} className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">{k}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-white">{item.jam}</td>
                                        <td className="px-6 py-4">
                                            <button className="p-1 hover:bg-slate-700 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
                                        </td>
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
