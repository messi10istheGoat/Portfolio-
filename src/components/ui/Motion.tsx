"use client";

import { motion, useReducedMotion, useScroll, useSpring, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.07,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp} transition={{ duration: 0.65, ease: EASE }}>
      {children}
    </motion.div>
  );
}

/** Masked, line-by-line display heading reveal. */
export function SplitLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as: Tag = "h1",
  animateOnLoad = false,
  id,
}: {
  lines: readonly string[];
  id?: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  animateOnLoad?: boolean;
}) {
  const reduced = useReducedMotion();
  const animationProps = animateOnLoad
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.35 } };

  return (
    <Tag id={id} className={cn("display", className)}>
      <motion.span
        className="block"
        initial={reduced ? false : "hidden"}
        {...animationProps}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {lines.map((line) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className={cn("block will-change-transform", lineClassName)}
              variants={{
                hidden: { y: "112%" },
                visible: { y: "0%" },
              }}
              transition={{ duration: 0.95, ease: EASE }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

export function SectionHeading({
  index,
  code,
  title,
  className,
  align = "left",
  id,
}: {
  index: string;
  code: string;
  title: readonly string[];
  className?: string;
  align?: "left" | "right";
  id?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "mb-6 flex flex-wrap items-center gap-3 sm:gap-5",
          align === "right" && "justify-end text-right",
        )}
      >
        <span className="mono border border-line px-2.5 py-1.5 text-bone">{index}</span>
        <span className="mono text-accent">/ {code}</span>
        <span className="hidden h-px w-16 bg-line sm:block" aria-hidden />
      </div>
      <SplitLines
        as="h2"
        id={id}
        lines={title}
        className={cn(
          "text-[clamp(2.6rem,8.4vw,7.4rem)]",
          align === "right" && "text-right",
        )}
      />
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent opacity-90"
      style={{ scaleX }}
    />
  );
}
