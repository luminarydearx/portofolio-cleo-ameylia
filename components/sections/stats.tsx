"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, DollarSign, Activity, Star, UserPlus } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData } from "@/contexts/data-context";
import { cn } from "@/lib/utils";
export function Stats() {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const statsMeta = [
    { icon: Users, value: data?.statsData?.usersValue || 100, prefix: "", suffix: "K+", key: "users" as const, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", glow: "shadow-[0_0_20px_rgba(139,92,246,0.15)]" },
    { icon: DollarSign, value: data?.statsData?.arrValue || 2, prefix: "$", suffix: "M+", key: "arr" as const, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(52,211,153,0.15)]" },
    { icon: Activity, value: data?.statsData?.uptimeValue || 99.9, prefix: "", suffix: "%", key: "uptime" as const, decimals: 1, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "shadow-[0_0_20px_rgba(96,165,250,0.15)]" },
    { icon: Star, value: data?.statsData?.ratingValue || 4.9, prefix: "", suffix: "/5", key: "rating" as const, decimals: 1, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", glow: "shadow-[0_0_20px_rgba(250,204,21,0.15)]" },
    { icon: UserPlus, value: data?.statsData?.teamValue || 30, prefix: "", suffix: "+", key: "team" as const, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20", glow: "shadow-[0_0_20px_rgba(244,114,182,0.15)]" },
  ];

  return (
    <section id="stats" ref={ref} className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="section-label mb-3">{t.stats.sectionLabel}</p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statsMeta.map(({ icon: Icon, value, prefix, suffix, key, decimals, color, bg, border, glow }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.03 }}
              className={cn("group relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border bg-card p-6 text-center transition-all duration-300", border, glow)}
            >
              <div className={cn("pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100", bg)} />
              <div className={cn("relative flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300", bg, border)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div className={cn("relative text-2xl font-bold tabular-nums sm:text-3xl", color)}>
                <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals ?? 0} duration={2200} />
              </div>
              <p className="relative text-xs text-muted-foreground leading-tight">{t.stats.items[key]}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
