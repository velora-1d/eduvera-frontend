"use client";

import { useState } from "react";
import { UserCog, Briefcase, Plus, Search, Building } from "lucide-react";

export default function StafPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBidang, setSelectedBidang] = useState("all");

    const [stafList] = useState([
        { id: 1, nip: "198705122010011002", nama: "Bambang Suryanto", bidang: "Tata Usaha", jabatan: "Kepala TU", status: "PNS", pendidikan: "S1 Administrasi" },
        { id: 2, nip: "-", nama: "Siti Rahmawati", bidang: "Keuangan", jabatan: "Bendahara", status: "Honorer", pendidikan: "S1 Akuntansi" },
        { id: 3, nip: "-", nama: "Ahmad Rizki", bidang: "IT", jabatan: "Operator Sekolah", status: "Honorer", pendidikan: "S1 Teknik Informatika" },
        { id: 4, nip: "-", nama: "Dewi Sartika", bidang: "Perpustakaan", jabatan: "Pustakawan", status: "Honorer", pendidikan: "D3 Perpustakaan" },
        { id: 5, nip: "-", nama: "Eko Prasetyo", bidang: "Kesiswaan", jabatan: "Staf Kesiswaan", status: "Honorer", pendidikan: "S1 Pendidikan" },
        { id: 6, nip: "-", nama: "Fitri Handayani", bidang: "BK", jabatan: "Konselor", status: "Honorer", pendidikan: "S1 Psikologi" },
        { id: 7, nip: "-", nama: "Gunawan", bidang: "Keamanan", jabatan: "Satpam", status: "Honorer", pendidikan: "SMA" },
        { id: 8, nip: "-", nama: "Hartini", bidang: "Kebersihan", jabatan: "Petugas Kebersihan", status: "Honorer", pendidikan: "SMP" },
    ]);

    const bidangOptions = ["all", "Tata Usaha", "Keuangan", "Kurikulum", "Kesiswaan", "Sarpras", "Perpustakaan", "BK", "IT", "Keamanan", "Kebersihan"];

    const filteredStaf = stafList.filter(s => {
        const matchSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase());
        const matchBidang = selectedBidang === "all" || s.bidang === selectedBidang;
        return matchSearch && matchBidang;
    });

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Data Staf</h2>
                        <p className="text-slate-400">Kelola data staf sekolah</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium">
                        <Plus size={16} /> Tambah Staf
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <UserCog className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Staf</div>
                                <div className="text-xl font-bold text-white">{stafList.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">PNS</div>
                                <div className="text-xl font-bold text-white">{stafList.filter(s => s.status === "PNS").length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <UserCog className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Honorer</div>
                                <div className="text-xl font-bold text-white">{stafList.filter(s => s.status === "Honorer").length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Building className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Bidang</div>
                                <div className="text-xl font-bold text-white">{new Set(stafList.map(s => s.bidang)).size}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-wrap">
                    <select
                        value={selectedBidang}
                        onChange={(e) => setSelectedBidang(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                    >
                        {bidangOptions.map(b => (
                            <option key={b} value={b}>{b === "all" ? "Semua Bidang" : b}</option>
                        ))}
                    </select>
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Cari staf..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">NIP</th>
                                <th className="px-6 py-4 font-medium">Nama</th>
                                <th className="px-6 py-4 font-medium">Bidang</th>
                                <th className="px-6 py-4 font-medium">Jabatan</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Pendidikan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredStaf.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 text-slate-300">{item.nip}</td>
                                    <td className="px-6 py-4 font-medium text-white">{item.nama}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-300">{item.bidang}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{item.jabatan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${item.status === "PNS" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{item.pendidikan}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
