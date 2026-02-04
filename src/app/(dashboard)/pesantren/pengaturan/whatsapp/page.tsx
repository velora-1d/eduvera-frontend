"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, QrCode, Wifi, WifiOff, Send, RefreshCw, Loader2, Crown, AlertTriangle } from "lucide-react";
import { tenantWhatsAppApi } from "@/lib/api";
import { showToast } from "@/components/ui/Toast";

type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

interface WhatsAppStatus {
    connected: boolean;
    status: string;
    instance_name?: string;
    device_info?: string;
}

export default function PesantrenWhatsAppSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<ConnectionStatus>("disconnected");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [deviceInfo, setDeviceInfo] = useState<string>("");
    const [isPremium, setIsPremium] = useState(true);

    const [testPhone, setTestPhone] = useState("");
    const [testMessage, setTestMessage] = useState("Ini adalah pesan test dari EduVera");
    const [sendingTest, setSendingTest] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            setLoading(true);
            const response = await tenantWhatsAppApi.getStatus();
            if (response.status === "success") {
                const data = response.data as WhatsAppStatus;
                setStatus(data.connected ? "connected" : "disconnected");
                setDeviceInfo(data.device_info || "");
            }
        } catch (error: any) {
            if (error.response?.status === 403) {
                setIsPremium(false);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const handleConnect = async () => {
        try {
            setStatus("connecting");
            setQrCode(null);
            const response = await tenantWhatsAppApi.connect();
            if (response.status === "success") {
                setQrCode(response.data.qr_code);
                showToast("Scan QR Code untuk menghubungkan WhatsApp", "info");
                pollConnectionStatus();
            }
        } catch (error: any) {
            setStatus("error");
            showToast(error.userMessage || "Gagal memulai koneksi", "error");
        }
    };

    const pollConnectionStatus = () => {
        const interval = setInterval(async () => {
            try {
                const response = await tenantWhatsAppApi.getStatus();
                if (response.data?.connected) {
                    setStatus("connected");
                    setQrCode(null);
                    setDeviceInfo(response.data.device_info || "");
                    showToast("WhatsApp berhasil terhubung!", "success");
                    clearInterval(interval);
                }
            } catch {
                // Continue polling
            }
        }, 3000);

        setTimeout(() => {
            clearInterval(interval);
            if (status === "connecting") {
                setStatus("disconnected");
                setQrCode(null);
                showToast("Waktu koneksi habis, silakan coba lagi", "error");
            }
        }, 120000);
    };

    const handleDisconnect = async () => {
        if (!confirm("Yakin ingin memutuskan koneksi WhatsApp?")) return;
        try {
            await tenantWhatsAppApi.disconnect();
            setStatus("disconnected");
            setDeviceInfo("");
            showToast("WhatsApp berhasil diputus", "success");
        } catch (error: any) {
            showToast(error.userMessage || "Gagal memutus koneksi", "error");
        }
    };

    const handleSendTest = async () => {
        if (!testPhone) {
            showToast("Masukkan nomor WhatsApp tujuan", "error");
            return;
        }
        try {
            setSendingTest(true);
            await tenantWhatsAppApi.sendTest(testPhone, testMessage);
            showToast("Pesan test berhasil dikirim!", "success");
        } catch (error: any) {
            showToast(error.userMessage || "Gagal mengirim pesan", "error");
        } finally {
            setSendingTest(false);
        }
    };

    if (!isPremium) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4">
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8 text-center">
                    <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Fitur Premium</h1>
                    <p className="text-slate-400 mb-6">
                        WhatsApp Sender adalah fitur eksklusif untuk langganan Premium.
                    </p>
                    <a href="/upgrade" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition">
                        <Crown className="w-5 h-5" />
                        Upgrade ke Premium
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">WhatsApp Sender</h1>
                    <p className="text-slate-400">Hubungkan nomor WhatsApp untuk mengirim notifikasi</p>
                </div>
            </div>

            {/* Status Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Status Koneksi</h2>
                    <button onClick={fetchStatus} className="p-2 hover:bg-slate-700 rounded-lg transition">
                        <RefreshCw className="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                    {status === "connected" ? (
                        <>
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                <Wifi className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Terhubung</p>
                                <p className="text-sm text-slate-400">{deviceInfo || "WhatsApp aktif"}</p>
                            </div>
                        </>
                    ) : status === "connecting" ? (
                        <>
                            <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Menghubungkan...</p>
                                <p className="text-sm text-slate-400">Scan QR Code di bawah</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                                <WifiOff className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Tidak Terhubung</p>
                                <p className="text-sm text-slate-400">Klik tombol untuk menghubungkan</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    {status === "connected" ? (
                        <button onClick={handleDisconnect} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition">
                            Putuskan Koneksi
                        </button>
                    ) : status !== "connecting" && (
                        <button onClick={handleConnect} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-2">
                            <QrCode className="w-4 h-4" />
                            Hubungkan WhatsApp
                        </button>
                    )}
                </div>
            </div>

            {/* QR Code */}
            {qrCode && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-emerald-500" />
                        Scan QR Code
                    </h2>
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-xl mb-4">
                            <img src={qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`} alt="QR Code" className="w-64 h-64" />
                        </div>
                        <p className="text-slate-400 text-sm text-center">Buka WhatsApp → Menu → WhatsApp Web → Scan QR</p>
                    </div>
                </div>
            )}

            {/* Test Message */}
            {status === "connected" && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-emerald-500" />
                        Kirim Pesan Test
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Nomor WhatsApp</label>
                            <input type="text" placeholder="628xxxxxxxxxx" value={testPhone} onChange={(e) => setTestPhone(e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Pesan</label>
                            <textarea placeholder="Isi pesan..." value={testMessage} onChange={(e) => setTestMessage(e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white resize-none" />
                        </div>
                        <button onClick={handleSendTest} disabled={sendingTest || !testPhone} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition flex items-center gap-2 disabled:opacity-50">
                            {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Kirim Pesan Test
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="text-sm text-blue-300">
                        <p className="font-medium mb-1">Catatan:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-300/80">
                            <li>WhatsApp hanya bisa terhubung ke satu perangkat</li>
                            <li>HP harus tetap online untuk pengiriman pesan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
