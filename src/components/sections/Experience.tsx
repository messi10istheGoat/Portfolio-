"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { experience, experienceDisclaimer } from "@/data/experience";
import { SectionHeading, Reveal } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

export function Experience() {
  const [open, setOpen] = useState<string[]>([experience[0].index]);

  const toggle = (index: string) => {
    setOpen((current) =>
      current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
    );
  };

  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative border-t border-white/10">
      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading index="05" code="EXPERIENCE" title={["THE", "JOURNEY."]} id="experience-heading" />
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:text-right">
              <p className="body-copy ml-auto max-w-[40ch] text-sm">
                Timeline of practice, collaboration, and study. Expand an entry for responsibilities,
                technologies, and outcomes.
              </p>
              <span className="mono-sm mt-4 inline-flex items-center gap-2 border border-white/12 px-2.5 py-1.5 text-[8px] text-fog">
                <span className="h-1 w-1 bg-[#febc2e]" /> DRAFT DATA — EDITABLE PLACEHOLDER
              </span>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 border-t border-white/12">
          {experience.map((entry) => {
            const isOpen = open.includes(entry.index);
            return (
              <div key={entry.index} className="group relative border-b border-white/12">
                <div className="grid gap-4 py-6 sm:grid-cols-[64px_1fr] sm:gap-6 lg:grid-cols-[110px_1fr]">
                  <div className="flex items-start gap-4 sm:flex-col sm:gap-2">
                    <span
                      className={cn(
                        "display text-[clamp(2rem,4.5vw,3.4rem)] transition-colors duration-500",
                        isOpen ? "text-accent" : "text-outline group-hover:text-outline-accent",
                      )}
                    >
                      {entry.index}
                    </span>
                    <span className="mono-sm mt-1 text-[7px] leading-relaxed text-fog sm:mt-0">
                      {entry.period}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="display-tight text-xl text-bone sm:text-2xl">{entry.organization}</h3>
                          {!entry.verified && (
                            <span className="mono-sm border border-[#febc2e]/40 px-1.5 py-0.5 text-[6px] text-[#febc2e]/90">
                              DRAFT
                            </span>
                          )}
                        </div>
                        <p className="mono-sm mt-1.5 text-[9px] text-accent">
                          {entry.position.toUpperCase()}
                          <span className="text-fog"> — {entry.location}</span>
                        </p>
                        <p className="body-copy mt-3 max-w-[62ch] text-sm">{entry.summary}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggle(entry.index)}
                        aria-expanded={isOpen}
                        aria-controls={`experience-panel-${entry.index}`}
                        className="flex shrink-0 items-center gap-2 self-start border border-white/15 px-3 py-2 transition-colors hover:border-accent/60 hover:text-accent"
                      >
                        <span className="mono-sm text-[8px]">{isOpen ? "COLLAPSE" : "DETAILS"}</span>
                        {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`experience-panel-${entry.index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-5 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-2">
                            <div>
                              <p className="mono-sm text-[8px] text-fog">RESPONSIBILITIES</p>
                              <ul className="mt-2 space-y-1.5">
                                {entry.responsibilities.map((item) => (
                                  <li key={item} className="flex gap-2 font-sans text-[12px] leading-relaxed text-ash">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-accent/70" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="mono-sm text-[8px] text-fog">KEY ACCOMPLISHMENTS</p>
                              <ul className="mt-2 space-y-1.5">
                                {entry.accomplishments.map((item) => (
                                  <li key={item} className="flex gap-2 font-sans text-[12px] leading-relaxed text-ash">
                                    <ArrowUpRight className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="md:col-span-2">
                              <p className="mono-sm text-[8px] text-fog">TECHNOLOGIES</p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {entry.technologies.map((tech) => (
                                  <span key={tech} className="tag">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <span
                  className={cn(
                    "pointer-events-none absolute left-0 top-0 h-px bg-accent transition-all duration-700",
                    isOpen ? "w-full opacity-70" : "w-0 opacity-0",
                  )}
                />
              </div>
            );
          })}
        </div>

        <p className="mono-sm mt-5 max-w-[80ch] text-[8px] leading-relaxed text-fog">
          ⚠ {experienceDisclaimer}
        </p>
      </div>
    </section>
  );
}
