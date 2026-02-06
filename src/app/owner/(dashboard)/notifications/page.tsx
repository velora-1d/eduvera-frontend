"use client";

import { useEffect, useState } from "react";
import { ownerApi } from "@/lib/api";
import { Bell, MessageCircle, Send, CheckCircle, XCircle, Clock } from "lucide-react";

interface NotificationLog {
    id: string;
    recipient: string;
    message: string;
    channel: string;
    status: string;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await ownerApi.getNotifications();
            setNotifications(response?.notifications || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const getChannelIcon = (channel: string) => {
        switch (channel?.toLowerCase()) {
            case "whatsapp":
                return <MessageCircle className="w-4 h-4 text-green-400" />;
            case "telegram":
                return <Send className="w-4 h-4 text-blue-400" />;
            default:
                return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "sent":
            case "delivered":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                        <CheckCircle className="w-3 h-3" /> Sent
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-amber-500/20 text-amber-400">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                        <XCircle className="w-3 h-3" /> Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-500/20 text-slate-400">
                        {status}
                    </span>
                );
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Notification Logs</h2>
                <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-400">{notifications.length} total</span>
                </div>
            </div>

            {/* Notifications Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800">
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Channel</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Recipient</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Message</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Status</th>
                                <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No notifications sent yet
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((notif) => (
                                    <tr key={notif.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getChannelIcon(notif.channel)}
                                                <span className="text-white capitalize">{notif.channel}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{notif.recipient}</td>
                                        <td className="px-6 py-4 text-slate-400 max-w-md truncate">{notif.message}</td>
                                        <td className="px-6 py-4">{getStatusBadge(notif.status)}</td>
                                        <td className="px-6 py-4 text-slate-400">{formatDate(notif.created_at)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
