"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function OwnerSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { path: "/owner", label: "Overview" },
        { path: "/owner/tenants", label: "Tenants" },
        { path: "/owner/registrations", label: "Registrations" },
    ];

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto">
            <div className="p-6">
                <h1 className="text-xl font-bold text-white">EduOwner</h1>
            </div>

            <nav className="px-4 space-y-1 pb-20">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`block px-4 py-3 rounded-xl font-medium ${isActive ? "bg-red-500/10 text-red-500" : "text-slate-400"}`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="fixed bottom-0 left-0 w-64 p-4 bg-slate-900 border-t border-slate-800">
                <button onClick={logout} className="w-full text-left px-4 py-3 text-slate-400 hover:text-red-400">
                    Logout
                </button>
            </div>
        </aside>
    );
}
