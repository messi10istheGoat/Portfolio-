import { useId, type CSSProperties } from "react";
import type { ProjectPreview } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Hand-built interface mockups. No raster assets: every project preview is
 * composed from CSS gradients, SVG paths and typography so it stays sharp,
 * on-brand and weightless.
 */
export function ProjectVisual({
  kind,
  accent,
  className,
  compact = false,
}: {
  kind: ProjectPreview;
  accent: string;
  className?: string;
  compact?: boolean;
}) {
  const style = { "--pv-accent": accent } as CSSProperties;

  return (
    <div
      className={cn(
        "relative isolate h-full w-full overflow-hidden bg-[#0a0c10] text-bone",
        className,
      )}
      style={style}
      aria-hidden
    >
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
        </span>
        <div className="mx-2 flex h-4 flex-1 items-center border border-white/10 bg-black/30 px-2">
          <span className="mono-sm text-[6px] tracking-[0.14em] text-white/35">
            {kind === "dashboard"
              ? "budget-tracker.app/budget"
              : kind === "ai"
                ? "user-directory.app/users"
                : kind === "commerce"
                  ? "fresh-mart.app/catalogue"
                  : kind === "terminal"
                    ? "sylhet-live — routemap"
                    : kind === "observability"
                      ? "user-directory.app/users/01"
                      : "chronoclock.app/dashboard"}
          </span>
        </div>
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
      </div>

      <div className="relative h-[calc(100%-33px)] p-3 sm:p-4">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: accent }}
        />

        {kind === "dashboard" && <DashboardPreview compact={compact} />}
        {kind === "ai" && <AiPreview compact={compact} />}
        {kind === "commerce" && <CommercePreview compact={compact} />}
        {kind === "terminal" && <TerminalPreview compact={compact} />}
        {kind === "observability" && <ObservabilityPreview compact={compact} />}
        {kind === "type" && <TypePreview compact={compact} />}
      </div>

      <div className="sheen" />
    </div>
  );
}

