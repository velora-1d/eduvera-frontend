"use client";

import { useState, useEffect } from "react";
import { Send, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { ownerApi } from "@/lib/api";

interface NotificationLog {
    id: string;
    type: string;
    recipient: string;
    subject?: string;
    message: string;
    status: string;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            const res = await ownerApi.getNotifications();
            setNotifications((res as any).data || res || []);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Notification Logs</h2>
                    <p className="text-slate-400">Track all sent notifications</p>
                </div>

                {/* Filter */}
                <div className="flex gap-2">
                    {["all", "telegram", "email"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === type
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Send className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Total Sent</div>
                                <div className="text-xl font-bold text-white">{notifications.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-500/10 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-sky-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Telegram</div>
                                <div className="text-xl font-bold text-white">
                                    {notifications.filter(n => n.type === 'telegram').length}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <div className="text-slate-400 text-sm">Success Rate</div>
                                <div className="text-xl font-bold text-white">100%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logs */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="font-medium text-white">Recent Notifications</h3>
                    </div>
                    <div className="divide-y divide-slate-800">
                        {isLoading ? (
                            <div className="px-6 py-8 text-center text-slate-500">
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="px-6 py-8 text-center text-slate-500">
                                No notifications yet
                            </div>
                        ) : (
                            notifications
                                .filter(n => filter === 'all' || n.type === filter)
                                .map((notif) => (
                                    <div key={notif.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${notif.type === 'telegram' ? 'bg-sky-500/10' : 'bg-purple-500/10'
                                                }`}>
                                                <MessageSquare className={`w-4 h-4 ${notif.type === 'telegram' ? 'text-sky-500' : 'text-purple-500'
                                                    }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-white">
                                                        {notif.type.toUpperCase()}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {new Date(notif.created_at).toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-slate-500">To: {notif.recipient}</span>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${notif.status === 'sent'
                                                            ? 'bg-emerald-500/10 text-emerald-500'
                                                            : 'bg-red-500/10 text-red-500'
                                                        }`}>
                                                        {notif.status === 'sent' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                        {notif.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
