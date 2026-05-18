"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[999] h-0.5 w-full origin-left bg-gradient-to-r from-violet-600 via-purple-500 to-blue-500"
      style={{ scaleX }}
    />
  );
}
