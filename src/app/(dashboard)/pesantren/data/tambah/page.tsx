"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, User, Users, MapPin, BookOpen, Home } from "lucide-react";

export default function TambahSantriPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState("pribadi");

    const tabs = [
        { id: "pribadi", label: "Data Pribadi", icon: User },
        { id: "ortu", label: "Data Wali", icon: Users },
        { id: "alamat", label: "Alamat", icon: MapPin },
        { id: "asrama", label: "Asrama", icon: Home },
        { id: "diniyah", label: "Diniyah", icon: BookOpen },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            router.push("/pesantren/data");
        }, 1500);
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/pesantren/data" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Tambah Santri Baru</h1>
                        <p className="text-slate-400">Lengkapi data untuk mendaftarkan santri baru</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-slate-800 pb-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? "bg-emerald-500 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">

                        {/* Tab: Data Pribadi */}
                        {activeTab === "pribadi" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Data Pribadi Santri</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap <span className="text-red-400">*</span></label>
                                        <input type="text" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="Masukkan nama lengkap" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">NIS <span className="text-red-400">*</span></label>
                                        <input type="text" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="Nomor Induk Santri" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">NIK</label>
                                        <input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="16 digit NIK" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Tempat Lahir <span className="text-red-400">*</span></label>
                                        <input type="text" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="Kota/Kabupaten" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Lahir <span className="text-red-400">*</span></label>
                                        <input type="date" required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Jenis Kelamin <span className="text-red-400">*</span></label>
                                        <select required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="">Pilih</option>
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">No. HP</label>
                                        <input type="tel" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="08xxxxxxxxxx" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Data Wali */}
                        {activeTab === "ortu" && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Data Ayah</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">Nama Ayah</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">No. HP</label><input type="tel" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">Pekerjaan</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">Penghasilan</label>
                                            <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                                <option value="">Pilih</option>
                                                <option value="<1jt">&lt; 1 Juta</option>
                                                <option value="1-3jt">1 - 3 Juta</option>
                                                <option value="3-5jt">3 - 5 Juta</option>
                                                <option value=">5jt">&gt; 5 Juta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Data Ibu</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">Nama Ibu</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">No. HP</label><input type="tel" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">Pekerjaan</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                        <div><label className="block text-sm font-medium text-slate-300 mb-1">Penghasilan</label>
                                            <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                                <option value="">Pilih</option>
                                                <option value="<1jt">&lt; 1 Juta</option>
                                                <option value="1-3jt">1 - 3 Juta</option>
                                                <option value="3-5jt">3 - 5 Juta</option>
                                                <option value=">5jt">&gt; 5 Juta</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Alamat */}
                        {activeTab === "alamat" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Alamat Asal</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2"><label className="block text-sm font-medium text-slate-300 mb-1">Alamat Lengkap</label><textarea rows={3} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="Jalan, RT/RW, Desa/Kelurahan" /></div>
                                    <div><label className="block text-sm font-medium text-slate-300 mb-1">Kecamatan</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                    <div><label className="block text-sm font-medium text-slate-300 mb-1">Kabupaten/Kota</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                    <div><label className="block text-sm font-medium text-slate-300 mb-1">Provinsi</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                    <div><label className="block text-sm font-medium text-slate-300 mb-1">Kode Pos</label><input type="text" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" /></div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Asrama */}
                        {activeTab === "asrama" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Penempatan Asrama</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Asrama <span className="text-red-400">*</span></label>
                                        <select required className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="">Pilih Asrama</option>
                                            <option value="putra_1">Asrama Putra 1</option>
                                            <option value="putra_2">Asrama Putra 2</option>
                                            <option value="putri_1">Asrama Putri 1</option>
                                            <option value="putri_2">Asrama Putri 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Kamar</label>
                                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="">Pilih Kamar</option>
                                            <option value="101">Kamar 101</option>
                                            <option value="102">Kamar 102</option>
                                            <option value="103">Kamar 103</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Tahun Masuk</label>
                                        <input type="number" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="2024" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="aktif">Aktif</option>
                                            <option value="boyong">Boyong</option>
                                            <option value="lulus">Lulus</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: Diniyah */}
                        {activeTab === "diniyah" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-2">Data Pendidikan Diniyah</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Kelas Diniyah</label>
                                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="">Pilih Kelas</option>
                                            <option value="ula_1">Ula 1</option>
                                            <option value="ula_2">Ula 2</option>
                                            <option value="wustho_1">Wustho 1</option>
                                            <option value="wustho_2">Wustho 2</option>
                                            <option value="ulya_1">Ulya 1</option>
                                            <option value="ulya_2">Ulya 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Halaqoh</label>
                                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="">Pilih Halaqoh</option>
                                            <option value="halaqoh_a">Halaqoh A</option>
                                            <option value="halaqoh_b">Halaqoh B</option>
                                            <option value="halaqoh_c">Halaqoh C</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Program Tahfidz</label>
                                        <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500">
                                            <option value="tidak">Tidak Ikut</option>
                                            <option value="reguler">Reguler (1 Juz/Tahun)</option>
                                            <option value="intensif">Intensif (5 Juz/Tahun)</option>
                                            <option value="tahassus">Tahassus (30 Juz)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Hafalan Sebelumnya</label>
                                        <input type="number" className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500" placeholder="0 Juz" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6">
                        <Link href="/pesantren/data" className="px-6 py-3 text-slate-400 hover:text-white transition-colors">
                            Batal
                        </Link>
                        <div className="flex gap-3">
                            {activeTab !== "diniyah" && (
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
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Simpan Santri
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
