"use client";

import { useEffect, useState } from "react";
import { Megaphone, Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: "info" | "warning" | "success";
    is_active: boolean;
    created_at: string;
}

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
            id: "1",
            title: "Selamat datang di EduVera!",
            content: "Platform manajemen sekolah dan pesantren terlengkap.",
            type: "info",
            is_active: true,
            created_at: new Date().toISOString(),
        },
    ]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ title: "", content: "", type: "info" as "info" | "warning" | "success" });

    const handleCreate = () => {
        const newAnnouncement: Announcement = {
            id: Date.now().toString(),
            title: form.title,
            content: form.content,
            type: form.type,
            is_active: true,
            created_at: new Date().toISOString(),
        };
        setAnnouncements([newAnnouncement, ...announcements]);
        setForm({ title: "", content: "", type: "info" });
        setIsCreating(false);
        // TODO: Save to backend
    };

    const handleUpdate = (id: string) => {
        setAnnouncements(
            announcements.map((a) =>
                a.id === id ? { ...a, title: form.title, content: form.content, type: form.type } : a
            )
        );
        setEditingId(null);
        setForm({ title: "", content: "", type: "info" });
        // TODO: Save to backend
    };

    const handleDelete = (id: string) => {
        if (confirm("Hapus pengumuman ini?")) {
            setAnnouncements(announcements.filter((a) => a.id !== id));
            // TODO: Delete from backend
        }
    };

    const handleToggle = (id: string) => {
        setAnnouncements(
            announcements.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a))
        );
        // TODO: Save to backend
    };

    const startEdit = (announcement: Announcement) => {
        setEditingId(announcement.id);
        setForm({ title: announcement.title, content: announcement.content, type: announcement.type });
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "success":
                return "bg-emerald-500/20 text-emerald-400";
            case "warning":
                return "bg-amber-500/20 text-amber-400";
            default:
                return "bg-blue-500/20 text-blue-400";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Megaphone className="w-6 h-6 text-slate-400" />
                    <h2 className="text-2xl font-bold text-white">Announcements</h2>
                </div>
                <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={isCreating}
                >
                    <Plus className="w-4 h-4 mr-2" /> Tambah Pengumuman
                </Button>
            </div>

            {/* Create Form */}
            {isCreating && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Pengumuman Baru</h3>
                    <div className="space-y-4">
                        <div>
                            <Input
                                placeholder="Judul pengumuman"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Isi pengumuman..."
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white min-h-24 resize-none"
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                            >
                                <option value="info">Info</option>
                                <option value="success">Success</option>
                                <option value="warning">Warning</option>
                            </select>
                            <div className="flex gap-2 ml-auto">
                                <Button variant="outline" onClick={() => setIsCreating(false)}>
                                    <X className="w-4 h-4 mr-2" /> Batal
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={handleCreate}
                                    disabled={!form.title || !form.content}
                                >
                                    <Save className="w-4 h-4 mr-2" /> Simpan
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <Megaphone className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                        <p className="text-slate-500">Belum ada pengumuman</p>
                    </div>
                ) : (
                    announcements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className={`bg-slate-900 border border-slate-800 rounded-xl p-6 ${!announcement.is_active ? "opacity-50" : ""
                                }`}
                        >
                            {editingId === announcement.id ? (
                                <div className="space-y-4">
                                    <Input
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="bg-slate-800 border-slate-700"
                                    />
                                    <textarea
                                        value={form.content}
                                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white min-h-20 resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <select
                                            value={form.type}
                                            onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                                        >
                                            <option value="info">Info</option>
                                            <option value="success">Success</option>
                                            <option value="warning">Warning</option>
                                        </select>
                                        <div className="flex gap-2 ml-auto">
                                            <Button variant="outline" onClick={() => setEditingId(null)}>
                                                Batal
                                            </Button>
                                            <Button
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                onClick={() => handleUpdate(announcement.id)}
                                            >
                                                Simpan
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs ${getTypeBadge(announcement.type)}`}>
                                                {announcement.type}
                                            </span>
                                            {!announcement.is_active && (
                                                <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-400">
                                                    Tidak Aktif
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="text-lg font-semibold text-white mb-1">{announcement.title}</h4>
                                        <p className="text-slate-400">{announcement.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-white"
                                            onClick={() => handleToggle(announcement.id)}
                                        >
                                            {announcement.is_active ? "Nonaktifkan" : "Aktifkan"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-white"
                                            onClick={() => startEdit(announcement)}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => handleDelete(announcement.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
