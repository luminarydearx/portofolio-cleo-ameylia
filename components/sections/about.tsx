"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Rocket, DollarSign, Users, Globe, ArrowRight } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData } from "@/contexts/data-context";
import { cn } from "@/lib/utils";

export function About() {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const statsMeta = [
    { icon: Rocket, value: data?.aboutStats?.companiesValue || 3, prefix: "", suffix: "", key: "companies" as const, color: "text-violet-400", bg: "bg-violet-500/10" },
    { icon: DollarSign, value: data?.aboutStats?.fundingValue || 12, prefix: "$", suffix: "M+", key: "funding" as const, color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Users, value: data?.aboutStats?.usersValue || 100, prefix: "", suffix: "K+", key: "users" as const, color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Globe, value: data?.aboutStats?.countriesValue || 15, prefix: "", suffix: "+", key: "countries" as const, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="about" ref={ref} className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-violet-600/5 blur-[100px]" />
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="overflow-hidden rounded-3xl border border-white/[0.06] bg-card shadow-premium"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left */}
            <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
              <motion.p variants={itemVariants} className="section-label mb-4">
                {t.about.sectionLabel}
              </motion.p>
              <motion.h2 variants={itemVariants} className="text-3xl font-bold leading-tight lg:text-4xl">
                {t.about.headline}{" "}
                <span className="gradient-text">{t.about.headlineAccent}</span>
                <br />
                {t.about.headline2}
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
                {t.about.description1}
              </motion.p>
              <motion.p variants={itemVariants} className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {t.about.description2}
              </motion.p>
              <motion.button
                variants={itemVariants}
                onClick={() => document.getElementById("companies")?.scrollIntoView({ behavior: "smooth" })}
                whileHover={{ x: 4 }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20"
              >
                {t.about.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </div>

            {/* Right — Stats Grid */}
            <div className="grid grid-cols-2 gap-0">
              {statsMeta.map(({ icon: Icon, value, prefix, suffix, key, color, bg }, i) => (
                <motion.div
                  key={key}
                  variants={itemVariants}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-3 p-6 text-center transition-all duration-300 hover:bg-white/[0.02]",
                    i === 0 && "border-b border-r border-white/[0.06]",
                    i === 1 && "border-b border-white/[0.06]",
                    i === 2 && "border-r border-white/[0.06]",
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg)}>
                    <Icon className={cn("h-5 w-5", color)} />
                  </div>
                  <div className={cn("text-3xl font-bold", color)}>
                    <AnimatedCounter value={value} prefix={prefix} suffix={suffix} duration={2000} />
                  </div>
                  <p className="text-xs text-muted-foreground leading-tight">{t.about.stats[key]}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
