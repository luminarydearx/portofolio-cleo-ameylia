"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const speed = 0.08;
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * speed;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * speed;

      if (cursor) {
        cursor.style.transform = `translate(${currentRef.current.x - 200}px, ${currentRef.current.y - 200}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[400px] w-[400px] rounded-full opacity-[0.04] dark:opacity-[0.06]"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,1) 0%, transparent 70%)",
        filter: "blur(0px)",
      }}
    />
  );
}
