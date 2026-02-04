"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Home,
    Calendar,
    BadgeDollarSign,
    FileText,
    Settings,
    LogOut,
    GraduationCap,
    BookOpenCheck,
    Scale,
    UserCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function PesantrenSidebar() {
    const pathname = usePathname();
    const { logout, tenant, user } = useAuth();

    // Check if current user is owner (untuk fitur switch dashboard)
    const isOwner = user?.role === "super_admin" || user?.role === "owner" || (typeof window !== "undefined" && localStorage.getItem("is_owner") === "true");

    const menuItems = [
        { path: "/pesantren", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/pesantren/santri", icon: Users, label: "Data Santri" },
        { path: "/pesantren/wali", icon: UserCheck, label: "Wali Santri" },
        { path: "/pesantren/ustadz", icon: GraduationCap, label: "Ustadz" },
        { path: "/pesantren/asrama", icon: Home, label: "Asrama" },
        { path: "/pesantren/tahfidz", icon: BookOpenCheck, label: "Tahfidz" },
        { path: "/pesantren/diniyah", icon: BookOpen, label: "Diniyah" },
        { path: "/pesantren/kepesantrenan", icon: Scale, label: "Kepesantrenan" },
        { path: "/pesantren/keuangan", icon: BadgeDollarSign, label: "Keuangan" },
        { path: "/pesantren/kalender", icon: Calendar, label: "Kalender" },
        { path: "/pesantren/laporan", icon: FileText, label: "Laporan" },
        { path: "/pesantren/pengaturan", icon: Settings, label: "Pengaturan" },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white">
                    Edu<span className="text-emerald-500">Vera</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">{tenant?.name || "Pesantren Dashboard"}</p>
            </div>

            <nav className="px-4 space-y-1 pb-20">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== "/pesantren" && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="fixed bottom-0 left-0 w-64 p-4 bg-slate-900 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
