"use client";

import { useState, useCallback } from "react";
import { Upload, X, File, Image, FileText, Loader2 } from "lucide-react";

interface FileUploadProps {
    onUpload: (files: File[]) => Promise<string[]>;
    accept?: string;
    multiple?: boolean;
    maxSize?: number; // in MB
    label?: string;
    value?: string[];
    onChange?: (urls: string[]) => void;
}

export default function FileUpload({
    onUpload,
    accept = "image/*,.pdf,.doc,.docx",
    multiple = false,
    maxSize = 5,
    label = "Upload File",
    value = [],
    onChange,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>(value);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const validateFiles = (files: FileList | File[]): File[] => {
        const validFiles: File[] = [];
        setError(null);

        Array.from(files).forEach((file) => {
            if (file.size > maxSize * 1024 * 1024) {
                setError(`File ${file.name} melebihi batas ${maxSize}MB`);
                return;
            }
            validFiles.push(file);
        });

        return validFiles;
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = validateFiles(e.dataTransfer.files);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const validFiles = validateFiles(files);
        if (validFiles.length > 0) {
            await uploadFiles(validFiles);
        }
        e.target.value = "";
    };

    const uploadFiles = async (files: File[]) => {
        setIsUploading(true);
        setError(null);

        try {
            const urls = await onUpload(files);
            const newFiles = multiple ? [...uploadedFiles, ...urls] : urls;
            setUploadedFiles(newFiles);
            onChange?.(newFiles);
        } catch (err) {
            setError("Gagal mengupload file. Silakan coba lagi.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        setUploadedFiles(newFiles);
        onChange?.(newFiles);
    };

    const getFileIcon = (url: string) => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return Image;
        if (url.match(/\.(pdf)$/i)) return FileText;
        return File;
    };

    const getFileName = (url: string) => {
        return url.split("/").pop() || "file";
    };

    return (
        <div className="space-y-3">
            {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}

            {/* Dropzone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
            >
                <input
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-400">Mengupload...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-3 bg-slate-800 rounded-full">
                            <Upload className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium">
                                Drag & drop atau <span className="text-blue-400">pilih file</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Maksimal {maxSize}MB per file
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                    {uploadedFiles.map((url, index) => {
                        const Icon = getFileIcon(url);
                        const isImage = url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg group"
                            >
                                {isImage ? (
                                    <img
                                        src={url}
                                        alt="Preview"
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                                        <Icon className="w-6 h-6 text-slate-400" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{getFileName(url)}</p>
                                </div>
                                <button
                                    onClick={() => handleRemove(index)}
                                    className="p-1.5 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
