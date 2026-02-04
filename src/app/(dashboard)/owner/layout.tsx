"use client";

import { OwnerSidebar } from "@/components/layouts/OwnerSidebar";
import { useAuth } from "@/hooks/useAuth";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <div className="p-8 text-white">Loading Auth...</div>;
    }

    if (!isAuthenticated) {
        return <div className="p-8 text-white">Redirecting to login... (Please go to /owner/login)</div>;
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
