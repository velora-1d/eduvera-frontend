"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Building2, User, Globe, CreditCard, School, BookOpen, Loader2, Eye, EyeOff } from "lucide-react";
import { onboardingApi } from "@/lib/api";

type PlanType = "sekolah" | "pesantren" | "hybrid";

interface FormData {
    // Step 1: Admin Account
    adminName: string;
    adminEmail: string;
    adminWhatsApp: string;
    password: string;
    confirmPassword: string;

    // Step 2: Institution
    institutionName: string;
    institutionType: PlanType;
    address: string;

    // Step 3: Subdomain
    subdomain: string;

    // Step 4: Bank Account
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
    institutionName: "",
    institutionType: "pesantren",
    address: "",
    subdomain: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
};

const steps = [
    { id: 1, title: "Akun Admin", icon: User },
    { id: 2, title: "Informasi Lembaga", icon: Building2 },
    { id: 3, title: "Subdomain", icon: Globe },
    { id: 4, title: "Rekening Bank", icon: CreditCard },
];

const planOptions = [
    {
        id: "sekolah" as PlanType,
        title: "Paket Sekolah",
        description: "Untuk sekolah formal (SD, SMP, SMA, SMK)",
        price: "Rp 499.000",
        priceNote: "/bulan",
        features: ["Manajemen Siswa & Guru", "E-Rapor Digital", "Jadwal Pelajaran", "SDM & Kepegawaian"],
        icon: School,
        color: "blue",
    },
    {
        id: "pesantren" as PlanType,
        title: "Paket Pesantren",
        description: "Untuk pesantren dan madrasah diniyah",
        price: "Rp 499.000",
        priceNote: "/bulan",
        features: ["Manajemen Santri", "Program Tahfidz", "Diniyah & Kitab", "Asrama"],
        icon: BookOpen,
        color: "emerald",
    },
    {
        id: "hybrid" as PlanType,
        title: "Paket Hybrid",
        description: "Kombinasi sekolah + pesantren (lengkap)",
        price: "Rp 799.000",
        priceNote: "/bulan",
        features: ["Semua fitur Sekolah", "Semua fitur Pesantren", "Dashboard Terpadu", "Laporan Komprehensif"],
        icon: Building2,
        color: "purple",
        recommended: true,
    },
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

    const updateFormData = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));

        if (field === "subdomain") {
            setSubdomainAvailable(null);
        }
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};

        if (step === 1) {
            if (!formData.adminName.trim()) newErrors.adminName = "Nama wajib diisi";
            if (!formData.adminEmail.trim()) newErrors.adminEmail = "Email wajib diisi";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
                newErrors.adminEmail = "Format email tidak valid";
            }
            if (!formData.adminWhatsApp.trim()) newErrors.adminWhatsApp = "WhatsApp wajib diisi";
            if (!formData.password) newErrors.password = "Password wajib diisi";
            else if (formData.password.length < 8) newErrors.password = "Password minimal 8 karakter";
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Password tidak sama";
            }
        }

        if (step === 2) {
            if (!formData.institutionName.trim()) newErrors.institutionName = "Nama lembaga wajib diisi";
            if (!formData.address.trim()) newErrors.address = "Alamat wajib diisi";
        }

        if (step === 3) {
            if (!formData.subdomain.trim()) newErrors.subdomain = "Subdomain wajib diisi";
            else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
                newErrors.subdomain = "Subdomain hanya boleh huruf kecil, angka, dan strip";
            }
            else if (subdomainAvailable === false) {
                newErrors.subdomain = "Subdomain sudah digunakan";
            }
        }

        if (step === 4) {
            if (!formData.bankName.trim()) newErrors.bankName = "Nama bank wajib diisi";
            if (!formData.accountNumber.trim()) newErrors.accountNumber = "Nomor rekening wajib diisi";
            if (!formData.accountHolder.trim()) newErrors.accountHolder = "Nama pemilik rekening wajib diisi";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkSubdomain = async () => {
        if (!formData.subdomain.trim() || !/^[a-z0-9-]+$/.test(formData.subdomain)) return;

        setSubdomainChecking(true);
        try {
            const res = await onboardingApi.checkSubdomain(formData.subdomain);
            setSubdomainAvailable(res.available);
        } catch (error) {
            console.error("Check subdomain failed", error);
            setSubdomainAvailable(null);
        } finally {
            setSubdomainChecking(false);
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            if (currentStep < 4) {
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

        setLoading(true);
        try {
            // Step 1: Register admin account
            const registerRes = await onboardingApi.register({
                admin_name: formData.adminName,
                admin_email: formData.adminEmail,
                admin_whatsapp: formData.adminWhatsApp,
                password: formData.password,
            });

            const sessionId = registerRes.session_id;

            // Step 2: Submit institution info
            await onboardingApi.institution({
                session_id: sessionId,
                institution_name: formData.institutionName,
                institution_type: formData.institutionType,
                plan_type: formData.institutionType,
                address: formData.address,
            });

            // Step 3: Submit subdomain
            await onboardingApi.subdomain({
                session_id: sessionId,
                subdomain: formData.subdomain,
            });

            // Step 4: Submit bank account
            await onboardingApi.bankAccount({
                session_id: sessionId,
                bank_name: formData.bankName,
                account_number: formData.accountNumber,
                account_holder: formData.accountHolder,
            });

            // Confirm registration
            await onboardingApi.confirm({ session_id: sessionId });

            // Redirect to success or login
            router.push("/login?registered=true");
        } catch (error) {
            console.error("Registration failed", error);
            alert("Pendaftaran gagal. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${currentStep > step.id
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : currentStep === step.id
                            ? "border-emerald-500 text-emerald-500"
                            : "border-slate-700 text-slate-500"
                        }`}>
                        {currentStep > step.id ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <step.icon className="w-5 h-5" />
                        )}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`w-12 h-0.5 mx-2 ${currentStep > step.id ? "bg-emerald-500" : "bg-slate-700"
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Informasi Admin</h3>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Nama Lengkap</label>
                <input
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => updateFormData("adminName", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.adminName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="Nama lengkap Anda"
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
                    placeholder="email@lembaga.id"
                />
                {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-1">WhatsApp</label>
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
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
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
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pilih Paket</h3>

            <div className="grid grid-cols-1 gap-4">
                {planOptions.map((plan) => {
                    const Icon = plan.icon;
                    const isSelected = formData.institutionType === plan.id;
                    const colorClasses = {
                        blue: "border-blue-500 bg-blue-500/10",
                        emerald: "border-emerald-500 bg-emerald-500/10",
                        purple: "border-purple-500 bg-purple-500/10",
                    };
                    const iconColors = {
                        blue: "text-blue-500",
                        emerald: "text-emerald-500",
                        purple: "text-purple-500",
                    };

                    return (
                        <div
                            key={plan.id}
                            onClick={() => updateFormData("institutionType", plan.id)}
                            className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all ${isSelected
                                ? colorClasses[plan.color as keyof typeof colorClasses]
                                : "border-slate-700 hover:border-slate-600"
                                }`}
                        >
                            {plan.recommended && (
                                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    Rekomendasi
                                </span>
                            )}
                            <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-lg ${isSelected ? iconColors[plan.color as keyof typeof iconColors] : 'text-slate-500'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-white">{plan.title}</h4>
                                        <div className="text-right">
                                            <span className="font-bold text-white">{plan.price}</span>
                                            <span className="text-slate-400 text-sm">{plan.priceNote}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
                                    <ul className="mt-2 grid grid-cols-2 gap-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="text-xs text-slate-500 flex items-center gap-1">
                                                <Check className="w-3 h-3 text-emerald-500" /> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Nama Lembaga</label>
                <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => updateFormData("institutionName", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.institutionName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                    placeholder="Nama lembaga pendidikan"
                />
                {errors.institutionName && <p className="text-red-500 text-sm mt-1">{errors.institutionName}</p>}
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Alamat</label>
                <textarea
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.address ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 resize-none`}
                    rows={3}
                    placeholder="Alamat lengkap lembaga"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Pilih Subdomain</h3>
            <p className="text-slate-400 text-sm mb-4">
                Subdomain akan menjadi alamat akses sistem Anda. Contoh: <span className="text-emerald-500">namalembaga</span>.eduvera.id
            </p>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Subdomain</label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={formData.subdomain}
                        onChange={(e) => updateFormData("subdomain", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        onBlur={checkSubdomain}
                        className={`flex-1 bg-slate-800 border ${errors.subdomain ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                        placeholder="namalembaga"
                    />
                    <span className="text-slate-400">.eduvera.id</span>
                </div>
                {subdomainChecking && (
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Memeriksa ketersediaan...
                    </p>
                )}
                {subdomainAvailable === true && (
                    <p className="text-emerald-500 text-sm mt-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Subdomain tersedia
                    </p>
                )}
                {subdomainAvailable === false && (
                    <p className="text-red-500 text-sm mt-1">Subdomain sudah digunakan</p>
                )}
                {errors.subdomain && <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>}
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mt-6">
                <h4 className="text-white font-medium mb-2">Preview URL</h4>
                <p className="text-emerald-500 font-mono">
                    https://{formData.subdomain || "namalembaga"}.eduvera.id
                </p>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Informasi Rekening</h3>
            <p className="text-slate-400 text-sm mb-4">
                Rekening ini akan digunakan untuk menerima pembayaran SPP dari wali santri.
            </p>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Nama Bank</label>
                <select
                    value={formData.bankName}
                    onChange={(e) => updateFormData("bankName", e.target.value)}
                    className={`w-full bg-slate-800 border ${errors.bankName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500`}
                >
                    <option value="">Pilih bank</option>
                    <option value="BCA">BCA</option>
                    <option value="BNI">BNI</option>
                    <option value="BRI">BRI</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BSI">BSI (Bank Syariah Indonesia)</option>
                    <option value="CIMB">CIMB Niaga</option>
                    <option value="Permata">Permata</option>
                    <option value="Other">Lainnya</option>
                </select>
                {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
            </div>

            <div>
                <label className="block text-sm text-slate-400 mb-1">Nomor Rekening</label>
                <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData("accountNumber", e.target.value.replace(/\D/g, ''))}
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
                    placeholder="Nama sesuai buku rekening"
                />
                {errors.accountHolder && <p className="text-red-500 text-sm mt-1">{errors.accountHolder}</p>}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-6">
                <p className="text-amber-500 text-sm">
                    <strong>Penting:</strong> Pastikan data rekening benar. Rekening ini akan digunakan untuk pencairan dana SPP.
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Edu<span className="text-emerald-500">Vera</span>
                        </h1>
                    </Link>
                    <p className="text-slate-400">Daftarkan lembaga Anda sekarang</p>
                </div>

                {renderStepIndicator()}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {steps[currentStep - 1].title}
                        </h2>
                        <p className="text-slate-400 text-sm">Langkah {currentStep} dari 4</p>
                    </div>

                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                        {currentStep > 1 ? (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Kembali
                            </button>
                        ) : (
                            <Link href="/" className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Batal
                            </Link>
                        )}

                        {currentStep < 4 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Lanjut <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" /> Mendaftar...
                                    </>
                                ) : (
                                    <>
                                        Daftar Sekarang <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Sudah punya akun?{" "}
                    <Link href="/login" className="text-emerald-500 hover:underline">
                        Login di sini
                    </Link>
                </p>
            </div>
        </div>
    );
}