function DashboardPreview({ compact }: { compact: boolean }) {
  const bars = [38, 62, 45, 72, 58, 84, 66, 94, 78, 88, 70, 96];
  // Every card renders its own dashboard, so gradient ids must be unique or
  // the first definition wins and later cards inherit the wrong fill.
  const gradientId = `area-grad-${useId().replace(/[:]/g, "")}`;
  return (
    <div className="grid h-full grid-cols-[52px_1fr] gap-2 sm:grid-cols-[64px_1fr]">
      <div className="hidden flex-col justify-between border border-white/10 bg-white/[0.02] p-2 sm:flex">
        <div className="space-y-2">
          <div className="h-4 w-4 border border-white/25" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={cn("h-1.5", i === 0 ? "bg-white/50" : "bg-white/15")} style={{ width: i === 0 ? "80%" : "60%" }} />
          ))}
        </div>
        <div className="h-6 w-full" style={{ backgroundColor: "color-mix(in srgb, var(--pv-accent) 20%, transparent)" }} />
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="mono-sm text-[6px] text-white/40">REMAINING BALANCE</p>
            <p className={cn("font-display font-semibold tracking-tight", compact ? "text-lg" : "text-xl sm:text-2xl")}>
              ৳28,400<span className="text-white/30">.00</span>
            </p>
          </div>
          <span className="mono-sm border border-white/15 px-1.5 py-0.5 text-[6px] text-white/50">THIS MONTH</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "INCOME", value: "৳42,000", color: "var(--pv-accent)" },
            { label: "EXPENSES", value: "−৳13,000", color: "#ffffff" },
            { label: "EST. TAX", value: "৳4,200", color: "var(--pv-accent)" },
          ].map((metric) => (
            <div key={metric.label} className="border border-white/10 bg-white/[0.03] p-1.5">
              <p className="mono-sm text-[5px] tracking-[0.1em] text-white/35">{metric.label}</p>
              <p className="mt-0.5 font-mono text-[8px] font-medium" style={{ color: metric.color }}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
        <div className="relative flex-1 border border-white/10 bg-white/[0.02] p-2">
          <div className="flex items-center justify-between">
            <p className="mono-sm text-[6px] text-white/40">EXPENSE SHARE</p>
            <span className="mono-sm text-[6px]" style={{ color: "var(--pv-accent)" }}>
              ● LIVE
            </span>
          </div>
          <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="mt-1 h-[calc(100%-24px)] w-full">
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--pv-accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--pv-accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 48 L18 40 L34 44 L52 28 L70 34 L88 18 L106 24 L124 12 L142 20 L160 8 L180 16 L200 6 L200 60 L0 60 Z" fill={`url(#${gradientId})`} />
            <path
              d="M0 48 L18 40 L34 44 L52 28 L70 34 L88 18 L106 24 L124 12 L142 20 L160 8 L180 16 L200 6"
              fill="none"
              stroke="var(--pv-accent)"
              strokeWidth="1.2"
            />
          </svg>
          <div className="absolute inset-x-2 bottom-1.5 flex gap-0.5 opacity-60">
            {bars.map((height, index) => (
              <span key={index} className="flex-1 bg-white/15" style={{ height: `${height / 8}px` }} />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {[
            { name: "Studio rent", cat: "HOUSING", value: "−$1,200" },
            { name: "Figma annual", cat: "TOOLS", value: "−$144" },
          ].map((row) => (
            <div key={row.name} className="flex items-center justify-between border-b border-white/8 pb-1">
              <span className="font-mono text-[7px] text-white/65">{row.name}</span>
              <span className="mono-sm text-[6px] text-white/30">{row.cat}</span>
              <span className="font-mono text-[7px] text-white/80">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AiPreview({ compact }: { compact: boolean }) {
  return (
    <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[1fr_0.62fr]">
      <div className="flex min-w-0 flex-col border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5">
          <span className="mono-sm text-[6px] text-white/45">RESEARCH THREAD</span>
          <span className="mono-sm text-[6px]" style={{ color: "var(--pv-accent)" }}>● STREAMING</span>
        </div>
        <div className="flex-1 space-y-2 p-2">
          <div className="ml-auto max-w-[82%] border border-white/10 bg-white/[0.05] px-2 py-1.5">
            <p className="font-mono text-[7px] leading-relaxed text-white/70">
              How does retrieval change answer quality in long-context models?
            </p>
          </div>
          <div className="max-w-[94%] space-y-1.5">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 border" style={{ borderColor: "var(--pv-accent)" }} />
              <span className="mono-sm text-[6px]" style={{ color: "var(--pv-accent)" }}>
                SYNTH
              </span>
            </div>
            <div className="space-y-1">
              {[100, 92, 96, 68, 88, 54].map((width, index) => (
                <div
                  key={index}
                  className="h-1 rounded-full bg-white/20"
                  style={{ width: `${width}%`, opacity: index === 5 ? 0.5 : 1 }}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              {["01", "02", "03"].map((cite) => (
                <span
                  key={cite}
                  className="mono-sm border px-1 py-0.5 text-[6px]"
                  style={{ borderColor: "color-mix(in srgb, var(--pv-accent) 45%, transparent)", color: "var(--pv-accent)" }}
                >
                  [{cite}]
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="m-2 flex items-center justify-between border border-white/15 px-2 py-1.5">
          <span className="mono-sm text-[6px] text-white/30">ASK A FOLLOW-UP…</span>
          <span className="mono-sm text-[6px]" style={{ background: "var(--pv-accent)", color: "#08090c", padding: "1px 4px" }}>
            ↵
          </span>
        </div>
      </div>
      <div className="hidden flex-col gap-2 sm:flex">
        <div className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-2 py-1.5">
          <span className="mono-sm text-[6px] text-white/45">NOTEBOOK</span>
          <span className="mono-sm text-[6px]" style={{ color: "var(--pv-accent)" }}>
            12
          </span>
        </div>
        {[
          { title: "Retrieval improves factuality", source: "p. 14" },
          { title: "Long context ≠ better recall", source: "p. 22" },
          { title: "Citation density matters", source: "p. 31" },
        ].map((note) => (
          <div key={note.title} className="border border-white/10 bg-white/[0.02] p-2">
            <p className="font-mono text-[7px] leading-snug text-white/70">{note.title}</p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="mono-sm text-[5px] text-white/25">SOURCE {note.source}</span>
              <span className="h-1 w-1" style={{ backgroundColor: "var(--pv-accent)" }} />
            </div>
          </div>
        ))}
        <div className={cn("flex-1 border border-dashed border-white/15 p-2", compact && "hidden")}>
          <p className="mono-sm text-[5px] leading-relaxed text-white/25">
            3 SOURCES INDEXED
            <br />
            VECTOR + KEYWORD
          </p>
          <div className="mt-2 space-y-1">
            {[70, 45, 88].map((width, index) => (
              <div key={index} className="h-1 bg-white/12" style={{ width: `${width}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommercePreview({ compact }: { compact: boolean }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="font-display text-[9px] font-bold uppercase tracking-[0.05em]">FRESH MART</span>
        <div className="flex items-center gap-2">
          {["সবজি", "মাছ", "মুদি"].map((item) => (
            <span key={item} className="mono-sm text-[5px] text-white/35">
              {item}
            </span>
          ))}
          <span className="mono-sm border border-white/20 px-1 py-0.5 text-[5px] text-white/70">CART / 2</span>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        <div className="relative flex flex-col justify-end overflow-hidden border border-white/10 bg-white/[0.02] p-2">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 30%, color-mix(in srgb, var(--pv-accent) 30%, transparent), transparent 70%)",
            }}
          />
          <div className="absolute left-1/2 top-[22%] h-[46%] w-[46%] -translate-x-1/2 rounded-t-full border border-white/25 bg-gradient-to-b from-white/25 to-transparent" />
          <div className="absolute bottom-[26%] left-1/2 h-[9%] w-[54%] -translate-x-1/2 border border-white/20 bg-black/40" />
          <span className="mono-sm relative text-[5px]" style={{ color: "var(--pv-accent)" }}>
            ৳25% OFF
          </span>
          <p className="relative font-display text-[11px] font-bold uppercase leading-tight">
            DESHI
            <br />
            TOMATOES
          </p>
          <div className="relative mt-1 flex items-center justify-between">
            <span className="font-mono text-[7px] text-white/60">৳60 /kg</span>
            <span className="mono-sm text-[5px] text-white/30">1 KG</span>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-2">
          {[
            { name: "HILSA FISH", price: "৳1,250", variant: "PADMA" },
            { name: "MINIKET RICE", price: "৳68", variant: "5 KG" },
          ].map((product) => (
            <div key={product.name} className="flex flex-col justify-between border border-white/10 bg-white/[0.03] p-2">
              <div className="flex justify-between">
                <span className="mono-sm text-[5px] text-white/25">{product.variant}</span>
                <span className="h-1 w-1" style={{ backgroundColor: "var(--pv-accent)" }} />
              </div>
              <div>
                <p className="font-display text-[8px] font-semibold uppercase leading-tight">{product.name}</p>
                <p className="font-mono text-[7px] text-white/50">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!compact && (
        <div className="flex items-center justify-between border border-white/10 bg-black/40 px-2 py-1.5">
          <span className="mono-sm text-[6px] text-white/35">ঢাকা ডেলিভারি · ২ ঘণ্টায়</span>
          <span className="mono-sm text-[6px]" style={{ color: "var(--pv-accent)" }}>
            CHECKOUT ↗
          </span>
        </div>
      )}
    </div>
  );
}

function TerminalPreview({ compact }: { compact: boolean }) {
  const lines: { prefix: string; text: string; accent?: boolean }[] = [
    { prefix: "$", text: "relay capture GET /v1/orders --save order-list", accent: true },
    { prefix: "→", text: "200 OK · 142ms · 8.2 KB" },
    { prefix: "✓", text: "normalised payload · 14 keys sorted", accent: true },
    { prefix: "✓", text: "fixture → fixtures/orders/order-list.json" },
    { prefix: "$", text: "relay diff order-list~1 order-list", accent: true },
    { prefix: "~", text: "+ shipping.estimated_delivery" },
    { prefix: "−", text: "− shipping.eta" },
    { prefix: "$", text: "relay export --format ts --target tests", accent: true },
    { prefix: "✓", text: "wrote tests/fixtures/orderList.ts (stable keys)" },
  ];
  return (
    <div className="flex h-full flex-col border border-white/10 bg-black/35">
      <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5">
        <div className="flex gap-1">
          {["CAPTURE", "INSPECT", "EXPORT"].map((tab, index) => (
            <span
              key={tab}
              className="mono-sm px-1.5 py-0.5 text-[6px]"
              style={{
                color: index === 0 ? "#08090c" : "rgba(255,255,255,0.4)",
                backgroundColor: index === 0 ? "var(--pv-accent)" : "transparent",
              }}
            >
              {tab}
            </span>
          ))}
        </div>
        <span className="mono-sm text-[6px] text-white/30">local · no cloud</span>
      </div>
      <div className="flex-1 space-y-[3px] overflow-hidden p-2 font-mono text-[7px] leading-relaxed sm:text-[8px]">
        {lines.slice(0, compact ? 6 : lines.length).map((line, index) => (
          <p key={index} className="flex gap-1.5">
            <span style={{ color: line.accent ? "var(--pv-accent)" : "rgba(255,255,255,0.3)" }}>{line.prefix}</span>
            <span className={line.accent ? "text-white/90" : "text-white/55"}>{line.text}</span>
          </p>
        ))}
        <p className="flex items-center gap-1.5">
          <span style={{ color: "var(--pv-accent)" }}>$</span>
          <span className="inline-block h-2.5 w-1 animate-pulse" style={{ backgroundColor: "var(--pv-accent)" }} />
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-white/10 px-2 py-1">
        <span className="mono-sm text-[5px] text-white/30">9 COMMANDS · PORTABLE STORE</span>
        <span className="mono-sm text-[5px]" style={{ color: "var(--pv-accent)" }}>
          READY
        </span>
      </div>
    </div>
  );
}

function ObservabilityPreview({ compact }: { compact: boolean }) {
  const series = [
    [8, 14, 10, 18, 12, 22, 16, 24, 20, 26],
    [20, 12, 18, 10, 22, 14, 26, 18, 12, 8],
    [6, 8, 14, 10, 16, 12, 20, 16, 22, 18],
    [16, 20, 14, 24, 18, 26, 14, 10, 18, 12],
  ];
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="font-display text-[11px] font-semibold uppercase tracking-tight">USERS / DIRECTORY</p>
        <span className="mono-sm border px-1.5 py-0.5 text-[5px]" style={{ borderColor: "var(--pv-accent)", color: "var(--pv-accent)" }}>
          ● LOADED
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "USERS", value: "10", delta: "API" },
          { label: "FILTERED", value: "03", delta: "LIVE" },
          { label: "ERRORS", value: "0", delta: "CLEAN" },
        ].map((metric) => (
          <div key={metric.label} className="border border-white/10 bg-white/[0.03] p-1.5">
            <p className="mono-sm text-[5px] text-white/30">{metric.label}</p>
            <p className="mt-0.5 font-mono text-[9px] text-white/85">{metric.value}</p>
            <p className="mono-sm text-[5px]" style={{ color: "var(--pv-accent)" }}>
              {metric.delta}
            </p>
          </div>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-1.5">
        {series.slice(0, compact ? 2 : 4).map((points, index) => (
          <div key={index} className="border border-white/10 bg-white/[0.02] p-1.5">
            <div className="flex justify-between">
              <span className="mono-sm text-[5px] text-white/30">USER 0{index + 1}</span>
              <span className="mono-sm text-[5px]" style={{ color: index === 1 ? "var(--pv-accent)" : "rgba(255,255,255,0.3)" }}>
                {index === 1 ? "▲" : "●"}
              </span>
            </div>
            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="mt-1 h-[calc(100%-14px)] w-full">
              <polyline
                points={points.map((point, i) => `${(i / (points.length - 1)) * 100},${32 - point}`).join(" ")}
                fill="none"
                stroke={index === 1 ? "var(--pv-accent)" : "rgba(255,255,255,0.4)"}
                strokeWidth="1.1"
              />
            </svg>
          </div>
        ))}
      </div>
      {!compact && (
        <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
          <span className="mono-sm text-[5px] text-white/25">JSONPLACEHOLDER · REST</span>
          <span className="mono-sm text-[5px] text-white/40">RETRY AVAILABLE</span>
        </div>
      )}
    </div>
  );
}

function TypePreview({ compact }: { compact: boolean }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden border border-white/10 bg-[#08090c] p-3">
      <div className="grid-field-sm absolute inset-0 opacity-50" />
      <div className="relative flex items-center justify-between">
        <span className="mono-sm text-[6px] text-white/35">CHRONOCLOCK / TTY 01</span>
        <span className="mono-sm text-[6px] text-white/35">24H — LIGHT OFF</span>
      </div>
      <div className="relative -mx-1 select-none py-1">
        {["14", "32", "08"].map((part, index) => (
          <p
            key={part}
            className={cn(
              "display flex items-baseline gap-2 whitespace-nowrap leading-[0.8]",
              compact ? "text-[9vw]" : "text-[clamp(1.8rem,6vw,3.4rem)] sm:text-[clamp(2rem,5vw,4rem)]",
              index === 1 ? "text-outline-accent" : "text-bone",
            )}
            style={{
              transform: `translateX(${index * 8}px) skewX(-6deg)`,
              letterSpacing: "-0.04em",
            }}
          >
            {part}
            <span
              className="font-mono text-[7px] not-italic tracking-normal text-white/35"
              style={{ transform: "skewX(6deg)" }}
            >
              {["HRS", "MIN", "SEC"][index]}
            </span>
          </p>
        ))}
      </div>
      <div className="relative flex items-end justify-between border-t border-white/12 pt-1.5">
        <div className="flex gap-2">
          {["CLOCK", "STOPWATCH", "ALARM", "ZONES"].map((mode, index) => (
            <span
              key={mode}
              className="mono-sm text-[5px]"
              style={{ color: index === 1 ? "var(--pv-accent)" : "rgba(255,255,255,0.28)" }}
            >
              {mode}
            </span>
          ))}
        </div>
        <span className="mono-sm text-[5px] text-white/25">CANVAS 2D · rAF</span>
      </div>
    </div>
  );
}
