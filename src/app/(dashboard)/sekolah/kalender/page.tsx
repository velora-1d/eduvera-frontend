"use client";

import { useState, useEffect } from "react";
import { Calendar, Plus, ChevronLeft, ChevronRight, Loader2, Pencil, Trash2, X } from "lucide-react";
import Modal from "@/components/ui/Modal";

interface CalendarEvent {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    type: "libur" | "ujian" | "kegiatan" | "lainnya";
    description?: string;
}

const EVENT_TYPES = {
    libur: { label: "Libur", color: "bg-red-500", text: "text-red-500", border: "border-red-500" },
    ujian: { label: "Ujian", color: "bg-amber-500", text: "text-amber-500", border: "border-amber-500" },
    kegiatan: { label: "Kegiatan", color: "bg-blue-500", text: "text-blue-500", border: "border-blue-500" },
    lainnya: { label: "Lainnya", color: "bg-slate-500", text: "text-slate-500", border: "border-slate-500" },
};

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export default function KalenderPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        start_date: "",
        end_date: "",
        type: "kegiatan" as CalendarEvent["type"],
        description: "",
    });

    useEffect(() => {
        loadEvents();
    }, [currentDate]);

    const loadEvents = async () => {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockEvents: CalendarEvent[] = [
            { id: "1", title: "Libur Semester", start_date: "2024-01-01", end_date: "2024-01-07", type: "libur" },
            { id: "2", title: "UTS Semester 2", start_date: "2024-03-11", end_date: "2024-03-15", type: "ujian" },
            { id: "3", title: "Hari Raya Idul Fitri", start_date: "2024-04-10", end_date: "2024-04-21", type: "libur" },
            { id: "4", title: "Pentas Seni", start_date: "2024-05-20", end_date: "2024-05-20", type: "kegiatan" },
            { id: "5", title: "UAS Semester 2", start_date: "2024-06-10", end_date: "2024-06-14", type: "ujian" },
        ];
        setEvents(mockEvents);
        setLoading(false);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const navigateMonth = (direction: "prev" | "next") => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        setCurrentDate(newDate);
    };

    const getEventsForDate = (date: string) => {
        return events.filter((e) => {
            const start = new Date(e.start_date);
            const end = new Date(e.end_date);
            const check = new Date(date);
            return check >= start && check <= end;
        });
    };

    const handleDayClick = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEvents = getEventsForDate(dateStr);

        if (dayEvents.length > 0) {
            setSelectedEvent(dayEvents[0]);
            setIsDetailModalOpen(true);
        } else {
            setSelectedDate(dateStr);
            setFormData({ ...formData, start_date: dateStr, end_date: dateStr });
            setIsAddModalOpen(true);
        }
    };

    const handleAddEvent = () => {
        setSelectedEvent(null);
        setFormData({ title: "", start_date: "", end_date: "", type: "kegiatan", description: "" });
        setIsAddModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API call to save event
        const newEvent: CalendarEvent = {
            id: Date.now().toString(),
            ...formData,
        };
        setEvents([...events, newEvent]);
        setIsAddModalOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Yakin ingin menghapus event ini?")) {
            setEvents(events.filter((e) => e.id !== id));
            setIsDetailModalOpen(false);
        }
    };

    const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Kalender Akademik</h2>
                        <p className="text-slate-400">Jadwal libur, ujian, dan kegiatan sekolah</p>
                    </div>
                    <button
                        onClick={handleAddEvent}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                    >
                        <Plus size={16} /> Tambah Event
                    </button>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4">
                    {Object.entries(EVENT_TYPES).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                            <span className="text-sm text-slate-400">{config.label}</span>
                        </div>
                    ))}
                </div>

                {/* Calendar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                        <button onClick={() => navigateMonth("prev")} className="p-2 hover:bg-slate-800 rounded-lg">
                            <ChevronLeft size={20} className="text-slate-400" />
                        </button>
                        <h3 className="text-lg font-semibold text-white">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <button onClick={() => navigateMonth("next")} className="p-2 hover:bg-slate-800 rounded-lg">
                            <ChevronRight size={20} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-slate-800">
                        {DAYS.map((day) => (
                            <div key={day} className="px-4 py-3 text-center text-sm font-medium text-slate-400">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7">
                        {/* Empty days before first day of month */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-28 border-b border-r border-slate-800 bg-slate-900/50"></div>
                        ))}

                        {/* Days of month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const dayEvents = getEventsForDate(dateStr);
                            const isToday = dateStr === today;

                            return (
                                <div
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    className={`h-28 border-b border-r border-slate-800 p-2 cursor-pointer hover:bg-slate-800/50 transition-colors ${isToday ? "bg-blue-500/10" : ""
                                        }`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-400" : "text-slate-300"}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.slice(0, 2).map((event) => (
                                            <div
                                                key={event.id}
                                                className={`text-xs px-1.5 py-0.5 rounded truncate ${EVENT_TYPES[event.type].color} text-white`}
                                            >
                                                {event.title}
                                            </div>
                                        ))}
                                        {dayEvents.length > 2 && (
                                            <div className="text-xs text-slate-500">+{dayEvents.length - 2} lainnya</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Event Mendatang</h3>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
                            </div>
                        ) : events.filter((e) => new Date(e.start_date) >= new Date()).length === 0 ? (
                            <p className="text-slate-500 text-center py-4">Tidak ada event mendatang</p>
                        ) : (
                            events
                                .filter((e) => new Date(e.start_date) >= new Date())
                                .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                                .slice(0, 5)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setSelectedEvent(event);
                                            setIsDetailModalOpen(true);
                                        }}
                                    >
                                        <div className={`w-1 h-12 rounded-full ${EVENT_TYPES[event.type].color}`}></div>
                                        <div className="flex-1">
                                            <div className="font-medium text-white">{event.title}</div>
                                            <div className="text-sm text-slate-400">
                                                {event.start_date === event.end_date
                                                    ? event.start_date
                                                    : `${event.start_date} - ${event.end_date}`}
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${EVENT_TYPES[event.type].color} text-white`}>
                                            {EVENT_TYPES[event.type].label}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={selectedEvent ? "Edit Event" : "Tambah Event Baru"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Judul Event</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            placeholder="Masukkan judul event"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Selesai</label>
                            <input
                                type="date"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tipe Event</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent["type"] })}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                        >
                            {Object.entries(EVENT_TYPES).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Deskripsi (opsional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                            placeholder="Tambahkan deskripsi..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">
                            Batal
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="Detail Event"
                size="md"
            >
                {selectedEvent && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className={`w-1 h-16 rounded-full ${EVENT_TYPES[selectedEvent.type].color}`}></div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">{selectedEvent.title}</h3>
                                <div className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mt-2 ${EVENT_TYPES[selectedEvent.type].color} text-white`}>
                                    {EVENT_TYPES[selectedEvent.type].label}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <span className="text-white">
                                    {selectedEvent.start_date === selectedEvent.end_date
                                        ? selectedEvent.start_date
                                        : `${selectedEvent.start_date} - ${selectedEvent.end_date}`}
                                </span>
                            </div>
                        </div>

                        {selectedEvent.description && (
                            <div>
                                <div className="text-sm text-slate-400 mb-1">Deskripsi</div>
                                <p className="text-white">{selectedEvent.description}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                            <button
                                onClick={() => handleDelete(selectedEvent.id)}
                                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300"
                            >
                                <Trash2 size={16} /> Hapus
                            </button>
                            <button
                                onClick={() => {
                                    setFormData({
                                        title: selectedEvent.title,
                                        start_date: selectedEvent.start_date,
                                        end_date: selectedEvent.end_date,
                                        type: selectedEvent.type,
                                        description: selectedEvent.description || "",
                                    });
                                    setIsDetailModalOpen(false);
                                    setIsAddModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                            >
                                <Pencil size={16} /> Edit
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
