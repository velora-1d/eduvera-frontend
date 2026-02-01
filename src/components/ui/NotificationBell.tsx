"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, CreditCard, Calendar, Users, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
    id: string;
    type: "payment" | "event" | "attendance" | "alert";
    title: string;
    message: string;
    time: string;
    read: boolean;
    link?: string;
}

const NOTIFICATION_ICONS = {
    payment: CreditCard,
    event: Calendar,
    attendance: Users,
    alert: AlertTriangle,
};

const NOTIFICATION_COLORS = {
    payment: "text-emerald-500 bg-emerald-500/10",
    event: "text-blue-500 bg-blue-500/10",
    attendance: "text-amber-500 bg-amber-500/10",
    alert: "text-red-500 bg-red-500/10",
};

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockNotifications: Notification[] = [
            {
                id: "1",
                type: "payment",
                title: "Pembayaran SPP Diterima",
                message: "Ahmad Ibrahim telah membayar SPP bulan Januari",
                time: "5 menit lalu",
                read: false,
                link: "/sekolah/keuangan/spp",
            },
            {
                id: "2",
                type: "event",
                title: "Pengingat: UTS Semester 2",
                message: "UTS akan dimulai dalam 3 hari",
                time: "1 jam lalu",
                read: false,
                link: "/sekolah/kalender",
            },
            {
                id: "3",
                type: "attendance",
                title: "Absensi Belum Diisi",
                message: "Kelas 8A belum mengisi absensi hari ini",
                time: "2 jam lalu",
                read: true,
                link: "/sekolah/absensi",
            },
            {
                id: "4",
                type: "alert",
                title: "Tunggakan SPP",
                message: "3 siswa memiliki tunggakan lebih dari 2 bulan",
                time: "1 hari lalu",
                read: true,
                link: "/sekolah/keuangan/spp",
            },
        ];
        setNotifications(mockNotifications);
        setLoading(false);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const handleDismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleNotificationClick = (notification: Notification) => {
        handleMarkAsRead(notification.id);
        if (notification.link) {
            window.location.href = notification.link;
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
                <Bell size={20} className="text-slate-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                            <h3 className="font-semibold text-white">Notifikasi</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-blue-400 hover:text-blue-300"
                                >
                                    Tandai semua dibaca
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-8 text-center text-slate-500">
                                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                    <p>Tidak ada notifikasi</p>
                                </div>
                            ) : (
                                notifications.map((notification) => {
                                    const Icon = NOTIFICATION_ICONS[notification.type];
                                    return (
                                        <div
                                            key={notification.id}
                                            className={`relative group px-4 py-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-500/5" : ""
                                                }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`p-2 rounded-lg ${NOTIFICATION_COLORS[notification.type]}`}>
                                                    <Icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`text-sm font-medium truncate ${!notification.read ? "text-white" : "text-slate-300"}`}>
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-600 mt-1">{notification.time}</p>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
                                                {!notification.read && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMarkAsRead(notification.id);
                                                        }}
                                                        className="p-1 hover:bg-slate-700 rounded"
                                                        title="Tandai dibaca"
                                                    >
                                                        <Check size={14} className="text-slate-400" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDismiss(notification.id);
                                                    }}
                                                    className="p-1 hover:bg-slate-700 rounded"
                                                    title="Hapus"
                                                >
                                                    <X size={14} className="text-slate-400" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-3 border-t border-slate-800 text-center">
                                <a href="/notifications" className="text-sm text-blue-400 hover:text-blue-300">
                                    Lihat semua notifikasi
                                </a>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
