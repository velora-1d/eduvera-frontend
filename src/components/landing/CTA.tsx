"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { contentApi } from "@/lib/api";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const DEFAULT_CTA = {
  title: "Siap Mengubah Wajah Pendidikan?",
  text: "Bergabunglah dengan ratusan lembaga modern lainnya. Transformasi digital dimulai dari sini.",
  primary_btn: "Daftar Gratis Sekarang",
  secondary_btn: "Konsultasi Gratis"
};

export const CTA = () => {
  const [cta, setCta] = useState(DEFAULT_CTA);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentApi.get("landing_cta");
        if (data && data.value) {
          setCta(data.value);
        }
      } catch (error) {
        console.error("Failed to load CTA content", error);
      }
    };
    loadContent();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-slate-950" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-slate-950/50 to-slate-950" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden group"
        >
          {/* Shine effect */}
          <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:left-[100%] transition-all duration-1000" />

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Start Free Trial - 14 Days
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-display">
            {cta.title}
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            {cta.text}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group/btn">
                {cta.primary_btn}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/register">
              <button className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-xl font-bold transition-all flex items-center justify-center">
                {cta.secondary_btn}
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
