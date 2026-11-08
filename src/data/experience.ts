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
 * Career entries.
 *
 * `verified: false` renders a visible DRAFT badge and is excluded from the
 * machine-readable surfaces, so nothing here is presented as a confirmed
 * employment record. Replace the drafts with real history when available.
 */
export const experience: ExperienceEntry[] = [
  {
    index: "01",
    organization: "INDEPENDENT PROJECTS",
    position: "Full-Stack Developer",
    period: "2025 — present",
    location: "REMOTE / BANGLADESH",
    summary:
      "Building end-to-end web products independently: data modelling, interface systems, and deployment — from an offline-first finance app to a civic GIS platform.",
    responsibilities: [
      "Own product work from schema design through interface delivery.",
      "Build reusable component systems with typed design tokens.",
      "Set up typechecking, tests, and release checks before shipping.",
    ],
    technologies: ["TypeScript", "React", "Next.js", "PostgreSQL", "Tailwind CSS"],
    accomplishments: [
      "Shipped Spendwise as a shared web and Android build from one codebase.",
      "Built Sylhet Live, a flood-hazard map with vehicle-aware routing.",
    ],
    verified: false,
  },
  {
    index: "02",
    organization: "ACADEMIC COURSEWORK",
    position: "Frontend & Interface Development",
    period: "2025 — 2026",
    location: "BANGLADESH",
    summary:
      "Coursework and self-directed study in frontend engineering, interface design, and applied data structures.",
    responsibilities: [
      "Delivered multi-page interfaces in plain HTML, CSS, and JavaScript.",
      "Studied layout systems, accessibility, and state management patterns.",
      "Presented and defended project work in technical reviews.",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    accomplishments: [
      "Built and documented two dependency-free frontend applications.",
      "Developed a routing engine as part of a civic-technology project.",
    ],
    verified: false,
  },
];

/** Shown under the timeline whenever any entry is still a draft. */
export const experienceDisclaimer =
  "Entries marked Draft are self-described project work, not verified employment history. They are left out of structured data and are never presented as a confirmed record.";
