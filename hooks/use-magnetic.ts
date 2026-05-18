"use client";

import { useRef, useEffect, useCallback } from "react";

interface MagneticOptions {
  strength?: number;
  ease?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLElement>({
  strength = 40,
  ease = 0.1,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null);
  const bounds = useRef<DOMRect | null>(null);
  const animationRef = useRef<number | null>(null);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  const animate = useCallback(() => {
    currentX.current += (targetX.current - currentX.current) * ease;
    currentY.current += (targetY.current - currentY.current) * ease;

    if (ref.current) {
      ref.current.style.transform = `translate(${currentX.current}px, ${currentY.current}px)`;
    }

    if (
      Math.abs(targetX.current - currentX.current) > 0.1 ||
      Math.abs(targetY.current - currentY.current) > 0.1
    ) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [ease]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseEnter = () => {
      bounds.current = el.getBoundingClientRect();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds.current) return;
      const centerX = bounds.current.left + bounds.current.width / 2;
      const centerY = bounds.current.top + bounds.current.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      targetX.current = (deltaX / bounds.current.width) * strength;
      targetY.current = (deltaY / bounds.current.height) * strength;

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      targetX.current = 0;
      targetY.current = 0;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(animate);
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [strength, animate]);

  return ref;
}
