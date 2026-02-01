"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Konfirmasi",
    message,
    confirmText = "Ya",
    cancelText = "Batal",
    variant = "danger",
}: ConfirmDialogProps) {
    const variants = {
        danger: {
            icon: AlertTriangle,
            iconColor: "text-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/50",
            buttonColor: "bg-red-500 hover:bg-red-600",
        },
        warning: {
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-500/50",
            buttonColor: "bg-amber-500 hover:bg-amber-600",
        },
        info: {
            icon: AlertTriangle,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/50",
            buttonColor: "bg-blue-500 hover:bg-blue-600",
        },
    };

    const config = variants[variant];
    const Icon = config.icon;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
                    <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
                    <p className="text-white text-sm">{message}</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-6 py-2 ${config.buttonColor} text-white rounded-lg font-medium transition-colors`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// Hook untuk menggunakan confirm dialog
export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<{
        message: string;
        onConfirm: () => void;
        title?: string;
        variant?: "danger" | "warning" | "info";
    }>({
        message: "",
        onConfirm: () => { },
    });

    const confirm = (
        message: string,
        onConfirm: () => void,
        options?: { title?: string; variant?: "danger" | "warning" | "info" }
    ) => {
        setConfig({ message, onConfirm, ...options });
        setIsOpen(true);
    };

    const ConfirmDialogComponent = () => (
        <ConfirmDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={config.onConfirm}
            message={config.message}
            title={config.title}
            variant={config.variant}
        />
    );

    return { confirm, ConfirmDialogComponent };
}
