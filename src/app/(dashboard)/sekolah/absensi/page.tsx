"use client";

import { useState } from "react";
import { Users, CheckCircle, XCircle, Clock, Search, Calendar, Download } from "lucide-react";

export default function AbsensiPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("XII IPA 1");
    const [selectedTanggal, setSelectedTanggal] = useState("2025-02-01");

    const [absensiList] = useState([
        { id: 1, nis: "12345", nama: "Ahmad Fauzi", kelas: "XII IPA 1", status: "Hadir", waktu: "07:15" },
        { id: 2, nis: "12346", nama: "Siti Aminah", kelas: "XII IPA 1", status: "Hadir", waktu: "07:10" },
        { id: 3, nis: "12347", nama: "Budi Santoso", kelas: "XII IPA 1", status: "Izin", waktu: "-", keterangan: "Sakit (Surat Dokter)" },
        { id: 4, nis: "12348", nama: "Dewi Lestari", kelas: "XII IPA 1", status: "Hadir", waktu: "07:20" },
        { id: 5, nis: "12349", nama: "Eko Prasetyo", kelas: "XII IPA 1", status: "Hadir", waktu: "07:05" },
        { id: 6, nis: "12350", nama: "Fitri Handayani", kelas: "XII IPA 1", status: "Sakit", waktu: "-", keterangan: "Demam" },
        { id: 7, nis: "12351", nama: "Gunawan Wibowo", kelas: "XII IPA 1", status: "Hadir", waktu: "07:25" },
        { id: 8, nis: "12352", nama: "Hani Susanti", kelas: "XII IPA 1", status: "Alpha", waktu: "-" },
    ]);

    const kelasOptions = ["XII IPA 1", "XII IPA 2", "XII IPS 1", "XI IPA 1", "XI IPA 2", "X-1", "X-2"];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hadir": return "bg-emerald-500/10 text-emerald-500";
            case "Izin": return "bg-amber-500/10 text-amber-500";
            case "Sakit": return "bg-blue-500/10 text-blue-500";
            case "Alpha": return "bg-red-500/10 text-red-500";
            default: return "bg-slate-500/10 text-slate-500";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Hadir": return <CheckCircle className="w-4 h-4" />;
            case "Izin": return <Clock className="w-4 h-4" />;
            case "Sakit": return <Clock className="w-4 h-4" />;
            case "Alpha": return <XCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const stats = {
        hadir: absensiList.filter(a => a.status === "Hadir").length,
        izin: absensiList.filter(a => a.status === "Izin").length,
        sakit: absensiList.filter(a => a.status === "Sakit").length,
        alpha: absensiList.filter(a => a.status === "Alpha").length,
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Absensi Siswa</h2>
                        <p className="text-slate-400">Kelola kehadiran siswa harian</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium">
                        <Download size={16} /> Export Rekap
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Hadir</div>
                                <div className="text-xl font-bold text-white">{stats.hadir}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Izin</div>
                                <div className="text-xl font-bold text-white">{stats.izin}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Sakit</div>
                                <div className="text-xl font-bold text-white">{stats.sakit}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Alpha</div>
                                <div className="text-xl font-bold text-white">{stats.alpha}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <input
                            type="date"
                            value={selectedTanggal}
                            onChange={(e) => setSelectedTanggal(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={selectedKelas}
                        onChange={(e) => setSelectedKelas(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        {kelasOptions.map(k => (
                            <option key={k} value={k}>{k}</option>
                        ))}
                    </select>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari siswa..."
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
                                <th className="px-6 py-4 font-medium">NIS</th>
                                <th className="px-6 py-4 font-medium">Nama Siswa</th>
                                <th className="px-6 py-4 font-medium">Kelas</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Waktu</th>
                                <th className="px-6 py-4 font-medium">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {absensiList.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-slate-300">{item.nis}</td>
                                    <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                    <td className="px-6 py-4 text-slate-300">{item.kelas}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                                            {getStatusIcon(item.status)}
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{item.waktu}</td>
                                    <td className="px-6 py-4 text-slate-400">{item.keterangan || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
