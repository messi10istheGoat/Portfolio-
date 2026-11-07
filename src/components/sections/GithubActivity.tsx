import { ArrowUpRight, Star } from "lucide-react";
import { getGithubData } from "@/lib/github";
import { ContributionGraph } from "@/components/github/ContributionGraph";
import { Reveal, SectionHeading } from "@/components/ui/Motion";
import { GithubIcon } from "@/components/ui/BrandIcons";

const languageDot: Record<string, string> = {
  TypeScript: "#3178c6",
  React: "#61dafb",
  "Node.js": "#8cc84b",
  SQL: "#e38d3a",
};

export async function GithubActivity() {
  const data = await getGithubData();

  const stats = [
    { label: "TOTAL CONTRIBUTIONS", value: data.totals.contributions.toLocaleString() },
    { label: "PUBLIC REPOSITORIES", value: data.totals.repositories.toLocaleString() },
    { label: "FOLLOWERS", value: data.totals.followers.toLocaleString() },
    { label: "LONGEST STREAK (DAYS)", value: data.totals.streak.toLocaleString() },
  ];

  return (
    <section id="github" aria-labelledby="github-heading" className="relative border-t border-white/10 bg-ink-2">
      <div className="pointer-events-none absolute inset-0 grid-field opacity-[0.12]" aria-hidden />
      <div className="shell relative py-20 sm:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeading index="04" code="GITHUB" title={["CONSISTENCY", "BUILDS", "EVERYTHING."]} id="github-heading" />
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="space-y-4 lg:text-right">
              <p className="body-copy ml-auto max-w-[42ch] text-sm">
                The development footprint: commits, repositories, and the streak that keeps the system
                honest. Activity is fetched from the GitHub API when credentials are configured.
              </p>
              <span
                className="mono-sm inline-flex items-center gap-2 border px-2.5 py-1.5 text-[8px]"
                style={{
                  borderColor: data.live ? "rgba(198,243,106,0.4)" : "rgba(255,255,255,0.12)",
                  color: data.live ? "#c6f36a" : "#a1a1aa",
                }}
              >
                <span className={data.live ? "h-1 w-1 bg-lime" : "h-1 w-1 bg-white/40"} />
                {data.label.toUpperCase()}
              </span>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="glass-strong relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <GithubIcon className="h-4 w-4 text-ash" />
                  <span className="font-display text-[13px] font-semibold uppercase tracking-[0.02em] text-bone">
                    {data.username}
                  </span>
                  <span className="mono-sm border border-white/12 px-1.5 py-0.5 text-[7px] text-fog">
                    CONTRIBUTION GRAPH
                  </span>
                </div>
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mono-sm inline-flex items-center gap-1.5 text-[8px] text-ash transition-colors hover:text-accent"
                  data-cursor="open"
                >
                  OPEN PROFILE <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 divide-white/10 border-b border-white/10 sm:grid-cols-4 sm:divide-x">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-3.5">
                    <p className="mono-sm text-[7px] leading-relaxed text-fog">{stat.label}</p>
                    <p className="display mt-1 text-2xl text-bone sm:text-3xl">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 sm:p-4">
                <ContributionGraph
                  weeks={data.weeks}
                  months={data.months}
                  total={data.totals.contributions}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5">
                <span className="mono-sm text-[7px] text-fog">
                  WINDOW: LAST 53 WEEKS · TIMEZONE: UTC
                </span>
                <span className="mono-sm text-[7px] text-fog">
                  {data.live ? "SOURCE: GITHUB GRAPHQL API" : "SOURCE: SAMPLE DATASET (NOT LIVE STATS)"}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-4">
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col border border-white/12 bg-panel">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="mono-sm text-[8px] text-fog">REPOSITORY HIGHLIGHTS</span>
                  <span className="mono-sm text-[8px] text-accent">{String(data.repos.length).padStart(2, "0")}</span>
                </div>
                <div className="flex-1 divide-y divide-white/10">
                  {data.repos.map((repo, index) => (
                    <a
                      key={repo.name}
                      href={data.profileUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      data-cursor="open"
                      className="group flex flex-col gap-1.5 p-4 transition-colors hover:bg-white/[0.035]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[11px] text-bone transition-colors group-hover:text-accent">
                          <span className="text-fog/60">0{index + 1} /</span> {repo.name}
                        </span>
                        <span className="mono-sm inline-flex items-center gap-1 text-[8px] text-fog">
                          <Star className="h-2.5 w-2.5" /> {repo.stars}
                        </span>
                      </div>
                      <p className="line-clamp-2 font-sans text-[11px] leading-relaxed text-ash">
                        {repo.description}
                      </p>
                      <div className="mono-sm flex items-center gap-3 text-[7px] text-fog">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: languageDot[repo.language] ?? "#8b8b93" }}
                          />
                          {repo.language}
                        </span>
                        <span>UPDATED {repo.updated.toUpperCase()}</span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="border-t border-white/10 p-3">
                  {!data.live && (
                    <p className="mono-sm mb-3 border border-white/10 bg-white/[0.03] p-2 text-[7px] leading-relaxed text-fog">
                      SAMPLE REPOSITORY DATA — NOT PRESENTED AS VERIFIED STATISTICS. CONNECT A GITHUB TOKEN
                      TO STREAM REAL ACTIVITY.
                    </p>
                  )}
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn w-full justify-between py-3 text-[9px]"
                  >
                    GITHUB PROFILE
                    <ArrowUpRight className="arrow h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
