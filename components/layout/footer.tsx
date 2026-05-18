"use client";

import { motion } from "framer-motion";
import { Mail, ArrowUp, Heart, Focus } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData } from "@/contexts/data-context";

export function Footer() {
  const { t } = useLanguage();
  const { data } = usePortfolioData();

  const socialLinks = [
    {
      icon: Focus,
      href: data?.socialLinks.instagram || "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: Mail,
      href: `mailto:${data?.socialLinks.email || "dearlyfebrianoi@gmail.com"}`,
      label: "E-Mail"
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5 bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-600 text-white text-[10px] font-bold">
              A/
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Cleo Ameylia Salsabila</span>
              <span>·</span>
              <span>© {new Date().getFullYear()} {t.footer.rights}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-violet-500/30 hover:text-violet-400"
              >
                <Icon className="h-3.5 w-3.5" />
              </motion.a>
            ))}
          </div>

          {/* Built with + Back to top */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {t.footer.builtWith}{" "}
              <Heart className="h-3 w-3 fill-violet-500 text-violet-500" />
            </span>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-violet-500/30 hover:text-violet-400"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
