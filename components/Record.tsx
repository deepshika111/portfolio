"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { record, work } from "@/lib/content";
import { reducedMotion } from "@/lib/env";
import { useCaseStudy } from "./CaseStudy";
import Split from "./Split";

const entries = [...record].reverse(); // read oldest to newest, like a date-due slip
const rot = [-7, 4, -3];

export default function Record() {
  const root = useRef<HTMLElement>(null);
  const open = useCaseStudy();

  useEffect(() => {
    const reduce = reducedMotion();
    const ctx = gsap.context(() => {
      const stamps = gsap.utils.toArray<HTMLElement>(".slip-stamp");
      const inline = gsap.utils.toArray<HTMLElement>(".entry-stamp");
      const thud = (el: HTMLElement, i: number) =>
        gsap.fromTo(
          el,
          { scale: 1.9, opacity: 0, rotate: rot[i] - 14 },
          { scale: 1, opacity: 1, rotate: rot[i], duration: reduce ? 0 : 0.22, ease: "power4.in" },
        );
      if (!reduce) gsap.set([...stamps, ...inline], { opacity: 0 });

      gsap.utils.toArray<HTMLElement>(".entry").forEach((entry, i) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 62%",
          onEnter: () => {
            thud(stamps[i], i);
            thud(inline[i], i);
            entry.classList.add("is-on");
          },
          onLeaveBack: () => {
            gsap.to([stamps[i], inline[i]], { opacity: 0, duration: 0.2 });
            entry.classList.remove("is-on");
          },
        });
      });

      if (reduce) return;
      gsap.fromTo(
        ".record-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".record-list", start: "top 60%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.from(".record-title .split-item", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: ".record-title", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="record"
      ref={root}
      aria-labelledby="record-heading"
      className="mx-auto max-w-[1500px] px-5 py-32 md:px-10 md:py-48"
    >
      <div className="grid gap-16 lg:grid-cols-[22rem_1fr] lg:gap-24">
        <div>
          <h2 id="record-heading" className="record-title text-[clamp(3rem,10vw,9rem)] leading-[0.9] lg:text-[7rem]">
            <Split text="Record" />
          </h2>
          <p className="mt-6 max-w-[30ch] text-[1.25rem] leading-relaxed text-cocoa/85">
            Four-plus years of work and study, stamped in the order it happened.
          </p>

          {/* The date-due slip: fills in as you read */}
          <div className="sticky top-28 mt-12 hidden lg:block" aria-hidden="true">
            <div className="rotate-[-1.5deg] bg-card px-6 pb-8 pt-5 shadow-[0_18px_40px_-24px_rgba(59,36,23,.45)]">
              <p className="text-center font-type text-sm font-bold tracking-[0.3em]">DATE DUE</p>
              <div className="mt-4 border-t-2 border-cocoa/70">
                {entries.map((e, i) => (
                  <div key={e.id} className="relative flex h-16 items-center border-b border-cocoa/20">
                    <span className="slip-stamp stamp absolute left-3 px-2 py-0.5 text-base">{e.from}</span>
                  </div>
                ))}
                {[0, 1, 2].map((k) => (
                  <div key={k} className="h-16 border-b border-cocoa/20" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <ol className="record-list relative">
          <span
            aria-hidden="true"
            className="record-line absolute left-0 top-0 h-full w-px origin-top bg-cocoa/40"
          />
          {entries.map((e, i) => (
            <li key={e.id} className="entry group relative pb-24 pl-8 last:pb-0 md:pl-14">
              <span
                aria-hidden="true"
                className="absolute -left-[5px] top-3 h-[11px] w-[11px] rounded-full border border-cocoa bg-paper transition-colors duration-500 group-[.is-on]:bg-olive"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <p className="font-type text-sm text-bark">
                  <time>{e.from.charAt(0) + e.from.slice(1, 3).toLowerCase() + e.from.slice(3)}</time> to{" "}
                  <time>{e.to}</time>
                </p>
                <span aria-hidden="true" className="entry-stamp stamp px-2 py-0.5 text-sm lg:hidden">
                  {e.from}
                </span>
              </div>
              <h3 className="mt-3 text-[clamp(2.2rem,5vw,4.5rem)] leading-none">{e.org}</h3>
              <p className="mt-3 text-lg">
                {e.role}, <span className="text-bark">{e.place}</span>
              </p>
              <ul className="mt-6 max-w-[58ch] space-y-2 text-[1.125rem] text-cocoa/85">
                {e.lines.map((l) => (
                  <li key={l} className="relative pl-5 before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-2.5 before:bg-bark">
                    {l}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm">
                <span className="text-bark">See: </span>
                {e.workIds.map((id, k) => {
                  const w = work.find((x) => x.id === id)!;
                  return (
                    <span key={id}>
                      <button onClick={() => open(id)} className="link-ink" data-cursor="Open">
                        {w.title}
                      </button>
                      {k < e.workIds.length - 1 && " ; "}
                    </span>
                  );
                })}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
