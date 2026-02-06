"use client";

import { useState } from "react";
import { FileText, Save, Image, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContentSection {
    id: string;
    title: string;
    description: string;
}

const sections: ContentSection[] = [
    { id: "hero", title: "Hero Section", description: "Main banner on landing page" },
    { id: "features", title: "Features", description: "Platform features showcase" },
    { id: "stats", title: "Statistics", description: "Platform stats (tenants, students, etc)" },
    { id: "testimonials", title: "Testimonials", description: "Customer testimonials" },
    { id: "cta", title: "Call to Action", description: "CTA section before footer" },
];

export default function ContentPage() {
    const [activeSection, setActiveSection] = useState("hero");
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        hero_title: "Kelola Institusi Pendidikan dengan Mudah",
        hero_subtitle: "Platform manajemen sekolah dan pesantren terlengkap",
        hero_cta: "Mulai Gratis",
    });

    const handleSave = async () => {
        setSaving(true);
        // TODO: Implement content save API
        setTimeout(() => {
            setSaving(false);
            alert("Content saved!");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-400" />
                    <h2 className="text-2xl font-bold text-white">Content Management</h2>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700"
                >
                    {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === section.id
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"
                                }`}
                        >
                            <p className="font-medium">{section.title}</p>
                            <p className="text-sm text-slate-500">{section.description}</p>
                        </button>
                    ))}
                </div>

                {/* Content Editor */}
                <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    {activeSection === "hero" && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Type className="w-5 h-5" /> Hero Section
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Title
                                </label>
                                <Input
                                    value={content.hero_title}
                                    onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                                    className="bg-slate-800 border-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Subtitle
                                </label>
                                <Input
                                    value={content.hero_subtitle}
                                    onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                                    className="bg-slate-800 border-slate-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    CTA Button Text
                                </label>
                                <Input
                                    value={content.hero_cta}
                                    onChange={(e) => setContent({ ...content, hero_cta: e.target.value })}
                                    className="bg-slate-800 border-slate-700 max-w-xs"
                                />
                            </div>

                            {/* Preview */}
                            <div className="border-t border-slate-800 pt-6 mt-6">
                                <h4 className="text-sm font-medium text-slate-400 mb-4">Preview</h4>
                                <div className="bg-slate-800 rounded-lg p-8 text-center">
                                    <h1 className="text-2xl font-bold text-white mb-2">{content.hero_title}</h1>
                                    <p className="text-slate-400 mb-4">{content.hero_subtitle}</p>
                                    <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg">
                                        {content.hero_cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection !== "hero" && (
                        <div className="text-center py-12 text-slate-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Content editor for {sections.find(s => s.id === activeSection)?.title}</p>
                            <p className="text-sm">Coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
