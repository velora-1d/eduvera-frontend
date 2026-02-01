"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, User, Phone, MapPin, GraduationCap, Users } from "lucide-react";

export default function TambahSiswaPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("pribadi");

    const tabs = [
        { id: "pribadi", label: "Data Pribadi", icon: User },
        { id: "ortu", label: "Data Orang Tua", icon: Users },
        { id: "alamat", label: "Alamat", icon: MapPin },
        { id: "akademik", label: "Data Akademik", icon: GraduationCap },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // TODO: API call
        setTimeout(() => {
            setIsSubmitting(false);
            router.push("/sekolah/siswa");
        }, 1500);
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/sekolah/siswa"
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Tambah Siswa Baru</h1>
                        <p className="text-slate-400">Lengkapi data untuk mendaftarkan siswa baru</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "bg-blue-500 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

                        {/* Tab: Data Pribadi */}
                        {activeTab === "pribadi" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                                    Data Pribadi Siswa
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Nama Lengkap <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            NISN <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="Nomor Induk Siswa Nasional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            NIS
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="Nomor Induk Sekolah"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Tempat Lahir <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="Kota/Kabupaten"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Tanggal Lahir <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Jenis Kelamin <span className="text-red-400">*</span>
                                        </label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="">Pilih</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Agama
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="islam">Islam</option>
                                            <option value="kristen">Kristen</option>
                                            <option value="katolik">Katolik</option>
                                            <option value="hindu">Hindu</option>
                                            <option value="buddha">Buddha</option>
                                            <option value="konghucu">Konghucu</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            No. HP Siswa
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Data Orang Tua */}
                        {activeTab === "ortu" && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                                        Data Ayah
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Ayah</label>
                                            <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama lengkap ayah" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">No. HP Ayah</label>
                                            <input type="tel" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="08xxxxxxxxxx" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Pekerjaan</label>
                                            <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Pekerjaan ayah" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Pendidikan Terakhir</label>
                                            <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500">
                                                <option value="">Pilih</option>
                                                <option value="sd">SD</option>
                                                <option value="smp">SMP</option>
                                                <option value="sma">SMA/SMK</option>
                                                <option value="d3">D3</option>
                                                <option value="s1">S1</option>
                                                <option value="s2">S2</option>
                                                <option value="s3">S3</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                                        Data Ibu
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Ibu</label>
                                            <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama lengkap ibu" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">No. HP Ibu</label>
                                            <input type="tel" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="08xxxxxxxxxx" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Pekerjaan</label>
                                            <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Pekerjaan ibu" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Pendidikan Terakhir</label>
                                            <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500">
                                                <option value="">Pilih</option>
                                                <option value="sd">SD</option>
                                                <option value="smp">SMP</option>
                                                <option value="sma">SMA/SMK</option>
                                                <option value="d3">D3</option>
                                                <option value="s1">S1</option>
                                                <option value="s2">S2</option>
                                                <option value="s3">S3</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                                        Data Wali (Opsional)
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Wali</label>
                                            <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama lengkap wali" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-300 mb-1">No. HP Wali</label>
                                            <input type="tel" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="08xxxxxxxxxx" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Alamat */}
                        {activeTab === "alamat" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                                    Alamat Tempat Tinggal
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Alamat Lengkap</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                            placeholder="Jalan, RT/RW, Desa/Kelurahan"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Kecamatan</label>
                                        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama kecamatan" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Kabupaten/Kota</label>
                                        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama kabupaten/kota" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Provinsi</label>
                                        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama provinsi" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Kode Pos</label>
                                        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="12345" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Data Akademik */}
                        {activeTab === "akademik" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">
                                    Data Akademik
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Jenjang <span className="text-red-400">*</span>
                                        </label>
                                        <select required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500">
                                            <option value="">Pilih Jenjang</option>
                                            <option value="sd">SD</option>
                                            <option value="smp">SMP</option>
                                            <option value="sma">SMA</option>
                                            <option value="smk">SMK</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">
                                            Kelas <span className="text-red-400">*</span>
                                        </label>
                                        <select required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500">
                                            <option value="">Pilih Kelas</option>
                                            <option value="7A">7A</option>
                                            <option value="7B">7B</option>
                                            <option value="8A">8A</option>
                                            <option value="8B">8B</option>
                                            <option value="9A">9A</option>
                                            <option value="9B">9B</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Tahun Masuk</label>
                                        <input type="number" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="2024" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500">
                                            <option value="aktif">Aktif</option>
                                            <option value="tidak_aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Asal Sekolah</label>
                                        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500" placeholder="Nama sekolah sebelumnya" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6">
                        <Link
                            href="/sekolah/siswa"
                            className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                        >
                            Batal
                        </Link>
                        <div className="flex gap-3">
                            {activeTab !== "akademik" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const idx = tabs.findIndex(t => t.id === activeTab);
                                        if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
                                    }}
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
                                >
                                    Lanjut
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Simpan Siswa
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
