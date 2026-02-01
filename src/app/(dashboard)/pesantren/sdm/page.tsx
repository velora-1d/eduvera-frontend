"use client";

import { useState } from "react";
import { Users, GraduationCap, UserCog, Plus, Search } from "lucide-react";

export default function SDMPage() {
    const [activeTab, setActiveTab] = useState("ustadz");
    const [searchTerm, setSearchTerm] = useState("");

    const [ustadzList] = useState([
        { id: 1, name: "Ust. Ahmad Farid", bidang: "Tahfidz", jabatan: "Mudir", status: "Aktif" },
        { id: 2, name: "Ust. Ibrahim Hasan", bidang: "Diniyah", jabatan: "Pengajar", status: "Aktif" },
        { id: 3, name: "Ust. Yusuf Hakim", bidang: "Bahasa Arab", jabatan: "Pengajar", status: "Aktif" },
    ]);

    const [pengurusList] = useState([
        { id: 1, name: "Ahmad Zaki", divisi: "Kesantrian", jabatan: "Ketua", status: "Aktif" },
        { id: 2, name: "Muhammad Farhan", divisi: "Keamanan", jabatan: "Anggota", status: "Aktif" },
    ]);

    const tabs = [
        { id: "ustadz", label: "Ustadz/Ustadzah", icon: GraduationCap },
        { id: "pengurus", label: "Pengurus", icon: UserCog },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">SDM Pesantren</h2>
                        <p className="text-slate-400">Kelola ustadz, pengurus, dan karyawan</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah SDM
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Ustadz</div>
                                <div className="text-xl font-bold text-white">{ustadzList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <UserCog className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Pengurus</div>
                                <div className="text-xl font-bold text-white">{pengurusList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total SDM</div>
                                <div className="text-xl font-bold text-white">{ustadzList.length + pengurusList.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex gap-2 border-b border-slate-800 flex-1">
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
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {activeTab === "ustadz" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Bidang</th>
                                    <th className="px-6 py-4 font-medium">Jabatan</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {ustadzList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.bidang}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jabatan}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-500">{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "pengurus" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Divisi</th>
                                    <th className="px-6 py-4 font-medium">Jabatan</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {pengurusList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.divisi}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jabatan}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-500">{item.status}</span>
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
