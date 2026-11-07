export type ProjectCategory = "full-stack" | "frontend" | "backend" | "experiments";
export type ProjectPreview = "dashboard" | "ai" | "commerce" | "terminal" | "observability" | "type";

export interface Project {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  role: string;
  timeline: string;
  stack: string[];
  /** `live` may be empty — the UI then shows the repository link only. */
  links: { live: string; github: string };
  preview: ProjectPreview;
  accent: string;
  metrics: { value: string; label: string }[];
  caseStudy: {
    overview: string[];
    challenge: { body: string[]; constraints: string[] };
    research: { body: string[]; findings: { label: string; value: string }[] };
    architecture: { body: string[]; layers: { code: string; label: string; note: string }[] };
    build: { body: string[]; steps: { title: string; body: string }[] };
    decisions: { title: string; body: string; tradeoff: string }[];
    features: { title: string; body: string }[];
    code: { language: string; filename: string; snippet: string };
    result: { body: string[]; metrics: { value: string; label: string }[] };
  };
}

export const projectFilters: { key: ProjectCategory | "all"; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "full-stack", label: "FULL-STACK" },
  { key: "frontend", label: "FRONTEND" },
  { key: "backend", label: "BACKEND" },
  { key: "experiments", label: "EXPERIMENTS" },
];

/**
 * Real, shipped work. Every stack listed here is read from the repository's
 * own package.json; nothing is embellished. Metrics that cannot be verified
 * from the repository are not claimed on this page — the case studies describe
 * architecture and decisions instead of inventing performance numbers.
 */
