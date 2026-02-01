"use client";

import { useState } from "react";
import { PesantrenSidebar } from "@/components/layouts/PesantrenSidebar";
import { SekolahSidebar } from "@/components/layouts/SekolahSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function HybridLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { tenant } = useAuth();
    const [mode, setMode] = useState<"pesantren" | "sekolah">("pesantren");

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Mode Switcher */}
            <div className="fixed top-4 right-4 z-50 flex gap-2 bg-slate-800 p-1 rounded-lg">
                <button
                    onClick={() => setMode("pesantren")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "pesantren"
                            ? "bg-emerald-500 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                >
                    Pesantren
                </button>
                <button
                    onClick={() => setMode("sekolah")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === "sekolah"
                            ? "bg-blue-500 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                >
                    Sekolah
                </button>
            </div>

            {mode === "pesantren" ? <PesantrenSidebar /> : <SekolahSidebar />}

            <main className="flex-1 ml-64 bg-slate-950 min-h-screen">
                {children}
            </main>
        </div>
    );
}
