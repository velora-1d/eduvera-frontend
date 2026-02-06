"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        platformName: "EduVera",
        supportEmail: "support@eduvera.id",
        supportWhatsApp: "081320442174",
        revenueSharePercent: "10",
        trialDays: "14",
        telegramChatId: "",
    });

    const handleSave = async () => {
        setSaving(true);
        // TODO: Implement save settings API
        setTimeout(() => {
            setSaving(false);
            alert("Settings saved!");
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-slate-400" />
                <h2 className="text-2xl font-bold text-white">Settings</h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
                    Platform Settings
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Platform Name
                        </label>
                        <Input
                            value={settings.platformName}
                            onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Support Email
                        </label>
                        <Input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Support WhatsApp
                        </label>
                        <Input
                            value={settings.supportWhatsApp}
                            onChange={(e) => setSettings({ ...settings, supportWhatsApp: e.target.value })}
                            className="bg-slate-800 border-slate-700"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
                    Business Settings
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Revenue Share (%)
                        </label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={settings.revenueSharePercent}
                            onChange={(e) => setSettings({ ...settings, revenueSharePercent: e.target.value })}
                            className="bg-slate-800 border-slate-700 max-w-32"
                        />
                        <p className="text-slate-500 text-sm mt-1">
                            Percentage of revenue shared with platform
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Trial Period (Days)
                        </label>
                        <Input
                            type="number"
                            min="1"
                            value={settings.trialDays}
                            onChange={(e) => setSettings({ ...settings, trialDays: e.target.value })}
                            className="bg-slate-800 border-slate-700 max-w-32"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white border-b border-slate-800 pb-3">
                    Notification Settings
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Telegram Chat ID
                        </label>
                        <Input
                            value={settings.telegramChatId}
                            onChange={(e) => setSettings({ ...settings, telegramChatId: e.target.value })}
                            placeholder="e.g., 7978715275"
                            className="bg-slate-800 border-slate-700"
                        />
                        <p className="text-slate-500 text-sm mt-1">
                            Chat ID for receiving registration notifications
                        </p>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
            >
                {saving ? (
                    <>Saving...</>
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" /> Save Settings
                    </>
                )}
            </Button>
        </div>
    );
}
