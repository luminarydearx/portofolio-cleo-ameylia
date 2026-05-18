"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { locales } from "@/lib/translations";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = locales.find((l) => l.code === locale) ?? locales[0];

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/20"
        aria-label="Change language"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="text-xs font-semibold tracking-wide text-foreground/80">
          {current.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-12 z-50 min-w-[180px] overflow-hidden rounded-xl border border-white/10 bg-card/95 p-1.5 shadow-premium backdrop-blur-xl"
            >
              {/* Header */}
              <div className="px-2 pb-1.5 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Language
                </p>
              </div>

              {/* Options */}
              <div className="space-y-0.5">
                {locales.map((lang) => {
                  const isActive = locale === lang.code;
                  return (
                    <motion.button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code);
                        setIsOpen(false);
                      }}
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150",
                        isActive
                          ? "bg-violet-600/15 text-violet-400"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      {/* Flag */}
                      <span className="text-base leading-none">{lang.flag}</span>

                      {/* Name */}
                      <div className="flex flex-col items-start gap-0.5 flex-1">
                        <span className="text-xs font-semibold leading-none">
                          {lang.name}
                        </span>
                        <span className="text-[10px] leading-none opacity-50">
                          {lang.label}
                        </span>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-500/20"
                        >
                          <Check className="h-2.5 w-2.5 text-violet-400" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <div className="mt-1.5 border-t border-white/5 px-2 pt-1.5 pb-0.5">
                <p className="text-[10px] text-muted-foreground/40">
                  {locales.length} languages available
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
