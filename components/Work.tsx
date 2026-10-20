"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { work } from "@/lib/content";
import PlateArt from "./Plates";
import Split from "./Split";
import { useCaseStudy } from "./CaseStudy";

const tilt = [-1.6, 1.1, -0.6, 1.8, -1.2];

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const open = useCaseStudy();

  useEffect(() => {
    const el = root.current!;
    // Measure each plate path once so it can be drawn in.
    el.querySelectorAll<SVGPathElement>(".plate-line").forEach((p) => {
      const len = Math.ceil(p.getTotalLength());
      p.style.setProperty("--len", `${len}`);
    });

    const mm = gsap.matchMedia();
    const draw = (plate: Element, opts: ScrollTrigger.Vars) =>
      gsap.fromTo(
        plate.querySelectorAll(".plate-line"),
        { strokeDashoffset: (_i: number, t: SVGPathElement) => t.style.getPropertyValue("--len") },
        { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.02, scrollTrigger: opts },
      );

    mm.add(
      {
        wide: "(min-width: 1024px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (c) => {
        const { wide, motion } = c.conditions as { wide: boolean; motion: boolean };
        gsap.from(".work-title .split-item", {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: ".work-title", start: "top 80%" },
          immediateRender: motion,
        });
        if (!motion) return;

        const cards = gsap.utils.toArray<HTMLElement>(".work-card");
        if (!wide) {
          cards.forEach((card) => draw(card.querySelector("svg")!, { trigger: card, start: "top 75%" }));
          return;
        }

        // Pinned horizontal drawer: vertical scroll flips through the cards.
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const slide = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".work-pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (st) => setCurrent(Math.min(work.length - 1, Math.round(st.progress * (work.length - 1)))),
          },
        });
        cards.forEach((card, i) => {
          draw(
            card.querySelector("svg")!,
            i < 2 ? { trigger: ".work-pin", start: "top 55%" } : { trigger: card, containerAnimation: slide, start: "left 85%" },
          );
          // Cards settle into place as they slide in, like being dropped into the drawer.
          gsap.fromTo(
            card,
            { rotate: tilt[i] * 4, y: 40 },
            {
              rotate: tilt[i],
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "left 40%", scrub: true },
            },
          );
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={root} aria-labelledby="work-heading" className="relative">
      <div className="mx-auto max-w-[1500px] px-5 pb-10 md:px-10">
        <h2 id="work-heading" className="work-title text-[clamp(3rem,10vw,9rem)] leading-[0.9]">
          <Split text="Selected work" />
        </h2>
        <p className="mt-6 max-w-[40ch] text-[1.25rem] leading-relaxed text-cocoa/85">
          Projects from Datadog, Hexaware and my graduate studies. Open one for the details.
        </p>
      </div>

      <div className="work-pin lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden lg:motion-reduce:h-auto lg:motion-reduce:overflow-x-auto lg:motion-reduce:py-12">
        <div
          ref={track}
          className="flex flex-col gap-6 px-5 pb-16 md:px-10 lg:w-max lg:flex-row lg:items-center lg:gap-14 lg:px-[8vw] lg:pb-0"
        >
          {work.map((w, i) => (
            <article
              key={w.id}
              className="work-card group sticky lg:static"
              style={{ top: `${5.5 + i * 0.9}rem`, transform: `rotate(${tilt[i]}deg)` }}
            >
              <button
                type="button"
                onClick={() => open(w.id)}
                data-cursor="Open"
                data-no-stamp
                aria-label={`Open case study: ${w.title}`}
                className="catalogue-card flex w-full flex-col justify-start rounded-[3px] px-5 pb-12 pt-4 text-left transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] [--head:2.75rem] hover:-translate-y-5 focus-visible:-translate-y-5 lg:aspect-[5/3] lg:w-[min(42rem,62vw)] lg:px-8 lg:pb-8"
              >
                <span className="flex justify-between font-type text-sm text-bark">
                  <span>{w.org}</span>
                  <span>{w.dates}</span>
                </span>
                <span className="mt-8 grid gap-6 sm:grid-cols-[1.1fr_1fr] sm:items-end">
                  <span>
                    <span className="block font-display text-[clamp(1.7rem,2.6vw,2.5rem)] leading-[1.05]">
                      {w.title}
                    </span>
                    <span className="mt-4 hidden max-w-[34ch] text-base leading-snug text-bark xl:block">
                      {w.summary}
                    </span>
                  </span>
                  <PlateArt plate={w.plate} className="w-full text-olive transition-transform duration-700 group-hover:scale-[1.03]" />
                </span>
                {/* The headline result, stamped. Visible on touch, inked on hover with a mouse. */}
                {w.results[0] && (
                <span
                  aria-hidden="true"
                  className="stamp absolute -bottom-3 right-5 bg-card/0 px-2 py-1 text-center text-sm transition-all duration-300 [@media(hover:hover)]:scale-125 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:scale-100 [@media(hover:hover)]:group-focus-within:opacity-100"
                  style={{ rotate: `${-6 + i * 3}deg` }}
                >
                  <span className="block text-lg">{w.results[0].value}</span>
                  <span className="block max-w-[14ch] text-[0.6rem] font-normal leading-tight">
                    {w.results[0].label}
                  </span>
                </span>
                )}
              </button>
            </article>
          ))}
        </div>

        <div aria-hidden="true" className="mx-auto mt-14 hidden w-full max-w-[1500px] items-center gap-6 px-10 lg:flex">
          <span className="font-type text-sm">
            Project {current + 1} of {work.length}
          </span>
          <span className="relative h-px flex-1 bg-cocoa/20">
            <span
              className="absolute inset-y-0 left-0 bg-cocoa transition-[width] duration-300"
              style={{ width: `${((current + 1) / work.length) * 100}%` }}
            />
          </span>
          <span className="text-sm text-bark">Keep scrolling</span>
        </div>
      </div>
    </section>
  );
}
