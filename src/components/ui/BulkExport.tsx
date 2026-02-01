"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Archive, Loader2, Check } from "lucide-react";
import Modal from "./Modal";

interface ExportOption {
    id: string;
    label: string;
    description: string;
    icon: typeof FileSpreadsheet;
}

const EXPORT_OPTIONS: ExportOption[] = [
    { id: "students", label: "Data Siswa", description: "Semua data siswa aktif", icon: FileSpreadsheet },
    { id: "teachers", label: "Data Guru", description: "Data guru dan staf", icon: FileSpreadsheet },
    { id: "attendance", label: "Absensi", description: "Rekap absensi bulanan", icon: FileSpreadsheet },
    { id: "spp", label: "Pembayaran SPP", description: "Riwayat pembayaran", icon: FileText },
    { id: "finance", label: "Laporan Keuangan", description: "Pemasukan & pengeluaran", icon: FileText },
    { id: "schedule", label: "Jadwal Pelajaran", description: "Jadwal per kelas", icon: FileSpreadsheet },
];

interface BulkExportProps {
    tenantType?: "sekolah" | "pesantren";
}

export default function BulkExport({ tenantType = "sekolah" }: BulkExportProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [format, setFormat] = useState<"xlsx" | "pdf">("xlsx");
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleToggleItem = (id: string) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedItems.length === EXPORT_OPTIONS.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(EXPORT_OPTIONS.map((o) => o.id));
        }
    };

    const handleExport = async () => {
        if (selectedItems.length === 0) return;

        setIsExporting(true);
        setProgress(0);

        try {
            // Simulate export progress
            for (let i = 0; i < selectedItems.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                setProgress(((i + 1) / selectedItems.length) * 100);
            }

            // TODO: Replace with actual API call
            // const response = await exportApi.bulkExport(selectedItems, format);
            // Download the file

            // Simulate download
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Create mock download
            const blob = new Blob(["Export data"], { type: "application/zip" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `export_${new Date().toISOString().split("T")[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setIsOpen(false);
            setSelectedItems([]);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export gagal. Silakan coba lagi.");
        } finally {
            setIsExporting(false);
            setProgress(0);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
                <Archive size={16} />
                Export Bulk
            </button>

            <Modal
                isOpen={isOpen}
                onClose={() => !isExporting && setIsOpen(false)}
                title="Export Data Bulk"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Format Selection */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Format Export</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setFormat("xlsx")}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${format === "xlsx"
                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                                    }`}
                            >
                                <FileSpreadsheet size={20} />
                                Excel (.xlsx)
                            </button>
                            <button
                                onClick={() => setFormat("pdf")}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${format === "pdf"
                                        ? "border-red-500 bg-red-500/10 text-red-400"
                                        : "border-slate-700 text-slate-400 hover:border-slate-600"
                                    }`}
                            >
                                <FileText size={20} />
                                PDF
                            </button>
                        </div>
                    </div>

                    {/* Data Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-300">Pilih Data</label>
                            <button
                                onClick={handleSelectAll}
                                className="text-xs text-blue-400 hover:text-blue-300"
                            >
                                {selectedItems.length === EXPORT_OPTIONS.length ? "Batal Pilih Semua" : "Pilih Semua"}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {EXPORT_OPTIONS.map((option) => {
                                const Icon = option.icon;
                                const isSelected = selectedItems.includes(option.id);

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleToggleItem(option.id)}
                                        disabled={isExporting}
                                        className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${isSelected
                                                ? "border-blue-500 bg-blue-500/10"
                                                : "border-slate-700 hover:border-slate-600"
                                            }`}
                                    >
                                        <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500/20" : "bg-slate-800"}`}>
                                            <Icon size={18} className={isSelected ? "text-blue-400" : "text-slate-400"} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${isSelected ? "text-white" : "text-slate-300"}`}>
                                                    {option.label}
                                                </span>
                                                {isSelected && <Check size={14} className="text-blue-400" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Progress */}
                    {isExporting && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Mengexport data...</span>
                                <span className="text-white font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            onClick={() => setIsOpen(false)}
                            disabled={isExporting}
                            className="px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={selectedItems.length === 0 || isExporting}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                        >
                            {isExporting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Download size={16} />
                            )}
                            {isExporting ? "Mengexport..." : `Export ${selectedItems.length} Data`}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
