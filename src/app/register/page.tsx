"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Building2, User, Globe, CreditCard, School, BookOpen, Loader2, Eye, EyeOff, Zap, Star } from "lucide-react";
import { onboardingApi } from "@/lib/api";
import { pricing, planMetadata, formatPrice, PlanType, TierType, BillingType } from "@/lib/pricing";
import { showToast } from "@/components/ui/Toast";

interface FormData {
    // Step 1: Admin Account
    adminName: string;
    adminEmail: string;
    adminWhatsApp: string;
    password: string;
    confirmPassword: string;

    // Step 2: Plan Selection
    planType: PlanType;
    subscriptionTier: TierType;
    billingCycle: BillingType;

    // Step 3: Institution Info
    institutionName: string;      // Primary name / Yayasan name
    schoolName: string;           // For hybrid: specific school name
    pesantrenName: string;        // For hybrid: specific pesantren name
    schoolJenjangs: string[];     // Multi-select: TK, SD, MI, SMP, MTs, SMA, MA, SMK
    address: string;

    // Step 4: Subdomain
    subdomain: string;

    // Step 5: Bank Account
    bankName: string;
    accountNumber: string;
    accountHolder: string;
}

const initialFormData: FormData = {
    adminName: "",
    adminEmail: "",
    adminWhatsApp: "",
    password: "",
    confirmPassword: "",
    planType: "hybrid",        // Default: Hybrid for trial
    subscriptionTier: "basic", // Default: Basic (trial)
    billingCycle: "monthly",
    institutionName: "",
    schoolName: "",
    pesantrenName: "",
    schoolJenjangs: [],
    address: "",
    subdomain: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
};

// Simplified steps - removed Plan Selection (all users get Hybrid Trial)
const steps = [
    { id: 1, title: "Akun Admin", icon: User },
    { id: 2, title: "Info Lembaga", icon: Building2 },
    { id: 3, title: "Subdomain", icon: Globe },
    { id: 4, title: "Rekening Bank", icon: CreditCard },
];


