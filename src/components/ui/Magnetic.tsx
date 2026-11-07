"use client";

import { useCallback, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Magnetic wrapper — subtle attraction toward the pointer, disabled for
 * coarse pointers and when reduced motion is requested.
 */
export function Magnetic({
  children,
  className,
  strength = 12,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const handleMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength * 2;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setOffset({ x, y }));
    },
    [strength],
  );

  return (
    <div
      ref={ref}
      className={cn("inline-flex will-change-transform", className)}
      onPointerMove={handleMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`,
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}
