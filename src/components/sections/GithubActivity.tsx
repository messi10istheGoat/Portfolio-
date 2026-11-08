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
            <SectionHeading index="04" code="GITHUB" title={["CONSISTENCY", "COMPOUNDS."]} id="github-heading" />
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="space-y-4 lg:text-right">
              <p className="body-copy ml-auto max-w-[44ch] text-[15px]">
                Commits, repositories, and streaks. Fetched live from the GitHub API when a token is
                configured — otherwise the labelled sample below.
              </p>
              <span
                className="inline-flex items-center gap-2 border px-2.5 py-1.5 font-sans text-[13px]"
                style={{
                  borderColor: data.live ? "rgba(198,243,106,0.4)" : "rgba(255,255,255,0.12)",
                  color: data.live ? "#c6f36a" : "#a1a1aa",
                }}
              >
                <span className={data.live ? "h-1 w-1 bg-lime" : "h-1 w-1 bg-white/40"} />
                {data.label}
              </span>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <Reveal className="lg:col-span-8">
            <div className="glass-strong relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <GithubIcon className="h-4 w-4 text-ash" />
                  <span className="font-mono text-[14px] text-bone">
                    {data.username}
                  </span>
                </div>
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 py-1 font-mono text-[13px] text-ash transition-colors hover:text-accent"
                  data-cursor="open"
                >
                  Open profile <ArrowUpRight className="h-2.5 w-2.5" />
                </a>
              </div>

              <div className="grid grid-cols-2 divide-white/10 border-b border-white/10 sm:grid-cols-4 sm:divide-x">
                {stats.map((stat) => (
                  <div key={stat.label} className="p-3.5">
                    <p className="font-mono text-[13px] leading-snug text-fog">{stat.label}</p>
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
                <span className="font-mono text-[13px] text-fog">Last 53 weeks · UTC</span>
                <span className="font-mono text-[13px] text-fog">
                  {data.live ? "Live from GitHub" : "Sample data — not live stats"}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-4">
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col border border-white/12 bg-panel">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <span className="font-mono text-[13px] text-fog">Repository highlights</span>
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
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0 break-words font-mono text-[14px] leading-snug text-bone transition-colors group-hover:text-accent">
                          <span className="text-fog/60">0{index + 1} /</span> {repo.name}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[13px] text-fog">
                          <Star className="h-2.5 w-2.5" /> {repo.stars}
                        </span>
                      </div>
                      <p className="line-clamp-2 font-sans text-[14px] leading-relaxed text-ash">
                        {repo.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-fog">
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: languageDot[repo.language] ?? "#8b8b93" }}
                          />
                          {repo.language}
                        </span>
                        <span>Updated {repo.updated}</span>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="border-t border-white/10 p-3">
                  {!data.live && (
                    <p className="mb-3 border border-white/10 bg-white/[0.03] p-2.5 font-mono text-[13px] leading-relaxed text-fog">
                      Sample repository data — illustrative, not verified statistics.
                    </p>
                  )}
                  <a
                    href={data.profileUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn w-full justify-between py-3 text-[14px]"
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
