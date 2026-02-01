"use client";

import { useState, useEffect } from "react";
import { Calendar, Check, X, Clock, Users, Download, Save, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { sekolahApi, exportApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/components/ui/Toast";

interface Student {
    id: string;
    name: string;
    nisn: string;
    kelas: string;
}

interface AttendanceRecord {
    student_id: string;
    status: "hadir" | "izin" | "sakit" | "alpha";
    note?: string;
}

interface DailyAttendance {
    date: string;
    kelas: string;
    records: AttendanceRecord[];
}

const STATUS_CONFIG = {
    hadir: { label: "Hadir", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    izin: { label: "Izin", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    sakit: { label: "Sakit", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    alpha: { label: "Alpha", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function AbsensiPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedKelas, setSelectedKelas] = useState("7A");
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Rekap modal
    const [isRekapOpen, setIsRekapOpen] = useState(false);
    const [rekapMonth, setRekapMonth] = useState(new Date().toISOString().slice(0, 7));

    const kelasList = ["7A", "7B", "8A", "8B", "9A", "9B"];

    useEffect(() => {
        loadData();
    }, [selectedDate, selectedKelas]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await sekolahApi.getSiswaList();
            const studentList = (res as any).data || res || [];
            setStudents(studentList);

            // Load existing attendance for this date/class
            const attendanceRes = await sekolahApi.getAttendance?.(selectedDate, selectedKelas);
            const existingRecords: AttendanceRecord[] = (attendanceRes as any)?.data || [];

            const attendanceMap: Record<string, AttendanceRecord> = {};
            existingRecords.forEach((r) => {
                attendanceMap[r.student_id] = r;
            });

            // Default to hadir for students without record
            studentList.forEach((s: Student) => {
                if (!attendanceMap[s.id]) {
                    attendanceMap[s.id] = { student_id: s.id, status: "hadir" };
                }
            });

            setAttendance(attendanceMap);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId: string, status: AttendanceRecord["status"]) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const records = Object.values(attendance);
            await sekolahApi.saveAttendance?.(selectedDate, selectedKelas, records);
            showToast("Absensi berhasil disimpan!", "success");
        } catch (error) {
            console.error("Failed to save", error);
            showToast("Gagal menyimpan absensi", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async (format: "pdf" | "xlsx") => {
        setExporting(true);
        try {
            const blob = await exportApi.exportAttendance?.(selectedKelas, rekapMonth, format);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `absensi_${selectedKelas}_${rekapMonth}.${format}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setExporting(false);
        }
    };

    const navigateDate = (direction: "prev" | "next") => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + (direction === "next" ? 1 : -1));
        setSelectedDate(date.toISOString().split("T")[0]);
    };

    const getStats = () => {
        const records = Object.values(attendance);
        return {
            hadir: records.filter((r) => r.status === "hadir").length,
            izin: records.filter((r) => r.status === "izin").length,
            sakit: records.filter((r) => r.status === "sakit").length,
            alpha: records.filter((r) => r.status === "alpha").length,
        };
    };

    const stats = getStats();

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Presensi Siswa</h2>
                        <p className="text-slate-400">Input dan kelola absensi harian siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsRekapOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
                        >
                            <Calendar size={16} /> Rekap Bulanan
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Simpan
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
                        <button onClick={() => navigateDate("prev")} className="p-1 hover:bg-slate-800 rounded">
                            <ChevronLeft size={18} className="text-slate-400" />
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-white border-none focus:outline-none"
                        />
                        <button onClick={() => navigateDate("next")} className="p-1 hover:bg-slate-800 rounded">
                            <ChevronRight size={18} className="text-slate-400" />
                        </button>
                    </div>

                    <select
                        value={selectedKelas}
                        onChange={(e) => setSelectedKelas(e.target.value)}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                        {kelasList.map((k) => (
                            <option key={k} value={k}>Kelas {k}</option>
                        ))}
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Check className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Hadir</div>
                                <div className="text-xl font-bold text-emerald-500">{stats.hadir}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Izin</div>
                                <div className="text-xl font-bold text-blue-500">{stats.izin}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Sakit</div>
                                <div className="text-xl font-bold text-amber-500">{stats.sakit}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <X className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Alpha</div>
                                <div className="text-xl font-bold text-red-500">{stats.alpha}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium w-12">No</th>
                                    <th className="px-6 py-4 font-medium">Nama Siswa</th>
                                    <th className="px-6 py-4 font-medium">NISN</th>
                                    <th className="px-6 py-4 font-medium text-center">Hadir</th>
                                    <th className="px-6 py-4 font-medium text-center">Izin</th>
                                    <th className="px-6 py-4 font-medium text-center">Sakit</th>
                                    <th className="px-6 py-4 font-medium text-center">Alpha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : students.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            Tidak ada siswa di kelas ini
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                                            <td className="px-6 py-4 font-medium text-white">{student.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{student.nisn}</td>
                                            {(["hadir", "izin", "sakit", "alpha"] as const).map((status) => (
                                                <td key={status} className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, status)}
                                                        className={`w-8 h-8 rounded-lg border transition-all ${attendance[student.id]?.status === status
                                                            ? `${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].border} ${STATUS_CONFIG[status].color}`
                                                            : "border-slate-700 text-slate-600 hover:border-slate-600"
                                                            }`}
                                                    >
                                                        {attendance[student.id]?.status === status && (
                                                            <Check size={16} className="mx-auto" />
                                                        )}
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Rekap Modal */}
            <Modal
                isOpen={isRekapOpen}
                onClose={() => setIsRekapOpen(false)}
                title="Rekap Absensi Bulanan"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Bulan</label>
                        <input
                            type="month"
                            value={rekapMonth}
                            onChange={(e) => setRekapMonth(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Kelas</label>
                        <select
                            value={selectedKelas}
                            onChange={(e) => setSelectedKelas(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        >
                            {kelasList.map((k) => (
                                <option key={k} value={k}>Kelas {k}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={exporting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            Export PDF
                        </button>
                        <button
                            onClick={() => handleExport("xlsx")}
                            disabled={exporting}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium disabled:opacity-50"
                        >
                            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            Export Excel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
