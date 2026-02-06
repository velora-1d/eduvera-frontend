"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ownerApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff, Shield } from "lucide-react";

export default function OwnerLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await ownerApi.login({ email, password });

            if (typeof window !== "undefined") {
                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("is_owner", "true");
                localStorage.setItem("auth_user", JSON.stringify(response.user));
            }

            router.push("/owner");
        } catch (err: any) {
            const message = err.response?.data?.error || err.userMessage || "Email atau password salah";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Edu<span className="text-emerald-500">Vera</span>
                    </h1>
                    <p className="text-slate-400">Owner Dashboard</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900/50 backdrop-blur border border-slate-700 rounded-xl p-8 space-y-6"
                >
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Email Owner
                        </label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="owner@eduvera.com"
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
                            "Masuk sebagai Owner"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
