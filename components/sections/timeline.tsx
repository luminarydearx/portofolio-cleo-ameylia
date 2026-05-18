"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

const timelineMeta = [
  { color: "bg-orange-500", textColor: "text-orange-400", tagBg: "bg-orange-500/15" },
  { color: "bg-blue-500",   textColor: "text-blue-400",   tagBg: "bg-blue-500/15"   },
  { color: "bg-green-500",  textColor: "text-green-400",  tagBg: "bg-green-500/15"  },
  { color: "bg-violet-500", textColor: "text-violet-400", tagBg: "bg-violet-500/15" },
  { color: "bg-pink-500",   textColor: "text-pink-400",   tagBg: "bg-pink-500/15"   },
];

export function Timeline() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="timeline" ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/5 to-transparent" />

      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="section-label mb-2">{t.timeline.sectionLabel}</p>
          <h2 className="text-3xl font-bold lg:text-4xl">
            {t.timeline.headline}{" "}
            <span className="gradient-text">{t.timeline.headlineAccent}</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-0 lg:items-start">
            {t.timeline.items.map((milestone, i) => {
              const meta = timelineMeta[i] ?? timelineMeta[0];
              return (
                <motion.div
                  key={`${milestone.year}-${i}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex-1 group"
                >
                  {/* Dot + stem desktop */}
                  <div className="hidden lg:flex mb-6 justify-center">
                    <div className="relative flex h-[100px] w-px flex-col items-center bg-white/5">
                      <div className={cn("absolute -top-1.5 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-background", meta.color)}>
                        <span className={cn("absolute inset-0.5 rounded-full animate-ping opacity-25", meta.color)} />
                      </div>
                    </div>
                  </div>

                  <div className="lg:mx-2">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="relative rounded-2xl border border-white/[0.06] bg-card p-5 transition-all duration-300 hover:border-white/10 hover:shadow-card-dark"
                    >
                      {/* Mobile dot */}
                      <div className={cn("absolute -left-2 top-5 flex lg:hidden h-4 w-4 rounded-full border-2 border-background", meta.color)} />

                      <span className={cn("text-xs font-bold", meta.textColor)}>{milestone.year}</span>
                      <h3 className="mt-1 font-bold text-sm leading-snug">{milestone.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{milestone.description}</p>

                      <div className="mt-3">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold", meta.tagBg, meta.textColor)}>
                          {milestone.tag}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
