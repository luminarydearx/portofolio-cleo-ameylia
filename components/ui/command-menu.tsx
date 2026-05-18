"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import {
  User,
  Code2,
  Mail,
  Github,
  Focus,
  FileText,
  Rocket,
  BarChart3,
  Wrench,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData } from "@/contexts/data-context";
import React, { useRef, useLayoutEffect } from "react";

/**
 * To minimize hydration errors, avoid code or state that could be inconsistent
 * between SSR and Client. This component assumes all props and context are
 * client-side consistent. Avoid Date.now(), Math.random(), or window branching here.
 */

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const { setTheme } = useTheme();
  const { t } = useLanguage();
  const { data } = usePortfolioData();

  // Modal click-outside logic
  const menuRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Use useLayoutEffect to ensure event binding is always client-side and not SSR-ed.
  useLayoutEffect(() => {
    if (!open) return;

    function onClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onClick);

    return () => {
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, setOpen]);

  // Focus input when the command menu opens
  useLayoutEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const runCommand = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  const navigate = (id: string) => {
    // document.getElementById is a client-only API,
    // called only on click so won't cause hydration issues
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Don't use any dynamic/random logic here!
  const navItems = [
    { id: "about", label: t.nav.about, icon: User },
    { id: "companies", label: t.nav.ventures, icon: Rocket },
    { id: "projects", label: t.nav.work, icon: Code2 },
    { id: "stats", label: t.nav.impact, icon: BarChart3 },
    { id: "services", label: "Services", icon: Wrench },
    { id: "contact", label: t.nav.contact, icon: Mail },
  ];

  const groupHeadingClass = [
    "[&_[cmdk-group-heading]]:py-2",
    "[&_[cmdk-group-heading]]:text-xs",
    "[&_[cmdk-group-heading]]:font-semibold",
    "[&_[cmdk-group-heading]]:uppercase",
    "[&_[cmdk-group-heading]]:tracking-wider",
    "[&_[cmdk-group-heading]]:text-violet-400/80",
    "[&_[cmdk-group-heading]]:px-2",
  ].join(" ");

  const itemClass =
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-all hover:bg-violet-600/10 hover:text-foreground aria-selected:bg-violet-600/10 aria-selected:text-foreground";

  // Keyboard hints are static; to minimize hydration issues, don't localize or randomize them at render
  const keyboardHints = [
    { key: "↑↓", desc: "navigate" },
    { key: "↵", desc: "select" },
    { key: "esc", desc: "close" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000]" suppressHydrationWarning>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
              <Command
                className={[
                  "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium",
                  "[&_[cmdk-group-heading]]:text-muted-foreground",
                  "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
                  "[&_[cmdk-group]]:px-2",
                  "[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5",
                  "[&_[cmdk-input]]:h-12",
                  "[&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3",
                  "[&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
                ].join(" ")}
              >
                {/* Search Row */}
                <div className="flex items-center border-b border-white/10 px-4">
                  <svg
                    className="mr-2 h-4 w-4 shrink-0 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <CommandInput
                    ref={inputRef}
                    autoFocus
                    placeholder={t.command.placeholder}
                    className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="ml-2 shrink-0 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                <CommandList className="max-h-[400px] overflow-y-auto overflow-x-hidden py-2">
                  <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                    {t.command.noResults}
                  </CommandEmpty>

                  {/* Navigate */}
                  <CommandGroup
                    heading={t.command.navigate}
                    className={groupHeadingClass}
                  >
                    {navItems.map(({ id, label, icon: Icon }) => (
                      <CommandItem
                        key={id}
                        onSelect={() => runCommand(() => navigate(id))}
                        className={itemClass}
                      >
                        <Icon className="h-4 w-4 text-violet-400" />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandSeparator className="my-1 h-px bg-white/5" />

                  {/* Links */}
                  <CommandGroup
                    heading={t.command.links}
                    className={groupHeadingClass}
                  >
                    {[
                      {
                        label: "GitHub",
                        icon: Github,
                        href: data?.socialLinks.github || "https://github.com/",
                      },
                      {
                        label: "Instagram",
                        icon: Focus,
                        href: data?.socialLinks.instagram || "https://instagram.com/",
                      },
                      { label: "Resume", icon: FileText, href: data?.socialLinks.resume || "/resume.pdf" },
                    ].map(({ label, icon: Icon, href }) => (
                      <CommandItem
                        key={label}
                        onSelect={() =>
                          runCommand(() => window.open(href, "_blank"))
                        }
                        className={itemClass}
                      >
                        <Icon className="h-4 w-4 text-violet-400" />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandSeparator className="my-1 h-px bg-white/5" />

                  {/* Theme */}
                  <CommandGroup
                    heading={t.command.theme}
                    className={groupHeadingClass}
                  >
                    {[
                      { label: t.command.light, icon: Sun, value: "light" },
                      { label: t.command.dark, icon: Moon, value: "dark" },
                      {
                        label: t.command.system,
                        icon: Monitor,
                        value: "system",
                      },
                    ].map(({ label, icon: Icon, value }) => (
                      <CommandItem
                        key={value}
                        onSelect={() => runCommand(() => setTheme(value))}
                        className={itemClass}
                      >
                        <Icon className="h-4 w-4 text-violet-400" />
                        {label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>

                {/* Keyboard hints */}
                <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-4">
                  {keyboardHints.map(({ key, desc }) => (
                    <span
                      key={desc}
                      className="flex items-center gap-1 text-xs text-muted-foreground/60"
                    >
                      <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-[9px]">
                        {key}
                      </kbd>
                      {desc}
                    </span>
                  ))}
                </div>
              </Command>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
