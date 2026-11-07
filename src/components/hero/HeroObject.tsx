"use client";

import { useMotionValue, useReducedMotion, useSpring, useTransform, motion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

/**
 * Hero centerpiece — a layered glass/metal structure built entirely from CSS
 * gradients and SVG geometry. Reacts to pointer movement with two depth planes.
 */
export function HeroObject() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Unique per instance so the SVG gradient is never shared by accident.
  const ringGradientId = `ring-grad-${useId().replace(/[:]/g, "")}`;
  const reduced = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), {
    stiffness: 90,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), {
    stiffness: 90,
    damping: 20,
  });
  const shiftFarX = useSpring(useTransform(px, [-0.5, 0.5], [22, -22]), {
    stiffness: 60,
    damping: 22,
  });
  const shiftFarY = useSpring(useTransform(py, [-0.5, 0.5], [16, -16]), {
    stiffness: 60,
    damping: 22,
  });
  const shiftNearX = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), {
    stiffness: 110,
    damping: 18,
  });
  const shiftNearY = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), {
    stiffness: 110,
    damping: 18,
  });

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      px.set(Math.max(-0.5, Math.min(0.5, x * 0.5)));
      py.set(Math.max(-0.5, Math.min(0.5, y * 0.5)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-[5/6] w-full max-w-[520px] select-none lg:max-w-none"
      aria-hidden
    >
      {/* structural frame */}
      <div className="absolute inset-0 border border-white/10" />
      <div className="absolute inset-x-0 top-0 flex justify-between">
        <span className="mono-sm -mt-2 bg-ink pr-2 text-[8px] text-fog">OBJ / 001</span>
        <span className="mono-sm -mt-2 bg-ink pl-2 text-[8px] text-fog">LIVE_RENDER</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between">
        <span className="mono-sm -mb-2 bg-ink pr-2 text-[8px] text-fog">GLASS × CHROME</span>
        <span className="mono-sm -mb-2 bg-ink pl-2 text-[8px] text-accent">● ACTIVE</span>
      </div>
      <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-accent/70" />
      <span className="absolute -right-px -top-px h-3 w-3 border-r border-t border-accent/70" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b border-l border-accent/70" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-accent/70" />

      {/* ambient light */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="radial-bleed absolute inset-0 opacity-90" />
        <div className="grid-field-sm absolute inset-0 opacity-40" />
        <div className="noise-layer absolute inset-0" />
      </div>

      <div
        className="absolute inset-0 grid place-items-center"
        style={{ perspective: "1200px", perspectiveOrigin: "50% 45%" }}
      >
        {/* orbit rings */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          style={{ x: shiftFarX, y: shiftFarY }}
        >
          <svg viewBox="0 0 400 400" className="h-[92%] w-[92%] opacity-60">
            <defs>
              <linearGradient id={ringGradientId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(var(--accent-rgb),0.5)" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="152" fill="none" stroke={`url(#${ringGradientId})`} strokeWidth="0.75" />
            <circle
              cx="200"
              cy="200"
              r="118"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.75"
              strokeDasharray="2 6"
            />
            <line x1="200" y1="18" x2="200" y2="58" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
            <line x1="200" y1="342" x2="200" y2="382" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
            <line x1="18" y1="200" x2="58" y2="200" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
            <line x1="342" y1="200" x2="382" y2="200" stroke="rgba(255,255,255,0.22)" strokeWidth="0.75" />
          </svg>
        </motion.div>

        <motion.div
          className="relative h-[74%] w-[76%]"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", x: shiftFarX, y: shiftFarY }}
        >
          {/* chrome sphere */}
          <div
            className="absolute right-[4%] top-[6%] h-[42%] w-[42%] overflow-hidden rounded-full"
            style={{
              transform: "translateZ(60px)",
              background:
                "radial-gradient(circle at 32% 24%, #f7f8fb 0%, #b9c0cc 16%, #666f7e 44%, #23272f 72%, #101216 100%)",
              boxShadow:
                "inset -18px -24px 48px rgba(0,0,0,0.85), inset 12px 12px 32px rgba(255,255,255,0.25), 0 40px 80px -30px rgba(0,0,0,0.9), 0 0 60px rgba(var(--accent-rgb),0.16)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 68% 78%, rgba(var(--accent-rgb),0.45) 0%, transparent 52%)",
                mixBlendMode: "screen",
              }}
            />
            <div className="absolute left-[18%] top-[12%] h-[20%] w-[28%] rounded-full bg-white/60 blur-[6px]" />
            <div className="scan-line absolute inset-0 rounded-full opacity-40" />
          </div>

          {/* glass monolith */}
          <div
            className="absolute bottom-[8%] left-[6%] h-[66%] w-[52%]"
            style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
          >
            <div className="absolute inset-0 border border-white/25 bg-gradient-to-br from-white/[0.14] via-white/[0.04] to-transparent backdrop-blur-md" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/20 px-2.5 py-1.5">
              <span className="mono-sm text-[7px] text-white/80">STRUCTURE</span>
              <span className="mono-sm text-[7px] text-accent">01</span>
            </div>
            <div className="absolute inset-x-0 top-[12%] h-px bg-white/15" />
            <div className="absolute inset-x-0 top-[46%] h-px bg-white/10" />
            <div className="absolute inset-y-0 left-[38%] w-px bg-white/10" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-2.5">
              <div className="space-y-1">
                <div className="h-1 w-12 bg-white/35" />
                <div className="h-1 w-8 bg-white/20" />
                <div className="h-1 w-14 bg-accent/60" />
              </div>
              <span className="mono-sm text-[7px] text-white/60">03–09</span>
            </div>
            <div className="sheen absolute inset-0" />
          </div>

          {/* floating glass plate */}
          <div
            className="absolute bottom-[16%] right-[2%] w-[46%] border border-white/20 bg-gradient-to-b from-white/[0.11] to-white/[0.02] p-3 backdrop-blur-md"
            style={{ transform: "translateZ(90px)" }}
          >
            <div className="flex items-center justify-between">
              <span className="mono-sm text-[7px] text-white/70">DEPLOYS / 7D</span>
              <span className="mono-sm text-[7px] text-lime">↑ 18%</span>
            </div>
            <div className="mt-2.5 flex h-12 items-end gap-[3px]">
              {[32, 48, 38, 66, 52, 78, 94, 62, 88, 70, 96, 100].map((height, index) => (
                <span
                  key={index}
                  className="flex-1 origin-bottom"
                  style={{
                    height: `${height}%`,
                    background:
                      index > 8 ? "var(--accent)" : "rgba(255,255,255,0.22)",
                    animation: reduced ? undefined : `bar-rise 1.4s ${index * 0.05 + 0.6}s cubic-bezier(0.16,1,0.3,1) both`,
                  }}
                />
              ))}
            </div>
            <div className="mono-sm mt-2 flex justify-between text-[6px] text-white/40">
              <span>MON</span>
              <span>SUN</span>
            </div>
          </div>

          {/* small chip */}
          <div
            className="absolute left-[2%] top-[26%] flex items-center gap-1.5 border border-white/20 bg-black/45 px-2 py-1.5 backdrop-blur-md"
            style={{ transform: "translateZ(110px)" }}
          >
            <span className="h-1 w-1 rounded-full bg-lime" />
            <span className="mono-sm text-[7px] text-white/80">99.98% UPTIME</span>
          </div>

          {/* wireframe cube */}
          <svg
            viewBox="0 0 100 100"
            className="absolute bottom-[4%] right-[22%] h-[22%] w-[22%] opacity-70"
            style={{ transform: "translateZ(40px)" }}
          >
            <path
              d="M20 30 L50 14 L80 30 L80 66 L50 82 L20 66 Z M20 30 L50 46 L80 30 M50 46 L50 82"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity="0.85"
            />
          </svg>
        </motion.div>
      </div>

      {/* near depth layer: labels */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ x: shiftNearX, y: shiftNearY }}
      >
        <div className="absolute right-2 top-[14%] border border-white/15 bg-[rgba(8,9,12,0.6)] px-2 py-1.5 backdrop-blur-sm">
          <span className="mono-sm block text-[7px] text-white/50">X / Y</span>
          <span className="mono-sm block text-[8px] text-bone">23.81°N 90.41°E</span>
        </div>
        <div className="float-slow absolute bottom-[28%] left-0 border-l border-accent/60 pl-2">
          <span className="mono-sm block text-[7px] text-fog">BUILD STATUS</span>
          <span className="mono-sm block text-[8px] text-bone">COMPILED ✓</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes bar-rise { from { transform: scaleY(0.05); opacity: 0 } to { transform: scaleY(1); opacity: 1 } }
        @media (prefers-reduced-motion: reduce) { .float-slow { animation: none } }
      `}</style>
    </div>
  );
}
