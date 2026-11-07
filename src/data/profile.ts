/**
 * Central identity + copy file.
 * Everything here is editable placeholder content — swap in your own details.
 */

export const profile = {
  name: "Riha Begum",
  firstName: "RIHA",
  monogram: "RB",
  role: "Full-Stack Developer",
  tagline: "Design × Engineering",
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  email: "rihabegum.dev@gmail.com",
  phoneLabel: "REMOTE — WORLDWIDE",
  availability: "Available for opportunities",
  availabilityShort: "OPEN TO WORK",
  /**
   * Static exports ship a pre-generated PDF in /public; server deployments
   * generate it on demand from the same source data.
   */
  resumePath:
    process.env.NEXT_PUBLIC_STATIC_MODE === "1" ? "/resume.pdf" : "/api/resume",
  /**
   * Only set the profiles that actually exist. The UI hides any social link
   * that is an empty string, so no dead links ever ship.
   */
  socials: {
    github: "https://github.com/messi10istheGoat",
    linkedin: "",
    x: "",
  },
  handles: {
    github: "@messi10istheGoat",
    linkedin: "",
  },
  hero: {
    lines: ["BUILDING", "BEYOND", "THE ORDINARY."],
    intro:
      "I'm a Full-Stack Developer focused on engineering scalable applications, designing intuitive interfaces, and transforming ambitious ideas into meaningful digital products.",
    metadata: ["BASED IN BANGLADESH", "FULL-STACK DEVELOPMENT", "DESIGN × ENGINEERING"],
  },
  about: {
    headline: ["NOT JUST", "ANOTHER", "DEVELOPER."],
    lede:
      "I'm a developer who enjoys exploring the intersection of engineering, design, and technology. I believe great software is not just about writing code. It's about solving meaningful problems and creating experiences people love to use.",
    paragraphs: [
      "My work sits between two disciplines that are usually kept apart: systems engineering and interface craft. I like architecture diagrams as much as typography scales, and I care about the millisecond between an interaction and its response.",
      "Most days I'm building full-stack products with TypeScript — modelling data, shaping APIs, and pushing pixels until the interface feels inevitable. I care about accessibility, performance budgets, and code that the next engineer can actually read.",
    ],
    philosophy: [
      {
        index: "01",
        title: "STRUCTURE FIRST",
        body: "Good products are legible before they are beautiful. Clear models, predictable state, honest interfaces.",
      },
      {
        index: "02",
        title: "DETAIL IS THE PRODUCT",
        body: "Motion, focus states, empty states, error copy. The last 10% is where trust is built.",
      },
      {
        index: "03",
        title: "SHIP, THEN REFINE",
        body: "Momentum beats perfection. Instrument the release, learn from real usage, then tighten the system.",
      },
    ],
    interests: [
      "INTERFACE ENGINEERING",
      "SYSTEM ARCHITECTURE",
      "DESIGN SYSTEMS",
      "API DESIGN",
      "MOTION DESIGN",
      "DEVELOPER TOOLS",
    ],
    currentFocus:
      "Currently exploring AI-assisted product surfaces, edge-rendered applications, and design-engineering workflows that keep interfaces fast under pressure.",
    facts: [
      { label: "NAME", value: "RIHA BEGUM" },
      { label: "ROLE", value: "FULL-STACK DEVELOPER" },
      { label: "LOCATION", value: "BANGLADESH" },
      { label: "FOCUS", value: "WEB APPLICATIONS" },
      { label: "STATUS", value: "OPEN TO OPPORTUNITIES" },
    ],
    stats: [
      { value: "4+", label: "YEARS ENGINEERING" },
      { value: "24", label: "SHIPPED BUILDS" },
      { value: "12", label: "TECHNOLOGIES" },
      { value: "∞", label: "CURIOSITY" },
    ],
  },
  meta: {
    /** Used for downloadable file names: "Riha Begum" -> "riha-begum". */
    slug: "riha-begum",
    description:
      "Portfolio of Riha Begum — a full-stack developer engineering scalable applications and designing interfaces at the intersection of raw structure and refined execution.",
    version: "PORTFOLIO_V1",
    crafted: "CRAFTED WITH PRECISION.",
    location: "DHAKA, BD",
    stackLine: "REACT / NEXT.JS / POSTGRES",
  },
} as const;

export type Profile = typeof profile;
