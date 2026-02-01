"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { contentApi } from "@/lib/api";
import { useEffect } from "react";

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default Fallback Plans
  const defaultPlans = [
    {
      name: "EduVera Sekolah",
      prices: {
        annual: { total: "4.990.000", original: "9.600.000", savings: "4.6 Juta", daily: "13.671", hourly: "570" },
        monthly: { total: "499.000", original: "799.000", savings: "300rb", daily: "16.633", hourly: "693" }
      },
      desc: "Solusi lengkap untuk sekolah formal.",
      features: [
        "Admin Akademik & Guru",
        "Kurikulum & E-Rapor Nasional",
        "Keuangan Sekolah (SPP/BOS)",
        "Mobile Access (Android/iOS)",
      ],
      button: "Pilih Sekolah",
      variant: "default" as const,
      icon: "TrendingUp",
      popular: true,
      registerPath: "/register?plan=sekolah",
    },
    {
      name: "EduVera Pesantren",
      prices: {
        annual: { total: "4.990.000", original: "9.600.000", savings: "4.6 Juta", daily: "13.671", hourly: "570" },
        monthly: { total: "499.000", original: "799.000", savings: "300rb", daily: "16.633", hourly: "693" }
      },
      desc: "Manajemen asrama & kurikulum kitab.",
      features: [
        "Manajemen Asrama & Santri",
        "Tahfidz & Kitab Kuning",
        "E-Rapor Pesantren & Kedisiplinan",
        "Keuangan & Kas Pesantren",
      ],
      button: "Pilih Pesantren",
      variant: "default" as const,
      popular: true,
      icon: "Sparkles",
      registerPath: "/register?plan=pesantren",
    },
    {
      name: "EduVera Hybrid",
      prices: {
        annual: { total: "7.990.000", original: "11.880.000", savings: "3.9 Juta", daily: "21.890", hourly: "912" },
        monthly: { total: "799.000", original: "1.199.000", savings: "400rb", daily: "26.633", hourly: "1.110" }
      },
      desc: "Integrasi total Sekolah + Pesantren.",
      features: [
        "Semua Fitur Sekolah & Pesantren",
        "Dashboard Terpadu (SSO)",
        "Multi-Lembaga / Cabang",
        "Custom Branding & Domain",
        "Prioritas Support 24/7",
      ],
      button: "Pilih Hybrid",
      variant: "default" as const,
      icon: "Zap",
      bestValue: true,
      registerPath: "/register?plan=hybrid",
    },
  ];

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const data = await contentApi.get("pricing_plans");
    if (data && data.value && Array.isArray(data.value)) {
      // Map dynamic data to required format if needed, pass through for now
      // But need to ensure registerPath is set based on ID or name
      const mappedPlans = data.value.map((p: any) => ({
        ...p,
        prices: p.prices, // Use structure from ContentEditor
        registerPath: `/register?plan=${p.id || 'sekolah'}`,
        color: p.id === 'hybrid' ? 'sky' : 'emerald'
      }));
      setPlans(mappedPlans);
    } else {
      setPlans(defaultPlans);
    }
    setIsLoading(false);
  };

  const iconMap: any = {
    TrendingUp,
    Sparkles,
    Zap
  };

  return (
    <section id="harga" className="py-24 bg-slate-900/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display"
          >
            Investasi Pendidikan
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 mb-8"
          >
            Pilih paket yang sesuai dengan skala lembaga Anda.
          </motion.p>

          {/* Billing Toggle with Savings Badge */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span
              className={`text-sm ${!isAnnual ? "text-white font-bold" : "text-slate-500"}`}
            >
              Bulanan
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 bg-slate-800 rounded-full p-1 transition-colors hover:bg-slate-700 border border-slate-700"
            >
              <motion.div
                animate={{ x: isAnnual ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-lg"
              />
            </button>
            <span
              className={`text-sm ${isAnnual ? "text-white font-bold" : "text-slate-500"}`}
            >
              Tahunan
            </span>
          </div>

          {/* Savings Highlight */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isAnnual ? "annual" : "monthly"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">
                {isAnnual
                  ? "Hemat hingga 48% dengan bayar Tahunan!"
                  : "Mulai dari Rp 16.600/hari saja!"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading State or Content */}
        {isLoading ? (
          <div className="text-center text-slate-500 py-12">Loading pricing plans...</div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          >
            {plans.map((plan, i) => {
              const PlanIcon = iconMap[plan.icon as string] || TrendingUp;
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring" as const,
                        stiffness: 80,
                        damping: 20,
                      },
                    },
                  }}
                  className={`relative bg-slate-950 p-8 rounded-2xl border h-full ${plan.popular
                    ? "border-emerald-500 ring-4 ring-emerald-500/10"
                    : plan.bestValue
                      ? "border-sky-500 ring-2 ring-sky-500/10"
                      : "border-slate-800"
                    } flex flex-col`}
                >
                  {/* Badges */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                      🔥 PALING POPULER
                    </div>
                  )}
                  {plan.bestValue && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-sky-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-sky-500/30">
                      💎 BEST VALUE
                    </div>
                  )}

                  {/* Header with Icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-2 rounded-xl ${plan.popular ? "bg-emerald-500/10" : plan.bestValue ? "bg-sky-500/10" : "bg-slate-800"}`}
                    >
                      <PlanIcon
                        className={`w-5 h-5 ${plan.popular ? "text-emerald-400" : plan.bestValue ? "text-sky-400" : "text-slate-400"}`}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white font-display">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>

                  {/* Pricing Block */}
                  <div className="mb-6 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    {/* Original Price (Strikethrough) */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-500 text-base line-through decoration-red-500/70 decoration-2">
                        Rp {plan.prices ? (isAnnual ? plan.prices.annual.original : plan.prices.monthly.original) : plan.originalPrice}
                      </span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                        Hemat {plan.prices ? (isAnnual ? plan.prices.annual.savings : plan.prices.monthly.savings) : plan.savings}
                      </span>
                    </div>

                    {/* Current Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-emerald-400 font-bold">Rp</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={isAnnual ? "year" : "month"}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-4xl font-bold text-white font-display"
                        >
                          {plan.prices ? (isAnnual ? plan.prices.annual.total : plan.prices.monthly.total) : plan.price}
                        </motion.span>
                      </AnimatePresence>
                      <span className="text-slate-500 text-sm">
                        /{isAnnual ? "tahun" : "bulan"}
                      </span>
                    </div>

                    {/* Daily & Hourly Price Frame */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span>
                        <span className="text-emerald-400 font-medium">
                          Rp {plan.prices ? (isAnnual ? plan.prices.annual.daily : plan.prices.monthly.daily) : plan.dailyPrice}
                        </span>
                        /hari
                      </span>
                      <span className="text-slate-700">•</span>
                      <span>
                        <span className="text-emerald-400 font-medium">
                          Rp {plan.prices ? (isAnnual ? plan.prices.annual.hourly : plan.prices.monthly.hourly) : plan.hourlyPrice}
                        </span>
                        /jam
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature: any, j: number) => (
                      <li
                        key={j}
                        className="flex items-center text-sm text-slate-300"
                      >
                        <Check
                          className={`w-4 h-4 ${plan.popular ? "text-emerald-400" : plan.bestValue ? "text-sky-400" : "text-emerald-400"} mr-2 flex-shrink-0`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={plan.registerPath} className="w-full">
                    <Button
                      variant={plan.variant}
                      className={`w-full font-bold py-6 rounded-xl transition-all ${plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 text-white"
                        : plan.bestValue
                          ? "bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 shadow-lg shadow-sky-500/20 text-white"
                          : ""
                        }`}
                    >
                      {plan.button}
                    </Button>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};
