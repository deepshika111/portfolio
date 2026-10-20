"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { work } from "@/lib/content";
import { lockScroll } from "@/lib/env";
import PlateArt from "./Plates";

const Ctx = createContext<(id: string) => void>(() => {});
export const useCaseStudy = () => useContext(Ctx);

export function CaseStudyProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((next: string) => {
    opener.current = document.activeElement as HTMLElement;
    setId(next);
  }, []);
  const close = useCallback(() => {
    setId(null);
    setTimeout(() => opener.current?.focus(), 50);
  }, []);

  useEffect(() => lockScroll(!!id), [id]);

  return (
    <Ctx.Provider value={open}>
      {children}
      <AnimatePresence>{id && <Sheet key="sheet" id={id} setId={setId} close={close} />}</AnimatePresence>
    </Ctx.Provider>
  );
}

function Sheet({ id, setId, close }: { id: string; setId: (id: string) => void; close: () => void }) {
  const i = work.findIndex((w) => w.id === id);
  const w = work[i];
  const panel = useRef<HTMLDivElement>(null);
  const prev = work[(i - 1 + work.length) % work.length];
  const next = work[(i + 1) % work.length];

  useEffect(() => {
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setId(next.id);
      if (e.key === "ArrowLeft") setId(prev.id);
      if (e.key === "Tab" && panel.current) {
        // Keep focus inside the sheet.
        const f = panel.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, setId, next.id, prev.id]);

  return (
    <motion.div
      className="fixed inset-0 z-[110] flex items-end justify-center md:items-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1 }}
    >
      <motion.button
        aria-label="Close case study"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 bg-cocoa/55"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        tabIndex={-1}
        data-lenis-prevent
        className="catalogue-card relative max-h-[92svh] after:hidden w-full max-w-5xl overflow-y-auto rounded-t-md px-5 pb-16 pt-5 [--head:3.6rem] focus:outline-none md:mx-6 md:rounded-md md:px-12 md:pt-6"
        initial={{ y: "105%", rotate: 3 }}
        animate={{ y: 0, rotate: 0 }}
        exit={{ y: "110%", rotate: -2 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 0.9 }}
      >
        <div className="flex items-center justify-between font-type text-sm text-bark">
          <span>
            {w.org}, {w.dates}
          </span>
          <button onClick={close} className="rounded-sm px-2 py-1 text-cocoa hover:bg-cocoa/5" data-cursor="Close">
            Close
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={w.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pt-12"
          >
                        <h2 id="case-title" className="mt-2 max-w-[18ch] text-[clamp(2.2rem,5vw,4rem)] leading-[1.02]">
              {w.title}
            </h2>
            <p className="mt-6 max-w-[52ch] text-lg">{w.summary}</p>

            <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr]">
              <PlateArt plate={w.plate} className="w-full text-olive" />
              <div className="flex flex-wrap content-start gap-4">
                {w.results.map((r, k) => (
                  <div
                    key={r.value}
                    className="stamp px-3 py-2"
                    style={{ transform: `rotate(${[-4, 2.5, -1.5, 3][k % 4]}deg)` }}
                  >
                    <div className="text-2xl">{r.value}</div>
                    <div className="max-w-[18ch] text-[0.78rem] font-normal leading-snug tracking-normal">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="text-xl">What I built</h3>
                <ol className="mt-4 space-y-3">
                  {w.built.map((b, k) => (
                    <li key={k} className="grid grid-cols-[1.75rem_1fr] text-bark">
                      <span className="font-type text-sm text-olive">{k + 1}.</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-xl">Tools</h3>
                <p className="mt-4 font-type text-sm leading-7">{w.stack.join(" ; ")}</p>
                {w.link && (
                  <a href={w.link.href} target="_blank" rel="noreferrer" className="link-ink mt-6 inline-block">
                    {w.link.label}
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>

        <div className="mt-14 flex justify-between gap-4 border-t border-cocoa/15 pt-5 text-sm">
          <button onClick={() => setId(prev.id)} className="text-left hover:text-olive">
            <span className="block text-bark">Previous project</span>
            {prev.title}
          </button>
          <button onClick={() => setId(next.id)} className="text-right hover:text-olive">
            <span className="block text-bark">Next project</span>
            {next.title}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
