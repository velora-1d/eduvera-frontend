"use client";

import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { sekolahApi } from "@/lib/api";
import { Loader2, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

interface ChartPoint {
    label: string;
    value: number;
}

interface AnalyticsData {
    attendance_chart: ChartPoint[];
    payment_chart: ChartPoint[];
    enrollment_chart: ChartPoint[];
    spp_collection_chart: ChartPoint[];
}

export default function AnalyticsCharts() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await sekolahApi.getAnalytics();
                if (res.data) {
                    setData(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch analytics", err);
                setError("Gagal memuat data analytics");
                // Mock data as fallback
                setData({
                    attendance_chart: [
                        { label: "Sen", value: 92 },
                        { label: "Sel", value: 88 },
                        { label: "Rab", value: 95 },
                        { label: "Kam", value: 90 },
                        { label: "Jum", value: 85 },
                    ],
                    payment_chart: [
                        { label: "Sep", value: 45000000 },
                        { label: "Okt", value: 52000000 },
                        { label: "Nov", value: 48000000 },
                        { label: "Des", value: 55000000 },
                        { label: "Jan", value: 58000000 },
                        { label: "Feb", value: 51000000 },
                    ],
                    enrollment_chart: [
                        { label: "Sep", value: 15 },
                        { label: "Okt", value: 8 },
                        { label: "Nov", value: 5 },
                        { label: "Des", value: 3 },
                        { label: "Jan", value: 12 },
                        { label: "Feb", value: 6 },
                    ],
                    spp_collection_chart: [
                        { label: "Sep", value: 95 },
                        { label: "Okt", value: 92 },
                        { label: "Nov", value: 88 },
                        { label: "Des", value: 94 },
                        { label: "Jan", value: 91 },
                        { label: "Feb", value: 85 },
                    ],
                });
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center text-slate-400 py-8">
                {error || "Data tidak tersedia"}
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return `Rp ${(value / 1000000).toFixed(0)}jt`;
    };

    return (
        <div className="space-y-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-emerald-500" />
                        <h3 className="text-lg font-semibold text-white">Kehadiran Mingguan</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.attendance_chart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#fff" }}
                                formatter={(value) => [`${value}%`, "Kehadiran"]}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Payment Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-white">Pembayaran Bulanan</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data.payment_chart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={formatCurrency} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#fff" }}
                                formatter={(value) => [formatCurrency(Number(value) || 0), "Total"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: "#3b82f6", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Enrollment Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-white">Pendaftaran Siswa Baru</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.enrollment_chart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#fff" }}
                                formatter={(value) => [value, "Siswa"]}
                            />
                            <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* SPP Collection Rate */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        <h3 className="text-lg font-semibold text-white">Tingkat Pembayaran SPP</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data.spp_collection_chart}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1e293b",
                                    border: "1px solid #334155",
                                    borderRadius: "8px",
                                }}
                                labelStyle={{ color: "#fff" }}
                                formatter={(value) => [`${value}%`, "Collection Rate"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: "#f59e0b", r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
