"use client";

import { useState } from "react";
import { BookOpen, GraduationCap, FileText, Settings, Plus, Search, BookMarked } from "lucide-react";

export default function KurikulumPage() {
    const [activeTab, setActiveTab] = useState("kurikulum");
    const [searchTerm, setSearchTerm] = useState("");

    const [kurikulumList] = useState([
        { id: 1, nama: "Kurikulum Merdeka", jenjang: "SMA", tahun: "2024/2025", status: "Aktif" },
        { id: 2, nama: "K13 Revisi", jenjang: "SMP", tahun: "2024/2025", status: "Aktif" },
        { id: 3, nama: "Kurikulum Merdeka", jenjang: "SD", tahun: "2024/2025", status: "Aktif" },
    ]);

    const [mapelList] = useState([
        { id: 1, kode: "MTK", nama: "Matematika", jenjang: "SMA", kelompok: "Wajib", kkm: 75 },
        { id: 2, kode: "BIN", nama: "Bahasa Indonesia", jenjang: "SMA", kelompok: "Wajib", kkm: 75 },
        { id: 3, kode: "BIG", nama: "Bahasa Inggris", jenjang: "SMA", kelompok: "Wajib", kkm: 75 },
        { id: 4, kode: "FIS", nama: "Fisika", jenjang: "SMA", kelompok: "Peminatan IPA", kkm: 70 },
        { id: 5, kode: "KIM", nama: "Kimia", jenjang: "SMA", kelompok: "Peminatan IPA", kkm: 70 },
        { id: 6, kode: "PAI", nama: "Pendidikan Agama Islam", jenjang: "SMA", kelompok: "Wajib", kkm: 75 },
    ]);

    const tabs = [
        { id: "kurikulum", label: "Kurikulum", icon: BookOpen },
        { id: "mapel", label: "Mata Pelajaran", icon: BookMarked },
        { id: "struktur", label: "Struktur", icon: FileText },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Kurikulum</h2>
                        <p className="text-slate-400">Kelola kurikulum dan mata pelajaran</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Kurikulum
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Kurikulum</div>
                                <div className="text-xl font-bold text-white">{kurikulumList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <BookMarked className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Mapel</div>
                                <div className="text-xl font-bold text-white">{mapelList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Jenjang Aktif</div>
                                <div className="text-xl font-bold text-white">3</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Settings className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Tahun Ajaran</div>
                                <div className="text-xl font-bold text-white">2024/2025</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
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
                    {activeTab === "kurikulum" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama Kurikulum</th>
                                    <th className="px-6 py-4 font-medium">Jenjang</th>
                                    <th className="px-6 py-4 font-medium">Tahun Ajaran</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {kurikulumList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jenjang}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.tahun}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-500">{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "mapel" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Kode</th>
                                    <th className="px-6 py-4 font-medium">Nama Mapel</th>
                                    <th className="px-6 py-4 font-medium">Jenjang</th>
                                    <th className="px-6 py-4 font-medium">Kelompok</th>
                                    <th className="px-6 py-4 font-medium">KKM</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {mapelList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.kode}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jenjang}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.kelompok === "Wajib" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"}`}>
                                                {item.kelompok}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{item.kkm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "struktur" && (
                        <div className="p-8 text-center text-slate-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Struktur kurikulum per jenjang akan ditampilkan di sini</p>
                            <p className="text-sm mt-2">Atur mata pelajaran, jam, dan komponen penilaian per tingkat</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
