import { OwnerSidebar } from "@/components/layouts/OwnerSidebar";
import { useRequireAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function OwnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading, isAuthenticated } = useRequireAuth("/owner/login");

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useRequireAuth
    }
    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <OwnerSidebar />
            <main className="flex-1 ml-64 bg-slate-950 min-h-screen">
                {children}
            </main>
        </div>
    );
}
