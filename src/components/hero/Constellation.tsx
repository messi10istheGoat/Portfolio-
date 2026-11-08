"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Constellation — the hero's interactive node field.
 *
 * A canvas of drifting nodes that draw a line to any neighbour within reach.
 * The pointer is a live attractor: connections reach toward it, nearby nodes
 * brighten and pull, and clicking sends a shockwave through the mesh that
 * briefly breaks and reforms the lattice.
 *
 * Deliberate constraints:
 *  - Nodes are seeded in normalised space and multiplied by the live canvas
 *    size, so a resize re-flows the field instead of restarting it.
 *  - Density and link distance scale with area, so a phone gets a field of the
 *    same character rather than the same node count crammed together.
 *  - It runs on requestAnimationFrame with early exits when off-screen or when
 *    the tab is hidden, and it renders one static frame (no rAF loop at all)
 *    when the visitor prefers reduced motion.
 *  - Colours are read from CSS custom properties on each theme change, so the
 *    field inverts with the rest of the site.
 */

type Node = {
  /** Home position, normalised 0..1. */
  hx: number;
  hy: number;
  /** Current position, normalised (offset by spring physics). */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Drift phase offsets so nodes do not move in lockstep. */
  phase: number;
  speed: number;
  radius: number;
  depth: number;
};

type Palette = {
  line: [number, number, number];
  dot: [number, number, number];
  accent: [number, number, number];
};

const LINE_ALPHA = 0.9;
const MAX_LINK_DISTANCE = 148;
const POINTER_REACH = 210;
const MAX_LINKS_PER_NODE = 4;

function hexToRgb(value: string): [number, number, number] {
  const hex = value.trim().replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int)) return [128, 128, 128];
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function readPalette(element: HTMLElement): Palette {
  const styles = getComputedStyle(element);
  const accent = hexToRgb(styles.getPropertyValue("--accent") || "#668cff");
  // `--bone` is the foreground token: near-white in dark mode, near-black in
  // light. Reading the resolved value rather than hardcoding keeps the field
  // legible in both themes.
  const ink = hexToRgb(styles.getPropertyValue("--bone") || "#f4f4f5");
  return {
    line: ink,
    dot: ink,
    accent,
  };
}

