"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    UserPlus,
    Receipt,
    Wallet,
    Bell,
    Settings,
    LogOut,
    Key
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function OwnerSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { path: "/owner", icon: LayoutDashboard, label: "Overview" },
        { path: "/owner/tenants", icon: Building2, label: "Tenants" },
        { path: "/owner/registrations", icon: UserPlus, label: "Registrations" },
        { path: "/owner/spp-transactions", icon: Receipt, label: "SPP Transactions" },
        { path: "/owner/disbursements", icon: Wallet, label: "Disbursement" },
        { path: "/owner/notifications", icon: Bell, label: "Notifications" },
        { path: "/owner/content", icon: Settings, label: "Content Editor" },
        { path: "/owner/settings", icon: Key, label: "Settings" },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white">
                    Edu<span className="text-red-500">Owner</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">Super Admin Panel</p>
            </div>

            <nav className="px-4 space-y-1 pb-20">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== "/owner" && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
                                ? "bg-red-500/10 text-red-500"
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
