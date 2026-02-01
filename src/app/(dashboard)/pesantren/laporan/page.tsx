"use client";

import { useState } from "react";
import { FileText, Download, Calendar, Filter } from "lucide-react";

export default function LaporanPage() {
    const [laporanList] = useState([
        { id: 1, name: "Laporan Keuangan Bulanan", type: "Keuangan", periode: "Januari 2024", status: "Selesai" },
        { id: 2, name: "Laporan Kehadiran Santri", type: "Kepesantrenan", periode: "Januari 2024", status: "Selesai" },
        { id: 3, name: "Laporan Hafalan Tahfidz", type: "Akademik", periode: "Semester 1", status: "Selesai" },
        { id: 4, name: "Laporan Pelanggaran", type: "Kepesantrenan", periode: "Januari 2024", status: "Proses" },
    ]);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Laporan</h2>
                        <p className="text-slate-400">Generate dan unduh laporan pesantren</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                        <FileText size={16} /> Buat Laporan
                    </button>
                </div>

                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:text-white">
                        <Calendar size={16} /> Pilih Periode
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-lg hover:text-white">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                        <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-4">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-white">Laporan Keuangan</h3>
                        <p className="text-slate-400 text-sm mt-1">Pemasukan, pengeluaran, saldo</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                        <div className="p-3 bg-emerald-500/10 rounded-xl w-fit mb-4">
                            <FileText className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h3 className="font-semibold text-white">Laporan Akademik</h3>
                        <p className="text-slate-400 text-sm mt-1">Nilai, hafalan, kediniyahan</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                        <div className="p-3 bg-amber-500/10 rounded-xl w-fit mb-4">
                            <FileText className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="font-semibold text-white">Laporan Kepesantrenan</h3>
                        <p className="text-slate-400 text-sm mt-1">Kehadiran, pelanggaran, izin</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors cursor-pointer">
                        <div className="p-3 bg-purple-500/10 rounded-xl w-fit mb-4">
                            <FileText className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="font-semibold text-white">Laporan SDM</h3>
                        <p className="text-slate-400 text-sm mt-1">Ustadz, pengurus, absensi</p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="font-semibold text-white">Riwayat Laporan</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="px-6 py-4 font-medium">Nama Laporan</th>
                                <th className="px-6 py-4 font-medium">Jenis</th>
                                <th className="px-6 py-4 font-medium">Periode</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {laporanList.map((laporan) => (
                                <tr key={laporan.id} className="hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-white">{laporan.name}</td>
                                    <td className="px-6 py-4 text-slate-300">{laporan.type}</td>
                                    <td className="px-6 py-4 text-slate-300">{laporan.periode}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${laporan.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>{laporan.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                                            <Download size={16} />
                                        </button>
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
