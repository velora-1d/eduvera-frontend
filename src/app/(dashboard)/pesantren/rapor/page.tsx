"use client";

import { useState } from "react";
import { FileText, Search, Download, Printer } from "lucide-react";

export default function RaporPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [santriList] = useState([
        { id: 1, name: "Ahmad Fulan", nis: "24001", kelas: "3A", semester: "Ganjil 2024", status: "Terbit" },
        { id: 2, name: "Muhammad Hasan", nis: "24002", kelas: "2B", semester: "Ganjil 2024", status: "Proses" },
        { id: 3, name: "Abdullah Zaini", nis: "24003", kelas: "1A", semester: "Ganjil 2024", status: "Terbit" },
    ]);

    const filteredSantri = santriList.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm)
    );

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Rapor Santri</h2>
                        <p className="text-slate-400">Kelola rapor dan nilai santri</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <FileText size={16} /> Generate Rapor
                    </button>
                </div>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIS santri..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Nama Santri</th>
                                <th className="px-6 py-4 font-medium">NIS</th>
                                <th className="px-6 py-4 font-medium">Kelas</th>
                                <th className="px-6 py-4 font-medium">Semester</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredSantri.map((santri) => (
                                <tr key={santri.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{santri.name}</td>
                                    <td className="px-6 py-4 text-slate-300">{santri.nis}</td>
                                    <td className="px-6 py-4 text-slate-300">{santri.kelas}</td>
                                    <td className="px-6 py-4 text-slate-300">{santri.semester}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${santri.status === 'Terbit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>{santri.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg" title="Download">
                                                <Download size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg" title="Print">
                                                <Printer size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
