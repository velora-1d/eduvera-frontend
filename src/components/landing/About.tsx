"use client";

import { useState, useEffect } from "react";
import { contentApi } from "@/lib/api";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

// Helper component to render icon by name
const DynamicIcon = ({ name, className, style }: { name: string; className?: string, style?: any }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} style={style} /> : <LucideIcons.HelpCircle className={className} style={style} />;
};

const DEFAULT_ABOUT = {
  title: "Tentang EduVera",
  description: "EduVera adalah platform manajemen pendidikan berbasis cloud yang dirancang khusus untuk memenuhi kebutuhan sekolah dan pesantren di Indonesia.",
  story_title: "Cerita Kami",
  story_p1: "Berawal dari keprihatinan melihat banyak lembaga pendidikan yang masih kesulitan mengelola administrasi secara manual, kami membangun EduVera untuk memberikan solusi digital yang mudah dan terjangkau.",
  story_p2: "Dengan pengalaman lebih dari 5 tahun di dunia teknologi pendidikan, kami memahami bahwa setiap lembaga memiliki keunikan tersendiri.",
  values: [
    { title: "Visi Kami", description: "Menjadi platform pendidikan digital #1 di Indonesia.", icon: "Target", color: "emerald" },
    { title: "Misi Kami", description: "Menyediakan solusi teknologi yang mudah dan terjangkau.", icon: "Heart", color: "rose" },
    { title: "Komitmen", description: "Keamanan data dan kualitas layanan adalah prioritas.", icon: "Shield", color: "sky" },
    { title: "Tim Kami", description: "Tim berpengalaman di teknologi pendidikan.", icon: "Users", color: "amber" },
  ]
};

const colorMap: Record<string, string> = {
  emerald: "from-emerald-500 to-emerald-600",
  rose: "from-rose-500 to-rose-600",
  sky: "from-sky-500 to-sky-600",
  amber: "from-amber-500 to-amber-600",
};

const bgColorMap: Record<string, string> = {
  emerald: "bg-emerald-500/10",
  rose: "bg-rose-500/10",
  sky: "bg-sky-500/10",
  amber: "bg-amber-500/10",
};

export const About = () => {
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await contentApi.get("landing_about");
        if (data && data.value) {
          setAbout(data.value);
        }
      } catch (error) {
        console.error("Failed to load about content", error);
      }
    };
    loadContent();
  }, []);

  return (
    <section
      id="about"
      className="py-24 bg-slate-900/50 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-display">
            {about.title}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {about.description}
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-12 mb-16"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              {about.story_title}
            </h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              {about.story_p1}
            </p>
            <p className="text-slate-400 leading-relaxed">
              {about.story_p2}
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.values && about.values.map((value: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${bgColorMap[value.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <DynamicIcon
                  name={value.icon}
                  className={`w-6 h-6 bg-gradient-to-r ${colorMap[value.color]} bg-clip-text`}
                  style={{
                    color:
                      value.color === "emerald"
                        ? "#10b981"
                        : value.color === "rose"
                          ? "#f43f5e"
                          : value.color === "sky"
                            ? "#0ea5e9"
                            : "#f59e0b",
                  }}
                />
              </div>
              <h4 className="text-white font-semibold mb-2">{value.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
