"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import { AlertTriangle, CheckCircle, Info, X, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "success" | "info" | "warning";
    loading?: boolean;
}

export default function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "info",
    loading = false,
}: ConfirmationDialogProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const typeConfig = {
        danger: {
            icon: AlertTriangle,
            iconBg: "bg-red-500/10",
            iconColor: "text-red-500",
            confirmBtn: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20",
        },
        success: {
            icon: CheckCircle,
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
            confirmBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20",
        },
        warning: {
            icon: HelpCircle,
            iconBg: "bg-amber-500/10",
            iconColor: "text-amber-500",
            confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-500/20",
        },
        info: {
            icon: Info,
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            confirmBtn: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
        },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && !loading) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose, loading]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={!loading ? onClose : undefined}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${config.iconBg} flex-shrink-0`}>
                            <Icon className={`w-6 h-6 ${config.iconColor}`} />
                        </div>
                        <div className="flex-1 mt-1">
                            <h3 className="text-lg font-bold leading-6 text-white">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {!loading && (
                            <button
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                            className="border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`${config.confirmBtn} min-w-[100px] border-0`}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
