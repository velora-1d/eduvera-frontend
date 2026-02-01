"use client";

import { useRequireAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated } = useRequireAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <span className="ml-2 text-slate-400">Memuat...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // useRequireAuth will redirect
    }

    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
