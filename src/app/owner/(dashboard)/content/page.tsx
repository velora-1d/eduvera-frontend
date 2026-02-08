"use client";

import { useEffect, useState, useCallback } from "react";
import {
    FileText,
    Save,
    Type,
    List,
    Plus,
    Trash2,
    Layout,
    BarChart3,
    MessageCircle,
    Megaphone,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showToast } from "@/components/ui/Toast"; // Using our custom toast
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { ownerApi, contentApi } from "@/lib/api";

interface ContentSection {
    id: string;
    title: string;
    description: string;
    icon: any;
}

const sections: ContentSection[] = [
    { id: "landing_hero", title: "Hero Section", description: "Main banner on landing page", icon: Layout },
    { id: "landing_features", title: "Features", description: "Platform features showcase", icon: List },
    { id: "landing_stats", title: "Statistics", description: "Platform stats (tenants, students)", icon: BarChart3 },
    { id: "landing_testimonials", title: "Testimonials", description: "Customer testimonials", icon: MessageCircle },
    { id: "landing_cta", title: "Call to Action", description: "CTA section before footer", icon: Megaphone },
];

export default function ContentPage() {
    const [activeSection, setActiveSection] = useState("landing_hero");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

    // Dynamic data state
    const [data, setData] = useState<any>(null);

    const fetchContent = useCallback(async (key: string) => {
        setLoading(true);
        try {
            const res = await contentApi.get(key);
            if (res && res.value) {
                setData(res.value);
            } else {
                // Set default structure if empty
                setData(getDefaultData(key));
            }
        } catch (error) {
            console.error("Failed to fetch content", error);
            setData(getDefaultData(key));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContent(activeSection);
    }, [activeSection, fetchContent]);

    const getDefaultData = (key: string) => {
        switch (key) {
            case "landing_hero":
                return {
                    title: "Kelola Institusi Pendidikan dengan Mudah",
                    subtitle: "Platform manajemen sekolah dan pesantren terlengkap dengan fitur modern.",
                    cta_text: "Mulai Gratis",
                    cta_link: "/register"
                };
            case "landing_features":
                return [
                    { title: "Manajemen SPP", description: "Kelola pembayaran SPP dengan mudah dan otomatis.", icon: "Wallet" },
                    { title: "Akademik Digital", description: "Sistem penilaian dan rapor digital terintegrasi.", icon: "Book" },
                    { title: "Laporan Keuangan", description: "Pantau arus kas dan laporan keuangan realtime.", icon: "BarChart" }
                ];
            case "landing_stats":
                return [
                    { label: "Institusi", value: "500+", symbol: "Building2" },
                    { label: "Siswa", value: "10.000+", symbol: "Users" },
                    { label: "Transaksi", value: "1M+", symbol: "Activity" }
                ];
            case "landing_testimonials":
                return [
                    { name: "Ahmad Fulan", role: "Kepala Sekolah", message: "Sangat membantu operasional sekolah kami.", avatar: "" }
                ];
            case "landing_cta":
                return {
                    title: "Siap mendigitalisasi sekolah Anda?",
                    subtitle: "Bergabung bersama ribuan institusi lainnya hari ini.",
                    button_text: "Daftar Sekarang",
                    button_link: "/register"
                };
            default:
                return {};
        }
    };

    const handleSaveClick = () => {
        setIsSaveDialogOpen(true);
    };

    const confirmSave = async () => {
        setSaving(true);
        try {
            await ownerApi.upsertContent({
                key: activeSection,
                value: JSON.stringify(data),
                type: "json"
            });
            showToast("Konten berhasil disimpan", "success");
            setIsSaveDialogOpen(false);
        } catch (error: any) {
            showToast(error.userMessage || "Gagal menyimpan konten", "error");
        } finally {
            setSaving(false);
        }
    };

    // Generic list handlers
    const handleAddItem = (defaultItem: any) => {
        setData([...(data || []), defaultItem]);
    };

    const handleRemoveItem = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        setData(newData);
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        setData(newData);
    };

    // --- Renderers ---

    const renderHeroEditor = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <Layout className="w-5 h-5 text-emerald-500" /> Hero Section
            </h3>
            <div className="grid gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Main Title</label>
                    <Input
                        value={data?.title || ""}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-emerald-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Subtitle</label>
                    <textarea
                        value={data?.subtitle || ""}
                        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[100px]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">CTA Text</label>
                        <Input
                            value={data?.cta_text || ""}
                            onChange={(e) => setData({ ...data, cta_text: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">CTA Link</label>
                        <Input
                            value={data?.cta_link || ""}
                            onChange={(e) => setData({ ...data, cta_link: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFeaturesEditor = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <List className="w-5 h-5 text-emerald-500" /> Features List
                </h3>
                <Button
                    size="sm"
                    onClick={() => handleAddItem({ title: "New Feature", description: "", icon: "Star" })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Feature
                </Button>
            </div>

            <div className="space-y-4">
                {Array.isArray(data) && data.map((item: any, index: number) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4 relative group">
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-4 pr-8">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Title</label>
                                <Input
                                    value={item.title}
                                    onChange={(e) => handleItemChange(index, "title", e.target.value)}
                                    className="bg-slate-900 border-slate-700 h-9"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Lucide Icon Name</label>
                                <Input
                                    value={item.icon}
                                    onChange={(e) => handleItemChange(index, "icon", e.target.value)}
                                    className="bg-slate-900 border-slate-700 h-9 font-mono text-xs"
                                    placeholder="e.g. Wallet, Users, Book"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Description</label>
                            <Input
                                value={item.description}
                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                className="bg-slate-900 border-slate-700 h-9"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStatsEditor = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" /> Statistics
                </h3>
                <Button
                    size="sm"
                    onClick={() => handleAddItem({ label: "New Stat", value: "0", symbol: "" })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Stat
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {Array.isArray(data) && data.map((item: any, index: number) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3 relative group">
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="absolute top-2 right-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Label</label>
                            <Input
                                value={item.label}
                                onChange={(e) => handleItemChange(index, "label", e.target.value)}
                                className="bg-slate-900 border-slate-700 h-8 text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Value</label>
                            <Input
                                value={item.value}
                                onChange={(e) => handleItemChange(index, "value", e.target.value)}
                                className="bg-slate-900 border-slate-700 h-8 text-sm font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-slate-400">Icon</label>
                            <Input
                                value={item.symbol}
                                onChange={(e) => handleItemChange(index, "symbol", e.target.value)}
                                className="bg-slate-900 border-slate-700 h-8 text-xs font-mono"
                                placeholder="Lucide Icon"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderTestimonialsEditor = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-emerald-500" /> Testimonials
                </h3>
                <Button
                    size="sm"
                    onClick={() => handleAddItem({ name: "Name", role: "Role", message: "Message..." })}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                </Button>
            </div>

            <div className="space-y-4">
                {Array.isArray(data) && data.map((item: any, index: number) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-4 relative group">
                        <button
                            onClick={() => handleRemoveItem(index)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid md:grid-cols-2 gap-4 pr-8">
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Name</label>
                                <Input
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                    className="bg-slate-900 border-slate-700 h-9"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400">Role</label>
                                <Input
                                    value={item.role}
                                    onChange={(e) => handleItemChange(index, "role", e.target.value)}
                                    className="bg-slate-900 border-slate-700 h-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">Message</label>
                            <textarea
                                value={item.message}
                                onChange={(e) => handleItemChange(index, "message", e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[80px]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCTAEditor = () => (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
                <Megaphone className="w-5 h-5 text-emerald-500" /> Call to Action Section
            </h3>
            <div className="grid gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Title</label>
                    <Input
                        value={data?.title || ""}
                        onChange={(e) => setData({ ...data, title: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-emerald-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Subtitle</label>
                    <Input
                        value={data?.subtitle || ""}
                        onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-emerald-500"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Button Text</label>
                        <Input
                            value={data?.button_text || ""}
                            onChange={(e) => setData({ ...data, button_text: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Button Link</label>
                        <Input
                            value={data?.button_link || ""}
                            onChange={(e) => setData({ ...data, button_link: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-500" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Content Management</h2>
                        <p className="text-slate-400 text-sm">Kelola konten landing page website utama.</p>
                    </div>
                </div>
                <Button
                    onClick={handleSaveClick}
                    disabled={saving || loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Simpan Perubahan
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-200 flex items-start gap-4 group ${activeSection === section.id
                                    ? "bg-slate-800 text-emerald-400 ring-1 ring-emerald-500/50 shadow-lg"
                                    : "bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 mt-0.5 ${activeSection === section.id ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"}`} />
                                <div>
                                    <p className="font-semibold">{section.title}</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{section.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Content Editor Area */}
                <div className="lg:col-span-3">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[500px] shadow-xl">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p>Memuat konten...</p>
                            </div>
                        ) : (
                            <>
                                {activeSection === "landing_hero" && renderHeroEditor()}
                                {activeSection === "landing_features" && renderFeaturesEditor()}
                                {activeSection === "landing_stats" && renderStatsEditor()}
                                {activeSection === "landing_testimonials" && renderTestimonialsEditor()}
                                {activeSection === "landing_cta" && renderCTAEditor()}
                            </>
                        )}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <p className="text-xs text-slate-500">
                            Perubahan akan langsung diterapkan pada landing page utama setelah disimpan.
                        </p>
                    </div>
                </div>

                <ConfirmationDialog
                    isOpen={isSaveDialogOpen}
                    onClose={() => setIsSaveDialogOpen(false)}
                    onConfirm={confirmSave}
                    title="Simpan Perubahan?"
                    description={`Apakah Anda yakin ingin menyimpan perubahan pada seksi "${sections.find(s => s.id === activeSection)?.title}"? Perubahan akan langsung terlihat di landing page.`}
                    confirmText="Simpan"
                    cancelText="Batal"
                    type="success"
                    loading={saving}
                />
            </div>
        </div>
    );
}
