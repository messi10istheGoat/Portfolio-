import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Signal lost",
  description: "This route does not exist. Head back to the index to keep exploring.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-field absolute inset-0 opacity-40" />
        <div className="radial-bleed absolute inset-0" />
        <div className="noise-layer absolute inset-0" />
      </div>
      <div className="shell relative">
        <p className="mono text-[9px] text-accent">SYSTEM / 404</p>
        <h1 className="display mt-4 text-[clamp(3.4rem,13vw,11rem)]">
          LOST
          <br />
          <span className="text-outline-accent">SIGNAL.</span>
        </h1>
        <p className="body-copy mt-6 max-w-[46ch]">
          This route does not exist — or it was removed during a deploy. The structure is still intact
          everywhere else.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary text-[10px]">
            <ArrowLeft className="h-3.5 w-3.5" />
            BACK TO INDEX
          </Link>
          <Link href="/#work" className="btn btn-ghost text-[10px]">
            SELECTED WORK
            <ArrowUpRight className="arrow h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
