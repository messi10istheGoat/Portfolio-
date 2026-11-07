import { ArrowUpRight, MapPin, Terminal as TerminalIcon } from "lucide-react";
import { profile } from "@/data/profile";
import { Reveal, SectionHeading, SplitLines, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Terminal } from "@/components/sections/Terminal";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="relative border-t border-white/10">
      <div className="pointer-events-none absolute inset-0 grid-field opacity-[0.18]" aria-hidden />
      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading index="01" code="WHOAMI" title={profile.about.headline} id="about-heading" />

            <Reveal delay={0.1} className="mt-8 max-w-[62ch]">
              <p className="font-display text-[clamp(1.15rem,2.1vw,1.6rem)] font-medium leading-[1.35] tracking-[-0.015em] text-bone">
                {profile.about.lede}
              </p>
            </Reveal>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {profile.about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 20)} delay={0.15 + index * 0.08}>
                  <p className="body-copy">{paragraph}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 border-t border-white/12">
              <Stagger className="divide-y divide-white/10">
                {profile.about.philosophy.map((item) => (
                  <StaggerItem key={item.index}>
                    <div className="group grid grid-cols-[auto_1fr] gap-4 py-5 sm:grid-cols-[70px_1fr_1.1fr] sm:items-baseline sm:gap-6">
                      <span className="mono text-[10px] text-fog transition-colors group-hover:text-accent">
                        {item.index}
                      </span>
                      <h3 className="display-tight text-lg text-bone sm:text-xl">{item.title}</h3>
                      <p className="body-copy col-span-2 text-sm sm:col-span-1">{item.body}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <Reveal delay={0.1} className="mt-10">
              <p className="mono-sm text-[8px] text-fog">AREAS OF INTEREST</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.about.interests.map((interest) => (
                  <span
                    key={interest}
                    className="tag transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-8 border-l border-accent/60 bg-white/[0.02] py-3 pl-4">
              <p className="mono-sm text-[8px] text-accent">CURRENT FOCUS</p>
              <p className="body-copy mt-1.5 text-sm">{profile.about.currentFocus}</p>
            </Reveal>
          </div>

          {/* right column */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-4">
              <Reveal>
                <div className="glass-strong relative overflow-hidden p-5">
                  <div className="absolute right-0 top-0 h-24 w-24 border-b border-l border-white/10">
                    <SplitLines
                      as="div"
                      lines={[profile.monogram]}
                      className="grid h-full place-items-center text-[2.6rem] text-white/12"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="status-dot" aria-hidden />
                    <span className="mono-sm text-[8px] text-ash">{profile.availability.toUpperCase()}</span>
                  </div>
                  <p className="mono-sm mt-4 text-[8px] text-fog">PROFILE / AT A GLANCE</p>
                  <dl className="mt-3 border-t border-white/12">
                    {profile.about.facts.map((fact) => (
                      <div
                        key={fact.label}
                        className="flex items-baseline justify-between gap-4 border-b border-white/10 py-2.5"
                      >
                        <dt className="mono-sm shrink-0 text-[8px] text-fog">{fact.label}</dt>
                        <dd className="text-right font-display text-[12px] font-semibold uppercase tracking-[0.02em] text-bone">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mono-sm inline-flex items-center gap-1.5 text-[8px] text-ash transition-colors hover:text-accent"
                    >
                      GITHUB <ArrowUpRight className="h-2.5 w-2.5" />
                    </a>
                    <span className="mono-sm inline-flex items-center gap-1.5 text-[8px] text-fog">
                      <MapPin className="h-2.5 w-2.5" /> {profile.location.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Reveal>

              <Stagger className="grid grid-cols-2 gap-px border border-white/10 bg-white/[0.06]">
                {profile.about.stats.map((stat) => (
                  <StaggerItem key={stat.label} className="bg-ink-2 p-4">
                    <p className="display text-3xl text-bone">{stat.value}</p>
                    <p className="mono-sm mt-2 text-[7px] leading-relaxed text-fog">{stat.label}</p>
                  </StaggerItem>
                ))}
              </Stagger>

              <Reveal delay={0.1}>
                <div className="mb-2 flex items-center gap-2">
                  <TerminalIcon className="h-3 w-3 text-accent" />
                  <p className="mono-sm text-[8px] text-fog">
                    TRY THE SYSTEM SHELL <span className="text-white/20">/</span>{" "}
                    <span className="text-accent">HELP</span>
                  </p>
                </div>
                <Terminal />
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
