"use client";

import { useState } from "react";
import { FileText, GraduationCap, CheckCircle, Clock, Plus, Search, Download, Upload } from "lucide-react";

export default function NilaiPage() {
    const [activeTab, setActiveTab] = useState("input");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("all");
    const [selectedMapel, setSelectedMapel] = useState("all");

    const [nilaiList] = useState([
        { id: 1, nis: "12345", nama: "Ahmad Fauzi", kelas: "XII IPA 1", mapel: "Matematika", uh1: 85, uh2: 88, uts: 82, uas: 90, rata: 86 },
        { id: 2, nis: "12346", nama: "Siti Aminah", kelas: "XII IPA 1", mapel: "Matematika", uh1: 90, uh2: 92, uts: 88, uas: 95, rata: 91 },
        { id: 3, nis: "12347", nama: "Budi Santoso", kelas: "XII IPA 1", mapel: "Matematika", uh1: 75, uh2: 78, uts: 72, uas: 80, rata: 76 },
        { id: 4, nis: "12348", nama: "Dewi Lestari", kelas: "XII IPA 1", mapel: "Matematika", uh1: 88, uh2: 85, uts: 90, uas: 88, rata: 88 },
    ]);

    const [raporList] = useState([
        { id: 1, kelas: "XII IPA 1", walikelas: "Drs. Ahmad Hidayat", siswa: 32, status: "Draft", progress: 75 },
        { id: 2, kelas: "XII IPA 2", walikelas: "Sri Wahyuni, S.Pd", siswa: 30, status: "Draft", progress: 60 },
        { id: 3, kelas: "XI IPA 1", walikelas: "Muh. Farhan, M.Pd", siswa: 34, status: "Proses", progress: 40 },
    ]);

    const tabs = [
        { id: "input", label: "Input Nilai", icon: Upload },
        { id: "rekap", label: "Rekap Nilai", icon: FileText },
        { id: "rapor", label: "E-Rapor", icon: GraduationCap },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Nilai & E-Rapor</h2>
                        <p className="text-slate-400">Input nilai dan generate rapor siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">
                            <Download size={16} /> Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                            <Plus size={16} /> Input Nilai
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Upload className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Nilai Masuk</div>
                                <div className="text-xl font-bold text-white">1,245</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Rapor Selesai</div>
                                <div className="text-xl font-bold text-white">5</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Rapor Draft</div>
                                <div className="text-xl font-bold text-white">12</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Siswa</div>
                                <div className="text-xl font-bold text-white">450</div>
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
                    <select
                        value={selectedKelas}
                        onChange={(e) => setSelectedKelas(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="all">Semua Kelas</option>
                        <option value="XII IPA 1">XII IPA 1</option>
                        <option value="XII IPA 2">XII IPA 2</option>
                        <option value="XI IPA 1">XI IPA 1</option>
                    </select>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari siswa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {(activeTab === "input" || activeTab === "rekap") && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">NIS</th>
                                    <th className="px-6 py-4 font-medium">Nama Siswa</th>
                                    <th className="px-6 py-4 font-medium">Kelas</th>
                                    <th className="px-6 py-4 font-medium text-center">UH 1</th>
                                    <th className="px-6 py-4 font-medium text-center">UH 2</th>
                                    <th className="px-6 py-4 font-medium text-center">UTS</th>
                                    <th className="px-6 py-4 font-medium text-center">UAS</th>
                                    <th className="px-6 py-4 font-medium text-center">Rata-rata</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {nilaiList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-slate-300">{item.nis}</td>
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.kelas}</td>
                                        <td className="px-6 py-4 text-center text-slate-300">{item.uh1}</td>
                                        <td className="px-6 py-4 text-center text-slate-300">{item.uh2}</td>
                                        <td className="px-6 py-4 text-center text-slate-300">{item.uts}</td>
                                        <td className="px-6 py-4 text-center text-slate-300">{item.uas}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.rata >= 85 ? "bg-emerald-500/10 text-emerald-500" : item.rata >= 75 ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"}`}>
                                                {item.rata}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "rapor" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Kelas</th>
                                    <th className="px-6 py-4 font-medium">Wali Kelas</th>
                                    <th className="px-6 py-4 font-medium">Jumlah Siswa</th>
                                    <th className="px-6 py-4 font-medium">Progress</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {raporList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.kelas}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.walikelas}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.siswa} siswa</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-700 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.progress}%` }}></div>
                                                </div>
                                                <span className="text-slate-400 text-xs">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === "Draft" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-500 hover:text-blue-400 text-sm">Generate</button>
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
