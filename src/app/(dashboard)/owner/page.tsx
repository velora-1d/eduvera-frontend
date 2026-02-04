"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function OwnerDashboard() {
    const { user, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Hello Owner!</h1>
            <p className="text-slate-400 mb-8">
                Jika Anda melihat halaman ini dan tidak crash, berarti environment Next.js Anda stabil.
            </p>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                <h2 className="text-xl font-semibold mb-4 text-amber-500">System Info:</h2>
                <div className="space-y-2 text-sm">
                    <p><span className="text-slate-500">Auth Status:</span> {isLoading ? "Loading..." : (user ? "Authenticated" : "Not Authenticated")}</p>
                    <p><span className="text-slate-500">User Name:</span> {user?.name || "---"}</p>
                    <p><span className="text-slate-500">User Email:</span> {user?.email || "---"}</p>
                    <p><span className="text-slate-500">User Role:</span> {user?.role || "---"}</p>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-500 italic">
                Minimal version - Restoring features incrementally...
            </p>
        </div>
    );
}
