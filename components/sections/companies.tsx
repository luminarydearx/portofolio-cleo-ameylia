"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const companiesMeta = [
  { emoji: "🟣", color: "from-violet-500/20 to-purple-600/10", accentColor: "text-violet-400", borderColor: "hover:border-violet-500/30", statusKey: "Active" as const },
  { emoji: "🟢", color: "from-green-500/15 to-emerald-600/5", accentColor: "text-green-400", borderColor: "hover:border-green-500/30", statusKey: "Acquired" as const },
  { emoji: "🟠", color: "from-orange-500/15 to-amber-600/5", accentColor: "text-orange-400", borderColor: "hover:border-orange-500/30", statusKey: "Exited" as const },
];

const statusBg: Record<string, string> = {
  Active: "bg-green-500/15 text-green-400 border-green-500/20",
  Acquired: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Exited: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

export function Companies() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="companies" ref={ref} className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <p className="section-label">{t.companies.sectionLabel}</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20">
            {t.companies.viewAll}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {t.companies.items.map((company, i) => {
            const meta = companiesMeta[i];
            return (
              <motion.div
                key={company.name}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-card p-6 shadow-card-dark transition-all duration-300",
                  meta.borderColor
                )}
              >
                <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100", meta.color)} />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">{meta.emoji}</div>
                      <div>
                        <h3 className="font-bold text-[15px]">{company.name}</h3>
                        <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide", statusBg[meta.statusKey])}>
                          {t.companies.status[meta.statusKey]}
                        </span>
                      </div>
                    </div>
                    <motion.div whileHover={{ rotate: 45, scale: 1.1 }} className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 cursor-pointer">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{company.description}</p>
                </div>
                <div className="relative mt-5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">{company.period}</span>
                  <div className="flex gap-1.5">
                    {company.tags.map((tag) => (
                      <span key={tag} className={cn("tech-pill text-[10px]", meta.accentColor)}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
