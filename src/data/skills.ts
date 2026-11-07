export interface TechItem {
  name: string;
  glyph: string;
  note: string;
  level: "core" | "strong" | "working";
}

export interface TechCategory {
  index: string;
  title: string;
  caption: string;
  items: TechItem[];
}

export const techCategories: TechCategory[] = [
  {
    index: "01",
    title: "FRONTEND",
    caption: "Interfaces built to be felt as much as used.",
    items: [
      { name: "HTML", glyph: "</>", note: "Semantic document structure", level: "core" },
      { name: "CSS", glyph: "#", note: "Layout, craft, modern CSS", level: "core" },
      { name: "JavaScript", glyph: "JS", note: "Language fundamentals & patterns", level: "core" },
      { name: "TypeScript", glyph: "TS", note: "Typed contracts end-to-end", level: "core" },
      { name: "React", glyph: "⚛", note: "Component architecture & hooks", level: "core" },
      { name: "Next.js", glyph: "N", note: "App Router, RSC, edge delivery", level: "core" },
      { name: "Tailwind CSS", glyph: "≈", note: "Utility systems & design tokens", level: "core" },
    ],
  },
  {
    index: "02",
    title: "BACKEND",
    caption: "Server logic with predictable failure modes.",
    items: [
      { name: "Node.js", glyph: "⬢", note: "Runtime & service architecture", level: "core" },
      { name: "Express", glyph: "EX", note: "REST services & middleware", level: "strong" },
      { name: "REST APIs", glyph: "⇄", note: "Resource modelling & contracts", level: "core" },
      { name: "Authentication", glyph: "⌘", note: "Sessions, JWT, OAuth flows", level: "strong" },
      { name: "Server-side", glyph: "SSR", note: "Server rendering & actions", level: "strong" },
    ],
  },
  {
    index: "03",
    title: "DATABASE",
    caption: "Modelling data that outlives the interface.",
    items: [
      { name: "PostgreSQL", glyph: "PG", note: "Relational modelling, indexes", level: "core" },
      { name: "MongoDB", glyph: "MO", note: "Document stores & aggregation", level: "strong" },
      { name: "MySQL", glyph: "MY", note: "Schema design & queries", level: "working" },
      { name: "Prisma", glyph: "△", note: "Typed ORM & migrations", level: "strong" },
    ],
  },
  {
    index: "04",
    title: "TOOLS & WORKFLOW",
    caption: "The bench where the work actually happens.",
    items: [
      { name: "Git", glyph: "⑂", note: "Branching & history hygiene", level: "core" },
      { name: "GitHub", glyph: "GH", note: "Review flow & automation", level: "core" },
      { name: "VS Code", glyph: "◧", note: "Daily editor environment", level: "core" },
      { name: "Docker", glyph: "◫", note: "Reproducible environments", level: "strong" },
      { name: "Postman", glyph: "PM", note: "API exploration & testing", level: "strong" },
      { name: "Figma", glyph: "FG", note: "Design handoff & systems", level: "strong" },
    ],
  },
  {
    index: "05",
    title: "DEPLOYMENT",
    caption: "From localhost to production, safely.",
    items: [
      { name: "Vercel", glyph: "▲", note: "Preview deploys & edge runtime", level: "core" },
      { name: "Netlify", glyph: "NT", note: "Static builds & functions", level: "strong" },
      { name: "CI/CD", glyph: "↻", note: "GitHub Actions pipelines", level: "strong" },
      { name: "Cloud", glyph: "☁", note: "Managed infra & storage", level: "working" },
    ],
  },
];

export const marqueeTech = [
  "TYPESCRIPT",
  "REACT",
  "NEXT.JS",
  "NODE.JS",
  "POSTGRESQL",
  "TAILWIND",
  "PRISMA",
  "DOCKER",
  "FIGMA",
  "GIT",
];
