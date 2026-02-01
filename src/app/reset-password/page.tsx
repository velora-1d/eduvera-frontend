"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Token reset tidak valid. Silakan request ulang reset password.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password tidak cocok");
            return;
        }

        if (!token) {
            setError("Token reset tidak valid");
            return;
        }

        setLoading(true);

        try {
            await authApi.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            const message =
                err.response?.data?.error ||
                err.userMessage ||
                "Gagal reset password";
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
                        <h2 className="text-xl font-bold text-white mb-2">Password Berhasil Diubah!</h2>
                        <p className="text-slate-400 mb-6">
                            Anda akan diarahkan ke halaman login dalam beberapa detik...
                        </p>
                        <Link href="/login">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Login Sekarang
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Link Tidak Valid</h2>
                        <p className="text-slate-400 mb-6">
                            Token reset password tidak ditemukan atau sudah kadaluarsa.
                        </p>
                        <Link href="/forgot-password">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                Request Reset Ulang
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
                    <p className="text-slate-400">Reset Password</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6"
                >
                    <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Lock className="w-6 h-6 text-emerald-500" />
                        </div>
                        <p className="text-slate-400 text-sm">
                            Masukkan password baru Anda
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password Baru
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimal 8 karakter"
                                required
                                minLength={8}
                                className="bg-slate-800 border-slate-700 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Konfirmasi Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ulangi password baru"
                                required
                                className="bg-slate-800 border-slate-700 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Ubah Password"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
