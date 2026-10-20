"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { finePointer, ready, reducedMotion, scrollToId } from "@/lib/env";
import { site } from "@/lib/content";
import Split from "./Split";

const cards = [
  {
    title: "AI/ML Engineer",
    lines: [
      "3+ years building machine learning",
      "and generative AI systems in Python.",
      "",
      "LLM applications, RAG pipelines",
      "and agent workflows.",
      "",
      "Datadog, Hexaware",
      "M.S. Computer Science, UNT",
    ],
  },
  {
    title: "Agent workflows",
    lines: [
      "Multi-step agents in LangGraph and",
      "CrewAI for retrieval and routine tasks.",
      "",
      "~20% fewer manual steps.",
      "~15% less integration effort",
      "with MCP.",
    ],
  },
  {
    title: "RAG pipelines",
    lines: [
      "Custom chunking, Hugging Face",
      "embeddings, pgvector and Pinecone.",
      "",
      "+15% relevant-context hits.",
      "8K+ requests a month.",
      "12% lower inference latency.",
    ],
  },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState([0, 1, 2]);
  const [typed, setTyped] = useState(false);

  useEffect(() => {
    const q = gsap.utils.selector(root);
    const reduce = reducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.set(q(".hero-char"), { yPercent: 110 });
      gsap.set(q(".hero-fade"), { opacity: 0, y: 16 });
      gsap.set(stack.current, { opacity: 0, y: 80, rotate: 6 });
    }, root);

    let cancelled = false;
    ready.then(() => {
      if (cancelled) return;
      if (reduce) return setTyped(true);
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(q(".hero-char"), { yPercent: 0, duration: 1.2, stagger: 0.035 })
        .to(stack.current, { opacity: 1, y: 0, rotate: 0, duration: 1.2 }, "<0.25")
        .add(() => setTyped(true), "<0.4")
        .to(q(".hero-fade"), { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, "<0.2");

      // Scroll parallax: the name drifts slower than the cards.
      gsap.to(q(".hero-name"), {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(stack.current, {
        yPercent: -35,
        rotate: -4,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    });

    // Cursor tilt on the card stack.
    const el = stack.current;
    let off = () => {};
    if (el && finePointer() && !reduce) {
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
      const move = (e: PointerEvent) => {
        rx(((e.clientY / window.innerHeight) - 0.5) * -4);
        ry(((e.clientX / window.innerWidth) - 0.5) * 6);
      };
      window.addEventListener("pointermove", move);
      off = () => window.removeEventListener("pointermove", move);
    }
    return () => {
      cancelled = true;
      off();
      ctx.revert();
    };
  }, []);

  const next = () => setOrder(([a, ...rest]) => [...rest, a]);

  return (
    <section
      id="top"
      ref={root}
      aria-label="Introduction"
      className="relative mx-auto grid min-h-[100svh] max-w-[1500px] grid-cols-1 content-end gap-12 px-5 pb-10 pt-28 md:px-10 lg:grid-cols-[1.25fr_1fr] lg:content-center lg:gap-8"
    >
      <div className="hero-name relative z-10">
        <h1 className="font-display leading-[0.86] tracking-[-0.03em]">
          <span className="block whitespace-nowrap text-[clamp(3.2rem,17vw,9rem)] lg:text-[clamp(6rem,9.2vw,10rem)]">
            <Split text={site.given} by="char" itemClass="hero-char" />
          </span>
          <span className="block whitespace-nowrap pl-[0.6em] text-[clamp(3.2rem,17vw,9rem)] lg:text-[clamp(6rem,9.2vw,10rem)]">
            <Split text={site.surname} by="char" itemClass="hero-char" />
          </span>
        </h1>
        <p className="hero-fade mt-8 max-w-[30ch] text-[clamp(1.25rem,2.1vw,1.6rem)] leading-snug">
          {site.tagline}
        </p>
        <div className="hero-fade mt-10 flex flex-wrap items-end gap-x-12 gap-y-4 text-sm text-bark">
          <p>
            {site.role} at Datadog
            <br />
            M.S. Computer Science, UNT, 2026
          </p>
          <button onClick={() => scrollToId("about")} className="group flex items-center gap-3 text-cocoa">
            <span className="relative block h-10 w-px overflow-hidden bg-cocoa/20">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[drip_1.8s_ease-in-out_infinite] bg-cocoa" />
            </span>
            Keep reading
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center self-center lg:justify-end" style={{ perspective: "1200px" }}>
        <div ref={stack} className="relative w-[min(92vw,36rem)]" style={{ transformStyle: "preserve-3d" }}>
          <div className="aspect-[5/3]" />
          {order.map((cardIndex, depth) => {
            const c = cards[cardIndex];
            const top = depth === 0;
            return (
              <motion.div
                key={cardIndex}
                className="absolute inset-0"
                style={{ zIndex: 3 - depth }}
                animate={{
                  x: depth * 14,
                  y: depth * -16,
                  rotate: [0, 2.5, -2][depth],
                  scale: 1 - depth * 0.03,
                }}
                transition={{ type: "spring", stiffness: 160, damping: 22 }}
              >
                <button
                  type="button"
                  onClick={top ? next : undefined}
                  tabIndex={top ? 0 : -1}
                  aria-hidden={!top}
                  aria-label={top ? `${c.title}. Show the next card` : undefined}
                  data-cursor={top ? "Next" : undefined}
                  data-no-stamp
                  className="catalogue-card flex h-full w-full flex-col justify-start overflow-hidden after:hidden rounded-[3px] px-[6%] pt-[1em] text-left font-type text-[clamp(0.68rem,2.3vw,1.02rem)] text-cocoa [--head:2.6em]"
                >
                  <span className="flex justify-between text-bark">
                    <span>{c.title}</span>
                    <span>{cardIndex + 1} / 3</span>
                  </span>
                  <span className="mt-[1.6em] block whitespace-pre leading-[1.6]">
                    {c.lines.map((line, i) => (
                      <TypedLine key={i} text={line} delay={i * 0.11} run={typed || !top} instant={!top} />
                    ))}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </div>
        <p className="hero-fade absolute -bottom-9 right-0 text-sm text-bark lg:right-4">
          Tap the card to see the next one.
        </p>
      </div>

      <style>{`@keyframes drip{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}

function TypedLine({ text, delay, run, instant }: { text: string; delay: number; run: boolean; instant: boolean }) {
  return (
    <span className="block min-h-[1.6em]">
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            opacity: run ? 1 : 0,
            transition: instant ? "none" : `opacity 0s linear ${delay + i * 0.012}s`,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
