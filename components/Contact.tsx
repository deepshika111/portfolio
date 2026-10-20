"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { site } from "@/lib/content";
import { finePointer, reducedMotion } from "@/lib/env";
import Magnetic from "./Magnetic";

export default function Contact() {
  const head = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState("");

  // Live local time in Denton.
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: site.timezone });
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 20_000);
    return () => clearInterval(t);
  }, []);

  // An olive ink pool follows the pointer across the headline.
  useEffect(() => {
    const el = head.current;
    if (!el || !finePointer() || reducedMotion()) return;
    const ink = el.querySelector<HTMLElement>(".ink-layer")!;
    const state = { x: -200, y: -200, r: 0 };
    const apply = () => (ink.style.clipPath = `circle(${state.r}px at ${state.x}px ${state.y}px)`);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      gsap.to(state, { x: e.clientX - r.left, y: e.clientY - r.top, duration: 0.5, ease: "power3", onUpdate: apply });
    };
    const enter = () => gsap.to(state, { r: 150, duration: 0.6, ease: "expo.out", onUpdate: apply });
    const leave = () => gsap.to(state, { r: 0, duration: 0.5, ease: "power2.in", onUpdate: apply });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const headline = (
    <>
      Let&rsquo;s find
      <br />
      the right page.
    </>
  );

  return (
    <footer id="contact" aria-labelledby="contact-heading" className="relative overflow-hidden bg-cocoa text-card">
      <div className="mx-auto max-w-[1500px] px-5 pb-10 pt-32 md:px-10 md:pt-44">
        <div ref={head} className="relative" data-no-stamp>
          <h2 id="contact-heading" className="text-[clamp(3.2rem,11vw,10.5rem)] leading-[0.92]">
            {headline}
          </h2>
          <p
            aria-hidden="true"
            className="ink-layer pointer-events-none absolute inset-0 font-display text-[clamp(3.2rem,11vw,10.5rem)] leading-[0.92] text-[#B9BE7C]"
            style={{ clipPath: "circle(0px at -200px -200px)" }}
          >
            {headline}
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <p className="max-w-[40ch] text-lg text-card/75">
              I&rsquo;m open to conversations about LLM applications, retrieval and agent systems. If that&rsquo;s on
              your desk, write to me.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-ink mt-8 inline-block break-all font-display text-[clamp(1.4rem,3.4vw,2.8rem)]"
              data-cursor="Write"
            >
              {site.email}
            </a>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <button
                  onClick={copy}
                  data-cursor="Copy"
                  className="relative rounded-full border border-card/40 px-6 py-3 transition-colors hover:bg-card hover:text-cocoa"
                >
                  {copied ? "Email copied" : "Copy email"}
                  {copied && (
                    <span
                      aria-hidden="true"
                      className="stamp absolute -right-6 -top-6 rotate-[-12deg] bg-cocoa mix-blend-normal px-2 py-0.5 text-xs text-[#B9BE7C]"
                    >
                      COPIED
                    </span>
                  )}
                </button>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-full border border-card/40 px-6 py-3 transition-colors hover:bg-card hover:text-cocoa"
                >
                  GitHub
                </a>
              </Magnetic>
              {site.linkedin && (
                <Magnetic strength={0.25}>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block rounded-full border border-card/40 px-6 py-3 transition-colors hover:bg-card hover:text-cocoa"
                  >
                    LinkedIn
                  </a>
                </Magnetic>
              )}
              {site.resume && (
                <a href={site.resume} className="link-ink">
                  Résumé (PDF)
                </a>
              )}
            </div>
            <p className="sr-only" aria-live="polite">
              {copied ? "Email address copied to clipboard" : ""}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-6 text-sm text-card/70 md:justify-self-end">
            <div>
              <dt className="text-card/45">Based in</dt>
              <dd className="mt-1 text-card">{site.location}</dd>
            </div>
            <div>
              <dt className="text-card/45">Local time</dt>
              <dd className="mt-1 text-card">{time || " "}</dd>
            </div>
            <div>
              <dt className="text-card/45">Currently</dt>
              <dd className="mt-1 text-card">Datadog</dd>
            </div>
            <div>
              <dt className="text-card/45">Education</dt>
              <dd className="mt-1 text-card">M.S. Computer Science, UNT</dd>
            </div>
          </dl>
        </div>

        <div className="mt-28 flex flex-col justify-between gap-3 border-t border-card/15 pt-6 text-xs text-card/50 md:flex-row">
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
