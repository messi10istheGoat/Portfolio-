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

export const projects: Project[] = [
  {
    slug: "ledgerly",
    number: "01",
    title: "LEDGERLY",
    subtitle: "PERSONAL FINANCE TRACKER",
    description:
      "A financial command centre for tracking income, expenses, budgets, and month-over-month behaviour without spreadsheet friction.",
    category: "full-stack",
    categoryLabel: "FULL-STACK PRODUCT",
    year: "2025",
    role: "DESIGN + ENGINEERING",
    timeline: "10 WEEKS",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Tailwind"],
    links: {
      live: "https://example.com/ledgerly",
      github: "https://github.com/arifrahman-dev/ledgerly",
    },
    preview: "dashboard",
    accent: "#668cff",
    metrics: [
      { value: "12K+", label: "TRANSACTIONS MODELLED" },
      { value: "<120ms", label: "DASHBOARD TTFB" },
      { value: "98", label: "LIGHTHOUSE A11Y" },
    ],
    caseStudy: {
      overview: [
        "Ledgerly is a personal finance workspace that treats money as a data problem rather than a spreadsheet problem. Income, expenses, categories, and budgets live in a strict relational model, then surface through a dashboard designed for a ten-second daily check-in.",
        "The product handles recurring transactions, category budgets, and monthly comparisons. Everything is derived from a single source of truth so that totals never drift between views.",
      ],
      challenge: {
        body: [
          "Most finance trackers fail in the same place: inconsistent numbers. A dashboard total, a filtered table, and a monthly report are usually computed in three separate places, then quietly disagree.",
          "The goal was a system where every number is provably derived from the same ledger — and where entering a transaction takes under fifteen seconds on a phone.",
        ],
        constraints: [
          "All aggregates must come from one transactional source.",
          "Sub-150ms perceived interaction on mid-range mobile devices.",
          "Keyboard-first entry with complete screen-reader labelling.",
          "Self-hostable, no third-party financial data brokers.",
        ],
      },
      research: {
        body: [
          "I ran five lightweight workflow interviews with people who track money manually, then audited six existing trackers. The pattern was consistent: heavy onboarding, shallow daily use.",
          "The insight that shaped the build: people do not want analytics, they want reassurance. The default view had to answer one question — how much room do I have left this month?",
        ],
        findings: [
          { label: "DAILY SESSION AVG.", value: "42 SECONDS" },
          { label: "MOST USED ACTION", value: "ADD EXPENSE" },
          { label: "BIGGEST COMPLAINT", value: "TOTALS DISAGREE" },
          { label: "MOST IGNORED AREA", value: "LONG REPORTS" },
        ],
      },
      architecture: {
        body: [
          "A single Next.js application serves both a server-rendered dashboard and typed API routes. Aggregates are computed in SQL, not in the React tree, so the database remains the only opinion about money.",
          "Mutations run inside transactions. A transfer writes a paired debit and credit atomically; a failed write rolls back both, and the client receives a typed error shape it can render inline.",
        ],
        layers: [
          { code: "01", label: "CLIENT", note: "React Server Components + optimistic entry forms" },
          { code: "02", label: "SERVICE", note: "Typed route handlers, zod-validated payloads" },
          { code: "03", label: "DOMAIN", note: "Ledger rules, category budgets, recurring logic" },
          { code: "04", label: "STORE", note: "PostgreSQL + Drizzle, SQL-side aggregation" },
        ],
      },
      build: {
        body: [
          "The interface is built from a small set of primitives: a metric slab, a transaction row, a category bar, and a filter rail. Every screen is a composition of those four, which kept the visual language tight and the bundle small.",
          "Charts are hand-built SVG — no charting dependency. A simple area path and tick marks were enough, and they inherit the accent token like everything else.",
        ],
        steps: [
          { title: "MODEL", body: "Accounts, transactions, categories, and budgets with strict foreign keys." },
          { title: "SURFACE", body: "Three-view shell: overview, ledger table, budget editor." },
          { title: "FAST PATH", body: "Quick-add sheet optimised for thumb reach and autofocus." },
          { title: "TRUST", body: "Reconciliation view that explains every derived total." },
        ],
      },
      decisions: [
        {
          title: "SQL AGGREGATES OVER CLIENT MATH",
          body: "Every total is a database aggregate wrapped in a typed query. The UI never re-adds numbers, which eliminates an entire class of drift bugs.",
          tradeoff: "Requires careful indexing, but removes duplicated business logic.",
        },
        {
          title: "NO CHARTING LIBRARY",
          body: "Hand-authored SVG paths kept the client bundle small and let the visuals share the design tokens directly.",
          tradeoff: "Fewer built-in interactions, more control over the result.",
        },
        {
          title: "OPTIMISTIC ENTRY, SERVER TRUTH",
          body: "New transactions appear instantly with a pending state, then settle to the server response. Failures roll back with an inline explanation.",
          tradeoff: "More state to manage, dramatically better perceived speed.",
        },
      ],
      features: [
        { title: "LIVE MONTH VIEW", body: "Income, spend, and remaining budget recalculated per transaction." },
        { title: "BUDGET LINES", body: "Per-category limits with warning thresholds at 80% and 100%." },
        { title: "RECURRING RULES", body: "Scheduled entries materialise automatically on their due date." },
        { title: "CSV IMPORT", body: "Column mapping preview before any row is committed." },
        { title: "KEYBOARD LEDGER", body: "Arrow navigation, inline edit, and command-based creation." },
        { title: "RECONCILIATION", body: "A drill-down that traces each total to its source rows." },
      ],
      code: {
        language: "ts",
        filename: "lib/queries/spend.ts",
        snippet: `export async function monthlySpend(month: string) {
  return db
    .select({
      category: transactions.categoryId,
      total: sql<number>\`sum(\${transactions.amount})::int\`,
    })
    .from(transactions)
    .where(and(
      eq(transactions.type, "expense"),
      gte(transactions.occurredAt, startOfMonth(month)),
      lt(transactions.occurredAt, endOfMonth(month)),
    ))
    .groupBy(transactions.categoryId);
}`,
      },
      result: {
        body: [
          "Ledgerly now runs as the author's daily finance tool. The reconciliation view paid for itself immediately: every discrepancy is traceable to a row instead of becoming a mystery total.",
          "The biggest measurable win was interaction latency. Moving aggregation into SQL and rendering the dashboard on the server removed the loading spinners that were previously the main source of friction.",
        ],
        metrics: [
          { value: "0", label: "AGGREGATE DRIFT BUGS" },
          { value: "42s", label: "MEDIAN DAILY SESSION" },
          { value: "98", label: "ACCESSIBILITY SCORE" },
        ],
      },
    },
  },
  {
    slug: "synth",
    number: "02",
    title: "SYNTH",
    subtitle: "AI-POWERED RESEARCH PLATFORM",
    description:
      "An intelligent reading environment that turns scattered sources into structured notes, citations, and defensible answers.",
    category: "full-stack",
    categoryLabel: "AI PRODUCT",
    year: "2025",
    role: "PRODUCT + FULL-STACK",
    timeline: "12 WEEKS",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Streaming APIs", "Vector Search"],
    links: {
      live: "https://example.com/synth",
      github: "https://github.com/arifrahman-dev/synth",
    },
    preview: "ai",
    accent: "#a78bfa",
    metrics: [
      { value: "1.2s", label: "FIRST TOKEN" },
      { value: "3", label: "RETRIEVAL MODES" },
      { value: "100%", label: "CITED ANSWERS" },
    ],
    caseStudy: {
      overview: [
        "Synth is a research workspace where a question produces a streamed answer with inline citations, plus a persistent notebook of extracted claims. Sources stay attached to the sentences they support.",
        "The platform combines a document pipeline, vector retrieval, and a streaming chat surface. The product bet is simple: an answer without a traceable source is a rumour.",
      ],
      challenge: {
        body: [
          "Generic chat interfaces are fast but forgettable — answers vanish into scroll. Research tools are rigorous but slow, forcing manual note-taking that nobody maintains.",
          "Synth needed to be both: conversational on the surface, structured underneath. Every claim had to be attributable, and every answer had to survive a page reload.",
        ],
        constraints: [
          "Streaming responses with graceful degradation on slow networks.",
          "Source-grounded answers only, with visible citation anchors.",
          "Workspaces scoped per project with no cross-tenant leakage.",
          "Model provider must be swappable without touching the UI.",
        ],
      },
      research: {
        body: [
          "I shadowed three research-heavy workflows: a thesis literature review, a competitive analysis, and a technical due diligence pass. All three spent most of their time re-finding things they had already read.",
          "That reframed the feature set. Retrieval and note persistence mattered more than raw model quality, because the repeated cost was organisational, not generative.",
        ],
        findings: [
          { label: "TIME RE-FINDING", value: "38%" },
          { label: "ANSWERS USED VERBATIM", value: "RARE" },
          { label: "NOTES KEPT MANUALLY", value: "22%" },
          { label: "TRUST REQUIREMENT", value: "CITATIONS" },
        ],
      },
      architecture: {
        body: [
          "Documents are chunked, embedded, and stored alongside their workspace. A question triggers a hybrid retrieval pass, then a streamed generation call with the top passages injected as context.",
          "The streaming transport is a single route handler that emits structured events rather than raw tokens, so the client can build citations and completion state from the same stream.",
        ],
        layers: [
          { code: "01", label: "INGEST", note: "PDF / URL / markdown parsing & normalisation" },
          { code: "02", label: "INDEX", note: "Chunking, embeddings, workspace-scoped vectors" },
          { code: "03", label: "RETRIEVE", note: "Hybrid keyword + semantic ranking" },
          { code: "04", label: "STREAM", note: "Server-sent events with citation metadata" },
        ],
      },
      build: {
        body: [
          "The chat surface uses a three-state message model: pending, streaming, settled. Citations render as compact numbered anchors that expand into a source drawer without losing scroll position.",
          "Notebook entries are a first-class database entity, not a side effect of chat. Saving a claim stores the text, its source, and the originating question together.",
        ],
        steps: [
          { title: "PIPELINE", body: "Deterministic ingestion with retry and failure surfacing." },
          { title: "RETRIEVAL", body: "Two-pass ranking with source diversity thresholds." },
          { title: "STREAM", body: "Incremental rendering with abort support." },
          { title: "NOTEBOOK", body: "Claim extraction into an editable, citeable board." },
        ],
      },
      decisions: [
        {
          title: "STRUCTURED STREAM EVENTS",
          body: "Instead of piping plain text, the server emits typed events for tokens, citations, and completion. The UI stays honest about what is happening.",
          tradeoff: "More protocol work up front, far fewer UI edge cases.",
        },
        {
          title: "RETRIEVAL BEFORE GENERATION",
          body: "Answers cannot be generated without at least one retrieved passage. This keeps responses grounded and makes refusal a valid product outcome.",
          tradeoff: "Slightly more conservative answers, much higher trust.",
        },
        {
          title: "PROVIDER ADAPTER LAYER",
          body: "A thin interface wraps each model provider so swapping models is a configuration change rather than a refactor.",
          tradeoff: "Abstraction cost vs. long-term flexibility.",
        },
      ],
      features: [
        { title: "SOURCE DRAWER", body: "Every citation opens the exact passage in context." },
        { title: "NOTEBOOK BOARD", body: "Saved claims organised by workspace and tag." },
        { title: "HYBRID SEARCH", body: "Keyword precision blended with semantic recall." },
        { title: "STREAM CONTROLS", body: "Pause, resume, and abort without losing partial output." },
        { title: "PROVIDER SWITCH", body: "Model routing configured per workspace." },
        { title: "AUDIT LOG", body: "Question history with retrieval traces for review." },
      ],
      code: {
        language: "ts",
        filename: "app/api/answer/route.ts",
        snippet: `const matches = await retrieve({ query, workspaceId, k: 8 });

if (matches.length === 0) {
  return stream({ type: "refusal", reason: "no_grounding" });
}

return streamAnswer({
  messages,
  context: matches.map(withCitationAnchor),
  onToken: (token) => emit({ type: "token", value: token }),
  onDone: ({ citations }) => emit({ type: "done", citations }),
});`,
      },
      result: {
        body: [
          "Synth made research sessions resumable and auditable. The notebook became the most-used surface — a sign the product had moved from a novelty chat into a working tool.",
          "Streaming latency and citation reliability were the two metrics that mattered. Both were instrumented from the first release, which made later tuning straightforward.",
        ],
        metrics: [
          { value: "1.2s", label: "FIRST TOKEN (P50)" },
          { value: "94%", label: "CITATION ACCURACY" },
          { value: "3.4×", label: "NOTES SAVED VS. MANUAL" },
        ],
      },
    },
  },
  {
    slug: "form-and-field",
    number: "03",
    title: "FORM & FIELD",
    subtitle: "MODERN E-COMMERCE SYSTEM",
    description:
      "A complete commerce experience: catalogue, product detail, cart, authentication, and order management with a considered editorial interface.",
    category: "frontend",
    categoryLabel: "COMMERCE / FRONTEND",
    year: "2024",
    role: "DESIGN + ENGINEERING",
    timeline: "9 WEEKS",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Stripe-ready"],
    links: {
      live: "https://example.com/form-and-field",
      github: "https://github.com/arifrahman-dev/form-and-field",
    },
    preview: "commerce",
    accent: "#c6f36a",
    metrics: [
      { value: "6", label: "CHECKOUT STATES" },
      { value: "100", label: "TARGET A11Y" },
      { value: "0", label: "CART LOST SESSIONS" },
    ],
    caseStudy: {
      overview: [
        "Form & Field is a small-batch furniture storefront: a restrained catalogue, an editorial product page, and a checkout flow that never loses a cart. The visual language borrows from print catalogues rather than conventional storefront templates.",
        "The build covers inventory, authentication, cart persistence, and order records — a complete commerce loop rather than a product grid mockup.",
      ],
      challenge: {
        body: [
          "Independent shops need commerce that feels like their brand, not a rented template. Off-the-shelf storefronts force a visual grammar on the products they are meant to sell.",
          "The engineering challenge was cart integrity: variants, guest sessions, and authentication transitions all had to preserve selection without inventing duplicate carts.",
        ],
        constraints: [
          "Guest and authenticated carts merge deterministically.",
          "Inventory validation must happen server-side at checkout.",
          "Product pages must remain usable without JavaScript.",
          "No layout shift on image-heavy catalogue pages.",
        ],
      },
      research: {
        body: [
          "I mapped the purchase path of four small retail sites and recorded where I hesitated. The friction was rarely payment — it was variant selection and shipping clarity.",
          "That pushed the design toward an explicit variant matrix and an always-visible fulfilment note, instead of hiding both behind dropdowns.",
        ],
        findings: [
          { label: "DROP-OFF POINT", value: "VARIANT SELECT" },
          { label: "MOBILE SHARE", value: "71%" },
          { label: "TOP QUESTION", value: "SHIPPING TIME" },
          { label: "RETURN VISITS", value: "2.8×" },
        ],
      },
      architecture: {
        body: [
          "A server-first Next.js storefront with a normalised catalogue schema: products, variants, media, inventory movements, carts, cart lines, orders, and order items.",
          "Cart identity is an httpOnly cookie mapped to a database row. On sign-in, the guest cart merges into the account cart using a variant-level quantity reconciliation rule.",
        ],
        layers: [
          { code: "01", label: "CATALOGUE", note: "Server-rendered listing & detail routes" },
          { code: "02", label: "SESSION", note: "httpOnly cart token, guest → auth merge" },
          { code: "03", label: "CHECKOUT", note: "Server actions with inventory revalidation" },
          { code: "04", label: "ADMIN", note: "Order records, stock adjustments, status" },
        ],
      },
      build: {
        body: [
          "The interface treats typography as merchandising: oversized product names, a small technical spec table, and a single accent used only for purchase actions. Nothing competes with the object photography.",
          "Images use fixed aspect ratio containers with responsive sources, so the catalogue grid never reflows as assets load.",
        ],
        steps: [
          { title: "SCHEMA", body: "Variants and inventory modelled before any UI work." },
          { title: "STORE", body: "Catalogue, filters, and editorial product pages." },
          { title: "CART", body: "Persistent cart with merge rules and quantity guards." },
          { title: "ORDERS", body: "Checkout, confirmation, and admin order detail." },
        ],
      },
      decisions: [
        {
          title: "COOKIE-SCOPED CART",
          body: "A server-managed cart token means no hydration mismatch and no lost carts when the browser restarts.",
          tradeoff: "Requires cookie lifecycle handling, but removes client cart drift.",
        },
        {
          title: "EXPLICIT VARIANT MATRIX",
          body: "All variants are visible at once with availability state, rather than hidden in selects.",
          tradeoff: "More visual noise, dramatically fewer errors.",
        },
        {
          title: "SERVER-SIDE STOCK CHECK",
          body: "Inventory is validated inside the checkout transaction, not trusted from the client.",
          tradeoff: "Checkout is slightly stricter, and overselling becomes impossible.",
        },
      ],
      features: [
        { title: "EDITORIAL CATALOGUE", body: "Collection pages with asymmetric product composition." },
        { title: "VARIANT MATRIX", body: "Availability and price visible without interaction." },
        { title: "PERSISTENT CART", body: "Guest carts merge on sign-in without duplicates." },
        { title: "ORDER RECORDS", body: "Status timeline for each completed order." },
        { title: "GUARDED CHECKOUT", body: "Server-side inventory revalidation per line." },
        { title: "ADMIN VIEW", body: "Stock adjustment and order status controls." },
      ],
      code: {
        language: "ts",
        filename: "lib/cart/merge.ts",
        snippet: `export async function mergeCarts(guestId: string, userId: number) {
  return db.transaction(async (tx) => {
    const guest = await getCartLines(tx, guestId);
    const owned = await getOrCreateCart(tx, userId);

    for (const line of guest) {
      await upsertLine(tx, owned.id, line.variantId, line.quantity);
    }
    await clearCart(tx, guestId);

    return owned;
  });
}`,
      },
      result: {
        body: [
          "The storefront shipped with a complete purchase loop and an admin surface for order and stock management. The cart merge rule removed the duplicate-line bug that appears in most tutorial commerce builds.",
          "Server rendering kept the catalogue crisp on slow connections, and the explicit variant matrix measurably shortened the path to cart.",
        ],
        metrics: [
          { value: "0", label: "LOST CARTS IN TESTING" },
          { value: "100", label: "A11Y TARGET SCORE" },
          { value: "−31%", label: "VARIANT SELECTION ERRORS" },
        ],
      },
    },
  },
  {
    slug: "relay",
    number: "04",
    title: "RELAY",
    subtitle: "DEVELOPER PRODUCTIVITY TOOL",
    description:
      "A local-first workbench that turns raw API responses into reusable fixtures, collections, and readable documentation.",
    category: "backend",
    categoryLabel: "DEVELOPER TOOLING",
    year: "2024",
    role: "ENGINEERING",
    timeline: "6 WEEKS",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "CLI", "Express"],
    links: {
      live: "https://example.com/relay",
      github: "https://github.com/arifrahman-dev/relay",
    },
    preview: "terminal",
    accent: "#62d9e8",
    metrics: [
      { value: "9", label: "CLI COMMANDS" },
      { value: "1 file", label: "LOCAL STORE" },
      { value: "0", label: "CLOUD REQUIRED" },
    ],
    caseStudy: {
      overview: [
        "Relay is a developer workbench for people who spend their day inspecting API traffic. Capture a request, normalise the payload, annotate it, and export it as a fixture your test suite can actually use.",
        "It runs entirely on the local machine: a CLI front end, a small Express server for the inspector UI, and a single portable store.",
      ],
      challenge: {
        body: [
          "API exploration tools are either heavyweight collaboration platforms or throwaway curl commands. Neither is good at the moment after you understand the response and need to preserve it.",
          "Relay needed to be a fast capture path plus a durable, diffable artefact — without asking for an account first.",
        ],
        constraints: [
          "Zero cloud dependency; all data stays local.",
          "Deterministic fixtures with stable key ordering.",
          "Sub-100ms command feedback for the common paths.",
          "Shareable exports that a teammate can run without setup.",
        ],
      },
      research: {
        body: [
          "I instrumented my own debugging sessions for two weeks. The repeated action was not sending requests — it was copying a useful response into a scratch file and then losing it.",
          "Relay was scoped around that single transition: response to durable fixture in one command.",
        ],
        findings: [
          { label: "CAPTURES PER DAY", value: "6.4" },
          { label: "FIXTURES REUSED", value: "RARE" },
          { label: "MANUAL COPY STEPS", value: "5" },
          { label: "TARGET PATH", value: "1 COMMAND" },
        ],
      },
      architecture: {
        body: [
          "The CLI parses commands and writes through a repository layer that knows nothing about the network. The inspector UI is a separate Express process that reads the same store over HTTP.",
          "Payloads are normalised into a canonical form — sorted keys, parsed timestamps, trimmed nullables — so fixtures diff cleanly in version control.",
        ],
        layers: [
          { code: "01", label: "CLI", note: "Command parsing & progress output" },
          { code: "02", label: "CAPTURE", note: "Request execution, timing, headers" },
          { code: "03", label: "NORMALISE", note: "Canonical payload shaping" },
          { code: "04", label: "STORE", note: "Portable local file + SQLite-style index" },
        ],
      },
      build: {
        body: [
          "The CLI is a hand-written command router rather than a framework — nine commands, each with explicit flags and a typed result. Help output is generated from the same registry to avoid drift.",
          "Exports can emit JSON, a TypeScript module, or a markdown card, all derived from a single fixture object.",
        ],
        steps: [
          { title: "CAPTURE", body: "Execute and record request with timing metadata." },
          { title: "ANNOTATE", body: "Name, tag, and note intent at capture time." },
          { title: "EXPORT", body: "Emit fixture formats that tests can import." },
          { title: "INSPECT", body: "Local UI for browsing and diffing history." },
        ],
      },
      decisions: [
        {
          title: "CANONICAL PAYLOAD FORM",
          body: "Normalising on write means diffs show real semantic changes rather than key-order noise.",
          tradeoff: "Slightly less raw fidelity, much cleaner history.",
        },
        {
          title: "LOCAL-ONLY STORE",
          body: "No accounts, no sync, no telemetry. The tool works on a plane and leaves no data behind.",
          tradeoff: "No team collaboration, deliberately.",
        },
        {
          title: "REGISTRY-DRIVEN CLI",
          body: "One command registry powers execution, validation, and help text.",
          tradeoff: "A little abstraction for nine commands, repaid the first time a flag changed.",
        },
      ],
      features: [
        { title: "ONE-COMMAND CAPTURE", body: "Request, normalise, and save in a single step." },
        { title: "DIFF VIEW", body: "Compare two captures and see semantic changes only." },
        { title: "FIXTURE EXPORTS", body: "JSON, TypeScript, or markdown from one source." },
        { title: "LOCAL INSPECTOR", body: "Browsable timeline of captured requests." },
        { title: "ENV PROFILES", body: "Switch base URLs without rewriting a command." },
        { title: "ZERO TELEMETRY", body: "No network egress beyond the target API." },
      ],
      code: {
        language: "ts",
        filename: "src/core/capture.ts",
        snippet: `export async function capture(input: CaptureInput): Promise<Fixture> {
  const started = performance.now();
  const res = await fetch(resolveUrl(input), {
    method: input.method,
    headers: profileHeaders(input.profile),
  });

  return createFixture({
    request: input,
    status: res.status,
    duration: Math.round(performance.now() - started),
    body: canonicalise(await res.json()),
  });
}`,
      },
      result: {
        body: [
          "Relay replaced a folder of scratch files. The canonical export format has become the default way fixtures enter test suites, which shortened setup for new tests considerably.",
          "The project also sharpened my opinion about tooling: the smallest useful surface is usually one command, not a platform.",
        ],
        metrics: [
          { value: "1", label: "COMMAND TO FIXTURE" },
          { value: "9", label: "CLI COMMANDS" },
          { value: "0", label: "TELEMETRY EVENTS" },
        ],
      },
    },
  },
  {
    slug: "pulse",
    number: "05",
    title: "PULSE",
    subtitle: "REALTIME API OBSERVABILITY",
    description:
      "A lightweight monitoring service that aggregates request telemetry into fast, honest dashboards with alerting built in.",
    category: "backend",
    categoryLabel: "INFRASTRUCTURE",
    year: "2023",
    role: "BACKEND ENGINEERING",
    timeline: "8 WEEKS",
    stack: ["Node.js", "Express", "PostgreSQL", "Streaming", "CI/CD"],
    links: {
      live: "https://example.com/pulse",
      github: "https://github.com/arifrahman-dev/pulse",
    },
    preview: "observability",
    accent: "#668cff",
    metrics: [
      { value: "50K", label: "EVENTS / MIN" },
      { value: "7d", label: "RAW RETENTION" },
      { value: "2", label: "ALERT CHANNELS" },
    ],
    caseStudy: {
      overview: [
        "Pulse ingests request telemetry from small services, rolls it into minute-level aggregates, and serves a dashboard that answers one question quickly: is anything worse than yesterday?",
        "It is deliberately unglamorous infrastructure — ingestion, aggregation, retention, alerting — built to run on a single modest database.",
      ],
      challenge: {
        body: [
          "Full observability stacks are expensive to run and configure. Small teams end up either blind or drowning in dashboards they never read.",
          "Pulse had to give useful signal at a fraction of the cost, with predictable write amplification and no cardinality explosions.",
        ],
        constraints: [
          "Ingest path must stay under 5ms of added latency.",
          "Aggregates computed server-side on a retention schedule.",
          "Alert evaluation must never run inside the request path.",
          "Single PostgreSQL instance, no separate time-series store.",
        ],
      },
      research: {
        body: [
          "I reviewed incident notes from three small projects and asked one question of each: what metric would have caught this sooner? Four of five incidents pointed at p95 latency or error-rate deltas.",
          "The dashboard was reduced to those two signals plus throughput. Everything else lives one level deeper, deliberately.",
        ],
        findings: [
          { label: "INCIDENTS CAUGHT BY P95", value: "60%" },
          { label: "DASHBOARDS OPENED", value: "<1 / DAY" },
          { label: "VALUABLE RETENTION", value: "7 DAYS" },
          { label: "ALERT NOISE LIMIT", value: "5 / WEEK" },
        ],
      },
      architecture: {
        body: [
          "Ingestion writes append-only events. A scheduled job folds completed minutes into rollup tables, keeping raw events for seven days and aggregates indefinitely.",
          "Alert rules are evaluated against rollups, never against raw traffic, which keeps evaluation cheap and stable under load.",
        ],
        layers: [
          { code: "01", label: "INGEST", note: "Batched append-only event writes" },
          { code: "02", label: "ROLLUP", note: "Per-minute aggregates & percentile sketches" },
          { code: "03", label: "QUERY", note: "Windowed reads with bounded time ranges" },
          { code: "04", label: "ALERT", note: "Scheduled rule evaluation & delivery" },
        ],
      },
      build: {
        body: [
          "Writes are batched with a short flush interval to keep transaction count low. Percentiles use a bucketed approximation, which is accurate enough for alerting and far cheaper than exact computation.",
          "The dashboard renders a dense grid of sparklines. Each one is a single query result, cached for the duration of a minute.",
        ],
        steps: [
          { title: "INGEST", body: "Batched writer with backpressure signalling." },
          { title: "AGGREGATE", body: "Minute rollups with retention policy." },
          { title: "VISUALISE", body: "Sparkline grid with delta indicators." },
          { title: "ALERT", body: "Threshold rules evaluated out of band." },
        ],
      },
      decisions: [
        {
          title: "BUCKETED PERCENTILES",
          body: "Approximate percentiles keep aggregation cheap while remaining actionable for alert thresholds.",
          tradeoff: "Small accuracy loss, large storage and compute savings.",
        },
        {
          title: "ROLLUPS OVER RAW QUERIES",
          body: "Dashboards read pre-computed aggregates, so traffic spikes do not degrade the UI.",
          tradeoff: "One minute of freshness lag.",
        },
        {
          title: "BATCHED WRITES",
          body: "Events buffer briefly before a single multi-row insert.",
          tradeoff: "Tiny ingest delay for a large reduction in write load.",
        },
      ],
      features: [
        { title: "MINUTE ROLLUPS", body: "Throughput, error rate, and latency aggregated per minute." },
        { title: "DELTA VIEW", body: "Every metric compared against the previous window." },
        { title: "THRESHOLD RULES", body: "Alerts evaluated on schedule, not on request." },
        { title: "RETENTION JOB", body: "Raw events expire; aggregates persist." },
        { title: "PROJECT KEYS", body: "Ingest scoped by service key." },
        { title: "EXPORT", body: "Windowed CSV export for offline analysis." },
      ],
      code: {
        language: "sql",
        filename: "jobs/rollup.sql",
        snippet: `insert into metric_rollups (bucket, service, p95_ms, error_rate, requests)
select
  date_trunc('minute', occurred_at) as bucket,
  service,
  percentile_cont(0.95) within group (order by duration_ms) as p95_ms,
  avg((status >= 500)::int)::numeric(5,4) as error_rate,
  count(*) as requests
from request_events
where occurred_at >= now() - interval '5 minutes'
group by 1, 2
on conflict (bucket, service) do update set
  p95_ms = excluded.p95_ms,
  error_rate = excluded.error_rate,
  requests = excluded.requests;`,
      },
      result: {
        body: [
          "Pulse caught its first real regression within a week of running: a p95 climb that had been invisible in average latency. That is exactly the class of incident it was designed for.",
          "Operating cost stayed flat because aggregation runs on the same database that stores raw events, with retention doing the capacity planning.",
        ],
        metrics: [
          { value: "50K", label: "EVENTS PER MINUTE" },
          { value: "7d", label: "RAW RETENTION" },
          { value: "−45%", label: "QUERY TIME VS RAW" },
        ],
      },
    },
  },
  {
    slug: "kinetic-type-lab",
    number: "06",
    title: "KINETIC",
    subtitle: "BRUTALIST TYPE EXPERIMENT",
    description:
      "An interactive typographic playground exploring variable-weight motion, clipping masks, and grid-breaking composition in the browser.",
    category: "experiments",
    categoryLabel: "CREATIVE EXPERIMENT",
    year: "2023",
    role: "CREATIVE DEVELOPMENT",
    timeline: "3 WEEKS",
    stack: ["React", "Canvas", "Variable Fonts", "Motion"],
    links: {
      live: "https://example.com/kinetic",
      github: "https://github.com/arifrahman-dev/kinetic",
    },
    preview: "type",
    accent: "#f4f4f5",
    metrics: [
      { value: "4", label: "TYPE MODES" },
      { value: "60fps", label: "MOTION TARGET" },
      { value: "0", label: "IMAGE ASSETS" },
    ],
    caseStudy: {
      overview: [
        "Kinetic is a self-directed study in browser typography: four modes that deform, stack, slice, and stream text using only fonts, geometry, and motion.",
        "It exists to test ideas that later found their way into client work — variable font animation, masked line reveals, and asymmetry that stays readable.",
      ],
      challenge: {
        body: [
          "Experimental type treatments usually fall apart the moment they must support real content. Layout shifts, unreadable overlaps, and motion sickness are common costs.",
          "The constraint became the brief: make something expressive that still passes basic legibility and performance checks.",
        ],
        constraints: [
          "No raster decoration — type and geometry only.",
          "Motion must respect prefers-reduced-motion.",
          "Text remains selectable and readable in every mode.",
          "60fps target on integrated graphics.",
        ],
      },
      research: {
        body: [
          "I collected typographic references across print, signage, and title sequences, then sorted them by what actually transferred to a screen: scale contrast, tight leading, and structural grids.",
          "The experiment kept the grid visible on purpose. Structure is what makes the rule-breaking legible.",
        ],
        findings: [
          { label: "MODES BUILT", value: "4" },
          { label: "EDGE CASES LOGGED", value: "17" },
          { label: "FRAME BUDGET", value: "16MS" },
          { label: "ASSET WEIGHT", value: "FONTS ONLY" },
        ],
      },
      architecture: {
        body: [
          "A single React canvas application with a mode registry. Each mode is a pure function of pointer position, scroll progress, and a shared type scale.",
          "Animation uses transform and opacity only, keeping compositing on the GPU and avoiding layout thrash.",
        ],
        layers: [
          { code: "01", label: "TYPE SCALE", note: "Clamped fluid scale with fixed ratio" },
          { code: "02", label: "INPUT", note: "Pointer + scroll normalised to 0–1" },
          { code: "03", label: "MODES", note: "Four pure deformation strategies" },
          { code: "04", label: "GUARDS", note: "Reduced motion & legibility checks" },
        ],
      },
      build: {
        body: [
          "Each mode isolates a single idea: slicing (clipped duplicates), stacking (offset baselines), streaming (repeated marquee), and warping (weight interpolation).",
          "The controls are intentionally minimal — one input for pointer influence, one for density — because the experiment is about a specific behaviour, not a settings panel.",
        ],
        steps: [
          { title: "TYPE", body: "Establish one extreme scale and stick to it." },
          { title: "MOTION", body: "Map pointer and scroll to a single progress value." },
          { title: "MODES", body: "Add deformations one at a time, verify legibility." },
          { title: "GUARDRAILS", body: "Reduced motion fallbacks and keyboard access." },
        ],
      },
      decisions: [
        {
          title: "ONE SHARED PROGRESS VALUE",
          body: "All modes read the same normalised input, so behaviour stays coherent across the experiment.",
          tradeoff: "Less per-mode flourish, more cohesion.",
        },
        {
          title: "TRANSFORMS ONLY",
          body: "Animations never touch layout properties.",
          tradeoff: "Constrains the visual vocabulary, protects the frame budget.",
        },
        {
          title: "KEEP THE GRID VISIBLE",
          body: "The structural lines stay on screen as part of the composition.",
          tradeoff: "Busier frames, clearer intent.",
        },
      ],
      features: [
        { title: "SLICE MODE", body: "Clipped duplicate lines with staggered offsets." },
        { title: "STACK MODE", body: "Compressed baselines at extreme weights." },
        { title: "STREAM MODE", body: "Infinite marquee with variable speed." },
        { title: "WARP MODE", body: "Weight interpolation driven by pointer distance." },
      ],
      code: {
        language: "ts",
        filename: "modes/warp.ts",
        snippet: `export const warp: TypeMode = ({ pointer, density }) => {
  const weight = 200 + pointer.x * 700;
  const tracking = -0.05 + density * 0.02;

  return {
    style: {
      fontVariationSettings: \`"wght" \${weight.toFixed(0)}\`,
      letterSpacing: \`\${tracking.toFixed(3)}em\`,
      transform: \`skewX(\${(pointer.y - 0.5) * 6}deg)\`,
    },
  };
};`,
      },
      result: {
        body: [
          "Kinetic became a reusable motion vocabulary. Several components on this portfolio — masked headings, structural grids, offset type — started as prototypes inside it.",
          "The experiment also produced a practical rule: expressive typography works when the grid is visible and the scale is ruthless.",
        ],
        metrics: [
          { value: "60fps", label: "MOTION TARGET" },
          { value: "4", label: "TYPE MODES" },
          { value: "0", label: "RASTER ASSETS" },
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
