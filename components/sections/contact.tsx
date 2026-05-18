"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  Focus,
  Mail,
  Copy,
  Check,
  Sparkles,
  Github,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData } from "@/contexts/data-context";
import { cn } from "@/lib/utils";

export function Contact() {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const EMAIL = data?.socialLinks.email || "dearlyfebrianoi@gmail.com";

  const socialLinks = [
    {
      icon: Focus,
      href: data?.socialLinks.instagram || "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: Github,
      href: data?.socialLinks.github || "https://github.com/",
      label: "GitHub",
    },
    {
      icon: Mail,
      href:  `mailto:${EMAIL}`,
      label: "E-Mail"
    },
  ];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const el = document.createElement("textarea");
      el.value = EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" ref={ref} className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/8 blur-[120px]" />
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-card p-10 lg:p-14 shadow-premium"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[80px]" />

          <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="space-y-4 max-w-lg">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                <span className="text-xs font-semibold text-green-400">
                  {t.contact.availableBadge}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 }}
                className="text-3xl font-bold leading-tight lg:text-4xl"
              >
                {t.contact.headline}{" "}
                <span className="gradient-text">
                  {t.contact.headlineAccent}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="text-[15px] text-muted-foreground leading-relaxed"
              >
                {t.contact.description}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 }}
                onClick={copyEmail}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  copied
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-white/20",
                )}
              >
                <Mail className="h-4 w-4" />
                {EMAIL}
                <span className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </span>
                {copied && (
                  <span className="text-green-400 text-xs">
                    {t.contact.copied}
                  </span>
                )}
              </motion.button>
            </div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-start gap-4 lg:items-end"
            >
              <motion.a
                href={`mailto:${EMAIL}`}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-violet-600 px-7 py-4 text-[15px] font-bold text-white shadow-glow transition-all duration-200 hover:bg-violet-500 hover:shadow-glow-lg"
              >
                <Sparkles className="h-4 w-4" />
                <span className="relative z-10">{t.contact.letsTalk}</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.a>

              <div className="flex items-center gap-2">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-400"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
