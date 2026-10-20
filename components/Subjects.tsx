"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { lookup, subjects, type Subject } from "@/lib/content";
import { useCaseStudy } from "./CaseStudy";

const headings = Array.from(new Set(subjects.map((s) => s.heading)));

export default function Subjects() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<Subject[]>(() => [subjects.find((s) => s.term === "RAG")!]);
  const input = useRef<HTMLInputElement>(null);
  const open = useCaseStudy();

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => subjects.filter((s) => !q || s.term.toLowerCase().includes(q) || s.heading.toLowerCase().includes(q)),
    [q],
  );

  // "/" jumps to the catalogue search, like a site search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA/.test(t.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = (s: Subject) => setHistory((h) => [s, ...h.filter((x) => x.term !== s.term)].slice(0, 3));

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="mx-auto max-w-[1500px] px-5 py-32 md:px-10 md:py-40"
    >
      <h2 id="skills-heading" className="text-[clamp(3rem,10vw,9rem)] leading-[0.9]">
        Skills
      </h2>
      <p className="mt-6 max-w-[40ch] text-[1.25rem] leading-relaxed text-cocoa/85">
        The tools and methods I work with. Pick one to see where I used it.
      </p>

      <div className="mt-16 grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
        <div>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (matches[0]) pick(matches[0]);
            }}
          >
            <label htmlFor="skill-search" className="text-sm text-bark">
              Search skills <span className="hidden md:inline">(press / from anywhere)</span>
            </label>
            <input
              id="skill-search"
              ref={input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. vector search"
              autoComplete="off"
              className="mt-2 w-full border-b-2 border-cocoa bg-transparent pb-2 font-type text-[clamp(1.4rem,3vw,2.2rem)] placeholder:text-cocoa/30 focus:border-olive focus:outline-none"
            />
          </form>
          <p className="mt-3 text-sm text-bark" aria-live="polite">
            {matches.length === 0
              ? "No skill by that name. Try a broader term, like search or cloud."
              : `${matches.length} ${matches.length === 1 ? "skill" : "skills"}`}
          </p>

          <div className="mt-10 space-y-8">
            {headings.map((h) => {
              const items = matches.filter((m) => m.heading === h);
              if (!items.length) return null;
              return (
                <div key={h}>
                  <h3 className="font-type text-sm text-bark">{h}</h3>
                  <p className="mt-2 text-[clamp(1.2rem,2.1vw,1.6rem)] leading-relaxed">
                    {items.map((s, i) => {
                      const active = history[0]?.term === s.term;
                      return (
                        <span key={s.term}>
                          <button
                            onClick={() => pick(s)}
                            aria-pressed={active}
                            data-cursor="Show"
                            className={`font-display transition-colors hover:text-olive ${active ? "text-olive underline decoration-1 underline-offset-4" : ""}`}
                          >
                            <Highlight text={s.term} q={q} />
                          </button>
                          {i < items.length - 1 && <span className="text-cocoa/30"> ; </span>}
                        </span>
                      );
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Looked-up cards pile up, newest on top */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative" aria-live="polite">
            <div className="aspect-[5/3] max-h-[20rem] w-full" />
            <AnimatePresence initial={false}>
              {history.map((s, depth) => (
                <motion.div
                  key={s.term}
                  className="absolute inset-0"
                  style={{ zIndex: 5 - depth }}
                  initial={{ y: -60, rotate: -6, opacity: 0 }}
                  animate={{ y: depth * -14, x: depth * 10, rotate: [-1, 2.5, -3][depth], opacity: 1, scale: 1 - depth * 0.03 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 170, damping: 22 }}
                  aria-hidden={depth > 0}
                >
                  <SubjectCard s={s} onOpen={open} interactive={depth === 0} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function SubjectCard({ s, onOpen, interactive }: { s: Subject; onOpen: (id: string) => void; interactive: boolean }) {
  return (
    <div className="catalogue-card h-full overflow-hidden rounded-[3px] px-6 pt-4 font-type text-[0.9rem] [--head:2.6rem]">
      <div className="flex justify-between text-bark">
        <span>Skill</span>
        <span>{s.heading}</span>
      </div>
      <p className="mt-7 font-display text-2xl">{s.term}</p>
      {s.see.length ? (
        <div className="mt-3 leading-7">
          <span className="text-bark">Used in: </span>
          {s.see.map((id, i) => {
            const { label, workId } = lookup(id);
            return (
              <span key={id}>
                {workId && interactive ? (
                  <button onClick={() => onOpen(workId)} className="link-ink text-left" data-cursor="Open">
                    {label}
                  </button>
                ) : (
                  label
                )}
                {i < s.see.length - 1 && " ; "}
              </span>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 leading-7 text-bark">Part of my technical skill set.</p>
      )}
    </div>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-olive/20 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}
