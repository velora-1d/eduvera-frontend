"use client";

import { useState, useEffect } from "react";
import { contentApi } from "@/lib/api";
import { motion } from "framer-motion";
import { Quote, Star, User } from "lucide-react";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Ustadz Ahmad Fauzi",
    role: "Direktur Pesantren Al-Hikmah, Jawa Timur",
    content:
      "EduVera sangat membantu kami mengelola data 800+ santri dengan mudah. Fitur Tahfidz dan E-Rapor Pesantren benar-benar sesuai kebutuhan kami.",
    rating: 5,
  },
  {
    name: "Ibu Siti Aminah, S.Pd",
    role: "Kepala Sekolah SDN 1 Sukamaju",
    content:
      "Administrasi sekolah jadi lebih rapi. E-Rapor otomatis menghemat waktu guru hingga 70%. Highly recommended!",
    rating: 5,
  },
  {
    name: "Bapak H. Muhammad Ridwan",
    role: "Ketua Yayasan Pendidikan Islam Terpadu",
    content:
      "Paket Hybrid sangat cocok untuk yayasan kami yang mengelola sekolah dan pesantren sekaligus. Satu dashboard untuk semuanya!",
    rating: 5,
  },
];

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentApi.get("landing_testimonials");
        if (data && data.value && Array.isArray(data.value)) {
          setTestimonials(data.value);
        }
      } catch (error) {
        console.error("Failed to load testimonials content", error);
      }
    };
    loadContent();
  }, []);

  // Duplicate for seamless loop
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      id="testimoni"
      className="py-24 bg-slate-950 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
            <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">
              Dipercaya 500+ Lembaga
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
            Apa Kata Mereka?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Testimoni dari lembaga pendidikan yang telah menggunakan EduVera
            untuk transformasi digital mereka.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -50 * testimonials.length * 6],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {allTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[400px] bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors"
                >
                  {/* Quote Icon */}
                  <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />

                  {/* Content */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800/50 border border-emerald-500/20 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-slate-500 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
