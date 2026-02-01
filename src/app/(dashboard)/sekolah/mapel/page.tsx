"use client";

import { useState } from "react";
import { BookOpen, BookMarked, Plus, Search, GraduationCap, Edit, Trash2 } from "lucide-react";

export default function MapelPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKelompok, setSelectedKelompok] = useState("all");
    const [selectedJenjang, setSelectedJenjang] = useState("all");

    const [mapelList] = useState([
        // Mapel Umum
        { id: 1, kode: "MTK", nama: "Matematika", kelompok: "Wajib", jenjang: "SMA", kkm: 75, jam: 4 },
        { id: 2, kode: "BIN", nama: "Bahasa Indonesia", kelompok: "Wajib", jenjang: "SMA", kkm: 75, jam: 4 },
        { id: 3, kode: "BIG", nama: "Bahasa Inggris", kelompok: "Wajib", jenjang: "SMA", kkm: 75, jam: 3 },
        { id: 4, kode: "PKN", nama: "Pendidikan Kewarganegaraan", kelompok: "Wajib", jenjang: "SMA", kkm: 75, jam: 2 },
        // Mapel Keagamaan
        { id: 5, kode: "PAI", nama: "Pendidikan Agama Islam", kelompok: "Keagamaan", jenjang: "SMA", kkm: 75, jam: 3 },
        { id: 6, kode: "BAR", nama: "Bahasa Arab", kelompok: "Keagamaan", jenjang: "MA", kkm: 70, jam: 2 },
        { id: 7, kode: "FIQ", nama: "Fiqih", kelompok: "Keagamaan", jenjang: "MA", kkm: 70, jam: 2 },
        // Mapel Peminatan
        { id: 8, kode: "FIS", nama: "Fisika", kelompok: "Peminatan IPA", jenjang: "SMA", kkm: 70, jam: 4 },
        { id: 9, kode: "KIM", nama: "Kimia", kelompok: "Peminatan IPA", jenjang: "SMA", kkm: 70, jam: 4 },
        { id: 10, kode: "BIO", nama: "Biologi", kelompok: "Peminatan IPA", jenjang: "SMA", kkm: 70, jam: 4 },
        { id: 11, kode: "EKO", nama: "Ekonomi", kelompok: "Peminatan IPS", jenjang: "SMA", kkm: 70, jam: 4 },
        // Mapel Produktif SMK
        { id: 12, kode: "PBO", nama: "Pemrograman Berorientasi Objek", kelompok: "Produktif", jenjang: "SMK", kkm: 75, jam: 6 },
        { id: 13, kode: "BDD", nama: "Basis Data", kelompok: "Produktif", jenjang: "SMK", kkm: 75, jam: 4 },
        // Aspek Perkembangan PAUD
        { id: 14, kode: "NAM", nama: "Nilai Agama & Moral", kelompok: "Perkembangan", jenjang: "TK", kkm: null, jam: null },
        { id: 15, kode: "FMK", nama: "Fisik Motorik", kelompok: "Perkembangan", jenjang: "TK", kkm: null, jam: null },
    ]);

    const kelompokOptions = ["all", "Wajib", "Keagamaan", "Peminatan IPA", "Peminatan IPS", "Produktif", "Perkembangan"];
    const jenjangOptions = ["all", "TK", "SD", "MI", "SMP", "MTs", "SMA", "MA", "SMK"];

    const filteredMapel = mapelList.filter(m => {
        const matchSearch = m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.kode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchKelompok = selectedKelompok === "all" || m.kelompok === selectedKelompok;
        const matchJenjang = selectedJenjang === "all" || m.jenjang === selectedJenjang;
        return matchSearch && matchKelompok && matchJenjang;
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Mata Pelajaran</h2>
                        <p className="text-slate-400">Kelola mata pelajaran per jenjang</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Mapel
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Mapel</div>
                                <div className="text-xl font-bold text-white">{mapelList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <BookMarked className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Mapel Wajib</div>
                                <div className="text-xl font-bold text-white">{mapelList.filter(m => m.kelompok === "Wajib").length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Mapel Keagamaan</div>
                                <div className="text-xl font-bold text-white">{mapelList.filter(m => m.kelompok === "Keagamaan").length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <BookOpen className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Mapel Produktif</div>
                                <div className="text-xl font-bold text-white">{mapelList.filter(m => m.kelompok === "Produktif").length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    <select
                        value={selectedJenjang}
                        onChange={(e) => setSelectedJenjang(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        {jenjangOptions.map(j => (
                            <option key={j} value={j}>{j === "all" ? "Semua Jenjang" : j}</option>
                        ))}
                    </select>
                    <select
                        value={selectedKelompok}
                        onChange={(e) => setSelectedKelompok(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        {kelompokOptions.map(k => (
                            <option key={k} value={k}>{k === "all" ? "Semua Kelompok" : k}</option>
                        ))}
                    </select>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari mapel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Kode</th>
                                <th className="px-6 py-4 font-medium">Nama Mapel</th>
                                <th className="px-6 py-4 font-medium">Jenjang</th>
                                <th className="px-6 py-4 font-medium">Kelompok</th>
                                <th className="px-6 py-4 font-medium text-center">KKM</th>
                                <th className="px-6 py-4 font-medium text-center">Jam/Minggu</th>
                                <th className="px-6 py-4 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredMapel.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{item.kode}</td>
                                    <td className="px-6 py-4 text-slate-300">{item.nama}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{item.jenjang}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${item.kelompok === "Wajib" ? "bg-blue-500/10 text-blue-500" :
                                                item.kelompok === "Keagamaan" ? "bg-purple-500/10 text-purple-500" :
                                                    item.kelompok === "Produktif" ? "bg-amber-500/10 text-amber-500" :
                                                        "bg-emerald-500/10 text-emerald-500"
                                            }`}>
                                            {item.kelompok}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-300">{item.kkm ?? "-"}</td>
                                    <td className="px-6 py-4 text-center text-slate-300">{item.jam ?? "-"}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-1 hover:bg-slate-700 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
                                            <button className="p-1 hover:bg-slate-700 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button>
                                        </div>
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
