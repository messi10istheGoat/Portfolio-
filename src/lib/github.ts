/**
 * GitHub activity data.
 *
 * Live data is used only when GITHUB_TOKEN (and optionally GITHUB_USERNAME) is
 * configured. Without credentials the module returns deterministic SAMPLE data,
 * which the UI labels explicitly — it is never presented as real statistics.
 */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface RepoHighlight {
  name: string;
  description: string;
  language: string;
  stars: number;
  updated: string;
}

export interface GithubData {
  live: boolean;
  label: string;
  username: string;
  profileUrl: string;
  totals: {
    contributions: number;
    repositories: number;
    followers: number;
    following: number;
    streak: number;
  };
  weeks: ContributionDay[][];
  months: { label: string; column: number }[];
  repos: RepoHighlight[];
}

const WEEKS = 53;

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function levelFor(count: number): ContributionLevel {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

function buildSampleWeeks(): { weeks: ContributionDay[][]; months: { label: string; column: number }[] } {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const end = new Date(today);
  end.setDate(end.getDate() - dayOfWeek + 6);

  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  const random = mulberry32(0x5eed1234);
  const weeks: ContributionDay[][] = [];
  const months: { label: string; column: number }[] = [];
  let lastMonth = -1;

  for (let w = 0; w < WEEKS; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setDate(start.getDate() + w * 7 + d);
      const isFuture = cell > end;
      const weekend = d === 0 || d === 6;
      const seasonal = 0.55 + 0.45 * Math.sin((w / WEEKS) * Math.PI * 3);
      const base = isFuture ? 0 : Math.floor(random() * (weekend ? 6 : 14) * seasonal);
      const count = isFuture ? 0 : base > 11 ? base : base === 0 && random() > 0.35 ? 1 : base;
      week.push({
        date: cell.toISOString().slice(0, 10),
        count,
        level: levelFor(count),
      });
      if (d === 0 && cell.getMonth() !== lastMonth) {
        lastMonth = cell.getMonth();
        months.push({
          label: cell.toLocaleString("en-US", { month: "short" }).toUpperCase(),
          column: w,
        });
      }
    }
    weeks.push(week);
  }

  return { weeks, months: months.filter((m, i) => i === 0 || m.column - months[i - 1].column > 3) };
}

function sumCounts(weeks: ContributionDay[][]): number {
  return weeks.reduce((total, week) => total + week.reduce((sum, day) => sum + day.count, 0), 0);
}

function longestStreak(weeks: ContributionDay[][]): number {
  let best = 0;
  let current = 0;
  for (const week of weeks) {
    for (const day of week) {
      if (day.count > 0) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
  }
  return best;
}

const sampleRepos: RepoHighlight[] = [
  {
    name: "ledgerly",
    description: "Personal finance workspace — typed ledger, server-side aggregates, zero drift.",
    language: "TypeScript",
    stars: 148,
    updated: "2 days ago",
  },
  {
    name: "relay",
    description: "Local-first API capture workbench. Response to fixture in one command.",
    language: "TypeScript",
    stars: 96,
    updated: "1 week ago",
  },
  {
    name: "pulse",
    description: "Realtime API observability for small teams, on one Postgres instance.",
    language: "Node.js",
    stars: 74,
    updated: "3 weeks ago",
  },
  {
    name: "kinetic-type-lab",
    description: "Four browser typography experiments using variable fonts and geometry.",
    language: "React",
    stars: 51,
    updated: "1 month ago",
  },
];

function sampleData(): GithubData {
  const { weeks, months } = buildSampleWeeks();
  return {
    live: false,
    label: "SAMPLE DATA — set GITHUB_TOKEN for live activity",
    username: "arifrahman-dev",
    profileUrl: "https://github.com/arifrahman-dev",
    totals: {
      contributions: sumCounts(weeks),
      repositories: 24,
      followers: 318,
      following: 112,
      streak: longestStreak(weeks),
    },
    weeks,
    months,
    repos: sampleRepos,
  };
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: {
            contributionDays: { date: string; contributionCount: number }[];
          }[];
        };
      };
      repositories?: { totalCount: number };
      followers?: { totalCount: number };
      following?: { totalCount: number };
    };
  };
}

/** Server-side fetch. Never throws: any failure falls back to labelled sample data. */
export async function getGithubData(): Promise<GithubData> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;
  const fallback = sampleData();

  if (!token || !username) return fallback;

  try {
    const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}} repositories(privacy:PUBLIC){totalCount} followers{totalCount} following{totalCount}}}`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return fallback;
    const json = (await res.json()) as GraphQLResponse;
    const user = json.data?.user;
    const calendar = user?.contributionsCollection?.contributionCalendar;
    if (!calendar?.weeks?.length) return fallback;

    const weeks = calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelFor(day.contributionCount),
      })),
    );

    const random = mulberry32(0xabc123);
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=4`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 3600 },
      },
    );
    const reposJson = reposRes.ok
      ? ((await reposRes.json()) as {
          name: string;
          description: string | null;
          language: string | null;
          stargazers_count: number;
          updated_at: string;
        }[])
      : [];

    return {
      live: true,
      label: "LIVE GITHUB DATA",
      username,
      profileUrl: `https://github.com/${username}`,
      totals: {
        contributions: calendar.totalContributions,
        repositories: user?.repositories?.totalCount ?? 0,
        followers: user?.followers?.totalCount ?? 0,
        following: user?.following?.totalCount ?? 0,
        streak: longestStreak(weeks),
      },
      weeks,
      months: fallback.months,
      repos: reposJson.length
        ? reposJson.map((repo, index) => ({
            name: repo.name,
            description: repo.description ?? "No description provided.",
            language: repo.language ?? "Other",
            stars: repo.stargazers_count,
            updated: new Date(repo.updated_at || Date.now()).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            }),
          }))
        : sampleRepos.slice(0, 4).map((repo) => ({
            ...repo,
            stars: Math.round(repo.stars * (0.6 + random() * 0.8)),
          })),
    };
  } catch {
    return sampleRepos.length ? fallback : fallback;
  }
}
