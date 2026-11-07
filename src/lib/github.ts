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
  url: string;
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
const REVALIDATE_SECONDS = 1800;

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

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

/**
 * Derive month labels from an actual set of weeks.
 * Previously live mode reused the *sample* month positions, so labels drifted
 * out of alignment with the real calendar.
 */
function monthsFor(weeks: ContributionDay[][]): { label: string; column: number }[] {
  const raw: { label: string; column: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, column) => {
    const first = week[0];
    if (!first) return;
    const month = new Date(`${first.date}T12:00:00Z`).getUTCMonth();
    if (month !== lastMonth) {
      lastMonth = month;
      raw.push({ label: MONTH_LABELS[month], column });
    }
  });

  // Keep labels that are at least four columns apart so they never collide.
  return raw.filter((entry, index) => index === 0 || entry.column - raw[index - 1].column > 3);
}

function buildSampleWeeks(): { weeks: ContributionDay[][]; months: { label: string; column: number }[] } {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() - today.getDay() + 6);

  const start = new Date(end);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  const random = mulberry32(0x5eed1234);
  const weeks: ContributionDay[][] = [];

  for (let w = 0; w < WEEKS; w++) {
    const week: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const cell = new Date(start);
      cell.setDate(start.getDate() + w * 7 + d);
      const isFuture = cell > today;
      const weekend = d === 0 || d === 6;
      const seasonal = 0.55 + 0.45 * Math.sin((w / WEEKS) * Math.PI * 3);
      const base = isFuture ? 0 : Math.floor(random() * (weekend ? 6 : 14) * seasonal);
      const count = isFuture ? 0 : base > 11 ? base : base === 0 && random() > 0.35 ? 1 : base;
      week.push({
        date: cell.toISOString().slice(0, 10),
        count,
        level: levelFor(count),
      });
    }
    weeks.push(week);
  }

  return { weeks, months: monthsFor(weeks) };
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
    updated: "2 DAYS AGO",
    url: "https://github.com/arifrahman-dev/ledgerly",
  },
  {
    name: "relay",
    description: "Local-first API capture workbench. Response to fixture in one command.",
    language: "TypeScript",
    stars: 96,
    updated: "1 WEEK AGO",
    url: "https://github.com/arifrahman-dev/relay",
  },
  {
    name: "pulse",
    description: "Realtime API observability for small teams, on one Postgres instance.",
    language: "Node.js",
    stars: 74,
    updated: "3 WEEKS AGO",
    url: "https://github.com/arifrahman-dev/pulse",
  },
  {
    name: "kinetic-type-lab",
    description: "Four browser typography experiments using variable fonts and geometry.",
    language: "React",
    stars: 51,
    updated: "1 MONTH AGO",
    url: "https://github.com/arifrahman-dev/kinetic-type-lab",
  },
];

/** Relative wording for repository freshness — stable between renders. */
function relativeUpdated(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "RECENTLY";

  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "TODAY";
  if (days === 1) return "YESTERDAY";
  if (days < 14) return `${days} DAYS AGO`;
  if (days < 60) return `${Math.round(days / 7)} WEEKS AGO`;
  if (days < 365) return `${Math.round(days / 30)} MONTHS AGO`;
  return `${Math.floor(days / 365)}+ YEARS AGO`;
}

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
  errors?: { message: string }[];
}

interface RestRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  html_url: string;
  fork: boolean;
  archived: boolean;
}

/** Server-side fetch. Never throws: any failure falls back to labelled sample data. */
export async function getGithubData(): Promise<GithubData> {
  const token = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME ?? process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const fallback = sampleData();

  if (!token || !username) return fallback;

  try {
    const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}} repositories(privacy:PUBLIC){totalCount} followers{totalCount} following{totalCount}}}`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-site",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      signal: AbortSignal.timeout(7000),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github-activity"] },
    });

    if (!res.ok) {
      console.warn(`[github] GraphQL responded ${res.status}; using sample data`);
      return fallback;
    }

    const json = (await res.json()) as GraphQLResponse;
    const user = json.data?.user;
    const calendar = user?.contributionsCollection?.contributionCalendar;
    if (!calendar?.weeks?.length) {
      if (json.errors?.length) console.warn("[github] GraphQL errors", json.errors[0]?.message);
      return fallback;
    }

    const weeks: ContributionDay[][] = calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levelFor(day.contributionCount),
      })),
    );

    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=8&type=owner`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "portfolio-site",
        },
        signal: AbortSignal.timeout(7000),
        next: { revalidate: REVALIDATE_SECONDS, tags: ["github-activity"] },
      },
    );

    const reposJson: RestRepo[] = reposRes.ok ? ((await reposRes.json()) as RestRepo[]) : [];

    const repos: RepoHighlight[] = reposJson
      .filter((repo) => !repo.fork && !repo.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || Date.parse(b.updated_at) - Date.parse(a.updated_at))
      .slice(0, 4)
      .map((repo) => ({
        name: repo.name,
        description: repo.description ?? "No description provided.",
        language: repo.language ?? "Other",
        stars: repo.stargazers_count,
        updated: relativeUpdated(repo.updated_at),
        url: repo.html_url || `https://github.com/${username}/${repo.name}`,
      }));

    return {
      live: true,
      label: "LIVE GITHUB DATA",
      username,
      profileUrl: `https://github.com/${username}`,
      totals: {
        contributions: calendar.totalContributions,
        repositories: user?.repositories?.totalCount ?? repos.length,
        followers: user?.followers?.totalCount ?? 0,
        following: user?.following?.totalCount ?? 0,
        streak: longestStreak(weeks),
      },
      weeks,
      months: monthsFor(weeks),
      repos,
    };
  } catch (error) {
    console.warn("[github] live fetch failed; using sample data", error);
    return fallback;
  }
}
