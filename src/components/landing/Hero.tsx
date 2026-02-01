"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MotionButton } from "@/components/ui/button";

const WordAnimate = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      className="gap-x-2"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

import { useState, useEffect } from "react";
import { contentApi } from "@/lib/api";

const DEFAULT_HERO = {
  subtitle: "Platform Manajemen Sekolah & Pesantren #1 di Indonesia",
  title_line1: "Kelola Sekolah & Pesantren",
  title_line2: "Jadi Lebih Modern",
  description: "Satu platform untuk semua kebutuhan: Akademik, Asrama, Keuangan, hingga Laporan Digital. Terintegrasi, Aman, dan Mudah Digunakan.",
  cta_primary: "Mulai Sekarang Gratis",
  cta_secondary: "Lihat Demo"
};

export const Hero = () => {
  const [content, setContent] = useState(DEFAULT_HERO);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentApi.get("landing_hero");
        if (data && data.value && typeof data.value === 'object') {
          setContent({ ...DEFAULT_HERO, ...data.value });
        }
      } catch (error) {
        console.error("Failed to load hero content", error);
      }
    };
    loadContent();
  }, []);

  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/30 rounded-full blur-[100px] animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
          <span className="text-sm text-slate-300 font-medium tracking-wide">
            {content.subtitle}
          </span>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 leading-tight font-display text-white">
          <WordAnimate text={content.title_line1} delay={0.1} />
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">
            <WordAnimate text={content.title_line2} delay={0.6} />
          </span>
        </h1>

        <div className="mt-4 max-w-3xl mx-auto text-xl text-slate-400 mb-12 font-light leading-relaxed">
          <WordAnimate
            text={content.description}
            delay={1.2}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 2.5 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link href="/register">
            <MotionButton
              size="lg"
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-7 shadow-xl shadow-emerald-500/20 text-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {content.cta_primary}
            </MotionButton>
          </Link>
          <Link href="/register">
            <MotionButton
              variant="outline"
              size="lg"
              className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white px-10 py-7 backdrop-blur-sm text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {content.cta_secondary}
            </MotionButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
