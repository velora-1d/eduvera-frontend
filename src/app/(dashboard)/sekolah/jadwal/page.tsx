"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, Clock, Pencil, Trash2, Loader2, Save } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface ScheduleItem {
    id: string;
    day: number; // 0-6 (Senin-Sabtu)
    hour: number; // 1-8
    subject: string;
    teacher: string;
    room?: string;
}

interface Teacher {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    name: string;
}

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const HOURS = [
    { num: 1, time: "07:00 - 07:45" },
    { num: 2, time: "07:45 - 08:30" },
    { num: 3, time: "08:30 - 09:15" },
    { num: 4, time: "09:15 - 10:00" },
    { num: 5, time: "10:15 - 11:00" },
    { num: 6, time: "11:00 - 11:45" },
    { num: 7, time: "12:30 - 13:15" },
    { num: 8, time: "13:15 - 14:00" },
];

export default function JadwalPage() {
    const [selectedKelas, setSelectedKelas] = useState("7A");
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: number; hour: number } | null>(null);
    const [formData, setFormData] = useState({ subject: "", teacher: "", room: "" });

    const kelasList = ["7A", "7B", "8A", "8B", "9A", "9B"];

    useEffect(() => {
        loadData();
    }, [selectedKelas]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Mock data - replace with API
            setTeachers([
                { id: "1", name: "Pak Ahmad" },
                { id: "2", name: "Bu Siti" },
                { id: "3", name: "Pak Budi" },
                { id: "4", name: "Bu Ani" },
            ]);

            setSubjects([
                { id: "1", name: "Matematika" },
                { id: "2", name: "Bahasa Indonesia" },
                { id: "3", name: "Bahasa Inggris" },
                { id: "4", name: "IPA" },
                { id: "5", name: "IPS" },
                { id: "6", name: "PKN" },
                { id: "7", name: "Pend. Agama" },
                { id: "8", name: "Olahraga" },
            ]);

            // Mock schedule
            setSchedule([
                { id: "1", day: 0, hour: 1, subject: "Matematika", teacher: "Pak Ahmad", room: "A1" },
                { id: "2", day: 0, hour: 2, subject: "Matematika", teacher: "Pak Ahmad", room: "A1" },
                { id: "3", day: 0, hour: 3, subject: "B. Indonesia", teacher: "Bu Siti", room: "A1" },
                { id: "4", day: 1, hour: 1, subject: "IPA", teacher: "Pak Budi", room: "Lab" },
                { id: "5", day: 2, hour: 5, subject: "Olahraga", teacher: "Bu Ani", room: "Lap" },
            ]);
        } catch (error) {
            console.error("Failed to load schedule", error);
        } finally {
            setLoading(false);
        }
    };

    const getScheduleItem = (day: number, hour: number): ScheduleItem | undefined => {
        return schedule.find((s) => s.day === day && s.hour === hour);
    };

    const handleSlotClick = (day: number, hour: number) => {
        setSelectedSlot({ day, hour });
        const existing = getScheduleItem(day, hour);
        if (existing) {
            setFormData({ subject: existing.subject, teacher: existing.teacher, room: existing.room || "" });
        } else {
            setFormData({ subject: "", teacher: "", room: "" });
        }
        setIsEditModalOpen(true);
    };

    const handleSaveSlot = async () => {
        if (!selectedSlot) return;

        const existingIndex = schedule.findIndex(
            (s) => s.day === selectedSlot.day && s.hour === selectedSlot.hour
        );

        if (formData.subject === "" && formData.teacher === "") {
            // Remove slot
            if (existingIndex >= 0) {
                setSchedule(schedule.filter((_, i) => i !== existingIndex));
            }
        } else {
            const newItem: ScheduleItem = {
                id: existingIndex >= 0 ? schedule[existingIndex].id : Date.now().toString(),
                day: selectedSlot.day,
                hour: selectedSlot.hour,
                subject: formData.subject,
                teacher: formData.teacher,
                room: formData.room,
            };

            if (existingIndex >= 0) {
                const newSchedule = [...schedule];
                newSchedule[existingIndex] = newItem;
                setSchedule(newSchedule);
            } else {
                setSchedule([...schedule, newItem]);
            }
        }

        setIsEditModalOpen(false);
        setSelectedSlot(null);
    };

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // TODO: API call to save schedule
            await new Promise((resolve) => setTimeout(resolve, 1000));
            alert("Jadwal berhasil disimpan!");
        } catch (error) {
            console.error("Failed to save", error);
            alert("Gagal menyimpan jadwal");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Jadwal Pelajaran</h2>
                        <p className="text-slate-400">Kelola jadwal pelajaran per kelas</p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedKelas}
                            onChange={(e) => setSelectedKelas(e.target.value)}
                            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        >
                            {kelasList.map((k) => (
                                <option key={k} value={k}>Kelas {k}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleSaveAll}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Simpan
                        </button>
                    </div>
                </div>

                {/* Schedule Grid */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800">
                                        <th className="w-24 px-4 py-3 text-left text-sm font-medium text-slate-400">Jam</th>
                                        {DAYS.map((day) => (
                                            <th key={day} className="px-4 py-3 text-center text-sm font-medium text-slate-400">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {HOURS.map((hourInfo) => (
                                        <tr key={hourInfo.num} className="border-b border-slate-800">
                                            <td className="px-4 py-2 text-xs text-slate-500">
                                                <div className="font-medium text-slate-300">Jam {hourInfo.num}</div>
                                                <div>{hourInfo.time}</div>
                                            </td>
                                            {DAYS.map((_, dayIndex) => {
                                                const item = getScheduleItem(dayIndex, hourInfo.num);
                                                return (
                                                    <td key={dayIndex} className="px-2 py-2">
                                                        <button
                                                            onClick={() => handleSlotClick(dayIndex, hourInfo.num)}
                                                            className={`w-full min-h-[60px] rounded-lg p-2 text-left transition-colors ${item
                                                                    ? "bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30"
                                                                    : "bg-slate-800/50 border border-slate-700 hover:bg-slate-800"
                                                                }`}
                                                        >
                                                            {item ? (
                                                                <div>
                                                                    <div className="text-sm font-medium text-white truncate">
                                                                        {item.subject}
                                                                    </div>
                                                                    <div className="text-xs text-slate-400 truncate">
                                                                        {item.teacher}
                                                                    </div>
                                                                    {item.room && (
                                                                        <div className="text-xs text-slate-500">
                                                                            {item.room}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center justify-center h-full">
                                                                    <Plus size={16} className="text-slate-600" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
                        <span>Terisi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700"></div>
                        <span>Kosong</span>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={`Jadwal ${selectedSlot ? DAYS[selectedSlot.day] : ""} Jam ${selectedSlot?.hour || ""}`}
                size="md"
                footer={
                    <>
                        <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                            Batal
                        </button>
                        <button
                            onClick={handleSaveSlot}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                        >
                            Simpan
                        </button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Mata Pelajaran</label>
                        <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Pilih Mata Pelajaran</option>
                            {subjects.map((s) => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Pengajar</label>
                        <select
                            value={formData.teacher}
                            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Pilih Pengajar</option>
                            {teachers.map((t) => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Ruangan (opsional)</label>
                        <input
                            type="text"
                            value={formData.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            placeholder="Contoh: A1, Lab, Lap"
                        />
                    </div>
                    {getScheduleItem(selectedSlot?.day || 0, selectedSlot?.hour || 0) && (
                        <button
                            onClick={() => {
                                setFormData({ subject: "", teacher: "", room: "" });
                                handleSaveSlot();
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                        >
                            <Trash2 size={16} /> Hapus Jadwal
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
}
