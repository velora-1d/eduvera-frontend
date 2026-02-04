"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { OwnerSidebar } from "@/components/layouts/OwnerSidebar";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration issues by only rendering layout on client
    if (!mounted) {
        return <div className="min-h-screen bg-slate-950" />;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white text-lg">Authenticating...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Sesi Tidak Ditemukan</h2>
                <p className="text-slate-400 mb-6">Silakan masuk kembali untuk mengakses area owner.</p>
                <a
                    href="/owner/login"
                    className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                    Ke Halaman Login
                </a>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <OwnerSidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
