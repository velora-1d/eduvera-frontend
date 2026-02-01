"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!isVisible) return null;

    const configs = {
        success: {
            icon: CheckCircle,
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-500/50",
            iconColor: "text-emerald-500",
            textColor: "text-emerald-100",
        },
        error: {
            icon: AlertCircle,
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/50",
            iconColor: "text-red-500",
            textColor: "text-red-100",
        },
        warning: {
            icon: AlertTriangle,
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/50",
            iconColor: "text-amber-500",
            textColor: "text-amber-100",
        },
        info: {
            icon: Info,
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/50",
            iconColor: "text-blue-500",
            textColor: "text-blue-100",
        },
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 ${config.bgColor} ${config.borderColor} border backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg min-w-[300px] max-w-md transition-all duration-300 ${isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
                }`}
        >
            <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
            <p className={`${config.textColor} text-sm flex-1`}>{message}</p>
            <button
                onClick={handleClose}
                className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Toast Container untuk multiple toasts
interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

export function ToastContainer() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        // Listen for custom toast events
        const handleToast = (event: CustomEvent<{ message: string; type: ToastType }>) => {
            const id = Date.now().toString();
            setToasts((prev) => [...prev, { id, ...event.detail }]);
        };

        window.addEventListener("show-toast" as any, handleToast);
        return () => window.removeEventListener("show-toast" as any, handleToast);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast, index) => (
                <div
                    key={toast.id}
                    style={{ transform: `translateY(${index * 10}px)` }}
                    className="transition-transform"
                >
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
}

// Helper function to show toast
export function showToast(message: string, type: ToastType = "info") {
    const event = new CustomEvent("show-toast", {
        detail: { message, type },
    });
    window.dispatchEvent(event);
}
