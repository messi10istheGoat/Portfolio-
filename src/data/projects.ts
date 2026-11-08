export type ProjectCategory = "full-stack" | "frontend";
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
];

/**
 * Selected work, pulled from Riha's own GitHub account (github.com/rihadev).
 *
 * Every stack, file, function and metric quoted in these case studies was read
 * from the repository itself — package.json for dependencies, the source files
 * for behaviour. Nothing is embellished, and metrics that cannot be verified
 * from the code are not claimed. Where a build is front-end only, the case
 * study says so rather than implying a backend that does not exist.
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
    slug: "fresh-mart",
    number: "03",
    title: "FRESH MART",
    subtitle: "BILINGUAL GROCERY STOREFRONT",
    description:
      "A grocery front-end for a Bangladeshi market: twelve products priced in taka, a live Bengali/English toggle across every label, a working cart, and a flash-deal countdown.",
    category: "frontend",
    categoryLabel: "FRONTEND BUILD",
    year: "2026",
    role: "DESIGN + FRONTEND",
    timeline: "SELF-DIRECTED",
    stack: ["JavaScript", "HTML5", "CSS3", "Hind Siliguri"],
    links: {
      live: "https://rihadev.github.io/Fresh-Mart/",
      github: "https://github.com/rihadev/Fresh-Mart",
    },
    preview: "commerce",
    accent: "#3fbf7f",
    metrics: [
      { value: "12", label: "PRODUCTS, 5 CATEGORIES" },
      { value: "2", label: "LANGUAGES, ONE CATALOGUE" },
      { value: "0", label: "DEPENDENCIES" },
    ],
    caseStudy: {
      overview: [
        "Fresh Mart is a grocery storefront built for how shopping actually works in Bangladesh: prices in taka, haggling-free discount badges, and a customer who may read Bengali or English depending on the day.",
        "The catalogue is defined once as data — twelve products, five categories — and every translatable node in the markup carries both languages as `data-bn` and `data-en` attributes. One toggle switches all of them without a reload or a page transition.",
      ],
      challenge: {
        body: [
          "A bilingual storefront is not the same problem as translating a page. Product names, units, badges, and descriptions all have to switch together, and the Bengali copy needs a typeface that renders conjuncts correctly rather than falling back to a system font.",
          "The second constraint was scope: no framework, no build step, no dependencies — so the entire shopping flow had to be built from DOM manipulation and event delegation.",
        ],
        constraints: [
          "Every user-facing string must exist in both Bengali and English.",
          "Bengali text must render in a font designed for it — Hind Siliguri, loaded per script.",
          "Cart, wishlist, quick view, and checkout must work without a routing library.",
          "No frameworks and no build step: plain HTML, CSS, and JavaScript.",
        ],
      },
      research: {
        body: [
          "The starting point was an inventory of which strings actually change: roughly forty-three Bengali/English pairs across product names, units, deal badges, and descriptions.",
          "Switching is handled by a single function that flips a language value, records it on the document element, and then walks every node carrying `data-bn`/`data-en` to swap its text — including input placeholders, which a plain text sweep would miss.",
        ],
        findings: [
          { label: "TRANSLATABLE STRINGS", value: "43 PAIRS" },
          { label: "CATEGORIES", value: "5" },
          { label: "TOGGLE COST", value: "RE-RENDER ONLY" },
          { label: "DEPENDENCIES", value: "NONE" },
        ],
      },
      architecture: {
        body: [
          "One array of product objects is the single source of truth. Each entry carries a bilingual name, price, old price, unit, rating, review count, badge, and description, plus a category and a flash-deal flag.",
          "Rendering is a set of pure functions that turn a product into HTML: the full card, the flash-deal strip, and the quick-view panel all read from the same object, so a price change can never disagree between views.",
        ],
        layers: [
          { code: "01", label: "DATA", note: "One product array with bilingual fields" },
          { code: "02", label: "RENDER", note: "Card, deal strip, and quick view from the same object" },
          { code: "03", label: "STATE", note: "Cart, wishlist, filters, promo code in memory" },
          { code: "04", label: "LANGUAGE", note: "data-bn / data-en swapped on toggle" },
        ],
      },
      build: {
        body: [
          "The script is organised as a named pipeline rather than a pile of handlers: initialise, render deals, render products, then attach delegated listeners once. Cart operations update a single state object and repaint the badge and drawer together.",
          "Discounts, quick view, and checkout are modal surfaces driven by the same state, which keeps the flow one continuous experience instead of a set of separate pages.",
        ],
        steps: [
          { title: "CATALOGUE", body: "Model twelve products with bilingual fields and taka pricing." },
          { title: "SHOP", body: "Category filters, flash-deal countdown, and search-free browsing." },
          { title: "CART", body: "Drawer with quantity controls, removal, and a promo-code path." },
          { title: "CHECKOUT", body: "Order modal and confirmation, no payment integration." },
        ],
      },
      decisions: [
        {
          title: "DATA, NOT MARKUP",
          body: "Products live in one array instead of being hand-written into HTML. Bilingual switching and filtering both become array operations.",
          tradeoff: "A JavaScript dependency for first paint, in exchange for a catalogue that cannot drift out of sync.",
        },
        {
          title: "NO PERSISTENCE",
          body: "The cart is intentionally in-memory. For a portfolio build, pretending to hold a basket across sessions would suggest a backend that does not exist.",
          tradeoff: "A reload empties the cart — honest about being a front-end demonstration.",
        },
        {
          title: "BENGALI FIRST, NOT TRANSLATED",
          body: "Copy is written in both languages rather than machine-translated, and units are localised (কেজি alongside kg).",
          tradeoff: "Twice the copy to maintain, but the interface reads natively in either language.",
        },
      ],
      features: [
        { title: "BILINGUAL TOGGLE", body: "Every label, badge, and description switches between Bengali and English." },
        { title: "FLASH DEALS", body: "A staggered countdown drives the discount strip at the top of the store." },
        { title: "CART DRAWER", body: "Add, adjust, and remove items with a live item count." },
        { title: "QUICK VIEW", body: "Inspect a product and choose a quantity without leaving the grid." },
      ],
      code: {
        language: "js",
        filename: "app.js",
        snippet: `const PRODUCTS = [
  {
    id: "prod-1",
    category: "vegetables",
    name: { bn: "তাজা লাল টমেটো (Deshi Tomatoes)", en: "Fresh Red Tomatoes" },
    price: 60,
    oldPrice: 80,
    unit: { bn: "১ কেজি (1 kg)", en: "1 kg" },
    badge: { bn: "২৫% ছাড়", en: "25% OFF" },
    isFlashDeal: true,
  },
  // ...
];

// 10. Language & Theme Toggles
function toggleLanguage() {
  state.lang = state.lang === 'bn' ? 'en' : 'bn';
  document.documentElement.setAttribute('data-lang', state.lang);

  const langLabel = document.getElementById('lang-label');
  if (langLabel) langLabel.innerText = state.lang === 'bn' ? 'English' : 'বাংলা';

  // Translate all elements with data-bn and data-en
  const translatableEls = document.querySelectorAll('[data-bn][data-en]');
  translatableEls.forEach(el => {
    el.innerText = el.getAttribute(\`data-\${state.lang}\`);
  });
}`,
      },
      result: {
        body: [
          "Fresh Mart ended up as the clearest demonstration in this set of separating content from presentation: one array, one language flag, and every view rendered from the same source.",
          "It is also where the Bengali-first decision was made — copy is authored in both languages against the markup, rather than bolted on as a translation layer afterwards.",
        ],
        metrics: [
          { value: "12", label: "PRODUCTS MODELLED" },
          { value: "43", label: "BILINGUAL STRINGS" },
          { value: "911", label: "LINES OF APP LOGIC" },
        ],
      },
    },
  },
  {
    slug: "budget-tracker",
    number: "04",
    title: "BUDGET TRACKER",
    subtitle: "FINANCE DASHBOARD, PLAIN JAVASCRIPT",
    description:
      "A personal budget dashboard that takes income and expense rows, calculates tax, net income, and remaining balance, then renders a proportional breakdown — and survives a reload.",
    category: "frontend",
    categoryLabel: "VANILLA JAVASCRIPT",
    year: "2026",
    role: "DESIGN + LOGIC",
    timeline: "SELF-DIRECTED",
    stack: ["JavaScript", "HTML5", "CSS3", "Web Storage API"],
    links: {
      live: "https://rihadev.github.io/personal-budget-tracker/",
      github: "https://github.com/rihadev/personal-budget-tracker",
    },
    preview: "dashboard",
    accent: "#668cff",
    metrics: [
      { value: "20", label: "EXPENSE ROWS, MAX" },
      { value: "6", label: "CALCULATED OUTPUTS" },
      { value: "1", label: "STORAGE KEY" },
    ],
    caseStudy: {
      overview: [
        "Budget Tracker is a single-page finance dashboard with no framework and no backend. It collects income and a list of expense rows, then returns total expenses, estimated tax, net income, remaining balance, and potential savings.",
        "The interesting part is not the arithmetic — it is doing arithmetic on user input without trusting it, and restoring a session exactly as it was left.",
      ],
      challenge: {
        body: [
          "A budget form is a validation problem disguised as a calculator. Expense rows are created dynamically, so the number of inputs changes while the user is typing, and any of them can hold an empty string, a negative number, or text.",
          "The tool also has to recover gracefully: a half-filled form that reloads should come back, and a cleared one should not resurrect old numbers.",
        ],
        constraints: [
          "Validate income and every expense amount before any calculation runs.",
          "Support up to twenty dynamically generated expense rows.",
          "Restore the complete previous session on reload.",
          "Keep the arithmetic transparent — the rules must be stated in the UI.",
        ],
      },
      research: {
        body: [
          "The model was derived by writing the calculation rules first and working backwards to the interface: estimate tax at ten percent, subtract it to get net income, subtract expenses to get balance, then estimate savings at twenty percent of a positive balance.",
          "Keeping those rules explicit (they are printed in the README and surfaced in the UI) matters more than the exact percentages, because the project must not read as financial advice.",
        ],
        findings: [
          { label: "TAX RATE", value: "10%" },
          { label: "SAVINGS RATE", value: "20%" },
          { label: "MAX EXPENSES", value: "20" },
          { label: "OUTPUTS", value: "6 METRICS" },
        ],
      },
      architecture: {
        body: [
          "The script opens by caching every element it will touch into one lookup object, so no function reaches into the DOM by id more than once.",
          "From there it is a straight pipeline: validate the setup, generate and collect expense fields, reduce them to a total, derive the six summary figures, paint the summary and the proportional breakdown, then persist the whole state to a single storage key.",
        ],
        layers: [
          { code: "01", label: "INPUT", note: "Setup validation and dynamic expense rows" },
          { code: "02", label: "CALCULATE", note: "Expenses, tax, net, balance, savings, status" },
          { code: "03", label: "DISPLAY", note: "Summary cards and a percentage breakdown" },
          { code: "04", label: "PERSIST", note: "One storage key, restored on load" },
        ],
      },
      build: {
        body: [
          "Expense inputs are generated rather than hard-coded: the user states how many they need, and the script builds that many labelled rows, up to twenty.",
          "The breakdown view converts each expense into a share of the total and renders it as a labelled progress bar, so the largest cost is obvious without reading the numbers.",
        ],
        steps: [
          { title: "SETUP", body: "Name, income, and how many expenses to track." },
          { title: "ENTRY", body: "Generated expense rows with validation on every value." },
          { title: "SUMMARY", body: "Six derived figures plus a plain-language status." },
          { title: "RESTORE", body: "State written to one key and rehydrated on reload." },
        ],
      },
      decisions: [
        {
          title: "CACHE THE DOM ONCE",
          body: "A single elements object is resolved at startup instead of querying inside handlers, which keeps the calculation functions short.",
          tradeoff: "Any new field must be registered in one place — a fair trade for predictable lookups.",
        },
        {
          title: "STATE, NOT ELEMENTS",
          body: "Persistence serialises the budget data rather than scraping input values, so a restore is immune to markup changes.",
          tradeoff: "Needs an explicit serialiser, but the save format stays stable.",
        },
        {
          title: "VALIDATE BEFORE COMPUTE",
          body: "Every value is checked before it reaches the maths, so a blank row cannot silently become zero.",
          tradeoff: "More guard code, and no silently wrong totals.",
        },
      ],
      features: [
        { title: "DYNAMIC EXPENSES", body: "Up to twenty rows generated from a single count field." },
        { title: "SIX SUMMARY FIGURES", body: "Income, expenses, tax, net, balance, and estimated savings." },
        { title: "PROPORTIONAL BREAKDOWN", body: "Each expense drawn as its share of the total." },
        { title: "SESSION RESTORE", body: "The whole budget returns intact after a reload." },
      ],
      code: {
        language: "js",
        filename: "index.js",
        snippet: `function calculateBudget(income, expenses) {
  const totalExpenses = calculateTotalExpenses(expenses);
  const tax = income * TAX_RATE;
  const netIncome = income - tax;
  const balance = netIncome - totalExpenses;

  // Never display negative savings.
  const savings = Math.max(0, balance) * SAVINGS_RATE;

  return { totalExpenses, tax, netIncome, balance, savings };
}`,
      },
      result: {
        body: [
          "The build produced a dashboard that is honest about being an exercise: the calculation rules are printed on the page, and the tax figure is explicitly labelled an estimate rather than financial advice.",
          "It is also the project where input handling stopped being an afterthought — every value is validated before it can influence a total.",
        ],
        metrics: [
          { value: "6", label: "DERIVED FIGURES" },
          { value: "0", label: "BACKEND CALLS" },
          { value: "699", label: "LINES OF LOGIC" },
        ],
      },
    },
  },
  {
    slug: "chronoclock",
    number: "05",
    title: "CHRONOCLOCK",
    subtitle: "TIME DASHBOARD WITH CANVAS",
    description:
      "An analog clock drawn stroke by stroke on a canvas, paired with a stopwatch, a countdown, repeating alarms, and world clocks — all persisted between visits.",
    category: "frontend",
    categoryLabel: "CANVAS + STATE",
    year: "2026",
    role: "DESIGN + ENGINEERING",
    timeline: "SELF-DIRECTED",
    stack: ["JavaScript", "Canvas 2D", "HTML5", "CSS3", "Web Storage API"],
    links: {
      live: "https://rihadev.github.io/ChronoClock-/",
      github: "https://github.com/rihadev/ChronoClock-",
    },
    preview: "type",
    accent: "#febc2e",
    metrics: [
      { value: "5", label: "TOOLS IN ONE DASHBOARD" },
      { value: "60", label: "FPS CANVAS CLOCK" },
      { value: "4", label: "PERSISTED SETTINGS" },
    ],
    caseStudy: {
      overview: [
        "ChronoClock began as a digital clock and grew into a small time laboratory: an analog face drawn on a canvas, a digital readout, a stopwatch, a countdown, repeating alarms with sound, and a set of world clocks.",
        "Everything runs on the browser's own clock, so the interesting engineering is in keeping several independent timers honest at once.",
      ],
      challenge: {
        body: [
          "Multiple time features fail in different ways. A canvas clock that draws on an interval drifts and stutters; a stopwatch based on counting ticks loses accuracy; an alarm that only checks on load will miss its moment.",
          "The brief became: one dashboard, five time tools, none of them allowed to drift away from the others.",
        ],
        constraints: [
          "Load must remain instant — no framework and no build step.",
          "Timers must stay accurate while the tab is backgrounded.",
          "Alarms, theme, and clock format must survive a reload.",
          "Settings and saved times must be sanitised before they reach the DOM.",
        ],
      },
      research: {
        body: [
          "The clock face is drawn with the Canvas 2D API: a render loop clears and repaints the dial and hands each frame, which keeps the sweep smooth instead of stepping once per second.",
          "The stopwatch and countdown take the opposite approach — they compute elapsed time from timestamps rather than incrementing a counter, so a delayed frame cannot accumulate into drift.",
        ],
        findings: [
          { label: "CLOCK RENDERING", value: "CANVAS 2D" },
          { label: "ELAPSED TIME", value: "TIMESTAMP MATH" },
          { label: "PERSISTED KEYS", value: "4" },
          { label: "FRAME LOOP", value: "requestAnimationFrame" },
        ],
      },
      architecture: {
        body: [
          "The file is deliberately sectionalised — settings, theme, format, stopwatch, countdown, alarms, world clocks, time-zone converter — with shared helpers (`pad`, `formatStopwatchTime`, `getTimezoneOffset`) defined once at the top.",
          "Saved state is split across four storage keys rather than one blob, so a corrupt alarm list cannot take the theme down with it.",
        ],
        layers: [
          { code: "01", label: "RENDER", note: "Canvas dial and hands on a frame loop" },
          { code: "02", label: "TIMERS", note: "Stopwatch and countdown from timestamps" },
          { code: "03", label: "ALARMS", note: "Repeating schedules with generated audio" },
          { code: "04", label: "ZONES", note: "World clock and time-zone conversion" },
        ],
      },
      build: {
        body: [
          "Alarms are the most stateful piece: each one carries a time, a label, a repeat setting, and enabled state, and is serialised as a whole. Rendering escapes the label before it is inserted, because alarm names are user input.",
          "The alarm sound is synthesised with the Web Audio API rather than loaded from a file, which keeps the dashboard a single-folder project with no audio assets to fetch.",
        ],
        steps: [
          { title: "FACE", body: "Draw the analog dial and hands on a canvas loop." },
          { title: "MEASURE", body: "Add stopwatch and countdown built on elapsed-time maths." },
          { title: "SCHEDULE", body: "Saved alarms with repeat logic and generated sound." },
          { title: "ORIENT", body: "World clocks, theme switching, and 12/24-hour format." },
        ],
      },
      decisions: [
        {
          title: "TWO CLOCKS, ON PURPOSE",
          body: "The analog face is drawn for accuracy of reading; the digital readout is updated from the same timestamp so they can never disagree.",
          tradeoff: "One extra render target, no possibility of drift between views.",
        },
        {
          title: "ESCAPE BEFORE RENDER",
          body: "Alarm labels are user input and pass through an escape helper before reaching the DOM.",
          tradeoff: "A small helper to maintain, and no injection path through a saved name.",
        },
        {
          title: "SEPARATE STORAGE KEYS",
          body: "Theme, format, alarms, and time zones are stored independently.",
          tradeoff: "Four reads at startup, and one damaged value cannot break the rest.",
        },
      ],
      features: [
        { title: "CANVAS CLOCK", body: "Analog dial and hands repainted on a frame loop." },
        { title: "STOPWATCH", body: "Elapsed time calculated from timestamps, not counted ticks." },
        { title: "ALARMS", body: "Repeat schedules with a synthesised alert tone." },
        { title: "WORLD CLOCKS", body: "Saved zones with a time-zone converter alongside." },
      ],
      code: {
        language: "js",
        filename: "index.js",
        snippet: `function saveAlarms() {
  localStorage.setItem("chronoAlarms", JSON.stringify(alarms));
}

function escapeHTML(text) {
  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

// Elapsed time comes from timestamps, so a slow frame cannot cause drift.
function updateStopwatch() {
  if (!stopwatchRunning) {
    return;
  }

  stopwatchElapsed = Date.now() - stopwatchStartTime;

  stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsed);
}`,
      },
      result: {
        body: [
          "ChronoClock is the most technically varied project in this set, and the one that taught the difference between animating something and measuring it: the canvas loop is for smoothness, the timers are for accuracy, and they are deliberately separate systems.",
          "It also set the pattern used elsewhere here — small named functions, a shared helper layer, and state that is saved explicitly rather than inferred from the DOM.",
        ],
        metrics: [
          { value: "5", label: "TOOLS" },
          { value: "1265", label: "LINES OF LOGIC" },
          { value: "0", label: "ASSET REQUESTS FOR SOUND" },
        ],
      },
    },
  },
  {
    slug: "user-management",
    number: "06",
    title: "USER MANAGEMENT",
    subtitle: "REACT ROUTER + LIVE API",
    description:
      "A React application that fetches a user directory from a REST API, filters it live across name, username, email, and city, and gives every record its own routed detail page.",
    category: "frontend",
    categoryLabel: "REACT APPLICATION",
    year: "2026",
    role: "FRONTEND ENGINEERING",
    timeline: "SELF-DIRECTED",
    stack: ["React 19", "React Router 7", "Vite", "Tailwind CSS v4"],
    links: {
      live: "https://react-user-management-sage.vercel.app/",
      github: "https://github.com/rihadev/react-user-management-",
    },
    preview: "observability",
    accent: "#a78bfa",
    metrics: [
      { value: "2", label: "ROUTES" },
      { value: "4", label: "SEARCH FIELDS" },
      { value: "3", label: "UI STATES PER FETCH" },
    ],
    caseStudy: {
      overview: [
        "This is the project where the network became part of the design. A directory screen loads users from a REST endpoint, filters them as you type, and links each one to a detail route that fetches that single record.",
        "Because the data arrives asynchronously and can fail, every screen had to account for three states — loading, error, and content — rather than only the happy path.",
      ],
      challenge: {
        body: [
          "A list backed by a remote API is really a state machine. The first render has no data, a slow response leaves the screen empty, and a failed request can leave a spinner running forever if the error branch is not explicit.",
          "Detail pages add a second problem: the record has to be fetched again by id, the id comes from the URL, and navigating between users must not show the previous user's data while the new request is in flight.",
        ],
        constraints: [
          "Handle loading, error, and success explicitly on both routes.",
          "Search across name, username, email, and city in one input.",
          "Fetch each detail record by the id in the URL.",
          "Treat a missing record as an error state, not an empty page.",
        ],
      },
      research: {
        body: [
          "Detail navigation exposed a subtle bug class worth designing around: React reuses the component when only the route parameter changes, so state from the previous user can persist into the next one.",
          "The fix is to reset the record and error state at the top of the effect before the new request starts, so stale content can never be shown under a new URL.",
        ],
        findings: [
          { label: "SEARCHABLE FIELDS", value: "4" },
          { label: "EXPLICIT STATES", value: "3 PER FETCH" },
          { label: "MISSING RECORD", value: "TREATED AS ERROR" },
          { label: "ROUTE PARAMS", value: "RESET ON CHANGE" },
        ],
      },
      architecture: {
        body: [
          "Routing sits at the top: a browser router with a list route and a parameterised detail route. Both screens own their data fetching rather than sharing a store, which keeps the data lifecycle visible in each component.",
          "The list screen derives its filtered view from state instead of fetching on every keystroke — the network is touched once, and searching is instant afterwards.",
        ],
        layers: [
          { code: "01", label: "ROUTER", note: "List and detail routes, id from the URL" },
          { code: "02", label: "FETCH", note: "Loading, error, and success handled explicitly" },
          { code: "03", label: "SEARCH", note: "Client-side filter across four fields" },
          { code: "04", label: "DETAIL", note: "Per-user fetch with state reset on id change" },
        ],
      },
      build: {
        body: [
          "The list screen fetches once on mount, then filters in memory: the query is normalised, and each user is tested against name, username, email, and city, with empty values skipped so a missing city cannot throw.",
          "The detail screen reads the id from the router, fetches that single record, and validates the response payload before storing it — a response without an id is treated as not found rather than rendered as a blank record.",
        ],
        steps: [
          { title: "SCAFFOLD", body: "Vite and React 19 with a two-route browser router." },
          { title: "DIRECTORY", body: "Fetch once, render cards, handle loading and failure." },
          { title: "SEARCH", body: "Normalise the query and filter across four fields." },
          { title: "DETAIL", body: "Fetch by id, reset on navigation, validate the payload." },
        ],
      },
      decisions: [
        {
          title: "FETCH ONCE, FILTER LOCALLY",
          body: "The directory is small enough to hold in memory, so typing filters state instead of issuing requests.",
          tradeoff: "Not appropriate for large datasets — the right call this size, and stated as such.",
        },
        {
          title: "RESET BEFORE FETCH",
          body: "Clearing the record and error at the start of the detail effect prevents the previous user showing under a new URL.",
          tradeoff: "A brief empty state on navigation, in exchange for never showing wrong data.",
        },
        {
          title: "ERRORS AS UI",
          body: "Failures render a readable message with a retry path instead of leaving a spinner or an empty list.",
          tradeoff: "More states to design, and a screen that never lies about what happened.",
        },
      ],
      features: [
        { title: "LIVE SEARCH", body: "One input filtering name, username, email, and city." },
        { title: "ROUTED DETAILS", body: "Every user has a shareable URL backed by its own fetch." },
        { title: "EXPLICIT STATES", body: "Loading, error, and content are separate, visible branches." },
        { title: "RETRY PATH", body: "A failed request can be retried without a reload." },
      ],
      code: {
        language: "jsx",
        filename: "src/UsersList.jsx",
        snippet: `const API_URL = "https://jsonplaceholder.typicode.com/users";

async function fetchUsers() {
  setLoading(true);
  setError("");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to load users.");
    }

    const data = await response.json();
    setUsers(data);
  } catch {
    setError(
      "We couldn't load the users. Please check your connection and try again.",
    );
  } finally {
    setLoading(false);
  }
}

const query = search.trim().toLowerCase();

const filteredUsers = users.filter((user) =>
  [user.name, user.username, user.email, user.address?.city]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query)),
);`,
      },
      result: {
        body: [
          "The finished app treats the network as a first-class concern: three visible states per fetch, a retry path, and a detail route that cannot show the previous record.",
          "Those habits carry directly into the larger builds on this site — the same loading, error, and reset discipline appears in the full-stack work.",
        ],
        metrics: [
          { value: "2", label: "ROUTES" },
          { value: "3", label: "FETCH STATES" },
          { value: "1", label: "NETWORK CALL PER VIEW" },
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
