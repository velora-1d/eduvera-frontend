"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function OwnerOverviewPage() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Owner Overview</h1>
                    <p className="text-slate-400">Welcome to the super admin dashboard.</p>
                </div>
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-sm font-medium">
                    Owner Account
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400 text-sm mb-1">User Name</h3>
                    <p className="text-xl font-bold text-white">{user?.name || "---"}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400 text-sm mb-1">User Email</h3>
                    <p className="text-xl font-bold text-white">{user?.email || "---"}</p>
                </div>
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-400 text-sm mb-1">User Role</h3>
                    <p className="text-xl font-bold text-white uppercase">{user?.role || "---"}</p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-dashed border-slate-800 text-center">
                <p className="text-slate-500">
                    Dashboard features will be restored incrementally after stability is verified.
                </p>
                <p className="text-emerald-500 mt-2 font-mono text-xs">
                    CONSOLIDATED ROUTE: /app/owner/page.tsx
                </p>
            </div>
        </div>
    );
}
