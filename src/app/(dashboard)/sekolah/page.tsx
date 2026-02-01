"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, BookOpen, GraduationCap, Calendar, Bell, ArrowRight } from "lucide-react";
import { sekolahApi } from "@/lib/api";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: "emerald" | "blue" | "purple" | "amber";
    href?: string;
}

function StatCard({ title, value, icon: Icon, color, href }: StatCardProps) {
    const colorClasses = {
        emerald: "bg-emerald-500/10 text-emerald-500",
        blue: "bg-blue-500/10 text-blue-500",
        purple: "bg-purple-500/10 text-purple-500",
        amber: "bg-amber-500/10 text-amber-500",
    };

    const content = (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors">
            <div className={`p-2 rounded-lg w-fit ${colorClasses[color]}`}>
                <Icon size={20} />
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{value}</h3>
            <p className="text-slate-400 text-sm mt-1">{title}</p>
        </div>
    );

    if (href) return <Link href={href}>{content}</Link>;
    return content;
}

export default function SekolahDashboardPage() {
    const [stats, setStats] = useState({
        total_siswa: 0,
        total_kelas: 0,
        total_guru: 0,
        rata_kehadiran: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await sekolahApi.getDashboardStats();
                if (res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                // Use mock data as fallback
                setStats({
                    total_siswa: 450,
                    total_kelas: 18,
                    total_guru: 35,
                    rata_kehadiran: 95,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);


    const notifications = [
        { id: 1, title: "Ujian Tengah Semester", desc: "Jadwal ujian sudah tersedia", time: "1 jam lalu", type: "info" },
        { id: 2, title: "Rapat Guru", desc: "Rapat koordinasi besok jam 09:00", time: "2 jam lalu", type: "meeting" },
        { id: 3, title: "Siswa Baru", desc: "5 siswa baru terdaftar minggu ini", time: "5 jam lalu", type: "student" },
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Sekolah</h1>
                    <p className="text-slate-400">Selamat datang, Admin Sekolah</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                        Semester Ganjil 2024/2025
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            {/* Stats */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Ringkasan Sekolah</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Siswa" value={stats.total_siswa} icon={Users} color="emerald" href="/sekolah/siswa" />
                    <StatCard title="Total Kelas" value={stats.total_kelas} icon={BookOpen} color="blue" href="/sekolah/kelas" />
                    <StatCard title="Total Guru" value={stats.total_guru} icon={GraduationCap} color="purple" href="/sekolah/guru" />
                    <StatCard title="Kehadiran" value={`${stats.rata_kehadiran}%`} icon={Calendar} color="amber" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Activity placeholder */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Jadwal Hari Ini</h3>
                        <div className="text-slate-400 text-sm">
                            <p>Tidak ada jadwal khusus hari ini.</p>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Notifikasi</h3>
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="flex gap-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                                <div className={`w-2 h-2 mt-2 rounded-full ${notif.type === 'info' ? 'bg-blue-500' :
                                    notif.type === 'meeting' ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`} />
                                <div>
                                    <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1">{notif.desc}</p>
                                    <p className="text-[10px] text-slate-500 mt-2">{notif.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Access */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Akses Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/sekolah/siswa" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Input Nilai</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                    <Link href="/sekolah/jadwal" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Jadwal KBM</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                    <Link href="/sekolah/guru" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Data Guru</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                    <Link href="/sekolah/pengaturan" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Pengaturan</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
