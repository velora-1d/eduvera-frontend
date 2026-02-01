"use client";

import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function JadwalPage() {
    const [jadwalList] = useState([
        { id: 1, jam: "07:00 - 07:45", senin: "Upacara", selasa: "Matematika", rabu: "Fisika", kamis: "Bahasa Indonesia", jumat: "Olahraga" },
        { id: 2, jam: "07:45 - 08:30", senin: "Matematika", selasa: "Matematika", rabu: "Fisika", kamis: "Bahasa Indonesia", jumat: "Olahraga" },
        { id: 3, jam: "08:30 - 09:15", senin: "Matematika", selasa: "Bahasa Inggris", rabu: "Kimia", kamis: "PKN", jumat: "Agama" },
        { id: 4, jam: "09:30 - 10:15", senin: "Fisika", selasa: "Bahasa Inggris", rabu: "Kimia", kamis: "PKN", jumat: "Agama" },
        { id: 5, jam: "10:15 - 11:00", senin: "Fisika", selasa: "Sejarah", rabu: "Biologi", kamis: "Seni", jumat: "Ekstrakurikuler" },
    ]);

    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Jadwal Pelajaran</h2>
                        <p className="text-slate-400">Jadwal kegiatan belajar mengajar</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm">
                            Minggu Ini
                        </span>
                        <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Hari Ini</div>
                                <div className="text-xl font-bold text-white">Senin, 15 Januari 2024</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Jam Pelajaran</div>
                                <div className="text-xl font-bold text-white">5 Jam/Hari</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-4 py-4 font-medium sticky left-0 bg-slate-900">Jam</th>
                                    {days.map((day) => (
                                        <th key={day} className="px-4 py-4 font-medium text-center">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {jadwalList.map((jadwal) => (
                                    <tr key={jadwal.id} className="hover:bg-slate-800/50">
                                        <td className="px-4 py-3 font-medium text-white sticky left-0 bg-slate-900">{jadwal.jam}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs">{jadwal.senin}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs">{jadwal.selasa}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs">{jadwal.rabu}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs">{jadwal.kamis}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs">{jadwal.jumat}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
