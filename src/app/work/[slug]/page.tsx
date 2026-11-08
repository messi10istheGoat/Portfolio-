import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { getProject, projects, relatedProjects } from "@/data/projects";
import { profile } from "@/data/profile";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { CaseVisual } from "@/components/projects/CaseVisual";
import { Reveal, SplitLines } from "@/components/ui/Motion";
import { GithubIcon } from "@/components/ui/BrandIcons";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case study not found" };
  return {
    title: `${project.title} — ${project.subtitle}`,
    description: project.description,
    keywords: [...project.stack, project.categoryLabel, "case study", project.title],
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${project.subtitle}`,
      description: project.description,
      type: "article",
      url: `/work/${project.slug}`,
      publishedTime: `${project.year}-01-01T00:00:00.000Z`,
      tags: [...project.stack, project.categoryLabel],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.subtitle}`,
      description: project.description,
    },
  };
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/10 py-2.5">
      <dt className="font-mono text-[14px] text-fog">{label}</dt>
      <dd className="mt-1 font-display text-[14px] font-semibold uppercase tracking-[0.02em] text-bone">
        {value}
      </dd>
    </div>
  );
}

function CaseSection({
  index,
  title,
  children,
  tone = "default",
}: {
  index: string;
  title: string;
  children: ReactNode;
  tone?: "default" | "panel";
}) {
  return (
    <section className={tone === "panel" ? "border-t border-white/10 bg-ink-2" : "border-t border-white/10"}>
      <div className="shell grid gap-6 py-12 sm:py-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3">
              <span className="mono border border-white/15 px-2 py-1 text-[14px] text-bone">{index}</span>
              <span className="h-px w-8 bg-accent" />
            </div>
            <h2 className="display-tight mt-3 text-[clamp(1.7rem,3.6vw,2.8rem)] text-bone">{title}</h2>
          </div>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const related = relatedProjects(project.slug, 2);

  const caseSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: `${project.title} — ${project.subtitle}`,
    description: project.description,
    dateCreated: project.year,
    keywords: project.stack.join(", "),
    creator: { "@type": "Person", name: profile.name },
    about: project.categoryLabel,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseSchema) }}
      />
      {/* hero */}
      <header className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="grid-field absolute inset-0 opacity-30" />
          <div className="radial-bleed absolute inset-0 opacity-70" />
          <div className="noise-layer absolute inset-0" />
        </div>
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/#work"
              className="group inline-flex items-center gap-2 font-mono text-[13px] text-ash transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              ALL WORK
            </Link>
            <span className="font-mono text-[13px] text-fog">
              CASE STUDY {project.number} / {String(projects.length).padStart(2, "0")}{" "}
              <span className="text-white/20">·</span> <span className="text-accent">{project.year}</span>
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <p className="mono text-[14px] text-accent">{project.categoryLabel}</p>
              <SplitLines
                lines={[project.title]}
                as="h1"
                animateOnLoad
                className="mt-3 text-[clamp(2.6rem,8.4vw,7rem)]"
              />
              <SplitLines
                lines={[project.subtitle]}
                as="p"
                animateOnLoad
                delay={0.12}
                className="mt-2 text-[clamp(1.2rem,3.4vw,2.4rem)] text-outline"
              />
              <Reveal delay={0.2} className="mt-6 max-w-[62ch]">
                <p className="body-copy">{project.description}</p>
              </Reveal>
              <Reveal delay={0.28} className="mt-7 flex flex-wrap gap-2">
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-primary text-[14px]"
                  data-cursor="open"
                >
                  LIVE PRODUCT
                  <ExternalLink className="arrow h-3.5 w-3.5" />
                </a>
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn text-[14px]"
                  data-cursor="open"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  SOURCE CODE
                </a>
              </Reveal>
            </div>

            <div className="lg:col-span-4">
              <Reveal delay={0.15}>
                <div className="glass-strong p-4">
                  <p className="mono-sm border-b border-white/10 pb-2 text-[14px] text-fog">PROJECT FILE</p>
                  <dl>
                    <MetaRow label="ROLE" value={project.role} />
                    <MetaRow label="TIMELINE" value={project.timeline} />
                    <MetaRow label="YEAR" value={project.year} />
                    <MetaRow label="CATEGORY" value={project.categoryLabel} />
                  </dl>
                  <div className="pt-3">
                    <p className="font-mono text-[14px] text-fog">STACK</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span key={tech} className="tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={0.2} className="mt-10">
            <CaseVisual
              kind={project.preview}
              accent={project.accent}
              ratio="aspect-[16/10] sm:aspect-[16/8]"
              caption={`${project.title} — primary product surface.`}
            />
          </Reveal>

          <div className="mt-6 grid grid-cols-1 gap-px border border-white/10 bg-white/[0.06] sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-ink px-4 py-4">
                <p className="display text-2xl text-bone sm:text-3xl">{metric.value}</p>
                <p className="mono mt-1.5 text-[14px] text-fog">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-12 sm:mt-16">
        <CaseSection index="01" title="OVERVIEW">
          <div className="space-y-4">
            {caseStudy.overview.map((paragraph) => (
              <Reveal key={paragraph.slice(0, 24)}>
                <p className="body-copy">{paragraph}</p>
              </Reveal>
            ))}
            <Reveal delay={0.1} className="mt-6">
              <div className="glass flex items-start gap-3 p-4">
                <span className="font-mono text-[14px] text-accent">↳</span>
                <p className="font-mono text-[14px] leading-relaxed text-ash">
                  {profile.name.toUpperCase()} — {project.role} · BUILT {project.year} ·{" "}
                  {project.stack.slice(0, 3).join(" / ").toUpperCase()}
                </p>
              </div>
            </Reveal>
          </div>
        </CaseSection>

        <CaseSection index="02" title="THE CHALLENGE">
          <div className="space-y-4">
            {caseStudy.challenge.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="body-copy">
                {paragraph}
              </p>
            ))}
            <div className="mt-6 border border-white/12">
              <p className="mono-sm border-b border-white/10 bg-white/[0.03] px-3 py-2 text-[14px] text-fog">
                CONSTRAINTS
              </p>
              <ul className="divide-y divide-white/10">
                {caseStudy.challenge.constraints.map((constraint, index) => (
                  <li key={constraint} className="flex items-start gap-3 px-3 py-3">
                    <span className="mono-sm mt-0.5 text-[14px] text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-[15px] leading-relaxed text-ash">{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CaseSection>

        <CaseSection index="03" title="RESEARCH" tone="panel">
          <div className="space-y-4">
            {caseStudy.research.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="body-copy">
                {paragraph}
              </p>
            ))}
            <div className="mt-6 grid grid-cols-1 gap-px bg-white/[0.08] min-[480px]:grid-cols-2 sm:grid-cols-4">
              {caseStudy.research.findings.map((finding) => (
                <div key={finding.label} className="bg-ink-2 p-3.5">
                  <p className="display-tight text-lg text-accent sm:text-xl">{finding.value}</p>
                  <p className="mono mt-2 text-[14px] leading-relaxed text-fog">{finding.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CaseSection>

        <CaseSection index="04" title="ARCHITECTURE">
          <div className="space-y-4">
            {caseStudy.architecture.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="body-copy">
                {paragraph}
              </p>
            ))}
            <div className="mt-6 space-y-2">
              {caseStudy.architecture.layers.map((layer, index) => (
                <Reveal key={layer.code} delay={index * 0.05}>
                  <div className="group flex items-start gap-3 border border-white/12 bg-panel p-3.5 transition-colors hover:border-accent/40">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center border border-white/15 font-mono text-[13px] text-accent">
                      {layer.code}
                    </span>
                    <div className="w-full">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-display text-[15px] font-semibold uppercase leading-tight tracking-[0.03em] text-bone">
                          {layer.label}
                        </p>
                        <span className="mono hidden text-[14px] text-fog sm:block">LAYER {layer.code}</span>
                      </div>
                      <p className="mt-1 font-sans text-[15px] leading-relaxed text-ash">{layer.note}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <p className="mono-sm pt-2 text-[14px] text-fog">
                REQUEST FLOW: 01 → 02 → 03 → 04 · CONTRACT TYPED END-TO-END
              </p>
            </div>
          </div>
        </CaseSection>

        <CaseSection index="05" title="DESIGN & DEVELOPMENT" tone="panel">
          <div className="space-y-4">
            {caseStudy.build.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="body-copy">
                {paragraph}
              </p>
            ))}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {caseStudy.build.steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.05}>
                  <div className="h-full border border-white/12 bg-ink-2 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[14px] text-accent">
                        STEP {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="h-1 w-1 bg-accent" />
                    </div>
                    <p className="display-tight mt-3 text-lg text-bone">{step.title}</p>
                    <p className="body-copy mt-1.5 text-[14px]">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <CaseVisual
                kind={project.preview}
                accent={project.accent}
                ratio="aspect-[4/3]"
                strength={30}
                caption="Interface detail — core interaction surface."
              />
              <div className="flex flex-col justify-between border border-white/12 bg-ink p-4">
                <div>
                  <p className="font-mono text-[14px] text-fog">DESIGN SYSTEM</p>
                  <p className="display-tight mt-2 text-xl text-bone">TOKENS → PRIMITIVES → SURFACES</p>
                  <p className="body-copy mt-2 text-[14px]">
                    Type scale, spacing, borders, and accent behaviour defined once. Every screen composes
                    from the same primitives so the interface stays coherent as it grows.
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  {["TYPE SCALE", "SURFACE TOKENS", "MOTION RULES", "ACCESSIBILITY"].map((token) => (
                    <div key={token} className="flex items-center justify-between border-b border-white/10 pb-1.5">
                      <span className="font-mono text-[14px] text-ash">{token}</span>
                      <span className="font-mono text-[14px] text-accent">DEFINED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CaseSection>

        <CaseSection index="06" title="TECHNICAL DECISIONS">
          <div className="space-y-3">
            {caseStudy.decisions.map((decision, index) => (
              <Reveal key={decision.title} delay={index * 0.05}>
                <div className="group border border-white/12 bg-panel p-4 transition-colors hover:border-accent/40">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="display-tight text-lg text-bone">{decision.title}</h3>
                    <span className="mono-sm shrink-0 text-[14px] text-fog">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="body-copy mt-2 text-[14px]">{decision.body}</p>
                  <p className="mono-sm mt-3 border-l border-accent/50 pl-2.5 text-[14px] leading-relaxed text-ash">
                    TRADEOFF — {decision.tradeoff}
                  </p>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.1} className="pt-4">
              <div className="overflow-hidden border border-white/12 bg-paper-deep">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-2">
                  <span className="font-mono text-[14px] text-ash">{caseStudy.code.filename}</span>
                  <span className="font-mono text-[14px] text-fog">
                    {caseStudy.code.language.toUpperCase()}
                  </span>
                </div>
                <pre className="thin-scroll overflow-x-auto p-4 font-mono text-[14px] leading-relaxed text-ash sm:text-[14px]">
                  <code>{caseStudy.code.snippet}</code>
                </pre>
              </div>
            </Reveal>
          </div>
        </CaseSection>

        <CaseSection index="07" title="KEY FEATURES" tone="panel">
          <div className="grid gap-px bg-white/[0.08] sm:grid-cols-2">
            {caseStudy.features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.04}>
                <div className="group h-full bg-ink-2 p-4 transition-colors hover:bg-elevated">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[14px] text-accent">
                      F{String(index + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-fog transition-all group-hover:rotate-45 group-hover:text-accent" />
                  </div>
                  <p className="display-tight mt-3 text-base text-bone">{feature.title}</p>
                  <p className="body-copy mt-1.5 text-[14px]">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </CaseSection>

        <CaseSection index="08" title="FINAL PRODUCT">
          <div className="space-y-5">
            <CaseVisual
              kind={project.preview}
              accent={project.accent}
              ratio="aspect-[16/10]"
              caption="Final build — shipped surface, production state."
            />
            <div className="flex flex-wrap gap-2">
              <a href={project.links.live} target="_blank" rel="noreferrer noopener" className="btn btn-primary text-[14px]" data-cursor="open">
                OPEN LIVE PRODUCT
                <ArrowUpRight className="arrow h-3.5 w-3.5" />
              </a>
              <a href={project.links.github} target="_blank" rel="noreferrer noopener" className="btn text-[14px]" data-cursor="open">
                <GithubIcon className="h-3.5 w-3.5" />
                VIEW REPOSITORY
              </a>
              <Link href="/#contact" className="btn btn-ghost text-[14px]" data-cursor="open">
                DISCUSS A SIMILAR BUILD
                <ArrowUpRight className="arrow h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </CaseSection>

        <CaseSection index="09" title="RESULTS" tone="panel">
          <div className="space-y-4">
            {caseStudy.result.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="body-copy">
                {paragraph}
              </p>
            ))}
            <div className="mt-6 grid gap-px bg-white/[0.08] sm:grid-cols-3">
              {caseStudy.result.metrics.map((metric) => (
                <div key={metric.label} className="bg-ink-2 p-4">
                  <p className="display text-2xl text-accent">{metric.value}</p>
                  <p className="mono mt-2 text-[14px] leading-relaxed text-fog">{metric.label}</p>
                </div>
              ))}
            </div>
            <p className="mono-sm border border-white/10 bg-white/[0.02] p-3 text-[14px] leading-relaxed text-fog">
              METRICS ARE SELF-REPORTED FROM DEVELOPMENT AND TESTING. PLACEHOLDER PROJECT CONTENT —
              REPLACE WITH VERIFIED OUTCOMES BEFORE PUBLISHING.
            </p>
          </div>
        </CaseSection>
      </div>

      {/* next projects */}
      <section className="border-t border-white/10 bg-paper-deep">
        <div className="shell py-12">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[14px] text-fog">NEXT CASE STUDIES</p>
            <Link href="/#work" className="font-mono text-[14px] text-ash transition-colors hover:text-accent">
              ALL WORK ↗
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/work/${item.slug}`}
                className="group flex items-stretch justify-between gap-3 border border-white/12 bg-panel/40 p-3 transition-colors hover:border-accent/45"
              >
                <div className="min-w-0">
                  <p className="font-mono text-[14px] text-fog">
                    {item.number} / {item.categoryLabel}
                  </p>
                  <p className="display-tight mt-1.5 truncate text-xl text-bone transition-colors group-hover:text-accent">
                    {item.title}
                  </p>
                  <p className="mono mt-1 text-[14px] text-fog">{item.subtitle}</p>
                </div>
                <div className="hidden aspect-[4/3] w-24 shrink-0 overflow-hidden border border-white/10 sm:block">
                  <ProjectVisual kind={item.preview} accent={item.accent} compact />
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-fog transition-all group-hover:rotate-45 group-hover:text-accent" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
