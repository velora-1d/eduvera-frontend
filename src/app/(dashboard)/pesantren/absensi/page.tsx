"use client";

import { useState, useEffect } from "react";
import { Calendar, Check, X, Clock, Users, Download, Save, Loader2, ChevronLeft, ChevronRight, Home, BookOpen } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface Santri {
    id: string;
    name: string;
    nis: string;
    asrama: string;
}

interface AttendanceRecord {
    santri_id: string;
    status: "hadir" | "izin" | "sakit" | "alpha";
    note?: string;
}

const STATUS_CONFIG = {
    hadir: { label: "Hadir", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    izin: { label: "Izin", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    sakit: { label: "Sakit", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    alpha: { label: "Alpha", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
};

type AttendanceType = "asrama" | "diniyah";

export default function AbsensiPesantrenPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedAsrama, setSelectedAsrama] = useState("putra_1");
    const [attendanceType, setAttendanceType] = useState<AttendanceType>("asrama");
    const [santriList, setSantriList] = useState<Santri[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [isRekapOpen, setIsRekapOpen] = useState(false);
    const [rekapMonth, setRekapMonth] = useState(new Date().toISOString().slice(0, 7));

    const asramaList = [
        { id: "putra_1", name: "Asrama Putra 1" },
        { id: "putra_2", name: "Asrama Putra 2" },
        { id: "putri_1", name: "Asrama Putri 1" },
        { id: "putri_2", name: "Asrama Putri 2" },
    ];

    useEffect(() => {
        loadData();
    }, [selectedDate, selectedAsrama, attendanceType]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Mock data
            const mockSantri: Santri[] = [
                { id: "1", name: "Ahmad Fauzi", nis: "2024001", asrama: "putra_1" },
                { id: "2", name: "Muhammad Rizky", nis: "2024002", asrama: "putra_1" },
                { id: "3", name: "Abdullah Haidar", nis: "2024003", asrama: "putra_1" },
                { id: "4", name: "Umar Farhan", nis: "2024004", asrama: "putra_1" },
                { id: "5", name: "Ali Imron", nis: "2024005", asrama: "putra_1" },
            ];

            setSantriList(mockSantri.filter(s => s.asrama === selectedAsrama));

            const attendanceMap: Record<string, AttendanceRecord> = {};
            mockSantri.forEach((s) => {
                attendanceMap[s.id] = { santri_id: s.id, status: "hadir" };
            });
            setAttendance(attendanceMap);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (santriId: string, status: AttendanceRecord["status"]) => {
        setAttendance((prev) => ({
            ...prev,
            [santriId]: { ...prev[santriId], status },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await new Promise(r => setTimeout(r, 1000));
            alert("Absensi berhasil disimpan!");
        } catch (error) {
            alert("Gagal menyimpan absensi");
        } finally {
            setSaving(false);
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
                        <h2 className="text-2xl font-bold text-white">Presensi Santri</h2>
                        <p className="text-slate-400">Input dan kelola absensi harian santri</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsRekapOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium"
                        >
                            <Calendar size={16} /> Rekap
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Simpan
                        </button>
                    </div>
                </div>

                {/* Type Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setAttendanceType("asrama")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${attendanceType === "asrama"
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                    >
                        <Home size={16} /> Absensi Asrama
                    </button>
                    <button
                        onClick={() => setAttendanceType("diniyah")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${attendanceType === "diniyah"
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-800 text-slate-400 hover:text-white"
                            }`}
                    >
                        <BookOpen size={16} /> Absensi Diniyah
                    </button>
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
                        value={selectedAsrama}
                        onChange={(e) => setSelectedAsrama(e.target.value)}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    >
                        {asramaList.map((a) => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <div key={key} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 ${config.bg} rounded-lg`}>
                                    {key === "hadir" ? <Check className={`w-5 h-5 ${config.color}`} /> :
                                        key === "alpha" ? <X className={`w-5 h-5 ${config.color}`} /> :
                                            <Clock className={`w-5 h-5 ${config.color}`} />}
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm">{config.label}</div>
                                    <div className={`text-xl font-bold ${config.color}`}>
                                        {stats[key as keyof typeof stats]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium w-12">No</th>
                                    <th className="px-6 py-4 font-medium">Nama Santri</th>
                                    <th className="px-6 py-4 font-medium">NIS</th>
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
                                ) : santriList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            Tidak ada santri di asrama ini
                                        </td>
                                    </tr>
                                ) : (
                                    santriList.map((santri, idx) => (
                                        <tr key={santri.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                                            <td className="px-6 py-4 font-medium text-white">{santri.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{santri.nis}</td>
                                            {(["hadir", "izin", "sakit", "alpha"] as const).map((status) => (
                                                <td key={status} className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleStatusChange(santri.id, status)}
                                                        className={`w-8 h-8 rounded-lg border transition-all ${attendance[santri.id]?.status === status
                                                                ? `${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].border} ${STATUS_CONFIG[status].color}`
                                                                : "border-slate-700 text-slate-600 hover:border-slate-600"
                                                            }`}
                                                    >
                                                        {attendance[santri.id]?.status === status && (
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
            <Modal isOpen={isRekapOpen} onClose={() => setIsRekapOpen(false)} title="Rekap Absensi Bulanan" size="md">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Pilih Bulan</label>
                        <input
                            type="month"
                            value={rekapMonth}
                            onChange={(e) => setRekapMonth(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium">
                            <Download size={16} /> Export PDF
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium">
                            <Download size={16} /> Export Excel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