export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [subdomainChecking, setSubdomainChecking] = useState(false);
    const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [customBankName, setCustomBankName] = useState("");
    const [isCustomBank, setIsCustomBank] = useState(false);

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const getCurrentPrice = () => {
        return pricing[formData.planType][formData.subscriptionTier][formData.billingCycle];
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (step === 1) {
            if (!formData.adminName.trim()) newErrors.adminName = "Nama wajib diisi";
            if (!formData.adminEmail.trim()) newErrors.adminEmail = "Email wajib diisi";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) newErrors.adminEmail = "Format email tidak valid";
            if (!formData.adminWhatsApp.trim()) newErrors.adminWhatsApp = "WhatsApp wajib diisi";
            else if (!/^(\+62|62|08)[0-9]{8,12}$/.test(formData.adminWhatsApp.replace(/\s/g, ""))) newErrors.adminWhatsApp = "Format WhatsApp tidak valid";
            if (!formData.password) newErrors.password = "Password wajib diisi";
            else if (formData.password.length < 8) newErrors.password = "Password minimal 8 karakter";
            if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Password tidak cocok";
        } else if (step === 2) {
            // Step 2: Institution (was Step 3)
            if (!formData.institutionName.trim()) newErrors.institutionName = "Nama lembaga wajib diisi";
            if (!formData.address.trim()) newErrors.address = "Alamat wajib diisi";
            // Hybrid always requires school jenjangs selection
            if (formData.schoolJenjangs.length === 0) {
                (newErrors as Record<string, string>).schoolJenjangs = "Pilih minimal satu jenjang sekolah";
            }
        } else if (step === 3) {
            // Step 3: Subdomain (was Step 4)
            if (!formData.subdomain.trim()) newErrors.subdomain = "Subdomain wajib diisi";
            else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) newErrors.subdomain = "Subdomain hanya boleh huruf kecil, angka, dan strip";
            else if (subdomainAvailable === false) newErrors.subdomain = "Subdomain sudah digunakan";
        } else if (step === 4) {
            // Step 4: Bank Account (was Step 5)
            const bankName = isCustomBank ? customBankName : formData.bankName;
            if (!bankName.trim()) newErrors.bankName = "Nama bank wajib diisi";
            if (!formData.accountNumber.trim()) newErrors.accountNumber = "Nomor rekening wajib diisi";
            if (!formData.accountHolder.trim()) newErrors.accountHolder = "Nama pemilik rekening wajib diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkSubdomain = async () => {
        if (!formData.subdomain.trim()) return;
        setSubdomainChecking(true);
        try {
            const res = await onboardingApi.checkSubdomain(formData.subdomain);
            setSubdomainAvailable(res.available);
        } catch {
            setSubdomainAvailable(null);
        } finally {
            setSubdomainChecking(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.subdomain.length >= 3) checkSubdomain();
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.subdomain]);

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 4) setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        if (!validateStep(5)) return;
        setLoading(true);
        try {
            const registerRes = await onboardingApi.register({
                name: formData.adminName,
                email: formData.adminEmail,
                whatsapp: formData.adminWhatsApp,
                password: formData.password,
            });

            const sessionId = registerRes.session_id;

            await onboardingApi.institution({
                session_id: sessionId,
                institution_name: formData.institutionName,
                school_name: formData.schoolName || undefined,
                pesantren_name: formData.pesantrenName || undefined,
                school_jenjangs: formData.schoolJenjangs.length > 0 ? formData.schoolJenjangs : undefined,
                institution_type: formData.planType,
                plan_type: formData.planType,
                subscription_tier: formData.subscriptionTier,
                billing_cycle: formData.billingCycle,
                address: formData.address,
            });

            await onboardingApi.subdomain({
                session_id: sessionId,
                subdomain: formData.subdomain,
            });

            // Use custom bank name if selected
            const finalBankName = isCustomBank ? customBankName : formData.bankName;

            await onboardingApi.bankAccount({
                session_id: sessionId,
                bank_name: finalBankName,
                account_number: formData.accountNumber,
                account_holder: formData.accountHolder,
            });

            await onboardingApi.confirm({ session_id: sessionId });

            showToast("Pendaftaran berhasil! Silakan login.", "success");
            setTimeout(() => {
                router.push("/login?registered=true");
            }, 1500);
        } catch (error: any) {
            console.error("Registration failed", error);
            const errorMessage = error?.response?.data?.error || error?.message || "Pendaftaran gagal. Silakan coba lagi.";
            showToast(errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8 overflow-x-auto">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep > step.id
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : currentStep === step.id
                            ? "border-emerald-500 text-emerald-500"
                            : "border-slate-700 text-slate-500"
                        }`}>
                        {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-1 ${currentStep > step.id ? "bg-emerald-500" : "bg-slate-700"}`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Akun Admin</h2>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Nama Lengkap</label>
                <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => updateFormData("adminName", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.adminName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="Nama admin"
                />
                {errors.adminName && <p className="text-red-500 text-sm mt-1">{errors.adminName}</p>}
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => updateFormData("adminEmail", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.adminEmail ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="email@lembaga.com"
                />
                {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Nomor WhatsApp</label>
                <input
                    type="tel"
                    value={formData.adminWhatsApp}
                    onChange={(e) => updateFormData("adminWhatsApp", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.adminWhatsApp ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="08xxxxxxxxxx"
                />
                {errors.adminWhatsApp && <p className="text-red-500 text-sm mt-1">{errors.adminWhatsApp}</p>}
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateFormData("password", e.target.value)}
                        className={`w-full bg-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-emerald-500`}
                        placeholder="Minimal 8 karakter"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Konfirmasi Password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                        className={`w-full bg-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-emerald-500`}
                        placeholder="Ulangi password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Pilih Paket Langganan</h2>

            {/* Plan Type Selection */}
            <div>
                <label className="block text-sm text-slate-400 mb-3">Jenis Lembaga</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {([
                        { id: "sekolah" as const, title: "Sekolah", desc: "SD, SMP, SMA, SMK", icon: School, color: "blue", payment: "SPP", recommended: false },
                        { id: "pesantren" as const, title: "Pesantren", desc: "Pondok & Madrasah", icon: BookOpen, color: "emerald", payment: "Syahriah", recommended: false },
                        { id: "hybrid" as const, title: "Hybrid", desc: "Sekolah + Pesantren", icon: Building2, color: "purple", payment: "SPP & Syahriah", recommended: true },
                    ]).map((plan) => (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => updateFormData("planType", plan.id)}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${formData.planType === plan.id
                                ? `border-${plan.color}-500 bg-${plan.color}-500/10`
                                : "border-slate-700 hover:border-slate-600"
                                }`}
                        >
                            {plan.recommended && (
                                <span className="absolute -top-2 right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">Rekomendasi</span>
                            )}
                            <plan.icon className={`w-8 h-8 mb-2 ${formData.planType === plan.id ? `text-${plan.color}-500` : "text-slate-400"}`} />
                            <h3 className="font-semibold text-white">{plan.title}</h3>
                            <p className="text-sm text-slate-400">{plan.desc}</p>
                            <p className="text-xs text-slate-500 mt-1">Pembayaran: {plan.payment}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tier Selection */}
            <div>
                <label className="block text-sm text-slate-400 mb-3">Tier Langganan</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => updateFormData("subscriptionTier", "basic")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.subscriptionTier === "basic"
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-700 hover:border-slate-600"
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Star className={`w-5 h-5 ${formData.subscriptionTier === "basic" ? "text-emerald-500" : "text-slate-400"}`} />
                            <h3 className="font-semibold text-white">Basic</h3>
                        </div>
                        <p className="text-sm text-slate-400">Pembayaran {formData.planType === "sekolah" ? "SPP" : formData.planType === "pesantren" ? "Syahriah" : "SPP/Syahriah"} manual</p>
                        <p className="text-xs text-slate-500 mt-1">Admin approve setiap pembayaran</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => updateFormData("subscriptionTier", "premium")}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${formData.subscriptionTier === "premium"
                            ? "border-amber-500 bg-amber-500/10"
                            : "border-slate-700 hover:border-slate-600"
                            }`}
                    >
                        <span className="absolute -top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Auto
                        </span>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className={`w-5 h-5 ${formData.subscriptionTier === "premium" ? "text-amber-500" : "text-slate-400"}`} />
                            <h3 className="font-semibold text-white">Premium</h3>
                        </div>
                        <p className="text-sm text-slate-400">Payment Gateway otomatis</p>
                        <p className="text-xs text-slate-500 mt-1">GoPay, OVO, DANA, Transfer, QRIS</p>
                    </button>
                </div>
            </div>

            {/* Billing Cycle */}
            <div>
                <label className="block text-sm text-slate-400 mb-3">Periode Pembayaran</label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => updateFormData("billingCycle", "monthly")}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${formData.billingCycle === "monthly"
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-700 hover:border-slate-600"
                            }`}
                    >
                        <h3 className="font-semibold text-white">Bulanan</h3>
                        <p className="text-lg font-bold text-emerald-500 mt-1">{formatPrice(pricing[formData.planType][formData.subscriptionTier].monthly)}</p>
                        <p className="text-xs text-slate-500">/bulan</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => updateFormData("billingCycle", "annual")}
                        className={`relative p-4 rounded-xl border-2 text-center transition-all ${formData.billingCycle === "annual"
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-slate-700 hover:border-slate-600"
                            }`}
                    >
                        <span className="absolute -top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">Hemat 2 Bulan</span>
                        <h3 className="font-semibold text-white">Tahunan</h3>
                        <p className="text-lg font-bold text-emerald-500 mt-1">{formatPrice(pricing[formData.planType][formData.subscriptionTier].annual)}</p>
                        <p className="text-xs text-slate-500">/tahun</p>
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <h4 className="font-semibold text-white mb-2">Ringkasan Paket</h4>
                <div className="text-sm space-y-1">
                    <p className="text-slate-400">Paket: <span className="text-white capitalize">{formData.planType} {formData.subscriptionTier}</span></p>
                    <p className="text-slate-400">Periode: <span className="text-white">{formData.billingCycle === "monthly" ? "Bulanan" : "Tahunan"}</span></p>
                    <p className="text-slate-400">Total: <span className="text-emerald-500 font-bold">{formatPrice(getCurrentPrice())}</span></p>
                    {formData.subscriptionTier === "premium" && (
                        <p className="text-amber-500 text-xs mt-2 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Termasuk Payment Gateway untuk {formData.planType === "sekolah" ? "SPP" : formData.planType === "pesantren" ? "Syahriah" : "SPP & Syahriah"}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Informasi Lembaga</h2>

            {/* Nama Lembaga / Yayasan */}
            <div>
                <label className="block text-sm text-slate-400 mb-1">
                    {formData.planType === "hybrid" ? "Nama Yayasan / Lembaga Induk" : formData.planType === "sekolah" ? "Nama Sekolah" : "Nama Pesantren"}
                </label>
                <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => updateFormData("institutionName", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.institutionName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder={formData.planType === "hybrid" ? "Yayasan Al-Hikmah" : formData.planType === "sekolah" ? "SMA Negeri 1 Jakarta" : "Pondok Pesantren Al-Hikmah"}
                />
                {errors.institutionName && <p className="text-red-500 text-sm mt-1">{errors.institutionName}</p>}
            </div>

            {/* Hybrid: Nama Sekolah (Opsional) */}
            {formData.planType === "hybrid" && (
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Nama Sekolah <span className="text-slate-500">(opsional, jika berbeda dari yayasan)</span>
                    </label>
                    <input
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => updateFormData("schoolName", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Contoh: SMA Terpadu Al-Hikmah"
                    />
                    <p className="text-xs text-slate-500 mt-1">Kosongkan jika nama sekolah sama dengan nama yayasan</p>
                </div>
            )}

            {/* Hybrid: Nama Pesantren (Opsional) */}
            {formData.planType === "hybrid" && (
                <div>
                    <label className="block text-sm text-slate-400 mb-1">
                        Nama Pesantren <span className="text-slate-500">(opsional, jika berbeda dari yayasan)</span>
                    </label>
                    <input
                        type="text"
                        value={formData.pesantrenName}
                        onChange={(e) => updateFormData("pesantrenName", e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Contoh: Pondok Pesantren Nurul Iman"
                    />
                    <p className="text-xs text-slate-500 mt-1">Kosongkan jika nama pesantren sama dengan nama yayasan</p>
                </div>
            )}

            {/* Multi-select Jenjang Sekolah */}
            {(formData.planType === "sekolah" || formData.planType === "hybrid") && (
                <div>
                    <label className="block text-sm text-slate-400 mb-2">
                        Jenjang Sekolah <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-3">Pilih jenjang yang ada di lembaga Anda (bisa lebih dari satu)</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { id: "TK", label: "TK / PAUD", icon: "🎒" },
                            { id: "SD", label: "SD", icon: "📚" },
                            { id: "MI", label: "MI", icon: "🕌" },
                            { id: "SMP", label: "SMP", icon: "🎓" },
                            { id: "MTs", label: "MTs", icon: "🕋" },
                            { id: "SMA", label: "SMA", icon: "🏫" },
                            { id: "MA", label: "MA", icon: "☪️" },
                            { id: "SMK", label: "SMK", icon: "⚙️" },
                        ].map((jenjang) => {
                            const isSelected = formData.schoolJenjangs.includes(jenjang.id);
                            return (
                                <button
                                    key={jenjang.id}
                                    type="button"
                                    onClick={() => {
                                        const updated = isSelected
                                            ? formData.schoolJenjangs.filter(j => j !== jenjang.id)
                                            : [...formData.schoolJenjangs, jenjang.id];
                                        setFormData(prev => ({ ...prev, schoolJenjangs: updated }));
                                    }}
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${isSelected
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                                        : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                                        }`}
                                >
                                    <span className="text-lg">{jenjang.icon}</span>
                                    <span className="text-sm font-medium">{jenjang.label}</span>
                                    {isSelected && <Check className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })}
                    </div>
                    {(errors as Record<string, string>).schoolJenjangs && (
                        <p className="text-red-500 text-sm mt-2">{(errors as Record<string, string>).schoolJenjangs}</p>
                    )}
                </div>
            )}

            {/* Alamat */}
            <div>
                <label className="block text-sm text-slate-400 mb-1">Alamat Lengkap</label>
                <textarea
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.address ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 min-h-[100px]`}
                    placeholder="Jl. Contoh No. 123, Kota, Provinsi"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Subdomain</h2>
            <p className="text-slate-400 text-sm">Pilih subdomain unik untuk lembaga Anda</p>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Subdomain</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={formData.subdomain}
                        onChange={(e) => updateFormData("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        className={`flex-1 bg-slate-800 border ${errors.subdomain ? 'border-red-500' : 'border-slate-700'} rounded-l-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                        placeholder="nama-lembaga"
                    />
                    <span className="bg-slate-700 border border-slate-700 rounded-r-lg px-4 py-3 text-slate-400">.eduvera.id</span>
                </div>
                {subdomainChecking && <p className="text-slate-400 text-sm mt-1">Memeriksa ketersediaan...</p>}
                {subdomainAvailable === true && <p className="text-emerald-500 text-sm mt-1 flex items-center gap-1"><Check className="w-4 h-4" /> Subdomain tersedia!</p>}
                {subdomainAvailable === false && <p className="text-red-500 text-sm mt-1">Subdomain sudah digunakan</p>}
                {errors.subdomain && <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Rekening Bank</h2>
            <p className="text-slate-400 text-sm">Rekening untuk penerimaan pembayaran {formData.planType === "sekolah" ? "SPP" : formData.planType === "pesantren" ? "Syahriah" : "SPP/Syahriah"}</p>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Nama Bank</label>

                {!isCustomBank ? (
                    <>
                        <select
                            value={formData.bankName}
                            onChange={(e) => {
                                if (e.target.value === "custom") {
                                    setIsCustomBank(true);
                                    updateFormData("bankName", "");
                                } else {
                                    updateFormData("bankName", e.target.value);
                                }
                            }}
                            className={`w-full bg-slate-800 border ${errors.bankName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                        >
                            <option value="">Pilih Bank</option>
                            <option value="BCA">BCA</option>
                            <option value="Mandiri">Mandiri</option>
                            <option value="BNI">BNI</option>
                            <option value="BRI">BRI</option>
                            <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                            <option value="CIMB">CIMB Niaga</option>
                            <option value="Permata">Permata</option>
                            <option value="Danamon">Danamon</option>
                            <option value="BTN">BTN</option>
                            <option value="Muamalat">Muamalat</option>
                            <option value="BCA Syariah">BCA Syariah</option>
                            <option value="Mandiri Syariah">Mandiri Syariah</option>
                            <option value="BRI Syariah">BRI Syariah</option>
                            <option value="BNI Syariah">BNI Syariah</option>
                            <option value="custom" className="text-emerald-400">✏️ Input Manual (Bank Lain)</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">Bank tidak ada di list? Pilih "Input Manual"</p>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customBankName}
                                onChange={(e) => setCustomBankName(e.target.value)}
                                className={`flex-1 bg-slate-800 border ${errors.bankName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                                placeholder="Contoh: Bank Jatim, Bank DKI, dll"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustomBank(false);
                                    setCustomBankName("");
                                }}
                                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                        <p className="text-xs text-emerald-400 mt-1">Masukkan nama bank secara manual</p>
                    </>
                )}

                {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Nomor Rekening</label>
                <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData("accountNumber", e.target.value.replace(/\D/g, ""))}
                    className={`w-full bg-slate-800 border ${errors.accountNumber ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="1234567890"
                />
                {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
            </div>
            <div>
                <label className="block text-sm text-slate-400 mb-1">Nama Pemilik Rekening</label>
                <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => updateFormData("accountHolder", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.accountHolder ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="Sesuai buku rekening"
                />
                {errors.accountHolder && <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>}
            </div>

            {/* Final Summary */}
            <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 mt-6">
                <h4 className="font-semibold text-white mb-3">Konfirmasi Pendaftaran</h4>
                <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Paket</span>
                        <span className="text-white capitalize">{formData.planType} {formData.subscriptionTier}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Periode</span>
                        <span className="text-white">{formData.billingCycle === "monthly" ? "Bulanan" : "Tahunan"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Subdomain</span>
                        <span className="text-white">{formData.subdomain}.eduvera.id</span>
                    </div>
                    <hr className="border-slate-700 my-2" />
                    <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Total</span>
                        <span className="text-emerald-500 font-bold text-lg">{formatPrice(getCurrentPrice())}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: return renderStep1();
            case 2: return renderStep3(); // Institution (was Step 3)
            case 3: return renderStep4(); // Subdomain (was Step 4)
            case 4: return renderStep5(); // Bank Account (was Step 5)
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Edu<span className="text-emerald-500">Vera</span>
                        </h1>
                    </Link>
                    <p className="text-slate-400">Daftarkan lembaga Anda</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8">
                    {renderStepIndicator()}
                    {renderCurrentStep()}

                    <div className="flex justify-between mt-8">
                        {currentStep > 1 ? (
                            <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Kembali
                            </button>
                        ) : (
                            <Link href="/" className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Batal
                            </Link>
                        )}

                        {currentStep < 4 ? (
                            <button onClick={nextStep} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                                Lanjut <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Mendaftar...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" /> Daftar Sekarang
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
