"use client";

import { useEffect, useState, useCallback } from "react";
import { ownerApi } from "@/lib/api";
import {
    Smartphone,
    Scan,
    CheckCircle,
    XCircle,
    RefreshCw,
    LogOut,
    AlertCircle,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { showToast } from "@/components/ui/Toast";

interface WhatsAppStatus {
    status: string; // "CONNECTED", "DISCONNECTED", "CONNECTING"
    phone?: string;
    instanceName?: string;
}

export default function WhatsAppSettingsPage() {
    const [status, setStatus] = useState<string>("LOADING");
    const [phone, setPhone] = useState<string | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [polling, setPolling] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const data = await ownerApi.getWhatsAppStatus();
            setStatus(data.status);
            if (data.status === "CONNECTED") {
                setPhone(data.phone_number || null);
                setQrCode(null);
                setPolling(false);
            } else if (data.status === "CONNECTING") {
                setPolling(true);
            } else {
                setPolling(false);
            }
        } catch (error) {
            console.error("Failed to fetch WhatsApp status", error);
            setStatus("ERROR");
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Polling when connecting
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (polling) {
            interval = setInterval(() => {
                fetchStatus();
            }, 5000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [polling, fetchStatus]);

    const handleConnect = async () => {
        setLoading(true);
        setQrCode(null);
        try {
            const data = await ownerApi.connectWhatsApp();
            if (data.qr_code) {
                setQrCode(data.qr_code);
                setStatus("CONNECTING");
                setPolling(true);
            } else if (data.status === "CONNECTED") {
                setStatus("CONNECTED");
                setPhone(data.phone_number);
            }
        } catch (error: any) {
            showToast(error.userMessage || "Gagal menghubungkan WhatsApp", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Apakah Anda yakin ingin memutuskan koneksi WhatsApp?")) return;

        setLoading(true);
        try {
            await ownerApi.disconnectWhatsApp();
            setStatus("DISCONNECTED");
            setPhone(null);
            setQrCode(null);
            setPolling(false);
            showToast("WhatsApp berhasil diputuskan", "success");
        } catch (error: any) {
            showToast(error.userMessage || "Gagal memutuskan koneksi WhatsApp", "error");
        } finally {
            setLoading(false);
        }
    };

    const getStatusDisplay = () => {
        switch (status) {
            case "CONNECTED":
                return (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Terhubung
                    </div>
                );
            case "CONNECTING":
                return (
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Menunggu Scan...
                    </div>
                );
            case "DISCONNECTED":
                return (
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        Terputus
                    </div>
                );
            case "LOADING":
                return (
                    <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Memuat...
                    </div>
                );
            default:
                return (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        Error
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-7 h-7 text-emerald-500" />
                    WhatsApp Owner
                </h2>
                <p className="text-slate-400">
                    Hubungkan akun WhatsApp owner untuk menerima notifikasi sistem (Registrasi, Pembayaran, dsb).
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-6 border-slate-800">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-white">Status Koneksi</h3>
                        {getStatusDisplay()}
                    </div>

                    <div className="space-y-4">
                        {status === "CONNECTED" ? (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2">
                                    <span className="text-slate-400">Nomor Terhubung</span>
                                    <span className="text-white font-medium">{phone || "-"}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2">
                                    <span className="text-slate-400">Provider</span>
                                    <span className="text-blue-400 font-medium">Evolution API</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Uptime</span>
                                    <span className="text-emerald-400">Aktif</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-center">
                                <p className="text-slate-500 text-sm">
                                    Belum ada WhatsApp yang terhubung.
                                </p>
                            </div>
                        )}

                        <div className="pt-2">
                            {status === "CONNECTED" ? (
                                <Button
                                    onClick={handleDisconnect}
                                    disabled={loading}
                                    variant="outline"
                                    className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-4 h-4 mr-2" />}
                                    Putuskan Koneksi
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleConnect}
                                    disabled={loading || status === "CONNECTING"}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
                                    {status === "CONNECTING" ? "Menunggu Scand..." : "Hubungkan WhatsApp"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
                    <h3 className="text-lg font-semibold text-white mb-6 w-full text-left">Scan QR Code</h3>

                    {qrCode ? (
                        <div className="bg-white p-4 rounded-2xl shadow-xl shadow-emerald-500/10 mb-6">
                            <img
                                src={qrCode}
                                alt="WhatsApp QR Code"
                                className="w-64 h-64"
                            />
                        </div>
                    ) : status === "CONNECTED" ? (
                        <div className="text-center space-y-4 py-8">
                            <div className="bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-white font-bold">Terhubung!</h4>
                                <p className="text-slate-400 text-sm max-w-[250px]">
                                    WhatsApp Anda sudah siap menerima notifikasi.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 py-8">
                            <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                                <Scan className="w-10 h-10 text-slate-500" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-slate-400 font-medium">QR Code Belum Tersedia</h4>
                                <p className="text-slate-500 text-sm max-w-[250px]">
                                    Klik tombol "Hubungkan WhatsApp" untuk menampilkan QR Code.
                                </p>
                            </div>
                        </div>
                    )}

                    {qrCode && (
                        <div className="flex items-center gap-2 text-amber-400 animate-pulse text-sm font-medium">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Silakan scan via WhatsApp {">"} Linked Devices
                        </div>
                    )}
                </Card>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <div className="text-sm text-blue-400/90 leading-relaxed">
                    <p className="font-semibold mb-1">Panduan Penghubungan:</p>
                    <ol className="list-decimal ml-4 space-y-1">
                        <li>Pastikan WhatsApp Anda dalam kondisi aktif dan memiliki koneksi internet.</li>
                        <li>Klik <b>Hubungkan WhatsApp</b> untuk menginisialisasi sesi.</li>
                        <li>Buka WhatsApp di HP Anda {">"} Menu/Setelan {">"} Perangkat Tertaut {">"} Tautkan Perangkat.</li>
                        <li>Arahkan kamera HP ke QR Code yang muncul di layar dashboard.</li>
                        <li>Tunggu proses sinkronisasi hingga status berubah menjadi <b>Terhubung</b>.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
