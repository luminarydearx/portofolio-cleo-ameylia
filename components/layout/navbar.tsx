"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, Command } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { CommandMenu } from "@/components/ui/command-menu";
import { useScrollDirection, useActiveSection } from "@/hooks/use-scroll";
import { useLanguage } from "@/contexts/language-context";
import { locales } from "@/lib/translations";
import { cn } from "@/lib/utils";

const sectionIds = [
  "about",
  "companies",
  "projects",
  "stats",
  "services",
  "contact",
];

function useMacPlatform() {
  // This runs only on client
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(window.navigator.platform.toLowerCase().includes("mac"));
  }, []);
  return isMac;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const { scrollDirection, isAtTop } = useScrollDirection();
  const activeSection = useActiveSection(sectionIds);
  const { t, locale, setLocale } = useLanguage();
  const isMac = useMacPlatform();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinks = useMemo(() => [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.ventures, href: "#companies" },
    { label: t.nav.work, href: "#projects" },
    { label: t.nav.impact, href: "#stats" },
    { label: t.nav.contact, href: "#contact" },
  ], [t]);

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    if (typeof window !== "undefined") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  const navVisible = isAtTop || scrollDirection === "up";

  return (
    <>
      <CommandMenu open={commandOpen} setOpen={setCommandOpen} />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: navVisible ? 0 : -100, opacity: navVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "relative flex w-full max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500",
            isAtTop
              ? "border border-transparent bg-transparent"
              : "glass border border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          )}
        >
          {/* Logo */}
          <motion.button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white text-xs font-bold shadow-glow-sm">
              A/
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Cleo Ameylia Salsabila
            </span>
          </motion.button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className={cn(
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-white/8 dark:bg-white/5"
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions: CMD+K | Language | Theme | CTA | Hamburger */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex">
              <button
                type="button"
                onClick={() => setCommandOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition-all hover:bg-white/10 hover:text-foreground"
              >
                <span>
                  {isMac ? (
                    <>
                      <span className="sr-only">Command</span>
                      <span className="font-mono">
                        <Command className="h-3 w-3" />
                      </span>
                      +K
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Control</span>
                      <span className="font-mono">Ctrl</span>+K
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Language Toggle — between CMD+K and Theme */}
            <LanguageToggle />

            <ThemeToggle />

            <motion.button
              onClick={() => scrollTo("#contact")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-sm font-semibold text-background transition-all duration-200 hover:opacity-90 active:scale-95"
            >
              {t.nav.letsTalk}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </motion.button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5"
              aria-label="Toggle menu"
              type="button"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-4 right-4 mt-2 overflow-hidden rounded-2xl border border-white/[0.06] glass shadow-premium"
            >
              <div className="flex flex-col gap-1 p-3">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollTo(link.href)}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground text-left"
                  >
                    {link.label}
                  </motion.button>
                ))}

                {/* Mobile language grid */}
                <div className="mt-2 border-t border-white/5 pt-3 px-1">
                  <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                    Language
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {locales.map((lang) => {
                      const isActive = locale === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLocale(lang.code);
                            setMobileOpen(false);
                          }}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-xl border py-2.5 transition-all",
                            isActive
                              ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10",
                          )}
                        >
                          <span className="text-base leading-none">
                            {lang.flag}
                          </span>
                          <span className="text-[10px] font-semibold">
                            {lang.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-2 pt-1">
                  <button
                    onClick={() => scrollTo("#contact")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
                  >
                    {t.nav.letsTalk} <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
