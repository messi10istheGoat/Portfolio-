"use client";

import { useEffect, useRef } from "react";

type CursorState = "default" | "hover" | "label";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const stateRef = useRef<CursorState>("default");

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.body.classList.add("no-cursor");

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let dotX = pointerX;
    let dotY = pointerY;
    let visible = false;
    let frame = 0;

    const setState = (next: CursorState, text = "") => {
      if (stateRef.current === next && label.textContent === text) return;
      stateRef.current = next;
      label.textContent = text;

      if (next === "label") {
        ring.style.width = "82px";
        ring.style.height = "82px";
        ring.style.backgroundColor = "rgba(8,9,12,0.82)";
        ring.style.borderColor = "rgba(255,255,255,0.5)";
        label.style.opacity = "1";
        dot.style.opacity = "0";
      } else if (next === "hover") {
        ring.style.width = "52px";
        ring.style.height = "52px";
        ring.style.backgroundColor = "rgba(255,255,255,0.06)";
        ring.style.borderColor = "rgba(255,255,255,0.55)";
        label.style.opacity = "0";
        dot.style.opacity = "1";
      } else {
        ring.style.width = "30px";
        ring.style.height = "30px";
        ring.style.backgroundColor = "transparent";
        ring.style.borderColor = "rgba(244,244,245,0.38)";
        label.style.opacity = "0";
        dot.style.opacity = "1";
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
        visible = false;
        return;
      }
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest<HTMLElement>(
        "a, button, input, textarea, select, [role='button'], [data-magnetic]",
      );

      if (labelled?.dataset.cursor) {
        setState("label", labelled.dataset.cursor.toUpperCase());
      } else if (interactive) {
        setState("hover");
      } else {
        setState("default");
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onDown = () => {
      ring.style.transform += " scale(0.86)";
    };

    const render = () => {
      dotX += (pointerX - dotX) * 0.55;
      dotY += (pointerY - dotY) * 0.55;
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      document.body.classList.remove("no-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-[30px] w-[30px] items-center justify-center rounded-full border opacity-0 backdrop-blur-[2px] transition-[width,height,background-color,border-color,opacity] duration-300 ease-out"
        style={{ willChange: "transform", borderColor: "rgba(244,244,245,0.38)" }}
      >
        <span
          ref={labelRef}
          className="mono-sm text-[8px] font-bold tracking-[0.14em] text-bone opacity-0 transition-opacity duration-200"
        />
      </div>
    </div>
  );
}
