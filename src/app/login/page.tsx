"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(email, password);

            const redirectTo =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("redirectAfterLogin")
                    : null;

            if (redirectTo) {
                sessionStorage.removeItem("redirectAfterLogin");
                router.push(redirectTo);
            } else {
                // Default redirect - will be based on user's tenant type
                router.push("/pesantren");
            }
        } catch (err: any) {
            const message =
                err.response?.data?.error ||
                err.userMessage ||
                "Email atau password salah";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Edu<span className="text-emerald-500">Vera</span>
                    </h1>
                    <p className="text-slate-400">Masuk ke dashboard Anda</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6"
                >
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

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
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

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Memuat...
                            </>
                        ) : (
                            "Masuk"
                        )}
                    </Button>

                    <p className="text-center text-sm text-slate-400">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-emerald-500 hover:underline">
                            Daftar di sini
                        </Link>
                    </p>

                    <p className="text-center text-sm">
                        <Link href="/forgot-password" className="text-slate-400 hover:text-white">
                            Lupa Password?
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

