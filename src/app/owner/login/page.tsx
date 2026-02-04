"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Shield, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";

export default function OwnerLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setUser, setToken } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/api/v1/owner/login", { email, password });
            const data = response.data;

            if (data.token) {
                // Set both hook state and local storage
                setToken(data.token);
                setUser(data.user);

                // Save owner session details manually since owner doesn't have /auth/me
                if (typeof window !== "undefined") {
                    localStorage.setItem("access_token", data.token); // Use consistent key
                    localStorage.setItem("is_owner", "true");
                    localStorage.setItem("auth_user", JSON.stringify(data.user));
                }

                router.push("/owner");
            }
        } catch (err: any) {
            const message =
                err.response?.data?.error ||
                "Email atau password salah";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Owner Access
                    </h1>
                    <p className="text-slate-400">Super Admin Panel</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-slate-900/80 backdrop-blur border border-amber-500/20 rounded-xl p-8 space-y-6"
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
                            placeholder="owner@eduvera.id"
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
                        className="w-full bg-amber-600 hover:bg-amber-700"
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

