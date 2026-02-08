"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl";
    children: ReactNode;
    footer?: ReactNode;
    closeOnOverlay?: boolean;
}

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    size = "md",
    children,
    footer,
    closeOnOverlay = true,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={closeOnOverlay ? onClose : undefined}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={`relative w-full ${sizeClasses[size]} bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200 group"
                    >
                        <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/30">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-5 border-t border-slate-800 bg-slate-900/50 backdrop-blur-xl flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
