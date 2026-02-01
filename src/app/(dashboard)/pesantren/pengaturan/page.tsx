"use client";

import { useState } from "react";
import { Save, Building2, Globe, Bell, Shield, Users } from "lucide-react";

export default function PengaturanPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState({
        nama_pesantren: "Pesantren Al-Hikmah",
        alamat: "Jl. Pesantren No. 123, Kota",
        telepon: "+62 812-3456-7890",
        email: "admin@alhikmah.sch.id",
        tahun_ajaran: "2024/2025",
        kepala_pesantren: "KH. Ahmad Farid",
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert("Pengaturan berhasil disimpan!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Gagal menyimpan pengaturan");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Pengaturan Pesantren</h2>
                        <p className="text-slate-400">Kelola konfigurasi dan informasi pesantren</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium disabled:opacity-50"
                    >
                        <Save size={16} />
                        {isSaving ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>

                {/* Informasi Pesantren */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Building2 size={20} className="text-emerald-500" />
                        Informasi Pesantren
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Nama Pesantren</label>
                            <input
                                type="text"
                                value={settings.nama_pesantren}
                                onChange={(e) => setSettings({ ...settings, nama_pesantren: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Kepala Pesantren</label>
                            <input
                                type="text"
                                value={settings.kepala_pesantren}
                                onChange={(e) => setSettings({ ...settings, kepala_pesantren: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm text-slate-400">Alamat</label>
                            <input
                                type="text"
                                value={settings.alamat}
                                onChange={(e) => setSettings({ ...settings, alamat: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Kontak */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Globe size={20} className="text-blue-500" />
                        Kontak
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Telepon</label>
                            <input
                                type="tel"
                                value={settings.telepon}
                                onChange={(e) => setSettings({ ...settings, telepon: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Email</label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Akademik */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Users size={20} className="text-purple-500" />
                        Akademik
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Tahun Ajaran Aktif</label>
                            <input
                                type="text"
                                value={settings.tahun_ajaran}
                                onChange={(e) => setSettings({ ...settings, tahun_ajaran: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Modul Shortcuts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer">
                        <Bell className="w-6 h-6 text-amber-500 mb-2" />
                        <h4 className="font-medium text-white text-sm">Notifikasi</h4>
                        <p className="text-xs text-slate-500">Atur notifikasi</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer">
                        <Shield className="w-6 h-6 text-red-500 mb-2" />
                        <h4 className="font-medium text-white text-sm">Keamanan</h4>
                        <p className="text-xs text-slate-500">Password & akses</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer">
                        <Users className="w-6 h-6 text-blue-500 mb-2" />
                        <h4 className="font-medium text-white text-sm">Pengguna</h4>
                        <p className="text-xs text-slate-500">Kelola admin</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors cursor-pointer">
                        <Globe className="w-6 h-6 text-emerald-500 mb-2" />
                        <h4 className="font-medium text-white text-sm">Integrasi</h4>
                        <p className="text-xs text-slate-500">API & webhook</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
