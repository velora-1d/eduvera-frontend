"use client";

import { useState } from "react";
import { Users, GraduationCap, UserCog, Briefcase, Plus, Search, DollarSign, Clock } from "lucide-react";

export default function SDMPage() {
    const [activeTab, setActiveTab] = useState("guru");
    const [searchTerm, setSearchTerm] = useState("");

    const [guruList] = useState([
        { id: 1, nip: "198501012010011001", nama: "Drs. Ahmad Hidayat", mapel: "Matematika", status: "PNS", jabatan: "Wali Kelas XII IPA 1" },
        { id: 2, nip: "199003152015012001", nama: "Sri Wahyuni, S.Pd", mapel: "Bahasa Indonesia", status: "PNS", jabatan: "Wali Kelas XII IPA 2" },
        { id: 3, nip: "199205202018011001", nama: "Muh. Farhan, M.Pd", mapel: "Fisika", status: "PPPK", jabatan: "Wali Kelas XI IPA 1" },
        { id: 4, nip: "-", nama: "Dewi Safitri, S.Pd", mapel: "Bahasa Inggris", status: "Honorer", jabatan: "-" },
    ]);

    const [stafList] = useState([
        { id: 1, nama: "Bambang Suryanto", bidang: "Tata Usaha", jabatan: "Kepala TU", status: "PNS" },
        { id: 2, nama: "Siti Rahmawati", bidang: "Keuangan", jabatan: "Bendahara", status: "Honorer" },
        { id: 3, nama: "Ahmad Rizki", bidang: "IT", jabatan: "Operator", status: "Honorer" },
    ]);

    const [absensiList] = useState([
        { id: 1, nama: "Drs. Ahmad Hidayat", hadir: 22, izin: 1, sakit: 0, alpha: 0 },
        { id: 2, nama: "Sri Wahyuni, S.Pd", hadir: 21, izin: 2, sakit: 0, alpha: 0 },
        { id: 3, nama: "Muh. Farhan, M.Pd", hadir: 23, izin: 0, sakit: 0, alpha: 0 },
    ]);

    const tabs = [
        { id: "guru", label: "Guru", icon: GraduationCap },
        { id: "staf", label: "Staf", icon: UserCog },
        { id: "absensi", label: "Absensi", icon: Clock },
        { id: "gaji", label: "Penggajian", icon: DollarSign },
    ];

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">SDM Sekolah</h2>
                        <p className="text-slate-400">Kelola guru, staf, dan penggajian</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah SDM
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <GraduationCap className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Guru</div>
                                <div className="text-xl font-bold text-white">{guruList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <UserCog className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Staf</div>
                                <div className="text-xl font-bold text-white">{stafList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">PNS</div>
                                <div className="text-xl font-bold text-white">3</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Users className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Honorer</div>
                                <div className="text-xl font-bold text-white">4</div>
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
                                    ? "text-blue-500 border-blue-500"
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
                            className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    {activeTab === "guru" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">NIP</th>
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium">Mapel</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Jabatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {guruList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-slate-300">{item.nip}</td>
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.mapel}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === "PNS" ? "bg-emerald-500/10 text-emerald-500" : item.status === "PPPK" ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{item.jabatan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "staf" && (
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
                                {stafList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.bidang}</td>
                                        <td className="px-6 py-4 text-slate-300">{item.jabatan}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${item.status === "PNS" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "absensi" && (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-400">
                                    <th className="px-6 py-4 font-medium">Nama</th>
                                    <th className="px-6 py-4 font-medium text-center">Hadir</th>
                                    <th className="px-6 py-4 font-medium text-center">Izin</th>
                                    <th className="px-6 py-4 font-medium text-center">Sakit</th>
                                    <th className="px-6 py-4 font-medium text-center">Alpha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {absensiList.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                        <td className="px-6 py-4 text-center text-emerald-500">{item.hadir}</td>
                                        <td className="px-6 py-4 text-center text-amber-500">{item.izin}</td>
                                        <td className="px-6 py-4 text-center text-blue-500">{item.sakit}</td>
                                        <td className="px-6 py-4 text-center text-red-500">{item.alpha}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    {activeTab === "gaji" && (
                        <div className="p-8 text-center text-slate-400">
                            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Modul penggajian akan ditampilkan di sini</p>
                            <p className="text-sm mt-2">Kelola gaji pokok, tunjangan, dan slip gaji</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
