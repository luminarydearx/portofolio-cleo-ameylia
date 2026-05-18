/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { usePortfolioData, PortfolioData } from "@/contexts/data-context";
import { cn } from "@/lib/utils";

type Project = PortfolioData["projects"][0];

function MockScreenshot({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false);

  if (project.image) {
    return <img src={project.image} alt={project.title} className="h-full w-full object-cover rounded-xl" />;
  }

  if (project.demo) {
    return (
      <div 
        className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black group/iframe pointer-events-auto cursor-pointer"
        onMouseEnter={() => setLoaded(true)}
        onClick={() => setLoaded(true)}
      >
        {loaded ? (
          <iframe src={project.demo} className="h-full w-full border-0 bg-white" sandbox="allow-scripts allow-same-origin" tabIndex={-1} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 text-muted-foreground gap-2 transition-colors hover:bg-white/10">
            <ExternalLink className="h-6 w-6 opacity-40" />
            <span className="text-[10px] font-medium uppercase tracking-widest opacity-50">Live Preview (Hover/Click)</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col gap-1.5 overflow-hidden rounded-xl p-2 border border-white/5",
        project.screenColor,
      )}
    >
      <div className="flex items-center gap-1.5 px-1">
        <div className="h-2 w-2 rounded-full bg-red-500/60" />
        <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
        <div className="h-2 w-2 rounded-full bg-green-500/60" />
        <div className="ml-2 h-2 flex-1 rounded-sm bg-white/5" />
      </div>
      <div className="flex flex-1 gap-2 p-1">
        <div className="flex w-1/4 flex-col gap-1.5">
          <div className="h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-3/4 rounded bg-white/8" />
          <div className="mt-2 h-2 w-full rounded bg-white/10" />
          <div className="h-2 w-2/3 rounded bg-white/8" />
          <div className="mt-2 h-2 w-full rounded bg-white/10" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-16 rounded-lg bg-white/5 border border-white/5" />
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 rounded-md bg-white/5 border border-white/5" />
            <div className="h-10 rounded-md bg-white/5 border border-white/5" />
          </div>
          <div className="h-8 rounded-md bg-white/5 border border-white/5" />
        </div>
      </div>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40 rounded-xl",
          project.gradient,
        )}
      />
    </div>
  );
}

export function Projects() {
  const { t } = useLanguage();
  const { data } = usePortfolioData();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const projectsData = data?.projects || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="projects" ref={ref} className="relative py-24 lg:py-32">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blue-600/5 blur-[100px]" />
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <p className="section-label">{t.projects.sectionLabel}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-all hover:bg-white/10 hover:border-white/20"
          >
            {t.projects.viewAll}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-card shadow-card-dark transition-all duration-300 hover:border-violet-500/20 hover:shadow-glow"
            >
              {/* Screenshot */}
              <div className="relative h-44 overflow-hidden">
                <MockScreenshot project={project} />
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 backdrop-blur-sm pointer-events-none">
                  <span className="text-xs font-bold text-white">
                    {project.metricValue}
                  </span>
                  <span className="text-[9px] text-white/60">
                    {project.metricLabel}
                  </span>
                </div>
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-1 backdrop-blur-sm pointer-events-none">
                  <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-medium text-white/80">
                    {project.stars}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-[15px] leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-pill text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all hover:text-foreground hover:border-white/20"
                      aria-label="GitHub"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </motion.a>
                    <motion.a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all hover:text-foreground hover:border-white/20"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </motion.a>
                  </div>
                  <motion.button
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-1 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
                  >
                    {t.projects.viewProject}
                    <ArrowUpRight className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>

              {/* Hover gradient */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  project.gradient,
                )}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
