"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "@/data/profile";
import { HeroObject } from "@/components/hero/HeroObject";
import { Magnetic } from "@/components/ui/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const lines = profile.hero.lines;

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pb-0 pt-24 sm:pt-28 lg:pt-32"
    >
      {/* environment */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div
            className="grid-field absolute inset-0 opacity-[0.55]"
            style={{
              maskImage:
                "radial-gradient(120% 90% at 60% 20%, #000 20%, rgba(0,0,0,0.55) 55%, transparent 88%)",
              WebkitMaskImage:
                "radial-gradient(120% 90% at 60% 20%, #000 20%, rgba(0,0,0,0.55) 55%, transparent 88%)",
            }}
          />
          <div className="radial-bleed absolute inset-0" />
          <div className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[rgba(var(--accent-rgb),0.07)] blur-[120px]" />
          <div className="noise-layer absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
        </motion.div>

        {/* oversized background numbering */}
        <motion.span
          initial={reduced ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 0.055, x: 0 }}
          transition={{ duration: 1.8, delay: 0.4, ease: EASE }}
          className="display pointer-events-none absolute -right-6 top-24 hidden select-none text-[26rem] leading-none text-bone lg:block"
        >
          01
        </motion.span>
      </div>

      <div className="shell relative flex min-h-[calc(100svh-8rem)] flex-col justify-between">
        <div className="grid flex-1 grid-cols-1 items-center gap-14 pb-10 lg:grid-cols-12 lg:gap-6 xl:gap-10">
          {/* left column */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2"
            >
              <span className="flex items-center gap-2 border border-white/12 bg-white/[0.03] px-2.5 py-1.5">
                <span className="status-dot" aria-hidden />
                <span className="mono-sm text-[8px] text-ash">{profile.availabilityShort}</span>
              </span>
              <span className="mono-sm text-[8px] text-fog">PORTFOLIO / {new Date().getFullYear()}</span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span className="mono-sm hidden text-[8px] text-fog sm:block">
                {profile.meta.location}
              </span>
            </motion.div>

            <div className="relative mt-7">
              <h1 id="hero-heading" className="display text-[clamp(2.5rem,6.6vw,7.6rem)]">
                {lines.map((line, index) => (
                  <span key={line} className="block overflow-hidden pb-[0.035em]">
                    <motion.span
                      className={`block will-change-transform ${
                        index === 1 ? "text-outline-accent" : ""
                      } ${index === 2 ? "text-[0.84em]" : ""}`}
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 1.05, delay: 0.28 + index * 0.1, ease: EASE }}
                    >
                      {line}
                      {index === lines.length - 1 && <span className="text-accent">.</span>}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.1 }}
                className="absolute -right-2 top-2 hidden items-center gap-2 lg:flex"
              >
                <span className="mono-sm text-[8px] text-fog">SCROLL↓</span>
                <span className="h-px w-10 bg-white/20" />
              </motion.div>
            </div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.72, ease: EASE }}
              className="mt-8 max-w-[54ch]"
            >
              <p className="body-copy text-balance text-ash">
                {profile.hero.intro}
              </p>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.86, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={7}>
                <a href="#work" className="btn btn-primary" data-cursor="explore">
                  EXPLORE MY WORK
                  <ArrowUpRight className="arrow h-3.5 w-3.5" />
                </a>
              </Magnetic>
              <Magnetic strength={7}>
                <a href="#contact" className="btn btn-ghost" data-cursor="open">
                  LET&apos;S CONNECT
                  <ArrowUpRight className="arrow h-3.5 w-3.5" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.dl
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.05 }}
              className="mt-10 grid max-w-2xl grid-cols-1 gap-px border border-white/10 bg-white/[0.06] sm:grid-cols-3"
            >
              {profile.hero.metadata.map((item, index) => (
                <div key={item} className="bg-ink/80 px-3 py-2.5 backdrop-blur-sm">
                  <dt className="mono-sm text-[7px] text-fog">0{index + 1} /</dt>
                  <dd className="mono-sm mt-1 text-[8px] leading-relaxed text-ash">{item}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* right column — signature object */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.15, delay: 0.4, ease: EASE }}
            className="relative lg:col-span-5"
            data-cursor="interact"
          >
            <HeroObject />
          </motion.div>
        </div>

        {/* bottom rail */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.15 }}
          className="relative border-t border-white/10"
        >
          <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="marquee-mask relative flex-1 overflow-hidden">
              <div className="skew-marquee flex w-max gap-6">
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex shrink-0 items-center gap-6" aria-hidden={copy === 1}>
                    {["ENGINEERING", "INTERFACE CRAFT", "SYSTEM DESIGN", "PERFORMANCE", "MOTION", "TYPESCRIPT"].map(
                      (item) => (
                        <span key={item} className="mono-sm flex items-center gap-6 text-[8px] text-fog">
                          {item}
                          <span className="text-accent">✦</span>
                        </span>
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
            <a
              href="#about"
              className="mono-sm group flex shrink-0 items-center gap-2 text-[8px] text-ash transition-colors hover:text-accent"
            >
              <span className="grid h-7 w-7 place-items-center border border-white/15 transition-colors group-hover:border-accent/60">
                <ArrowDown className="h-3 w-3 animate-bounce" />
              </span>
              SCROLL TO DISCOVER
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
