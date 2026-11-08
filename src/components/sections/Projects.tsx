"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { profile } from "@/data/profile";
import { projectFilters, projects, type ProjectCategory } from "@/data/projects";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Reveal, SectionHeading } from "@/components/ui/Motion";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";

/** "2023 — 2025" derived from the data, not typed by hand. */
function yearRangeFor(list: { year: string }[]): string {
  const years = list.map((project) => Number(project.year)).filter((year) => Number.isFinite(year));
  if (!years.length) return "";
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min} — ${max}`;
}

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const yearRange = yearRangeFor(projects);

  const filtered = useMemo(
    () => (filter === "all" ? projects : projects.filter((project) => project.category === filter)),
    [filter],
  );

  const counts = useMemo(
    () =>
      projectFilters.reduce<Record<string, number>>((accumulator, item) => {
        accumulator[item.key] =
          item.key === "all"
            ? projects.length
            : projects.filter((project) => project.category === item.key).length;
        return accumulator;
      }, {}),
    [],
  );

  return (
    <section id="work" aria-labelledby="work-heading" className="relative border-t border-white/10">
      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading index="03" code="SELECTED_WORK" title={["BUILT WITH", "PURPOSE."]} id="work-heading" />
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="space-y-4 lg:text-right">
              <p className="body-copy ml-auto max-w-[42ch] text-[15px]">
                Product engineering, interface systems, and infrastructure. Every card opens a full
                case study.
              </p>
              <span className="mono-sm inline-flex items-center gap-2 border border-white/10 px-2.5 py-1.5 text-[14px] text-fog">
                <span className="h-1 w-1 bg-accent" /> {String(projects.length).padStart(2, "0")}{" "}
                PROJECTS / {yearRange}
              </span>
            </Reveal>
          </div>
        </div>

        {/* filters */}
        <div className="mt-12 flex flex-col gap-4 border-y border-white/10 py-4 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-1.5">
            {projectFilters.map((item) => {
              const active = filter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  aria-pressed={active}
                  className={cn(
                    "relative px-3 py-2 font-mono text-[14px] uppercase tracking-[0.05em] transition-colors duration-300",
                    active ? "text-accent-ink" : "text-fog hover:text-bone",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {item.label}
                    <span className={cn("text-[14px]", active ? "text-accent-ink/70" : "text-fog/60")}>
                      {String(counts[item.key]).padStart(2, "0")}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="font-mono text-[13px] text-fog" aria-live="polite">
            {String(filtered.length).padStart(2, "0")} OF {String(projects.length).padStart(2, "0")} SHOWN
          </p>
        </div>

        {/* grid */}
        <motion.div layout className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project, index) => {
              const wide = index % 3 === 2;
              return (
                <motion.article
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.03 }}
                  className={cn(
                    "group relative border border-white/12 bg-panel/40 transition-colors duration-500 hover:border-accent/45",
                    wide ? "lg:col-span-12" : index % 2 === 0 ? "lg:col-span-7" : "lg:col-span-5",
                  )}
                >
                  <span className="pointer-events-none absolute -left-px -top-px h-2 w-2 border-l border-t border-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b border-r border-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div
                    className={cn(
                      wide && "lg:grid lg:grid-cols-[1.15fr_1fr]",
                    )}
                  >
                    {/* visual */}
                    <Link
                      href={`/work/${project.slug}`}
                      aria-label={`Open case study: ${project.title}`}
                      data-cursor="view"
                      className="relative block overflow-hidden border-b border-white/10 bg-paper-deep lg:border-b-0 lg:border-r"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
                        <span className="font-mono text-[13px] text-accent">{project.number}</span>
                        <span className="ml-auto font-mono text-[13px] text-fog">{project.year}</span>
                      </div>
                      <div
                        className={cn(
                          "relative overflow-hidden transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]",
                          wide ? "aspect-[16/10] lg:aspect-auto lg:h-[360px]" : "aspect-[16/10]",
                        )}
                      >
                        <ProjectVisual kind={project.preview} accent={project.accent} compact={!wide} />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper/70 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                      </div>
                    </Link>

                    {/* info */}
                    <div className={cn("p-5 sm:p-6", wide && "flex flex-col justify-between")}>
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-mono text-[14px] tracking-[0.04em] text-fog">{project.subtitle}</p>
                            <Link href={`/work/${project.slug}`} className="mt-2 block">
                              <h3 className="display text-[clamp(1.9rem,4.5vw,3.1rem)] transition-all duration-500 group-hover:translate-x-1 group-hover:text-accent">
                                {project.title}
                              </h3>
                            </Link>
                          </div>
                          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center border border-white/15 text-ash transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:text-accent">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </span>
                        </div>

                        <p className="body-copy mt-3 max-w-[48ch] text-[15px]">{project.description}</p>

                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {project.stack.slice(0, 4).map((tech) => (
                            <span key={tech} className="tag">
                              {tech}
                            </span>
                          ))}
                          {project.stack.length > 4 && (
                            <span className="tag border-accent/40 text-accent">+{project.stack.length - 4}</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                        <div className="flex items-center gap-3">
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${project.title} source on GitHub (opens in a new tab)`}
                            data-cursor="open"
                            className="inline-flex items-center gap-1.5 font-mono text-[14px] uppercase tracking-[0.04em] text-fog transition-colors hover:text-accent"
                          >
                            <GithubIcon className="h-3 w-3" /> CODE
                          </a>
                          <span className="h-3 w-px bg-white/15" />
                          <a
                            href={project.links.live}
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label={`${project.title} live demo (opens in a new tab)`}
                            data-cursor="open"
                            className="inline-flex items-center gap-1.5 font-mono text-[14px] uppercase tracking-[0.04em] text-fog transition-colors hover:text-accent"
                          >
                            <ExternalLink className="h-3 w-3" /> LIVE
                          </a>
                        </div>
                        <Link
                          href={`/work/${project.slug}`}
                          className="group/link inline-flex items-center gap-1.5 font-mono text-[14px] uppercase tracking-[0.04em] text-bone transition-colors hover:text-accent"
                          data-cursor="view"
                        >
                          CASE STUDY
                          <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mono mt-10 border border-white/10 p-8 text-center text-[14px] text-fog">
            NO PROJECTS IN THIS CATEGORY YET — TRY ANOTHER FILTER.
          </p>
        )}

        <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="body-copy max-w-[48ch] text-[15px]">
            More experiments live in the repositories — prototypes, tooling, and interface studies that
            didn&apos;t need a case study.
          </p>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer noopener"
            data-cursor="open"
            className="btn btn-ghost"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            ALL REPOSITORIES
            <ArrowUpRight className="arrow h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
