import { marqueeTech, techCategories } from "@/data/skills";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/ui/Motion";
import { cn } from "@/lib/utils";

const levelMeta = {
  core: { label: "CORE", bars: 4 },
  strong: { label: "STRONG", bars: 3 },
  working: { label: "WORKING", bars: 2 },
} as const;

export function Stack() {
  const total = techCategories.reduce((sum, category) => sum + category.items.length, 0);

  return (
    <section id="stack" aria-labelledby="stack-heading" className="relative border-t border-white/10 bg-ink-2">
      <div className="pointer-events-none absolute inset-0 grid-field-sm opacity-[0.22]" aria-hidden />
      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading index="02" code="TECHNOLOGIES" title={["MY DIGITAL", "TOOLBOX."]} id="stack-heading" />
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="space-y-4 lg:text-right">
              <p className="body-copy ml-auto max-w-[42ch] text-sm">
                {total} technologies, grouped by the layer of the stack they own. Each one is marked by how
                I work with it — core, strong, or working — and what it is actually good at.
              </p>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <span className="mono-sm flex items-center gap-2 border border-white/10 px-2.5 py-1.5 text-[8px] text-fog">
                  <span className="flex gap-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="h-2 w-1 bg-accent" />
                    ))}
                  </span>
                  CORE
                </span>
                <span className="mono-sm flex items-center gap-2 border border-white/10 px-2.5 py-1.5 text-[8px] text-fog">
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-2 w-1 bg-white/40" />
                    ))}
                    <span className="h-2 w-1 bg-white/10" />
                  </span>
                  STRONG
                </span>
                <span className="mono-sm flex items-center gap-2 border border-white/10 px-2.5 py-1.5 text-[8px] text-fog">
                  <span className="flex gap-0.5">
                    {[0, 1].map((i) => (
                      <span key={i} className="h-2 w-1 bg-white/40" />
                    ))}
                    <span className="h-2 w-1 bg-white/10" />
                    <span className="h-2 w-1 bg-white/10" />
                  </span>
                  WORKING
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 space-y-0 border-t border-white/12">
          {techCategories.map((category) => (
            <div
              key={category.index}
              className="group/category grid gap-5 border-b border-white/12 py-8 lg:grid-cols-12 lg:gap-8"
            >
              <div className="lg:col-span-4">
                <div className="flex items-start gap-4">
                  <span className="display text-outline select-none text-[clamp(3rem,6vw,5.4rem)] transition-all duration-500 group-hover/category:text-outline-accent">
                    {category.index}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="display-tight text-2xl text-bone sm:text-[1.75rem]">{category.title}</h3>
                    <p className="mono-sm mt-2 text-[8px] text-fog">{category.items.length} ENTRIES</p>
                  </div>
                </div>
                <p className="body-copy mt-4 max-w-[32ch] text-sm">{category.caption}</p>
                <span className="mt-4 hidden h-px w-full bg-white/10 lg:block" aria-hidden />
              </div>

              <Stagger className="grid grid-cols-2 gap-px bg-white/[0.07] sm:grid-cols-3 lg:col-span-8">
                {category.items.map((item) => {
                  const meta = levelMeta[item.level];
                  return (
                    <StaggerItem key={item.name}>
                      <div
                        className="group/tile relative h-full overflow-hidden bg-ink p-4 transition-colors duration-400 hover:bg-elevated"
                        data-cursor="skill"
                      >
                        <span className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover/tile:scale-x-100" />
                        <div className="flex items-start justify-between">
                          <span className="font-display text-lg leading-none text-ash transition-all duration-400 group-hover/tile:scale-110 group-hover/tile:text-accent">
                            {item.glyph}
                          </span>
                          <span className="mono-sm text-[7px] text-fog/70">
                            {category.index}.{String(category.items.indexOf(item) + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="mt-6 font-display text-[13px] font-semibold uppercase tracking-[0.02em] text-bone">
                          {item.name}
                        </p>
                        <p className="mt-1 line-clamp-1 font-mono text-[9px] leading-relaxed text-fog transition-all duration-300 group-hover/tile:text-ash">
                          {item.note}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="mono-sm flex items-center gap-1 text-[7px] text-fog">
                            <span className="flex gap-0.5">
                              {[0, 1, 2, 3].map((bar) => (
                                <span
                                  key={bar}
                                  className={cn(
                                    "h-1.5 w-1",
                                    bar < meta.bars ? "bg-accent/80" : "bg-white/12",
                                  )}
                                />
                              ))}
                            </span>
                            {meta.label}
                          </span>
                          <span className="h-1 w-1 bg-white/15 transition-colors group-hover/tile:bg-accent" />
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          ))}
        </div>

        <div className="marquee-mask relative mt-10 overflow-hidden border-y border-white/10 py-3">
          <div className="skew-marquee flex w-max gap-8">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center gap-8" aria-hidden={copy === 1}>
                {marqueeTech.map((tech) => (
                  <span
                    key={tech}
                    className="mono-sm flex items-center gap-8 text-[9px] tracking-[0.24em] text-fog"
                  >
                    {tech}
                    <span className="text-accent/70">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
