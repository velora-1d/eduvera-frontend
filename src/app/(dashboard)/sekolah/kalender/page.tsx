"use client";

import { useState } from "react";
import { Calendar, FileText, BarChart3, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function KalenderPage() {
    const [activeTab, setActiveTab] = useState("kalender");
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [kegiatanList] = useState([
        { id: 1, tanggal: "2025-02-03", kegiatan: "Ujian Tengah Semester", jenis: "Akademik", warna: "blue" },
        { id: 2, tanggal: "2025-02-10", kegiatan: "Rapat Wali Murid", jenis: "Kegiatan", warna: "purple" },
        { id: 3, tanggal: "2025-02-14", kegiatan: "Class Meeting", jenis: "Kegiatan", warna: "emerald" },
        { id: 4, tanggal: "2025-02-17", kegiatan: "Libur Isra Miraj", jenis: "Libur", warna: "red" },
        { id: 5, tanggal: "2025-02-28", kegiatan: "Pembagian Rapor", jenis: "Akademik", warna: "blue" },
    ]);

    const [laporanList] = useState([
        { id: 1, nama: "Laporan Akademik Semester Ganjil", tanggal: "15 Jan 2025", status: "Selesai" },
        { id: 2, nama: "Laporan Keuangan Bulanan", tanggal: "30 Jan 2025", status: "Selesai" },
        { id: 3, nama: "Laporan Kehadiran Siswa", tanggal: "31 Jan 2025", status: "Proses" },
    ]);

    const tabs = [
        { id: "kalender", label: "Kalender Akademik", icon: Calendar },
        { id: "laporan", label: "Laporan", icon: BarChart3 },
    ];

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Kalender & Laporan</h2>
                        <p className="text-slate-400">Jadwal kegiatan dan laporan sekolah</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Kegiatan
                    </button>
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
                </div>

                {activeTab === "kalender" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendar */}
                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg">
                                        <ChevronLeft className="w-5 h-5 text-slate-400" />
                                    </button>
                                    <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg">
                                        <ChevronRight className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                                    <div key={day} className="text-center text-sm text-slate-500 py-2">{day}</div>
                                ))}
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="p-2"></div>
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const kegiatan = kegiatanList.find(k => k.tanggal === dateStr);
                                    return (
                                        <div
                                            key={day}
                                            className={`p-2 text-center rounded-lg cursor-pointer hover:bg-slate-800 ${kegiatan ? `bg-${kegiatan.warna}-500/10 border border-${kegiatan.warna}-500/30` : ""}`}
                                        >
                                            <span className={`text-sm ${kegiatan ? `text-${kegiatan.warna}-400` : "text-slate-300"}`}>{day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Kegiatan Mendatang</h3>
                            <div className="space-y-4">
                                {kegiatanList.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 bg-${item.warna}-500`}></div>
                                        <div>
                                            <p className="text-white text-sm font-medium">{item.kegiatan}</p>
                                            <p className="text-slate-500 text-xs">{item.tanggal} • {item.jenis}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "laporan" && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama Laporan</th>
                                    <th className="px-6 py-4 font-medium">Tanggal</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {laporanList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.tanggal}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === "Selesai" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-blue-500 hover:text-blue-400 text-sm">Download</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
