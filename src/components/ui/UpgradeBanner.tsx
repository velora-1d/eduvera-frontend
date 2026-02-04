"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, Zap, X } from "lucide-react";
import { useState } from "react";

interface UpgradeBannerProps {
    type: "TRIAL_EXPIRED" | "LIMIT_REACHED";
    limitInfo?: {
        table: string;
        current: number;
        max: number;
    };
    onDismiss?: () => void;
}

export default function UpgradeBanner({ type, limitInfo, onDismiss }: UpgradeBannerProps) {
    const router = useRouter();
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const handleDismiss = () => {
        setDismissed(true);
        onDismiss?.();
    };

    const handleUpgrade = () => {
        router.push("/upgrade");
    };

    const isTrialExpired = type === "TRIAL_EXPIRED";

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${isTrialExpired ? "bg-amber-500" : "bg-red-500"}`}>
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {isTrialExpired ? (
                            <Clock className="w-5 h-5 text-amber-900" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-red-100" />
                        )}
                        <div className={`text-sm font-medium ${isTrialExpired ? "text-amber-900" : "text-white"}`}>
                            {isTrialExpired ? (
                                <>
                                    <span className="font-bold">Trial Anda sudah berakhir.</span>{" "}
                                    Upgrade sekarang untuk melanjutkan menggunakan semua fitur.
                                </>
                            ) : (
                                <>
                                    <span className="font-bold">Batas data tercapai!</span>{" "}
                                    {limitInfo && (
                                        <>
                                            Anda sudah memiliki {limitInfo.current}/{limitInfo.max} {limitInfo.table}.{" "}
                                        </>
                                    )}
                                    Upgrade untuk menambah lebih banyak data.
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleUpgrade}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${isTrialExpired
                                    ? "bg-amber-900 text-white hover:bg-amber-800"
                                    : "bg-white text-red-600 hover:bg-red-50"
                                }`}
                        >
                            <Zap className="w-4 h-4" />
                            Upgrade Sekarang
                        </button>
                        {!isTrialExpired && (
                            <button
                                onClick={handleDismiss}
                                className="p-1 text-red-200 hover:text-white transition-colors"
                                aria-label="Tutup"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Hook to handle API error responses that indicate trial expired or limit reached
export function useUpgradePrompt() {
    const [showBanner, setShowBanner] = useState(false);
    const [bannerType, setBannerType] = useState<"TRIAL_EXPIRED" | "LIMIT_REACHED">("TRIAL_EXPIRED");
    const [limitInfo, setLimitInfo] = useState<{ table: string; current: number; max: number } | undefined>();

    const handleApiError = (error: any) => {
        // Check if error response has our upgrade codes
        const errorData = error?.response?.data;
        if (errorData?.code === "TRIAL_EXPIRED") {
            setBannerType("TRIAL_EXPIRED");
            setShowBanner(true);
            return true;
        }
        if (errorData?.code === "LIMIT_REACHED") {
            setBannerType("LIMIT_REACHED");
            if (errorData?.limit_info) {
                setLimitInfo(errorData.limit_info);
            }
            setShowBanner(true);
            return true;
        }
        return false;
    };

    const dismissBanner = () => {
        setShowBanner(false);
    };

    return {
        showBanner,
        bannerType,
        limitInfo,
        handleApiError,
        dismissBanner,
        UpgradeBannerComponent: showBanner ? (
            <UpgradeBanner type={bannerType} limitInfo={limitInfo} onDismiss={dismissBanner} />
        ) : null,
    };
}
