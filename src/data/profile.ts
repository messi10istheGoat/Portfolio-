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
  availabilityShort: "Open to work",
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
    github: "https://github.com/rihadev",
    linkedin: "https://www.linkedin.com/in/riha-begum",
    x: "",
  },
  handles: {
    github: "@rihadev",
    linkedin: "in/riha-begum",
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
        title: "Model before interface",
        body: "Data shape first. Clear models and predictable state make the interface obvious instead of clever.",
      },
      {
        index: "02",
        title: "Edge cases are the product",
        body: "Empty states, error copy, focus order, slow networks. That is where trust is actually built.",
      },
      {
        index: "03",
        title: "Ship, then tighten",
        body: "Momentum beats polish. Release something real, watch how it is used, then remove what does not earn its place.",
      },
    ],
    interests: [
      "Interface Engineering",
      "System Architecture",
      "Design Systems",
      "API Design",
      "Motion Design",
      "Developer Tools",

    ],
    currentFocus:
      "Currently exploring AI-assisted product surfaces, edge-rendered applications, and design-engineering workflows that keep interfaces fast under pressure.",
    facts: [
      { label: "Location", value: "Bangladesh" },
      { label: "Focus", value: "Web applications" },
      { label: "Status", value: "Open to work" },
    ],
    stats: [
      { value: "6", label: "Case studies" },
      { value: "28", label: "Tools listed" },
      { value: "Full-stack", label: "Focus" },
      { value: "BD", label: "Based in" },
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
