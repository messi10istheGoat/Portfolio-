"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ProjectPreview } from "@/data/projects";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { cn } from "@/lib/utils";

export function CaseVisual({
  kind,
  accent,
  className,
  ratio = "aspect-[16/10]",
  strength = 60,
  caption,
}: {
  kind: ProjectPreview;
  accent: string;
  className?: string;
  ratio?: string;
  strength?: number;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <figure className={cn("group relative", className)}>
      <div className="relative overflow-hidden border border-white/12 bg-[#0a0c10]">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="font-mono text-[13px] text-fog">Product surface</span>
          
        </div>
        <div className={cn("relative overflow-hidden", ratio)}>
          <motion.div
            className="absolute inset-0 h-[118%] w-full"
            style={{ y: reduced ? 0 : y }}
          >
            <ProjectVisual kind={kind} accent={accent} />
          </motion.div>
          <span className="pointer-events-none absolute inset-0 border border-white/5" />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 flex items-start gap-2 font-sans text-[14px] leading-relaxed text-fog">
          <span className="text-accent">↳</span>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