export const projects: Project[] = [
  {
    slug: "spendwise",
    number: "01",
    title: "SPENDWISE",
    subtitle: "OFFLINE-FIRST PERSONAL FINANCE",
    description:
      "A privacy-first money tracker for web and Android that keeps every record on the device — no account, no cloud, no bank connection.",
    category: "full-stack",
    categoryLabel: "PRODUCT ENGINEERING",
    year: "2026",
    role: "DESIGN + ENGINEERING",
    timeline: "ONGOING",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Capacitor", "Recharts"],
    links: {
      live: "",
      github: "https://github.com/messi10istheGoat/Expense-Tracker",
    },
    preview: "dashboard",
    accent: "#668cff",
    metrics: [
      { value: "0", label: "NETWORK CALLS FOR DATA" },
      { value: "5", label: "APPEARANCE THEMES" },
      { value: "WEB + ANDROID", label: "SHIPPED SURFACES" },
    ],
    caseStudy: {
      overview: [
        "Spendwise is a personal-finance app built on a deliberate constraint: the financial data never leaves the device. There is no sign-up, no cloud database, and no automatic bank sync — records live in the browser profile, or in device storage inside a shared Capacitor Android shell.",
        "The product covers accounts, income and expense categories, transfers with opening balances, filters and search, CSV export, a validated JSON backup and restore flow with undo, plus a set of advanced tools gated behind a Pro surface.",
      ],
      challenge: {
        body: [
          "Most money apps ask for trust before they deliver value: create an account, link a bank, accept a privacy policy you cannot audit. The goal here was the opposite — a tracker that is useful in the first thirty seconds and provably local.",
          "That constraint moves real work into the client. Storage has to survive reloads and upgrades, backups have to be validated before they are allowed to overwrite anything, and the app has to behave correctly when it is used offline on a phone.",
        ],
        constraints: [
          "No backend, no account system, no third-party financial data brokers.",
          "Fresh installs start empty — never seeded with fictional balances.",
          "Backups validated and preserved before any restore commits.",
          "Pro state kept separate from financial data so a plan flag cannot unlock features.",
        ],
      },
      research: {
        body: [
          "The build was shaped by how people actually use a tracker rather than how dashboards demo. The default view answers one question immediately: where does this month stand?",
          "The Pro boundary was prototyped carefully. Locked destinations explain the offer instead of simulating a purchase, and no flow ever pretends a subscription was activated.",
        ],
        findings: [
          { label: "PRIMARY DEVICE", value: "MOBILE" },
          { label: "DEFAULT ACTION", value: "ADD EXPENSE" },
          { label: "DATA LOCATION", value: "ON DEVICE" },
          { label: "ONBOARDING", value: "3 STEPS" },
        ],
      },
      architecture: {
        body: [
          "A single React 19 + TypeScript client built with Vite. Domain logic sits in its own `finance` module, platform differences are isolated behind a `platform` layer, and the UI composes from `components` — so the same code runs as a web app and inside the Capacitor shell.",
          "Finite state is kept in typed hooks rather than a global store, which keeps persistence explicit: the app decides when to write, and a corrupt or partial record can never be half-applied.",
        ],
        layers: [
          { code: "01", label: "SURFACE", note: "React 19 components, Recharts summaries, Tailwind themes" },
          { code: "02", label: "DOMAIN", note: "finance module: accounts, transfers, categories, budgets" },
          { code: "03", label: "PERSISTENCE", note: "local storage on web, Capacitor filesystem on Android" },
          { code: "04", label: "PLATFORM", note: "Capacitor plugins behind a thin adapter" },
        ],
      },
      build: {
        body: [
          "The interface is assembled from a small set of primitives — a metric slab, a transaction row, a category bar, a filter rail — so every screen stays visually consistent as features accumulate.",
          "Testing is treated as part of the feature. Vitest covers domain logic, Playwright covers real onboarding and the locked-Pro behaviour on desktop and mobile, and an axe-core pass checks accessibility on the core flows.",
        ],
        steps: [
          { title: "ONBOARDING", body: "Device-local profile, display currency and first account." },
          { title: "LEDGER", body: "Add, edit, delete and search transactions; transfers write both sides." },
          { title: "BACKUP", body: "Validated JSON export and restore with undo before commit." },
          { title: "SHELLS", body: "Web build plus a shared Capacitor Android build." },
        ],
      },
      decisions: [
        {
          title: "LOCAL-FIRST, NOT LOCAL-ONLY BY ACCIDENT",
          body: "Persistence is an explicit module with a designed failure path rather than a side effect of a state library. Corrupt or partial data is rejected instead of silently merged.",
          tradeoff: "More code around reads and writes, but no silent data loss.",
        },
        {
          title: "THE PAYWALL IS HONEST",
          body: "Locked routes are guarded for direct URLs, navigation and search, and the app never simulates a purchase. Subscription state is stored separately from financial data.",
          tradeoff: "Less impressive demo, far less misleading product.",
        },
        {
          title: "ONE CODEBASE, TWO TARGETS",
          body: "Capacitor was chosen over a separate native app so web and Android share the same domain logic and design system.",
          tradeoff: "Platform quirks live in an adapter layer, native features are the ones Capacitor exposes.",
        },
      ],
      features: [
        { title: "MULTI-ACCOUNT LEDGER", body: "Accounts with opening balances, transfers, and income/expense categories." },
        { title: "FIVE THEMES", body: "Minimal, Botanical, Brutalist, Neon and Glassmorphism, each with light/dark/device modes." },
        { title: "BACKUP + RESTORE", body: "JSON export, validated import, and undo before anything is overwritten." },
        { title: "CSV EXPORT", body: "Take the data out in a format a spreadsheet can read." },
        { title: "OFFLINE APP SHELL", body: "A service worker caches the shell so the web app reopens without a connection." },
        { title: "ACCESSIBILITY PASSES", body: "Larger text setting, reduced-motion support, and axe-core checks in CI flows." },
      ],
      code: {
        language: "ts",
        filename: "src/finance/types.ts",
        snippet: `export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string | null;
  type: "income" | "expense" | "transfer";
  amount: number;
  /** ISO date the entry belongs to, not the moment it was typed. */
  occurredAt: string;
  note?: string;
}

/** A transfer is always written as a matched pair, never a single row. */
export type Transfer = { from: string; to: string; amount: number };`,
      },
      result: {
        body: [
          "Spendwise ships as both a web app and an Android shell from one codebase. The constraint that started the project — no cloud — turned out to be the feature users ask about first.",
          "The useful lesson was about boundaries: keeping domain logic away from the UI made the Pro gating, the backup validation and the platform split straightforward instead of tangled.",
        ],
        metrics: [
          { value: "1", label: "CODEBASE, 2 TARGETS" },
          { value: "0", label: "CLOUD DEPENDENCIES" },
          { value: "5", label: "THEMES SHIPPED" },
        ],
      },
    },
  },
  {
    slug: "sylhet-live",
    number: "02",
    title: "SYLHET LIVE",
    subtitle: "MONSOON HAZARD MAP",
    description:
      "A crowdsourced civic GIS platform that maps street waterlogging in Sylhet and routes vehicles around flooded roads.",
    category: "full-stack",
    categoryLabel: "CIVIC TECH / GIS",
    year: "2026",
    role: "DESIGN + ENGINEERING",
    timeline: "SEMESTER PROJECT",
    stack: ["React 19", "TypeScript", "Express", "Leaflet", "Tailwind CSS", "SQLite", "SSE"],
    links: {
      live: "",
      github: "https://github.com/messi10istheGoat/Clg-Project",
    },
    preview: "observability",
    accent: "#62d9e8",
    metrics: [
      { value: "36", label: "REAL INTERSECTIONS" },
      { value: "48", label: "ROAD CORRIDORS" },
      { value: "6", label: "VEHICLE PROFILES" },
    ],
    caseStudy: {
      overview: [
        "Sylhet sits downstream of the Meghalaya hills and floods fast. During monsoon cloudbursts, low-lying neighbourhoods submerge within minutes, and the danger is not just water — it is the open manhole hidden under it.",
        "Sylhet Live turns that into a live map: citizens report water depth and hazards, a municipal console verifies them, hydrological telemetry tracks the Surma against its danger level, and a routing engine suggests flood-safe corridors for the specific vehicle you are driving.",
      ],
      challenge: {
        body: [
          "Standard navigation has no concept of water. It will happily route a CNG auto-rickshaw through 25 cm of floodwater, or send a car across a bridge that is restricted to rickshaws and pedestrians.",
          "The other half of the problem is trust. A crowdsourced hazard map is only useful if a report is fresh, verified, or at least corroborated by other people standing in the same water.",
        ],
        constraints: [
          "Data must be hyperlocal — street level, not district level.",
          "Passability depends on the vehicle, not just the road.",
          "Reports need verification, not just submission.",
          "Must work on a phone, in the rain, with poor connectivity.",
        ],
      },
      research: {
        body: [
          "The map was built from actual Sylhet geography: 36 intersections and 48 road corridors across North Sylhet and South Surma, including the Historic Keane Bridge restriction and the bridges that remain usable when the main corridors flood.",
          "Hydrology follows the BWDB danger levels that residents already hear about — the Surma at Chandni Ghat and Kanairghat, Kushiyara at Amalshid, Sari-Gowain, plus upstream rainfall at Cherrapunji.",
        ],
        findings: [
          { label: "STALL DEPTH", value: "20–25 cm" },
          { label: "PRIMARY HAZARD", value: "HIDDEN MANHOLES" },
          { label: "KEY CHOKE POINT", value: "KEANE BRIDGE" },
          { label: "LANGUAGE", value: "EN + বাংলা" },
        ],
      },
      architecture: {
        body: [
          "An Express server owns the hazard graph, the report lifecycle and the SSE stream; a React 19 client renders the Leaflet map, the reporting flow and the moderator console. One process serves both in development and production.",
          "State that many people need at once — new reports, verification votes, status changes — is pushed over Server-Sent Events rather than polled, so a commuter watching a route sees the corridor reopen without refreshing.",
        ],
        layers: [
          { code: "01", label: "MAP", note: "Leaflet with three themes, hazard pins, basin and channel overlays" },
          { code: "02", label: "API", note: "Express routes for reports, votes, telemetry and moderation" },
          { code: "03", label: "ROUTING", note: "Hazard-weighted Dijkstra over a 36-node street graph" },
          { code: "04", label: "STORE", note: "node:sqlite with WAL — zero native build dependencies" },
        ],
      },
      build: {
        body: [
          "The routing engine is the core of the project. Each corridor edge carries a hazard weight derived from reported water depth, and each vehicle profile has a wading clearance; the shortest path is not the answer, the passable path is.",
          "Reporting had to be fast enough to do from the side of a flooded road: pin on the map or use the GPS, add a compressed photo, drag a depth slider from 0 to 90 cm, and submit — with community \"still here\" votes and a moderator console behind it.",
        ],
        steps: [
          { title: "GRAPH", body: "Encode 36 intersections and 48 corridors with real bridge restrictions." },
          { title: "WEIGHT", body: "Convert reported depth into per-vehicle edge cost." },
          { title: "ROUTE", body: "Run Dijkstra and draw safe and avoided paths side by side." },
          { title: "VERIFY", body: "Community votes plus an SCC moderator console for official status." },
        ],
      },
      decisions: [
        {
          title: "VEHICLE-AWARE ROUTING",
          body: "Cost is computed per vehicle profile, so a pedestrian, a rickshaw, a CNG and an ambulance each get a genuinely different answer from the same graph.",
          tradeoff: "Route results are not cacheable across users, but they are actually correct.",
        },
        {
          title: "SSE OVER WEBSOCKETS",
          body: "Updates flow one way — server to client — so Server-Sent Events give live behaviour with plain HTTP and automatic reconnection.",
          tradeoff: "Reports still use normal POSTs; no bidirectional channel to maintain.",
        },
        {
          title: "NODE:SQLITE, NO NATIVE BUILD",
          body: "Using Node's built-in SQLite keeps setup to `npm install` on any machine, which matters for an academic project that has to run on a viva panel's laptop.",
          tradeoff: "Single-writer semantics, fine for this traffic profile.",
        },
      ],
      features: [
        { title: "CROWDSOURCED REPORTS", body: "Map pin, landmark preset or GPS, with photo compression and a depth slider." },
        { title: "SAFE ROUTES", body: "Turn-by-turn route that avoids flooded corridors for your vehicle type." },
        { title: "HYDROLOGY", body: "24-hour Surma, Kushiyara and Sari-Gowain hydrographs against BWDB danger levels." },
        { title: "MONSOON SIMULATOR", body: "Four scenarios from clear recovery to a 2022-scale flash flood, for demos and drills." },
        { title: "MODERATOR CONSOLE", body: "Official verification, crew dispatch and city-wide emergency banners." },
        { title: "BILINGUAL UI", body: "Full English and বাংলা interface with live SSE synchronisation." },
      ],
      code: {
        language: "ts",
        filename: "server/routing.ts",
        snippet: `/** Depth a vehicle can still wade through, in centimetres. */
const CLEARANCE_CM = { pedestrian: 30, rickshaw: 25, cng: 20, motorbike: 30, car: 18, ambulance: 35 };

/** Edge cost is distance inflated by how close the flood is to the limit. */
function edgeCost(distance: number, depthCm: number, vehicle: Vehicle): number {
  const clearance = CLEARANCE_CM[vehicle];
  if (depthCm >= clearance) return Infinity;          // impassable for this vehicle
  const risk = 1 + (depthCm / clearance) * 4;         // up to 5x cost near the limit
  return distance * risk;
}`,
      },
      result: {
        body: [
          "Sylhet Live became a working model of the whole loop: report, verify, route, dispatch. Every layer uses real Sylhet geography and the danger levels residents already understand.",
          "The routing work was the most instructive part — the realisation that a navigation system's job is not the shortest path but the survivable one applies well beyond flood maps.",
        ],
        metrics: [
          { value: "EN + বাংলা", label: "BILINGUAL" },
          { value: "4", label: "SIMULATED SCENARIOS" },
          { value: "LIVE", label: "SSE SYNC" },
        ],
      },
    },
  },
  {
    slug: "droidmatrix",
    number: "03",
    title: "DROIDMATRIX",
    subtitle: "DEVICE FLEET ORCHESTRATOR",
    description:
      "A three-pane operations console for provisioning and monitoring a large fleet of cloud Android nodes with per-device proxies.",
    category: "full-stack",
    categoryLabel: "FULL-STACK PLATFORM",
    year: "2026",
    role: "DESIGN + ENGINEERING",
    timeline: "ONGOING",
    stack: ["Next.js 16", "React 19", "TypeScript", "PostgreSQL", "Drizzle", "Tailwind CSS"],
    links: {
      live: "",
      github: "https://github.com/messi10istheGoat/farm",
    },
    preview: "terminal",
    accent: "#c6f36a",
    metrics: [
      { value: "1,200+", label: "SIMULATED NODES" },
      { value: "4", label: "PROXY PROTOCOLS" },
      { value: "3", label: "WORKSPACE PANES" },
    ],
    caseStudy: {
      overview: [
        "DROIDMATRIX is a management dashboard for a simulated fleet of over a thousand cloud Android nodes, each with its own hardware profile and a dedicated proxy tunnel.",
        "The interface is built around the real problem of fleet operations: finding a node, seeing its state, and acting on it — without losing context as the numbers grow.",
      ],
      challenge: {
        body: [
          "Fleet dashboards usually collapse under their own scale: a four-column table with two thousand rows tells you nothing, and every action costs a page navigation.",
          "The console needed to keep three kinds of context visible at once — where you are in the fleet, what the selected device is doing, and what its session and proxy state actually are.",
        ],
        constraints: [
          "Thousands of records queried and filtered without blocking the UI.",
          "Per-node identity data surfaced clearly, never ambiguously.",
          "Provisioning from one device to five hundred at once.",
          "Real relational modelling — the fleet is data, not mock rows.",
        ],
      },
      research: {
        body: [
          "The design started from operator tasks rather than entity lists: filter to a suspicious country, open the node, inspect its logger, rotate its identity, move on.",
          "That led to a three-pane layout where each pane answers one question and never scrolls out of relationship with the others.",
        ],
        findings: [
          { label: "LAYOUT", value: "THREE PANES" },
          { label: "BULK PROVISION", value: "+500 AT ONCE" },
          { label: "IDENTITY", value: "REGENERABLE" },
          { label: "FILTERS", value: "MULTI-FACET" },
        ],
      },
      architecture: {
        body: [
          "Next.js 16 with the App Router for both the console and its typed API routes. PostgreSQL with Drizzle ORM models the fleet, with generated migrations committed to the repository.",
          "Heavy list views are server components fed by query parameters, so filtering and pagination happen in the database while the client only ever receives the current page.",
        ],
        layers: [
          { code: "01", label: "CONSOLE", note: "Three-pane React 19 shell: search, stage, inspector" },
          { code: "02", label: "ROUTES", note: "App Router route handlers for devices, tasks, provisioning" },
          { code: "03", label: "SCHEMA", note: "Drizzle models with generated SQL migrations" },
          { code: "04", label: "STORE", note: "PostgreSQL with server-side filtering and pagination" },
        ],
      },
      build: {
        body: [
          "The provisioning flow was built to be unambiguous: a single-device form for precision, and a bulk generator that takes a count and produces consistent nodes in one transaction.",
          "The inspector pane is where the detail lives — hardware identifiers that can be regenerated, session state, and a live stream log — kept one click away rather than buried in a modal chain.",
        ],
        steps: [
          { title: "MODEL", body: "Fleet schema covering nodes, shards, proxies and automation tasks." },
          { title: "QUERY", body: "Server-side multi-facet filtering with pagination." },
          { title: "PROVISION", body: "Single and bulk generation inside one transaction." },
          { title: "INSPECT", body: "Node drawer with identity rotation and stream log." },
        ],
      },
      decisions: [
        {
          title: "SERVER-RENDERED LISTS",
          body: "Lists are server components driven by URL parameters, so the browser never holds thousands of records in memory and filter state is shareable.",
          tradeoff: "Every interaction is a round trip; the payload stays small.",
        },
        {
          title: "REAL RELATIONAL MODEL",
          body: "The fleet is modelled in Postgres with Drizzle and committed migrations rather than generated client-side, which keeps counts and joins honest.",
          tradeoff: "Needs a database to run, but the numbers mean something.",
        },
        {
          title: "THREE PANES, NOT TABS",
          body: "Persistent panes keep fleet context visible while inspecting a node, which tabs cannot do without losing your place.",
          tradeoff: "Constrained layout on small screens, so the console is desktop-first.",
        },
      ],
      features: [
        { title: "MULTI-FACET SEARCH", body: "Filter by country, brand, application and cluster shard with pagination." },
        { title: "DEVICE STAGE", body: "Emulated screen with app switching, touch simulation and capture." },
        { title: "IDENTITY ROTATION", body: "Regenerate hardware identifiers from the node inspector." },
        { title: "BULK PROVISIONING", body: "Generate hundreds of consistent nodes in a single transaction." },
        { title: "STREAM LOG", body: "Per-node activity log kept beside the controls that affect it." },
        { title: "SHARD TOPOLOGY", body: "Fleet organised into shards with explicit ranges." },
      ],
      code: {
        language: "ts",
        filename: "src/db/schema.ts",
        snippet: `export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  nodeCode: varchar("node_code", { length: 16 }).notNull().unique(),
  shard: varchar("shard", { length: 16 }).notNull(),
  brand: varchar("brand", { length: 40 }).notNull(),
  model: varchar("model", { length: 60 }).notNull(),
  proxyProtocol: varchar("proxy_protocol", { length: 24 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("devices_shard_idx").on(table.shard),
  index("devices_brand_idx").on(table.brand),
]);`,
      },
      result: {
        body: [
          "The console holds a thousand-node fleet in a layout that stays readable: filter in one pane, work in the next, inspect in the third.",
          "The most transferable lesson was about scale in the interface rather than the database — at fleet size, navigation design matters more than query speed.",
        ],
        metrics: [
          { value: "DESKTOP-FIRST", label: "OPERATOR CONSOLE" },
          { value: "TYPED", label: "END-TO-END" },
          { value: "MIGRATIONS", label: "VERSIONED" },
        ],
      },
    },
  },
  {
    slug: "kinetic-type",
    number: "04",
    title: "KINETIC TYPE",
    subtitle: "PORTFOLIO INTERFACE STUDY",
    description:
      "A single-page React build exploring variable-font motion, masked type reveals and layout transitions in a static bundle.",
    category: "frontend",
    categoryLabel: "INTERFACE EXPERIMENT",
    year: "2026",
    role: "DESIGN + FRONTEND",
    timeline: "SIDE PROJECT",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Motion"],
    links: {
      live: "",
      github: "https://github.com/messi10istheGoat/My-website-1",
    },
    preview: "type",
    accent: "#a78bfa",
    metrics: [
      { value: "1", label: "PAGE, NO ROUTER" },
      { value: "0", label: "RASTER ASSETS" },
      { value: "STATIC", label: "DEPLOY TARGET" },
    ],
    caseStudy: {
      overview: [
        "A focused frontend study: how far a single page can go using only layout, type and motion — no imagery, no router, no backend.",
        "It is the experiment that established the motion vocabulary used across this portfolio: masked heading reveals, structural grids and spring-based transitions.",
      ],
      challenge: {
        body: [
          "Motion is usually the first thing to hurt performance. Animating layout properties forces reflow, and a page that celebrates animation can easily become a page that stutters.",
          "The constraint was to keep every interaction on the compositor and still make the page feel dimensional.",
        ],
        constraints: [
          "Animate transform and opacity only — never layout properties.",
          "Ship as a static bundle with no server.",
          "Hold the frame budget on mid-range phones.",
          "Respect reduced-motion preferences completely.",
        ],
      },
      research: {
        body: [
          "The study compared entrance styles across sections: masked line reveals versus fade-ups, spring versus eased transitions, and how much stagger reads as intentional rather than slow.",
          "The conclusion was consistent — fewer, slower reveals with real masking feel more expensive than many fast ones.",
        ],
        findings: [
          { label: "BEST ENTRANCE", value: "MASKED LINES" },
          { label: "STAGGER", value: "~90 ms" },
          { label: "EASING", value: "EXPO OUT" },
          { label: "BUDGET", value: "60 FPS" },
        ],
      },
      architecture: {
        body: [
          "React 19 and TypeScript on Vite, styled with Tailwind v4, with Motion handling the animation layer. The build produces a single static entry that can be dropped on any CDN.",
          "Sections are independent components with no shared mutable state, which is what keeps the animation work predictable.",
        ],
        layers: [
          { code: "01", label: "MOTION", note: "Variants, staggering and reduced-motion guards" },
          { code: "02", label: "TYPE", note: "Variable weights, outline treatments, optical tracking" },
          { code: "03", label: "LAYOUT", note: "Asymmetric grids with hairline structure" },
          { code: "04", label: "BUILD", note: "Static single-entry bundle on a CDN" },
        ],
      },
      build: {
        body: [
          "Each section was built twice — once loose, once restrained — and the restrained version was kept. That comparison is the actual output of the project.",
          "Motion settings were extracted into shared variants so timing stays coherent across sections instead of each component inventing its own rhythm.",
        ],
        steps: [
          { title: "PROTOTYPE", body: "Loose motion study for each section." },
          { title: "RESTRAIN", body: "Cut anything that competed with reading." },
          { title: "EXTRACT", body: "Shared variants for easing, stagger and duration." },
          { title: "SHIP", body: "Static build with reduced-motion fallbacks." },
        ],
      },
      decisions: [
        {
          title: "TRANSFORMS ONLY",
          body: "Every animation runs on transform or opacity, so the browser can keep it on the compositor.",
          tradeoff: "Constrains the visual vocabulary, protects the frame budget.",
        },
        {
          title: "NO ROUTER",
          body: "A single page with anchor navigation avoids a routing dependency for a site that has one destination.",
          tradeoff: "Not reusable as an app shell, perfect for a study.",
        },
        {
          title: "SYSTEM FONTS AS FALLBACK",
          body: "Type treatments are defined with metric-aware fallbacks so a slow font never causes a layout jump.",
          tradeoff: "Extra CSS to maintain, no visible shift.",
        },
      ],
      features: [
        { title: "MASKED REVEALS", body: "Headings rise inside clipped containers rather than fading." },
        { title: "VARIABLE WEIGHT", body: "Weight and tracking respond to position and pointer distance." },
        { title: "HAIRLINE GRID", body: "Structural lines stay visible as part of the composition." },
        { title: "REDUCED MOTION", body: "Every animation degrades to a static composition when requested." },
      ],
      code: {
        language: "ts",
        filename: "src/lib/motion.ts",
        snippet: `export const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared entrance used by every section so timing stays coherent. */
export const reveal = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
} as const;

export const stagger = (gap = 0.07) => ({
  visible: { transition: { staggerChildren: gap } },
});`,
      },
      result: {
        body: [
          "The study produced the motion system this portfolio uses: one easing curve, one reveal distance, one stagger interval, applied consistently.",
          "It also produced a rule worth keeping — expressive motion works when the grid is visible and the restraint is deliberate.",
        ],
        metrics: [
          { value: "1", label: "EASING CURVE" },
          { value: "0", label: "LAYOUT ANIMATIONS" },
          { value: "STATIC", label: "BUNDLE" },
        ],
      },
    },
  },
  {
    slug: "bookora",
    number: "05",
    title: "BOOKORA",
    subtitle: "LIBRARY MANAGEMENT SYSTEM",
    description:
      "A library management interface with catalogue browsing, authentication screens and a settings surface for book inventory.",
    category: "frontend",
    categoryLabel: "FRONTEND BUILD",
    year: "2025",
    role: "DESIGN + FRONTEND",
    timeline: "COURSEWORK",
    stack: ["HTML", "CSS", "JavaScript"],
    links: {
      live: "",
      github: "https://github.com/messi10istheGoat/Library-Management---Bookora",
    },
    preview: "commerce",
    accent: "#febc2e",
    metrics: [
      { value: "3", label: "PAGES" },
      { value: "0", label: "FRAMEWORKS" },
      { value: "VANILLA", label: "STACK" },
    ],
    caseStudy: {
      overview: [
        "Bookora is a library management front end built without a framework: a catalogue, an authentication screen and a settings surface, written in plain HTML, CSS and JavaScript.",
        "It is included here because it is where the layout fundamentals were learned — grid, type hierarchy and state handled by hand.",
      ],
      challenge: {
        body: [
          "With no framework, every piece of behaviour is explicit: the catalogue state, the filter interactions and the authentication form all run on plain DOM APIs.",
          "That makes the cost of each decision visible. Nothing is hidden behind a library, which is exactly why it was worth building this way once.",
        ],
        constraints: [
          "No build step and no dependencies.",
          "Multiple pages sharing one visual system.",
          "Interactive catalogue and authentication without a framework.",
          "Readable on first-generation low-end screens.",
        ],
      },
      research: {
        body: [
          "The interface borrows from physical library organisation: a strong shelf-like grid, catalogue cards with clear hierarchy, and typography that prioritises titles over chrome.",
          "The authentication screen is deliberately quieter than the catalogue so the two do not compete in the same visual system.",
        ],
        findings: [
          { label: "GRID", value: "CARD CATALOGUE" },
          { label: "TYPOGRAPHY", value: "TITLE-FIRST" },
          { label: "PAGES", value: "3 SHARED" },
          { label: "DEPS", value: "NONE" },
        ],
      },
      architecture: {
        body: [
          "Three HTML documents share one stylesheet and one script, with the visual system defined once in CSS custom properties.",
          "Inventory state lives in the DOM and in local storage rather than a virtual layer, keeping the entire behaviour of the app inspectable in a browser.",
        ],
        layers: [
          { code: "01", label: "MARKUP", note: "Catalogue, authentication and settings documents" },
          { code: "02", label: "STYLE", note: "One stylesheet with shared custom properties" },
          { code: "03", label: "BEHAVIOUR", note: "Vanilla DOM handlers and local storage" },
          { code: "04", label: "ASSETS", note: "Locally served covers and decorative imagery" },
        ],
      },
      build: {
        body: [
          "The stylesheet was organised by object rather than by page: layout, card, form and utility layers, so a new screen could be composed from existing parts.",
          "Breaking changes were caught by opening every page in a narrow viewport first — a habit that carried directly into the responsive work on the React projects.",
        ],
        steps: [
          { title: "SYSTEM", body: "Define shared custom properties and type scale." },
          { title: "CATALOGUE", body: "Card grid with filtering and detail states." },
          { title: "AUTH", body: "A quieter login and registration surface." },
          { title: "SETTINGS", body: "Inventory and preference controls." },
        ],
      },
      decisions: [
        {
          title: "CUSTOM PROPERTIES FROM DAY ONE",
          body: "Colours, spacing and type sizes live in CSS variables shared by every page, so the visual system stays consistent without a framework.",
          tradeoff: "Verbose CSS, but trivial to re-theme.",
        },
        {
          title: "STATE IN THE DOM",
          body: "No virtual state layer: what the browser shows is what exists, which keeps the whole app debuggable by inspection.",
          tradeoff: "More manual updates, far less indirection.",
        },
      ],
      features: [
        { title: "CARD CATALOGUE", body: "Shelf-like grid with clear title hierarchy." },
        { title: "AUTH SCREENS", body: "Login and registration surfaces sharing the same system." },
        { title: "SETTINGS", body: "Inventory and preference controls for the library." },
        { title: "ZERO DEPENDENCIES", body: "Loads with no build step and no package install." },
      ],
      code: {
        language: "css",
        filename: "style.css",
        snippet: `:root {
  --shelf-ink: #14110e;
  --shelf-paper: #f6f1e8;
  --shelf-accent: #b8763a;
  --shelf-gap: clamp(0.75rem, 2vw, 1.5rem);
  --shelf-radius: 2px;
}

.catalogue {
  display: grid;
  gap: var(--shelf-gap);
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}`,
      },
      result: {
        body: [
          "Bookora still runs from a folder with no installation. It is the clearest proof in this portfolio that visual polish and engineering rigour are not the same thing as dependencies.",
          "The lessons from this build — a shared token layer, object-based CSS, narrow-viewport first — show up in every React project above.",
        ],
        metrics: [
          { value: "0", label: "DEPENDENCIES" },
          { value: "3", label: "SHARED PAGES" },
          { value: "NO", label: "BUILD STEP" },
        ],
      },
    },
  },
  {
    slug: "storefront",
    number: "06",
    title: "STOREFRONT",
    subtitle: "STATIC E-COMMERCE BUILD",
    description:
      "A front-end commerce build — product listing, detail and cart surfaces — written in plain HTML, CSS and JavaScript.",
    category: "frontend",
    categoryLabel: "FRONTEND BUILD",
    year: "2025",
    role: "DESIGN + FRONTEND",
    timeline: "COURSEWORK",
    stack: ["HTML", "CSS", "JavaScript"],
    links: {
      live: "",
      github: "https://github.com/messi10istheGoat/Project-E-Commerce-Website",
    },
    preview: "commerce",
    accent: "#8cc84b",
    metrics: [
      { value: "3", label: "SHOPPING SURFACES" },
      { value: "0", label: "FRAMEWORKS" },
      { value: "VANILLA", label: "STACK" },
    ],
    caseStudy: {
      overview: [
        "A storefront front end built with the same no-framework discipline as Bookora: a product listing, a detail view and a cart, written directly in HTML, CSS and JavaScript.",
        "The interesting part of a commerce build is not the visuals — it is the small amount of state that has to stay coherent as a shopper moves between surfaces.",
      ],
      challenge: {
        body: [
          "Cart state has to survive navigation and reloads without a framework providing it, and the product grid has to stay responsive while the imagery loads.",
          "There is also an honesty problem in demo commerce: it is easy to build a checkout button that pretends to charge someone. This build does not.",
        ],
        constraints: [
          "Cart persists across pages without a backend.",
          "Product imagery must not break the grid on slow connections.",
          "No dependency on a framework or build tool.",
          "No simulated payment flow.",
        ],
      },
      research: {
        body: [
          "The layout follows conventional commerce patterns deliberately — a shopper already knows where the price, the variant and the add button live, and novelty there costs conversion.",
          "The visual budget went into whitespace and product framing instead of decoration.",
        ],
        findings: [
          { label: "PATTERN", value: "CONVENTIONAL" },
          { label: "CART", value: "LOCAL STORAGE" },
          { label: "GRID", value: "RESPONSIVE" },
          { label: "PAYMENTS", value: "NONE" },
        ],
      },
      architecture: {
        body: [
          "One shared script owns the cart in local storage and re-renders the cart badge on load; each page then reads the same state.",
          "Product data is defined in the markup and JavaScript constants rather than fetched, which is appropriate for a fixed catalogue and keeps the build dependency-free.",
        ],
        layers: [
          { code: "01", label: "LISTING", note: "Product grid with responsive columns" },
          { code: "02", label: "DETAIL", note: "Product view with variant and quantity controls" },
          { code: "03", label: "CART", note: "Persisted state and badge synchronisation" },
          { code: "04", label: "ASSETS", note: "Locally served product imagery" },
        ],
      },
      build: {
        body: [
          "The CSS was written mobile-first, with the grid built on `auto-fill` and `minmax` so it never needs breakpoint-specific column counts.",
          "Images use aspect-ratio boxes so the layout does not jump while they decode — the same technique used by the visuals on this portfolio.",
        ],
        steps: [
          { title: "GRID", body: "Auto-filling responsive product grid." },
          { title: "DETAIL", body: "Variant and quantity selection without a framework." },
          { title: "CART", body: "Local storage state with badge syncing." },
          { title: "POLISH", body: "Aspect-ratio media and hover states." },
        ],
      },
      decisions: [
        {
          title: "LOCAL STORAGE CART",
          body: "Persisting the cart in the browser keeps the build static while still surviving reloads.",
          tradeoff: "Per-device carts, no server-side stock validation.",
        },
        {
          title: "NO FAKE CHECKOUT",
          body: "The cart is the end of the flow by design. Pretending to take payment in a portfolio piece would be misleading.",
          tradeoff: "An incomplete commerce story, an honest one.",
        },
      ],
      features: [
        { title: "PRODUCT GRID", body: "Responsive listing that reflows without breakpoints." },
        { title: "PRODUCT DETAIL", body: "Individual product surface with controls." },
        { title: "PERSISTED CART", body: "Cart state survives navigation and reload." },
        { title: "ZERO DEPENDENCIES", body: "Plain HTML, CSS and JavaScript only." },
      ],
      code: {
        language: "js",
        filename: "script.js",
        snippet: `const CART_KEY = "storefront:cart";

/** The cart is the only cross-page state; everything else is presentational. */
const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = String(items.length);
  });
};`,
      },
      result: {
        body: [
          "A dependency-free storefront that behaves correctly across three surfaces and survives a reload.",
          "The transferable insight was about convention: in commerce, familiarity is a feature, and the engineering effort belongs in state and layout rather than novelty.",
        ],
        metrics: [
          { value: "3", label: "SURFACES" },
          { value: "0", label: "FRAMEWORKS" },
          { value: "PERSISTED", label: "CART" },
        ],
      },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/**
 * Related case studies: same category first, then the most recent others.
 * Falling back to `slice(0, count)` previously showed the same two projects
 * on every page.
 */
export function relatedProjects(slug: string, count = 2): Project[] {
  const current = getProject(slug);
  const others = projects.filter((project) => project.slug !== slug);
  if (!current) return others.slice(0, count);

  return others
    .map((project) => ({
      project,
      score:
        (project.category === current.category ? 2 : 0) +
        (Math.abs(Number(project.year) - Number(current.year)) <= 1 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((entry) => entry.project);
}
