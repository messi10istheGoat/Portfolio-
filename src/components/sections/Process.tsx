"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SplitLines } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    index: "01",
    title: "DISCOVER",
    subtitle: "Understand the problem",
    body: "Interviews, workflow audits, and constraints before a single component. The goal is a precise problem statement that the build can be measured against.",
    deliverables: ["Problem statement", "Workflow map", "Success criteria"],
    duration: "1—2 WEEKS",
  },
  {
    index: "02",
    title: "PLAN",
    subtitle: "Design the architecture",
    body: "Data model first, then interfaces. Routes, state ownership, and failure modes are decided in sketches so the build has fewer surprises.",
    deliverables: ["Schema & data model", "Interface system", "Delivery plan"],
    duration: "1 WEEK",
  },
  {
    index: "03",
    title: "ENGINEER",
    subtitle: "Build the product",
    body: "Typed end-to-end, built in vertical slices that remain shippable. Motion and accessibility are part of the component, not a later pass.",
    deliverables: ["Production code", "Component library", "Tested API surface"],
    duration: "4—8 WEEKS",
  },
  {
    index: "04",
    title: "OPTIMIZE",
    subtitle: "Improve performance and usability",
    body: "Measure first: bundle, query plans, and interaction latency. Then remove everything that doesn't earn its weight, including animations.",
    deliverables: ["Performance budget", "Accessibility audit", "Instrumentation"],
    duration: "1—2 WEEKS",
  },
  {
    index: "05",
    title: "DEPLOY",
    subtitle: "Ship and maintain",
    body: "Preview environments, migration checks, and a rollback path. After launch the work becomes iteration — measuring what the product actually does.",
    deliverables: ["CI/CD pipeline", "Release checklist", "Post-launch review"],
    duration: "CONTINUOUS",
  },
];

export function Process() {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 55%"],
  });
  const lineScale = useSpring(useTransform(scrollYProgress, [0, 1], [0.04, 1]), {
    stiffness: 90,
    damping: 26,
  });

  return (
    <section id="process" aria-labelledby="process-heading" className="relative border-t border-white/10 bg-ink-2">
      <div className="pointer-events-none absolute inset-0 grid-field-sm opacity-[0.2]" aria-hidden />
      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-5">
              <span className="mono border border-line px-2.5 py-1.5 text-bone">06</span>
              <span className="mono text-accent">PROCESS</span>
            </div>
            <SplitLines
              lines={["HOW THE", "WORK HAPPENS."]}
              as="h2"
              id="process-heading"
              className="text-[clamp(2.2rem,6.4vw,5rem)]"
            />
          </div>
          <div className="lg:col-span-4">
            <p className="body-copy ml-auto max-w-[38ch] text-[15px] lg:text-right">
              A repeatable delivery system. Five phases, each with a defined output — so momentum never
              depends on memory.
            </p>
          </div>
        </div>

        <div ref={containerRef} className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* step rail */}
          <div className="relative lg:col-span-5">
            <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 sm:left-[23px]" aria-hidden />
            <motion.div
              className="absolute left-[19px] top-0 w-px origin-top bg-accent sm:left-[23px]"
              style={{ height: "100%", scaleY: reduced ? 1 : lineScale }}
              aria-hidden
            />
            <ol className="relative space-y-1">
              {steps.map((step, index) => {
                const isActive = active === index;
                return (
                  <li key={step.index}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      onMouseEnter={() => setActive(index)}
                      aria-pressed={isActive}
                      className="group flex w-full items-center gap-4 py-3 text-left"
                    >
                      <span
                        className={cn(
                          "relative z-10 grid h-10 w-10 shrink-0 place-items-center border transition-all duration-400 sm:h-12 sm:w-12",
                          isActive
                            ? "border-accent bg-accent text-accent-ink"
                            : "border-white/20 bg-ink-2 text-fog group-hover:border-white/40 group-hover:text-bone",
                        )}
                      >
                        <span className="font-mono text-[14px] font-bold">{step.index}</span>
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-3">
                          <span
                            className={cn(
                              "display-tight text-lg transition-colors sm:text-xl",
                              isActive ? "text-bone" : "text-ash group-hover:text-bone",
                            )}
                          >
                            {step.title}
                          </span>
                          <span className="font-mono text-[14px] text-fog">{step.duration}</span>
                        </span>
                        <span className="mt-1 block font-sans text-[13px] text-fog">{step.subtitle}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* detail panel */}
          <div className="lg:col-span-7">
            <div className="glass-strong relative min-h-[320px] overflow-hidden p-5 sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[rgba(var(--accent-rgb),0.14)] blur-3xl" />
              <div className="relative flex items-start justify-between">
                <span className="display text-[clamp(4rem,11vw,8rem)] leading-none text-outline-accent">
                  {steps[active].index}
                </span>
                <div className="text-right">
                  <p className="font-mono text-[13px] text-fog">Phase {steps[active].index} of 05</p>
                  <p className="mt-1 font-mono text-[13px] text-accent">{steps[active].duration}</p>
                </div>
              </div>

              <motion.div
                key={steps[active].index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <h3 className="display-tight text-3xl text-bone sm:text-4xl">{steps[active].title}</h3>
                <p className="mt-2 font-sans text-[14px] text-fog">{steps[active].subtitle}</p>
                <p className="body-copy mt-4 max-w-[54ch] text-[15px]">{steps[active].body}</p>

                <div className="mt-6 border-t border-white/12 pt-4">
                  <p className="font-mono text-[13px] text-fog">Output</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {steps[active].deliverables.map((deliverable) => (
                      <li key={deliverable} className="tag gap-1.5 border-accent/30 text-accent">
                        <ArrowUpRight className="h-2.5 w-2.5" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              <div className="relative mt-7 flex gap-1">
                {steps.map((step, index) => (
                  <button
                    key={step.index}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Show phase ${step.index}: ${step.title}`}
                    className={cn(
                      "h-1 flex-1 transition-colors duration-300",
                      index <= active ? "bg-accent" : "bg-white/15 hover:bg-white/30",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
