"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    Building2,
    BookOpen,
    UserCog,
    AlertCircle,
    CheckCircle2,
    Clock,
    Bell,
    ArrowRight
} from "lucide-react";
import { pesantrenApi } from "@/lib/api";

interface DashboardStats {
    total_santri: number;
    total_asrama: number;
    total_ustadz: number;
    total_pengurus: number;
    attendance_rate: number;
    active_violations: number;
    active_perizinan: number;
    cash_balance: number;
    income_month: number;
    expense_month: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: "emerald" | "blue" | "purple" | "amber" | "red";
    href?: string;
    trend?: string;
    trendUp?: boolean;
}

function StatCard({ title, value, icon: Icon, color, href, trend, trendUp }: StatCardProps) {
    const colorClasses = {
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const content = (
        <div className={`p-6 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800/50 transition-colors`}>
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={20} />
                </div>
                {trend && (
                    <span className={`text-xs px-2 py-1 rounded ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-2xl font-bold text-white mt-4">{value}</h3>
            <p className="text-slate-400 text-sm mt-1">{title}</p>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

export default function PesantrenDashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        total_santri: 0,
        total_asrama: 0,
        total_ustadz: 0,
        total_pengurus: 0,
        attendance_rate: 0,
        active_violations: 0,
        active_perizinan: 0,
        cash_balance: 0,
        income_month: 0,
        expense_month: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await pesantrenApi.getDashboardStats();
                if (res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);


    const notifications = [
        { id: 1, title: "Pembayaran SPP Santri", desc: "Ahmad Fulan melunasi SPP bulan Januari", time: "10 menit lalu", type: "finance" },
        { id: 2, title: "Izin Pulang Disetujui", desc: "Santri Abdullah diizinkan pulang karena sakit", time: "1 jam lalu", type: "permit" },
        { id: 3, title: "Pelanggaran Berat", desc: "Ditemukan merokok di area asrama", time: "3 jam lalu", type: "violation" },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Monitoring</h1>
                    <p className="text-slate-400">Selamat datang, Admin Pesantren</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        Tahun Ajaran 2025/2026
                    </span>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            {/* Ringkasan Pesantren */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Ringkasan Pesantren</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Santri Aktif" value={stats.total_santri} icon={Users} color="emerald" href="/pesantren/data" trend="+12%" trendUp={true} />
                    <StatCard title="Asrama Aktif" value={stats.total_asrama} icon={Building2} color="blue" href="/pesantren/asrama" />
                    <StatCard title="Total Ustadz" value={stats.total_ustadz} icon={BookOpen} color="purple" href="/pesantren/sdm" />
                    <StatCard title="Pengurus" value={stats.total_pengurus} icon={UserCog} color="amber" href="/pesantren/sdm" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Kepesantrenan & Keuangan */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold text-white mb-4">Status Kepesantrenan Hari Ini</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard title="Kehadiran Santri" value={`${stats.attendance_rate}%`} icon={CheckCircle2} color="emerald" href="/pesantren/kepesantrenan" />
                            <StatCard title="Pelanggaran Aktif" value={stats.active_violations} icon={AlertCircle} color="red" href="/pesantren/kepesantrenan" trend="Perlu Tindakan" trendUp={false} />
                            <StatCard title="Perizinan Berjalan" value={stats.active_perizinan} icon={Clock} color="blue" href="/pesantren/kepesantrenan" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-white mb-4">Ringkasan Keuangan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
                                <p className="text-slate-400 text-sm mb-1">Saldo Kas Tunai</p>
                                <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.cash_balance)}</h3>
                            </div>
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
                                <p className="text-slate-400 text-sm mb-1">Pemasukan Bulan Ini</p>
                                <h3 className="text-2xl font-bold text-white">{formatCurrency(stats.income_month)}</h3>
                            </div>
                            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900">
                                <p className="text-slate-400 text-sm mb-1">Pengeluaran Bulan Ini</p>
                                <h3 className="text-2xl font-bold text-red-400">{formatCurrency(stats.expense_month)}</h3>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Notifikasi */}
                <div className="space-y-8">
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
                        <h2 className="text-lg font-semibold text-white mb-4">Notifikasi Terbaru</h2>
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="flex gap-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${notif.type === 'violation' ? 'bg-red-500' : notif.type === 'finance' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                    <div>
                                        <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1">{notif.desc}</p>
                                        <p className="text-[10px] text-slate-500 mt-2">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 text-sm text-center text-slate-400 hover:text-white">
                            Lihat Semua Notifikasi
                        </button>
                    </section>
                </div>
            </div>

            {/* Quick Access */}
            <section>
                <h2 className="text-lg font-semibold text-white mb-4">Akses Cepat</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/pesantren/kepesantrenan" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Input Pelanggaran</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                    <Link href="/pesantren/keuangan" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Catat Pemasukan</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                    <Link href="/pesantren/asrama" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Absensi Asrama</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                    <Link href="/pesantren/laporan" className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between group">
                        <span className="text-slate-300 font-medium group-hover:text-white">Buat Pengumuman</span>
                        <ArrowRight size={18} className="text-slate-500 group-hover:text-white" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
