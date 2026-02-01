// Shared pricing configuration for Landing Page and Register
// This ensures consistency across the application

export type PlanType = "sekolah" | "pesantren" | "hybrid";
export type TierType = "basic" | "premium";
export type BillingType = "monthly" | "annual";

export interface PricingTier {
    monthly: number;
    annual: number;
}

export interface PlanPricing {
    basic: PricingTier;
    premium: PricingTier;
}

// Pricing data matching database (pricing_plans table)
// Max price: Rp 6.999.999
export const pricing: Record<PlanType, PlanPricing> = {
    sekolah: {
        basic: { monthly: 499000, annual: 4990000 },
        premium: { monthly: 699000, annual: 6999999 },
    },
    pesantren: {
        basic: { monthly: 499000, annual: 4990000 },
        premium: { monthly: 699000, annual: 6999999 },
    },
    hybrid: {
        basic: { monthly: 599000, annual: 5990000 },
        premium: { monthly: 699000, annual: 6999999 },
    },
};

// Original prices for showing "hemat" (savings)
export const originalPricing: Record<PlanType, PlanPricing> = {
    sekolah: {
        basic: { monthly: 799000, annual: 9600000 },
        premium: { monthly: 1499000, annual: 15990000 },
    },
    pesantren: {
        basic: { monthly: 799000, annual: 9600000 },
        premium: { monthly: 1499000, annual: 15990000 },
    },
    hybrid: {
        basic: { monthly: 1199000, annual: 11880000 },
        premium: { monthly: 2199000, annual: 23990000 },
    },
};

// Plan metadata
export const planMetadata = {
    sekolah: {
        title: "Sekolah",
        description: "SD, SMP, SMA, SMK",
        paymentTerm: "SPP", // Term used for student payment
        icon: "School",
        color: "blue",
        features: {
            basic: [
                "Manajemen Siswa & Guru",
                "E-Rapor Digital",
                "Jadwal Pelajaran",
                "SDM & Kepegawaian",
                "Pembayaran SPP Manual",
            ],
            premium: [
                "Semua fitur Basic",
                "Payment Gateway SPP",
                "GoPay, OVO, DANA, Transfer, QRIS",
                "Notifikasi WhatsApp Otomatis",
                "Prioritas Support",
            ],
        },
    },
    pesantren: {
        title: "Pesantren",
        description: "Pondok & Madrasah Diniyah",
        paymentTerm: "Syahriah", // Term used for santri payment
        icon: "BookOpen",
        color: "emerald",
        features: {
            basic: [
                "Manajemen Santri & Ustadz",
                "Program Tahfidz",
                "Kurikulum Diniyah",
                "Manajemen Asrama",
                "Pembayaran Syahriah Manual",
            ],
            premium: [
                "Semua fitur Basic",
                "Payment Gateway Syahriah",
                "GoPay, OVO, DANA, Transfer, QRIS",
                "Notifikasi WhatsApp Otomatis",
                "Prioritas Support",
            ],
        },
    },
    hybrid: {
        title: "Hybrid",
        description: "Sekolah + Pesantren",
        paymentTerm: "SPP & Syahriah",
        icon: "Building2",
        color: "purple",
        recommended: true,
        features: {
            basic: [
                "Semua fitur Sekolah",
                "Semua fitur Pesantren",
                "Dashboard Terpadu",
                "Multi-Lembaga",
                "Pembayaran Manual",
            ],
            premium: [
                "Semua fitur Sekolah & Pesantren",
                "Payment Gateway SPP & Syahriah",
                "GoPay, OVO, DANA, Transfer, QRIS",
                "Notifikasi WhatsApp Otomatis",
                "Custom Branding & Domain",
                "Prioritas Support 24/7",
            ],
        },
    },
};

// Tier metadata
export const tierMetadata = {
    basic: {
        title: "Basic",
        description: "Pembayaran manual, approve oleh admin",
        icon: "Star",
        color: "emerald",
    },
    premium: {
        title: "Premium",
        description: "Payment Gateway otomatis",
        icon: "Zap",
        color: "amber",
        badge: "Auto PG",
    },
};

// Helper functions
export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

export const formatPriceShort = (price: number): string => {
    if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1).replace(/\.0$/, "")} Juta`;
    }
    return `${(price / 1000).toFixed(0)}rb`;
};

export const getPrice = (plan: PlanType, tier: TierType, billing: BillingType): number => {
    return pricing[plan][tier][billing];
};

export const getOriginalPrice = (plan: PlanType, tier: TierType, billing: BillingType): number => {
    return originalPricing[plan][tier][billing];
};

export const getSavings = (plan: PlanType, tier: TierType, billing: BillingType): number => {
    return getOriginalPrice(plan, tier, billing) - getPrice(plan, tier, billing);
};

export const getDailyPrice = (plan: PlanType, tier: TierType, billing: BillingType): number => {
    const price = getPrice(plan, tier, billing);
    return Math.round(billing === "annual" ? price / 365 : price / 30);
};

// For Landing Page - generate display-ready plan data
export const getLandingPagePlans = () => {
    return (["sekolah", "pesantren", "hybrid"] as PlanType[]).map((planId) => {
        const meta = planMetadata[planId];
        return {
            id: planId,
            name: `EduVera ${meta.title}`,
            desc: meta.description,
            icon: meta.icon,
            features: meta.features.basic, // Show basic features on LP
            recommended: planId === "hybrid",
            paymentTerm: meta.paymentTerm,
            registerPath: `/register?plan=${planId}`,
            prices: {
                basic: {
                    monthly: {
                        total: formatPriceShort(pricing[planId].basic.monthly),
                        original: formatPriceShort(originalPricing[planId].basic.monthly),
                        savings: formatPriceShort(getSavings(planId, "basic", "monthly")),
                        daily: getDailyPrice(planId, "basic", "monthly").toLocaleString("id-ID"),
                    },
                    annual: {
                        total: formatPriceShort(pricing[planId].basic.annual),
                        original: formatPriceShort(originalPricing[planId].basic.annual),
                        savings: formatPriceShort(getSavings(planId, "basic", "annual")),
                        daily: getDailyPrice(planId, "basic", "annual").toLocaleString("id-ID"),
                    },
                },
                premium: {
                    monthly: {
                        total: formatPriceShort(pricing[planId].premium.monthly),
                        original: formatPriceShort(originalPricing[planId].premium.monthly),
                        savings: formatPriceShort(getSavings(planId, "premium", "monthly")),
                        daily: getDailyPrice(planId, "premium", "monthly").toLocaleString("id-ID"),
                    },
                    annual: {
                        total: formatPriceShort(pricing[planId].premium.annual),
                        original: formatPriceShort(originalPricing[planId].premium.annual),
                        savings: formatPriceShort(getSavings(planId, "premium", "annual")),
                        daily: getDailyPrice(planId, "premium", "annual").toLocaleString("id-ID"),
                    },
                },
            },
        };
    });
};
