"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check localStorage for saved preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDark(savedTheme === "dark");
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
        } else {
            // Default to dark mode
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        localStorage.setItem("theme", newTheme ? "dark" : "light");
        document.documentElement.classList.toggle("dark", newTheme);

        // Update CSS variables for theme
        if (newTheme) {
            document.documentElement.style.setProperty("--bg-primary", "#0f172a");
            document.documentElement.style.setProperty("--bg-secondary", "#1e293b");
            document.documentElement.style.setProperty("--text-primary", "#ffffff");
            document.documentElement.style.setProperty("--text-secondary", "#94a3b8");
        } else {
            document.documentElement.style.setProperty("--bg-primary", "#ffffff");
            document.documentElement.style.setProperty("--bg-secondary", "#f8fafc");
            document.documentElement.style.setProperty("--text-primary", "#0f172a");
            document.documentElement.style.setProperty("--text-secondary", "#64748b");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200 rounded-lg transition-colors"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {isDark ? (
                    <Moon size={20} className="text-slate-400" />
                ) : (
                    <Sun size={20} className="text-amber-500" />
                )}
            </motion.div>
        </button>
    );
}
