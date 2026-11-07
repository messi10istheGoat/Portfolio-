export interface ExperienceEntry {
  index: string;
  organization: string;
  position: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  accomplishments: string[];
  verified: boolean;
}

/**
 * PLACEHOLDER CAREER DATA.
 * These entries are drafted placeholders so the layout can be evaluated.
 * Replace every field with verified history before publishing — the UI
 * surfaces a "draft" label for any entry with verified: false.
 */
export const experience: ExperienceEntry[] = [
  {
    index: "01",
    organization: "INDEPENDENT PRACTICE",
    position: "Full-Stack Developer",
    period: "2023 — PRESENT",
    location: "REMOTE / BANGLADESH",
    summary:
      "Designing and shipping end-to-end web products for small teams: architecture, interface systems, and deployment.",
    responsibilities: [
      "Own product work from data modelling through interface delivery.",
      "Build reusable component systems with typed design tokens.",
      "Set up preview environments, migrations, and release checks.",
    ],
    technologies: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind", "Vercel"],
    accomplishments: [
      "Shipped 3 production applications end-to-end.",
      "Cut median page load by roughly 40% through rendering and asset work.",
    ],
    verified: false,
  },
  {
    index: "02",
    organization: "STUDIO COLLABORATION",
    position: "Frontend Engineer",
    period: "2022 — 2023",
    location: "CONTRACT",
    summary:
      "Partnered with a small design studio translating editorial interfaces into production-grade frontend systems.",
    responsibilities: [
      "Implemented responsive, animation-led marketing surfaces.",
      "Bridged design handoff with reusable React primitives.",
      "Maintained accessibility and performance budgets per release.",
    ],
    technologies: ["React", "Next.js", "Framer Motion", "CSS", "Figma"],
    accomplishments: [
      "Delivered 6 client builds with a shared component library.",
      "Established the studio's first motion and accessibility guidelines.",
    ],
    verified: false,
  },
  {
    index: "03",
    organization: "OPEN SOURCE",
    position: "Contributor",
    period: "2021 — PRESENT",
    location: "GITHUB",
    summary:
      "Small, focused contributions to tooling and UI libraries — documentation, bug fixes, and test coverage.",
    responsibilities: [
      "Reproduce and fix interface bugs with minimal pull requests.",
      "Improve documentation for onboarding contributors.",
      "Add regression tests around fixed behaviour.",
    ],
    technologies: ["Git", "GitHub Actions", "TypeScript", "Jest"],
    accomplishments: ["Multiple merged pull requests across UI tooling repositories."],
    verified: false,
  },
  {
    index: "04",
    organization: "COMPUTER SCIENCE",
    position: "B.Sc. Studies",
    period: "2018 — 2022",
    location: "BANGLADESH",
    summary:
      "Foundations in algorithms, databases, and software engineering — paired with self-directed product work.",
    responsibilities: [
      "Studied data structures, networking, and database systems.",
      "Led a small student team on a semester-long software project.",
    ],
    technologies: ["C", "Java", "SQL", "Algorithms"],
    accomplishments: ["Final-year project focused on web-based information systems."],
    verified: false,
  },
];

export const experienceDisclaimer =
  "DRAFT CAREER DATA — placeholder entries, marked unverified. Edit src/data/experience.ts with confirmed history before publishing.";
