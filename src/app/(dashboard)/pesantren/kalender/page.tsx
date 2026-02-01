"use client";

import { useState } from "react";
import { Calendar, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function KalenderPage() {
    const [currentMonth] = useState(new Date());
    const [events] = useState([
        { id: 1, title: "Ujian Tengah Semester", date: "2024-02-15", type: "akademik", color: "blue" },
        { id: 2, title: "Haul Akbar", date: "2024-02-20", type: "keagamaan", color: "emerald" },
        { id: 3, title: "Libur Tahun Baru Hijriyah", date: "2024-02-28", type: "libur", color: "red" },
        { id: 4, title: "Rapat Wali Santri", date: "2024-02-10", type: "rapat", color: "amber" },
    ]);

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Kalender Akademik</h2>
                        <p className="text-slate-400">Jadwal kegiatan dan event pesantren</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Event
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar View */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">
                                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                                <div key={day} className="p-2 text-slate-500 text-sm font-medium">{day}</div>
                            ))}
                            {Array.from({ length: 35 }, (_, i) => (
                                <div
                                    key={i}
                                    className={`p-3 text-sm rounded-lg ${i === 14 ? 'bg-emerald-500/20 text-emerald-400 font-medium' :
                                            i % 7 === 0 ? 'text-red-400' : 'text-slate-300'
                                        } hover:bg-slate-800 cursor-pointer transition-colors`}
                                >
                                    {i < 31 ? i + 1 : ''}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Event Mendatang</h3>
                        <div className="space-y-4">
                            {events.map((event) => (
                                <div key={event.id} className="p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-3 h-3 mt-1.5 rounded-full bg-${event.color}-500`} />
                                        <div>
                                            <h4 className="text-sm font-medium text-white">{event.title}</h4>
                                            <p className="text-xs text-slate-400 mt-1">{event.date}</p>
                                            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded bg-${event.color}-500/10 text-${event.color}-400`}>
                                                {event.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
