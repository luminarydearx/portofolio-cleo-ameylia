"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Code2, Users, TrendingUp, BrainCircuit, Target } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const servicesMeta = [
  { icon: Target, color: "text-violet-400", bg: "bg-violet-500/10", border: "hover:border-violet-500/30", hoverGlow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]", delay: 0 },
  { icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10", border: "hover:border-blue-500/30", hoverGlow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.12)]", delay: 0.05 },
  { icon: Users, color: "text-green-400", bg: "bg-green-500/10", border: "hover:border-green-500/30", hoverGlow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.12)]", delay: 0.1 },
  { icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10", border: "hover:border-orange-500/30", hoverGlow: "hover:shadow-[0_0_30px_rgba(251,146,60,0.12)]", delay: 0.15 },
  { icon: BrainCircuit, color: "text-pink-400", bg: "bg-pink-500/10", border: "hover:border-pink-500/30", hoverGlow: "hover:shadow-[0_0_30px_rgba(244,114,182,0.12)]", delay: 0.2 },
  { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "hover:border-yellow-500/30", hoverGlow: "hover:shadow-[0_0_30px_rgba(250,204,21,0.12)]", delay: 0.25 },
];

export function Services() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" ref={ref} className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[120px]" />
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="section-label mb-2">{t.services.sectionLabel}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.items.map((service, i) => {
            const meta = servicesMeta[i];
            const Icon = meta.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: meta.delay, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className={cn("group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-6 transition-all duration-300", meta.border, meta.hoverGlow)}
              >
                <div className={cn("relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110", meta.bg)}>
                  <Icon className={cn("h-5 w-5", meta.color)} />
                </div>
                <div className="relative space-y-2">
                  <h3 className="font-bold text-sm leading-tight">{service.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
