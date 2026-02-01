"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            const message =
                err.response?.data?.error ||
                err.userMessage ||
                "Gagal mengirim link reset password";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Cek WhatsApp Anda</h2>
                        <p className="text-slate-400 mb-6">
                            Link reset password telah dikirim ke WhatsApp yang terdaftar dengan email <span className="text-white">{email}</span>
                        </p>
                        <Link href="/login">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Kembali ke Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Edu<span className="text-emerald-500">Vera</span>
                    </h1>
                    <p className="text-slate-400">Lupa Password</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6"
                >
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Mail className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-slate-400 text-sm">
                            Masukkan email Anda untuk menerima link reset password via WhatsApp
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            required
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            "Kirim Link Reset"
                        )}
                    </Button>

                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Login
                    </Link>
                </form>
            </div>
        </div>
    );
}
