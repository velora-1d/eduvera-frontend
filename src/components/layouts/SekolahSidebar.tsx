"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    BadgeDollarSign,
    FileText,
    Settings,
    LogOut,
    ClipboardList,
    UsersRound,
    CalendarDays
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function SekolahSidebar() {
    const pathname = usePathname();
    const { logout, tenant } = useAuth();

    const menuItems = [
        { path: "/sekolah", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/sekolah/siswa", icon: Users, label: "Data Siswa" },
        { path: "/sekolah/guru", icon: GraduationCap, label: "Data Guru" },
        { path: "/sekolah/kelas", icon: UsersRound, label: "Kelas" },
        { path: "/sekolah/kurikulum", icon: BookOpen, label: "Kurikulum" },
        { path: "/sekolah/erapor", icon: ClipboardList, label: "E-Rapor" },
        { path: "/sekolah/sdm", icon: Users, label: "SDM/Kepegawaian" },
        { path: "/sekolah/keuangan", icon: BadgeDollarSign, label: "Keuangan" },
        { path: "/sekolah/kalender", icon: CalendarDays, label: "Kalender" },
        { path: "/sekolah/pengaturan", icon: Settings, label: "Pengaturan" },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white">
                    Edu<span className="text-blue-500">Vera</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">{tenant?.name || "Sekolah Dashboard"}</p>
            </div>

            <nav className="px-4 space-y-1 pb-20">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== "/sekolah" && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                    ? "bg-blue-500/10 text-blue-500"
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
