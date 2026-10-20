"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { lockScroll, scrollToId } from "@/lib/env";
import { site } from "@/lib/content";

const sections = [
  { id: "work", label: "Selected work" },
  { id: "record", label: "Record" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Tuck the bar away while reading downward, bring it back on the way up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) button.current?.focus({ preventScroll: true });
    wasOpen.current = open;
    lockScroll(open);
    if (open) setTimeout(() => firstLink.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-transform duration-500 ${
          hidden && !open ? "-translate-y-full" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10">
          <a href="#top" onClick={go("top")} className="font-display text-xl" data-cursor="Top">
            Deepshika Thakur
          </a>
          <p className="hidden text-sm text-bark md:block">
            {site.role}, {site.location}
          </p>
          <button
            ref={button}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-index"
            className="group flex items-center gap-3 text-sm"
          >
            <span>{open ? "Close" : "Index"}</span>
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-cocoa transition-transform duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : "group-hover:translate-x-1"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-cocoa transition-transform duration-300 ${
                  open ? "-translate-y-[5px] -rotate-45" : "group-hover:-translate-x-1"
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="site-index"
            aria-label="Site index"
            className="fixed inset-0 z-[80] flex flex-col justify-end bg-paper px-5 pb-10 pt-24 md:px-10"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="mx-auto w-full max-w-[1500px]">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ y: -60, opacity: 0, rotate: -1.5 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative border-t border-cocoa/25"
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${s.id}`}
                    onClick={go(s.id)}
                    className="group flex items-baseline justify-between py-4 font-display text-[clamp(2.6rem,9vw,7.5rem)] leading-none"
                  >
                    <span className="transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-4 group-focus-visible:translate-x-4">
                      {s.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
