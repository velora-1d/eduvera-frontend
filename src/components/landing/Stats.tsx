"use client";

import { useState, useEffect } from "react";
import { contentApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Counter } from "@/components/ui/Counter";

const DEFAULT_STATS = [
  { label: "Pesantren & Sekolah", value: 100, suffix: "+", border: false },
  { label: "Siswa & Santri", value: 15000, suffix: "+", border: true },
  { label: "Uptime Server", value: 99.9, suffix: "%", border: false },
];

export const Stats = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentApi.get("landing_stats");
        if (data && data.value && Array.isArray(data.value)) {
          setStats(data.value);
        }
      } catch (error) {
        console.error("Failed to load stats content", error);
      }
    };
    loadContent();
  }, []);

  return (
    <div className="relative -mt-10 z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.1 }}
        className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center shadow-2xl border border-white/5"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
              visible: {
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                  type: "spring" as const,
                  stiffness: 100,
                  damping: 15,
                },
              },
            }}
            className={stat.border ? "md:border-x border-slate-700/50" : ""}
          >
            <dt className="text-4xl sm:text-5xl font-bold text-white mb-2 font-display">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dt>
            <dd className="text-sm font-medium text-slate-400 tracking-widest uppercase">
              {stat.label}
            </dd>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
