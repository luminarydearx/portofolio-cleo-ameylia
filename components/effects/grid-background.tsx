"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function GridBackground({ className, children }: GridBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 dark:bg-grid-pattern bg-grid-pattern-light bg-grid opacity-100"
        style={{ maskImage: "radial-gradient(ellipse at center, black, transparent 80%)" }}
      />
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      {children}
    </div>
  );
}

export function DotBackground({ className, children }: GridBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }}
      />
      {children}
    </div>
  );
}
