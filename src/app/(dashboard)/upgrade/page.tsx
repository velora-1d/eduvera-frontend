"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, Star, ArrowRight, Loader2, Clock, Crown } from "lucide-react";
import {
    pricing,
    planMetadata,
    tierMetadata,
    formatPrice,
    PlanType,
    TierType,
    BillingType
} from "@/lib/pricing";
import { showToast } from "@/components/ui/Toast";
import { subscriptionApi } from "@/lib/api";

// Mock subscription data - replace with API call
interface SubscriptionInfo {
    planType: PlanType;
    tier: TierType;
    trialEndsAt: string | null;
    daysRemaining: number;
    isTrialActive: boolean;
}

export default function UpgradePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [selectedTier, setSelectedTier] = useState<TierType>("premium");
    const [billingCycle, setBillingCycle] = useState<BillingType>("annual");
    const [currentSub, setCurrentSub] = useState<SubscriptionInfo | null>(null);
    const [apiPricing, setApiPricing] = useState<any>(null); // Store API pricing data
    const [processingUpgrade, setProcessingUpgrade] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Subscription
                // TODO: use subscriptionApi.getSubscription() when backend returns proper format
                // For now, we mock based on user role or partial data if needed, 
                // OR we presume "Trial" if 404/empty.
                // Let's TRY to fetch real subscription, if fails, fallback to trial/basic.

                try {
                    const subData = await subscriptionApi.getSubscription();
                    if (subData && subData.data) {
                        const sub = subData.data;
                        setCurrentSub({
                            planType: sub.plan_type || "sekolah",
                            tier: sub.tier || "basic",
                            trialEndsAt: sub.trial_ends_at,
                            daysRemaining: sub.days_remaining || 0,
                            isTrialActive: sub.status === "trial" || (sub.trial_ends_at && new Date(sub.trial_ends_at) > new Date()),
                        });
                    }
                } catch (e) {
                    // Fallback or assume new user (Trial)
                    console.log("No active subscription found or error fetching", e);
                    setCurrentSub({
                        planType: "sekolah", // Default
                        tier: "basic",
                        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        daysRemaining: 7,
                        isTrialActive: true,
                    });
                }

                // 2. Fetch Pricing
                try {
                    const pricingData = await subscriptionApi.getPricing();
                    if (pricingData && pricingData.data) {
                        setApiPricing(pricingData.data);
                    }
                } catch (e) {
                    console.error("Failed to fetch pricing", e);
                }

            } catch (error) {
                console.error("Error loading data", error);
                showToast("Gagal memuat data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCurrentPrice = () => {
        if (!currentSub) return 0;

        // If we have API pricing, try to find matching price
        if (apiPricing) {
            // structure: { plans: [ { plan_type, billing_cycle, price } ] }
            const plan = apiPricing.plans?.find((p: any) =>
                p.plan_type === currentSub.planType &&
                p.billing_cycle === billingCycle
            );
            if (plan) return plan.price;
        }

        // Fallback to local config
        const planPrices = pricing[currentSub.planType];
        if (planPrices && planPrices[selectedTier]) {
            return planPrices[selectedTier][billingCycle];
        }
        return 0;
    };

    const handleUpgrade = async () => {
        if (!currentSub) return;
        setProcessingUpgrade(true);

        try {
            // Call backend API to create Midtrans Snap transaction
            const result = await subscriptionApi.upgradePlan({
                new_plan_type: currentSub.planType,
                billing_cycle: billingCycle
            });

            // Check for snap_token (Midtrans) or payment_url fallback
            const snapToken = result?.data?.snap_token;
            const paymentUrl = result?.data?.payment_url;

            if (snapToken) {
                // Load Midtrans Snap SDK if not already loaded
                if (!(window as any).snap) {
                    const script = document.createElement("script");
                    script.src = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
                        ? "https://app.midtrans.com/snap/snap.js"
                        : "https://app.sandbox.midtrans.com/snap/snap.js";
                    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
                    script.async = true;
                    script.onload = () => {
                        (window as any).snap.pay(snapToken, {
                            onSuccess: function (result: any) {
                                showToast("Pembayaran berhasil! Mengaktifkan langganan...", "success");
                                router.push("/dashboard");
                            },
                            onPending: function (result: any) {
                                showToast("Menunggu pembayaran...", "info");
                                router.push("/dashboard");
                            },
                            onError: function (result: any) {
                                showToast("Pembayaran gagal", "error");
                                setProcessingUpgrade(false);
                            },
                            onClose: function () {
                                showToast("Popup pembayaran ditutup", "info");
                                setProcessingUpgrade(false);
                            }
                        });
                    };
                    document.head.appendChild(script);
                } else {
                    // Snap already loaded
                    (window as any).snap.pay(snapToken, {
                        onSuccess: function (result: any) {
                            showToast("Pembayaran berhasil! Mengaktifkan langganan...", "success");
                            router.push("/dashboard");
                        },
                        onPending: function (result: any) {
                            showToast("Menunggu pembayaran...", "info");
                            router.push("/dashboard");
                        },
                        onError: function (result: any) {
                            showToast("Pembayaran gagal", "error");
                            setProcessingUpgrade(false);
                        },
                        onClose: function () {
                            showToast("Popup pembayaran ditutup", "info");
                            setProcessingUpgrade(false);
                        }
                    });
                }
            } else if (paymentUrl) {
                // Fallback to redirect if snap_token not available
                showToast("Mengarahkan ke pembayaran...", "success");
                window.location.href = paymentUrl;
            } else {
                showToast("Gagal mendapatkan link pembayaran", "error");
                setProcessingUpgrade(false);
            }

        } catch (error: any) {
            console.error("Upgrade error:", error);
            showToast(error.userMessage || "Gagal memproses upgrade", "error");
            setProcessingUpgrade(false);
        }
    };

    if (loading || !currentSub) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    const tierFeatures = planMetadata[currentSub.planType]?.features || planMetadata["sekolah"].features;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Upgrade Langganan</h1>
                <p className="text-slate-400">Pilih paket yang sesuai dengan kebutuhan lembaga Anda</p>
            </div>

            {/* Current Status Banner */}
            {currentSub.isTrialActive && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 flex items-center gap-4">
                    <Clock className="w-8 h-8 text-amber-500" />
                    <div>
                        <p className="font-semibold text-amber-500">Trial Aktif</p>
                        <p className="text-sm text-slate-400">
                            Tersisa <span className="text-white font-medium">{currentSub.daysRemaining} hari</span>.
                            Upgrade sekarang untuk melanjutkan tanpa gangguan.
                        </p>
                    </div>
                </div>
            )}

            {/* Plan Info */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-slate-700">
                <p className="text-sm text-slate-400">
                    Paket saat ini: <span className="text-white font-medium capitalize">{currentSub.planType}</span>
                </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-800 rounded-xl p-1 inline-flex">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === "monthly"
                            ? "bg-emerald-600 text-white"
                            : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Bulanan
                    </button>
                    <button
                        onClick={() => setBillingCycle("annual")}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${billingCycle === "annual"
                            ? "bg-emerald-600 text-white"
                            : "text-slate-400 hover:text-white"
                            }`}
                    >
                        Tahunan
                        <span className="bg-emerald-500 text-xs px-2 py-0.5 rounded-full">Hemat 2 Bulan</span>
                    </button>
                </div>
            </div>

            {/* Tier Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Basic Tier */}
                <div
                    onClick={() => setSelectedTier("basic")}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedTier === "basic"
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-slate-700 hover:border-slate-600"
                        }`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Star className={`w-6 h-6 ${selectedTier === "basic" ? "text-emerald-500" : "text-slate-400"}`} />
                        <h2 className="text-xl font-bold text-white">Basic</h2>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{tierMetadata.basic.description}</p>

                    <p className="text-3xl font-bold text-white mb-6">
                        {/* Fallback to local pricing if API data not fully mapped for tiers yet, or implement full mapping */}
                        {formatPrice(pricing[currentSub.planType].basic[billingCycle])}
                        <span className="text-sm text-slate-400 font-normal">
                            /{billingCycle === "monthly" ? "bulan" : "tahun"}
                        </span>
                    </p>

                    <ul className="space-y-3">
                        {tierFeatures.basic.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {selectedTier === "basic" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                {/* Premium Tier */}
                <div
                    onClick={() => setSelectedTier("premium")}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedTier === "premium"
                        ? "border-amber-500 bg-amber-500/5"
                        : "border-slate-700 hover:border-slate-600"
                        }`}
                >
                    <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Rekomendasi
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <Zap className={`w-6 h-6 ${selectedTier === "premium" ? "text-amber-500" : "text-slate-400"}`} />
                        <h2 className="text-xl font-bold text-white">Premium</h2>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{tierMetadata.premium.description}</p>

                    <p className="text-3xl font-bold text-white mb-6">
                        {formatPrice(pricing[currentSub.planType].premium[billingCycle])}
                        <span className="text-sm text-slate-400 font-normal">
                            /{billingCycle === "monthly" ? "bulan" : "tahun"}
                        </span>
                    </p>

                    <ul className="space-y-3">
                        {tierFeatures.premium.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                <Check className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>

                    {selectedTier === "premium" && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Summary & CTA */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-slate-400 text-sm">Total Tagihan</p>
                        <p className="text-2xl font-bold text-white">{formatPrice(getCurrentPrice())}</p>
                        <p className="text-xs text-slate-500">
                            {billingCycle === "annual" ? "per tahun" : "per bulan"}
                        </p>
                    </div>
                    <button
                        onClick={handleUpgrade}
                        disabled={processingUpgrade}
                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all"
                    >
                        {processingUpgrade ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Upgrade Sekarang
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
                <p className="text-xs text-slate-500">
                    Pembayaran akan diproses melalui Xendit. Mendukung QRIS, Transfer Bank, GoPay, OVO, DANA.
                </p>
            </div>
        </div>
    );
}
