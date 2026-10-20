"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { reducedMotion } from "@/lib/env";
import { about } from "@/lib/content";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      // Words ink in as they pass the reading line.
      gsap.fromTo(
        ".ink-word",
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: ".lede", start: "top 78%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.fromTo(
        ".about-stamp",
        { yPercent: 60, rotate: -14 },
        {
          yPercent: -60,
          rotate: -4,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.from(".about-body p", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-body", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={root}
      aria-labelledby="about-title"
      className="relative mx-auto max-w-[1500px] px-5 py-32 md:px-10 md:py-48"
    >
      <h2 id="about-title" className="sr-only">
        About
      </h2>
      <p className="lede max-w-[24ch] font-display text-[clamp(1.9rem,4.6vw,4.2rem)] leading-[1.12]">
        {about.lede.split(" ").map((w, i) => (
          <span key={i} className="ink-word">
            {w}{" "}
          </span>
        ))}
      </p>

      <div className="about-body mt-20 grid gap-8 md:ml-[33%] md:grid-cols-2 md:gap-12">
        {about.body.map((p, i) => (
          <p key={i} className="max-w-[46ch] text-[1.25rem] leading-relaxed text-cocoa/85">
            {p}
          </p>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="about-stamp stamp absolute right-[6%] top-24 hidden px-3 py-2 text-center text-lg md:block"
      >
        <div className="text-[0.65rem]">M.S. COMPUTER SCIENCE</div>
        UNT  MAY 2026
      </div>
    </section>
  );
}