export function Constellation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const wrapEl = wrapRef.current;
    if (!canvasEl || !wrapEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;

    // Bind non-null locals: closures below are defined after this guard, so
    // narrowing on `canvasEl`/`context` would otherwise be lost inside them.
    const canvas: HTMLCanvasElement = canvasEl;
    const wrap: HTMLElement = wrapEl;
    const ctx: CanvasRenderingContext2D = context;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let palette = readPalette(wrap);
    let frame = 0;
    let visible = true;
    let lastTime = performance.now();
    // Bounding rect is cached and refreshed on resize/scroll rather than read
    // on every pointermove: getBoundingClientRect() forces layout, and this
    // listener fires at pointer rate across the whole window.
    let bounds = canvas.getBoundingClientRect();

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
      /** 0..1, decays after a tap; drives the shockwave. */
      pulse: 0,
    };

    /* ---------------------------------------------------------------- */
    /* Seeding                                                          */
    /* ---------------------------------------------------------------- */

    function seed() {
      // ~1 node per 9,000px², clamped so neither a phone nor a 4K panel gets
      // an absurd field.
      const target = Math.round((width * height) / 9000);
      const count = Math.max(28, Math.min(96, target));
      const random = mulberry32(0x5eed + count);

      nodes = Array.from({ length: count }, () => {
        const hx = random();
        const hy = random();
        return {
          hx,
          hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          phase: random() * Math.PI * 2,
          speed: 0.35 + random() * 0.9,
          radius: 0.9 + random() * 1.5,
          depth: 0.35 + random() * 0.65,
        };
      });
    }

    /** Small deterministic PRNG so the field is stable between renders. */
    function mulberry32(a: number) {
      return function next() {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    /* ---------------------------------------------------------------- */
    /* Sizing                                                           */
    /* ---------------------------------------------------------------- */

    function resize() {
      const rect = wrap.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      bounds = canvas.getBoundingClientRect();
      if (reduced) draw();
    }

    /* ---------------------------------------------------------------- */
    /* Physics + paint                                                  */
    /* ---------------------------------------------------------------- */

    function step(dt: number, time: number) {
      const pointerX = pointer.x;
      const pointerY = pointer.y;

      for (const node of nodes) {
        // Idle drift: a slow lissajous wander around the home position.
        const t = time * 0.0012 * node.speed + node.phase;
        const driftX = Math.cos(t) * 0.012;
        const driftY = Math.sin(t * 0.8) * 0.012;

        let targetX = node.hx + driftX;
        let targetY = node.hy + driftY;

        if (pointer.active) {
          const nx = node.x * width;
          const ny = node.y * height;
          const dx = pointerX - nx;
          const dy = pointerY - ny;
          const distance = Math.hypot(dx, dy) || 1;

          if (distance < POINTER_REACH) {
            // Pull toward the cursor, strongest at the centre. Eased so nodes
            // do not snap onto the pointer.
            const pull = (1 - distance / POINTER_REACH) ** 2 * node.depth;
            targetX += (dx / distance) * pull * 0.16;
            targetY += (dy / distance) * pull * 0.16;

            // Shockwave: push outward while the pulse decays.
            if (pointer.pulse > 0.01) {
              const shove = pointer.pulse * (1 - distance / POINTER_REACH);
              targetX -= (dx / distance) * shove * 0.22;
              targetY -= (dy / distance) * shove * 0.22;
            }
          }
        }

        // Critically-damped spring toward the target, frame-rate independent.
        const stiffness = 26;
        const damping = 7.4;
        const ax = (targetX - node.x) * stiffness - node.vx * damping;
        const ay = (targetY - node.y) * stiffness - node.vy * damping;
        node.vx += ax * dt;
        node.vy += ay * dt;
        node.x += node.vx * dt;
        node.y += node.vy * dt;
      }

      pointer.pulse = Math.max(0, pointer.pulse - dt * 1.7);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const [lr, lg, lb] = palette.line;
      const [dr, dg, db] = palette.dot;
      const [ar, ag, ab] = palette.accent;
      const isLight = document.documentElement.dataset.theme === "light";
      // Ink hairlines need more alpha than light ones to survive on paper.
      const lineBase = isLight ? 0.5 : 0.34;

      // Links first so dots sit on top of them.
      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        const ax = a.x * width;
        const ay = a.y * height;

        let links = 0;
        for (let j = i + 1; j < nodes.length && links < MAX_LINKS_PER_NODE; j += 1) {
          const b = nodes[j];
          const bx = b.x * width;
          const by = b.y * height;
          const distance = Math.hypot(bx - ax, by - ay);
          if (distance > MAX_LINK_DISTANCE) continue;
          links += 1;

          const proximity = 1 - distance / MAX_LINK_DISTANCE;
          const depth = (a.depth + b.depth) * 0.5;
          let alpha = proximity * depth * lineBase;

          // Near the pointer, lines warm toward the accent colour.
          let r = lr;
          let g = lg;
          let bl = lb;
          let accentMix = 0;
          if (pointer.active) {
            const midX = (ax + bx) * 0.5;
            const midY = (ay + by) * 0.5;
            const pointerDistance = Math.hypot(pointer.x - midX, pointer.y - midY);
            if (pointerDistance < POINTER_REACH) {
              accentMix = (1 - pointerDistance / POINTER_REACH) ** 1.5;
              alpha += accentMix * 0.5;
            }
          }
          if (accentMix > 0) {
            r = lr + (ar - lr) * accentMix;
            g = lg + (ag - lg) * accentMix;
            bl = lb + (ab - lb) * accentMix;
          }

          ctx.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${bl | 0}, ${Math.min(alpha, 0.92)})`;
          ctx.lineWidth = 0.5 + proximity * 0.7;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      // Node dots.
      for (const node of nodes) {
        const x = node.x * width;
        const y = node.y * height;
        let radius = node.radius * (0.7 + node.depth * 0.7);
        let accentMix = 0;

        if (pointer.active) {
          const distance = Math.hypot(pointer.x - x, pointer.y - y);
          if (distance < POINTER_REACH) {
            accentMix = (1 - distance / POINTER_REACH) ** 1.4;
            radius += accentMix * 1.6;
          }
        }

        const r = dr + (ar - dr) * accentMix;
        const g = dg + (ag - dg) * accentMix;
        const b = db + (ab - db) * accentMix;
        const alpha = Math.min((0.35 + node.depth * 0.5 + accentMix * 0.6) * (isLight ? 1.5 : 1.25), 1);

        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* ---------------------------------------------------------------- */
    /* Loop                                                             */
    /* ---------------------------------------------------------------- */

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      // Clamp dt so a backgrounded tab does not explode the spring on return.
      const dt = Math.min((now - lastTime) / 1000, 1 / 20);
      lastTime = now;
      step(dt, now);
      draw();
    }

    /* ---------------------------------------------------------------- */
    /* Events                                                           */
    /* ---------------------------------------------------------------- */

    const refreshBounds = () => {
      bounds = canvas.getBoundingClientRect();
    };

    const trackPointer = (event: PointerEvent) => {
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      return (
        pointer.x > -POINTER_REACH &&
        pointer.y > -POINTER_REACH &&
        pointer.x < width + POINTER_REACH &&
        pointer.y < height + POINTER_REACH
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.active = trackPointer(event);
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    // Bound to the window so tapping the sculpture in front of the canvas still
    // sends a wave through the mesh underneath it, but gated on the press
    // landing inside the field: clicking a link in another section must not
    // ripple the hero.
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" && !pointer.active) {
        // First touch only positions the pointer; a second tap fires the wave.
        // Without this a scroll gesture would pulse on every touchstart.
        trackPointer(event);
        pointer.pulse = 0;
        return;
      }
      if (!trackPointer(event)) {
        pointer.active = false;
        return;
      }
      pointer.active = true;
      pointer.pulse = 1;
    };

    const onScroll = () => refreshBounds();

    const onVisibility = () => {
      visible = !document.hidden;
      lastTime = performance.now();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        lastTime = performance.now();
      },
      { threshold: 0 },
    );
    observer.observe(wrap);

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(wrap);

    // Re-read theme colours when the data-theme attribute flips.
    const themeObserver = new MutationObserver(() => {
      palette = readPalette(wrap);
      if (reduced) draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-accent"],
    });

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    resize();

    if (!reduced) {
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="block h-full w-full touch-none"
      />
    </div>
  );
}
