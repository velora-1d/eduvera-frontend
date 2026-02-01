"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, FileText, Plus } from "lucide-react";

export default function KepesantrenanPage() {
    const [activeTab, setActiveTab] = useState("absensi");
    const [absensiData] = useState([
        { id: 1, name: "Ahmad Fulan", status: "hadir", waktu: "06:00" },
        { id: 2, name: "Muhammad Hasan", status: "hadir", waktu: "06:05" },
        { id: 3, name: "Abdullah Zaini", status: "izin", waktu: "-" },
        { id: 4, name: "Umar Faruq", status: "alpha", waktu: "-" },
    ]);

    const [pelanggaranData] = useState([
        { id: 1, santri: "Ahmad Fulan", jenis: "Terlambat Sholat", tingkat: "ringan", tanggal: "2024-01-15", status: "selesai" },
        { id: 2, santri: "Muhammad Hasan", jenis: "Keluar Tanpa Izin", tingkat: "sedang", tanggal: "2024-01-14", status: "proses" },
    ]);

    const [perizinanData] = useState([
        { id: 1, santri: "Abdullah Zaini", alasan: "Sakit", tanggal_keluar: "2024-01-15", tanggal_kembali: "2024-01-17", status: "aktif" },
        { id: 2, santri: "Umar Faruq", alasan: "Keperluan Keluarga", tanggal_keluar: "2024-01-10", tanggal_kembali: "2024-01-12", status: "selesai" },
    ]);

    const tabs = [
        { id: "absensi", label: "Absensi", icon: CheckCircle2 },
        { id: "pelanggaran", label: "Pelanggaran", icon: AlertCircle },
        { id: "perizinan", label: "Perizinan", icon: FileText },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Kepesantrenan</h2>
                        <p className="text-slate-400">Absensi, pelanggaran, dan perizinan santri</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Data
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Kehadiran Hari Ini</div>
                                <div className="text-xl font-bold text-emerald-500">92%</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Pelanggaran Aktif</div>
                                <div className="text-xl font-bold text-red-500">{pelanggaranData.filter(p => p.status === 'proses').length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Izin Berjalan</div>
                                <div className="text-xl font-bold text-blue-500">{perizinanData.filter(p => p.status === 'aktif').length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                    ? "text-emerald-500 border-emerald-500"
                                    : "text-slate-400 border-transparent hover:text-white"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {activeTab === "absensi" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Waktu</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {absensiData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white">{item.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === 'hadir' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    item.status === 'izin' ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-red-500/10 text-red-500'
                                                }`}>{item.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{item.waktu}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "pelanggaran" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Santri</th>
                                    <th className="px-6 py-4 font-medium">Jenis</th>
                                    <th className="px-6 py-4 font-medium">Tingkat</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {pelanggaranData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white">{item.santri}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jenis}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.tingkat === 'ringan' ? 'bg-amber-500/10 text-amber-500' :
                                                    item.tingkat === 'sedang' ? 'bg-orange-500/10 text-orange-500' :
                                                        'bg-red-500/10 text-red-500'
                                                }`}>{item.tingkat}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === 'selesai' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                }`}>{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "perizinan" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Santri</th>
                                    <th className="px-6 py-4 font-medium">Alasan</th>
                                    <th className="px-6 py-4 font-medium">Tanggal</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {perizinanData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white">{item.santri}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.alasan}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.tanggal_keluar} - {item.tanggal_kembali}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === 'aktif' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                                                }`}>{item.status}</span>
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
