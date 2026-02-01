"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, Globe, Mail, Key } from "lucide-react";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [settings, setSettings] = useState({
        site_name: "EduVera",
        site_description: "Platform Pendidikan Terpadu",
        contact_email: "support@eduvera.id",
        contact_phone: "+62 812-3456-7890",
        owner_email: "",
        owner_password: "",
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Implement save logic with content API
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast("Settings saved successfully!", "success");
        } catch (error) {
            console.error("Failed to save settings", error);
            showToast("Failed to save settings", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Settings</h2>
                        <p className="text-slate-400">Configure your owner dashboard settings</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                {/* Site Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Globe size={20} className="text-emerald-500" />
                        Site Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Site Name</label>
                            <input
                                type="text"
                                value={settings.site_name}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Site Description</label>
                            <input
                                type="text"
                                value={settings.site_description}
                                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Mail size={20} className="text-blue-500" />
                        Contact Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Support Email</label>
                            <input
                                type="email"
                                value={settings.contact_email}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Phone Number</label>
                            <input
                                type="tel"
                                value={settings.contact_phone}
                                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Owner Credentials */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                        <Key size={20} className="text-amber-500" />
                        Owner Credentials
                    </h3>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                        <p className="text-amber-500 text-sm">
                            ⚠️ Owner credentials are stored in environment variables on the server.
                            Changing them here requires server restart.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Owner Email</label>
                            <input
                                type="email"
                                value={settings.owner_email}
                                onChange={(e) => setSettings({ ...settings, owner_email: e.target.value })}
                                placeholder="Enter new owner email"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Owner Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={settings.owner_password}
                                    onChange={(e) => setSettings({ ...settings, owner_password: e.target.value })}
                                    placeholder="Enter new password"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-emerald-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                    <p className="text-slate-400 text-sm">
                        These actions are destructive and cannot be undone.
                    </p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors">
                            Clear Cache
                        </button>
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors">
                            Reset Content to Default
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
