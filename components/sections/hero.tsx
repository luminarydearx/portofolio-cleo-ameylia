/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Download,
  Focus,
  Mail,
  Sparkles
} from "lucide-react";
import { GridBackground } from "@/components/effects/grid-background";
import { MouseSpotlight } from "@/components/effects/spotlight";
import { Particles } from "@/components/effects/particles";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData } from "@/contexts/data-context";

export function Hero() {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const roles = t.hero.roles;

  useEffect(() => {
    setRoleIndex(0);
  }, [roles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [roles]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen overflow-hidden"
    >
      <GridBackground className="absolute inset-0" />
      <MouseSpotlight />
      <Particles count={35} />

      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-blue-600/8 blur-[100px]" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 pt-24 pb-12"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* LEFT */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariants}>
              <span data-edit-id="hero.badge" className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-violet-400 uppercase">
                <Sparkles className="h-3 w-3" />
                {t.hero.badge}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-[64px]">
                <span data-edit-id="hero.headline1">{t.hero.headline1}</span>
                <br />
                <span data-edit-id="hero.headline2">{t.hero.headline2}</span>
                <br />
                <span data-edit-id="hero.headline3">{t.hero.headline3}</span>{" "}
                <span className="relative">
                  <span data-edit-id="hero.headlineAccent" className="gradient-text animate-gradient-shift bg-[length:200%_200%]">
                    {t.hero.headlineAccent}
                  </span>
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-violet-500 via-purple-400 to-transparent opacity-60" />
                </span>
              </h1>
            </motion.div>

            {/* Rotating role */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${roleIndex}-${roles[roleIndex]}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="font-medium text-foreground/80"
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.p
              variants={itemVariants}
              data-edit-id="hero.description"
              className="max-w-md text-base leading-relaxed text-muted-foreground"
            >
              {t.hero.description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.button
                onClick={() => scrollTo("companies")}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:bg-violet-500 hover:shadow-glow-lg"
              >
                <span className="relative z-10">{t.hero.ctaPrimary}</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </motion.button>
              <motion.button
                onClick={() => scrollTo("contact")}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/20"
              >
                {t.hero.ctaSecondary}
              </motion.button>
            </motion.div>

            {/* Tech Pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2"
            >
              <br />
              <br />
              <br />
            </motion.div>
          </motion.div>

          {/* RIGHT — Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {data && (
              <ProfileCard 
                socialLinks={[
                  { icon: Focus, href: data.socialLinks.instagram, label: "Instagram" },
                  { icon: Mail, href: `mailto:${data.socialLinks.email}`, label: "E-Mail" }
                ]} 
                profileImage={data.profileImage} 
              />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40">
          Scroll
        </span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/10 p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-violet-500"
          />
        </div>
      </motion.div>
    </section>
  );
}

function ProfileCard({
  socialLinks,
  profileImage,
}: {
  socialLinks: { icon: React.ElementType; href: string; label: string }[];
  profileImage?: string;
}) {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const profile = t.hero.profile;

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[340px] w-[340px] rounded-full border border-violet-500/10 animate-spin-slow" />
        <div className="absolute h-[280px] w-[280px] rounded-full border border-violet-500/8" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute h-[320px] w-[320px]"
        >
          <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-500 shadow-glow" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute h-[260px] w-[260px]"
        >
          <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400" />
        </motion.div>
      </div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-[300px] sm:w-[340px] overflow-hidden rounded-3xl border border-white/8 bg-card shadow-premium"
      >
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-violet-900/50 via-purple-900/30 to-slate-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute inset-0 flex items-end justify-center">
            {profileImage ? (
              <img src={profileImage} alt={profile.name} className="h-48 w-40 rounded-t-full object-cover" />
            ) : (
              <div className="h-48 w-40 rounded-t-full bg-gradient-to-br from-violet-400/20 to-purple-600/20 flex items-center justify-center text-7xl select-none">
                👤
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[10px] font-semibold text-green-400">
              {profile.available}
            </span>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h2 data-edit-id="hero.profile.name" className="text-xl font-bold">{profile.name}</h2>
            <p data-edit-id="hero.profile.title" className="text-sm font-medium text-violet-400">
              {profile.title}
            </p>
          </div>
          <p data-edit-id="hero.profile.bio" className="text-sm text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
          <div data-edit-id="hero.profile.location" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 text-violet-400/70" />
            {profile.location}
          </div>
          <motion.a
            href={data?.socialLinks?.resume || "#"}
            download="Resume_Cleo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20"
          >
            <Download className="h-3.5 w-3.5" />
            {profile.downloadResume}
          </motion.a>
          <div className="flex items-center gap-2 pt-1">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.9 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all hover:border-violet-500/30 hover:text-violet-400"
              >
                <Icon className="h-3.5 w-3.5" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
