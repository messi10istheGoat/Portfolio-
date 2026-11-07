import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Projects } from "@/components/sections/Projects";
import { GithubActivity } from "@/components/sections/GithubActivity";
import { Experience } from "@/components/sections/Experience";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: `${profile.name} — Full-Stack Developer`,
  description:
    "Building beyond the ordinary. Full-stack developer engineering scalable applications, interface systems, and digital products from Bangladesh.",
  alternates: { canonical: "/" },
};

const workSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Selected work",
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: project.title,
    description: project.description,
    url: `/work/${project.slug}`,
  })),
};

export default async function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workSchema) }}
      />
      <Hero />
      <Manifesto />
      <About />
      <Stack />
      <Projects />
      <GithubActivity />
      <Experience />
      <Process />
      <Contact />
    </>
  );
}
