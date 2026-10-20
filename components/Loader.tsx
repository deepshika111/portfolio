"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { markReady, reducedMotion, lockScroll } from "@/lib/env";
import { stampDate } from "./Stamper";

// Opening sequence: a card rises from a drawer, gets typed, gets stamped, the drawer slides away.
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [date, setDate] = useState("");
  const name = "Deepshika Thakur";

  useEffect(() => {
    const seen = sessionStorageGet("dt-seen");
    if (reducedMotion() || seen) {
      setGone(true);
      markReady();
      return;
    }
    setDate(stampDate());
    lockScroll(true);
    const q = gsap.utils.selector(root);
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        sessionStorageSet("dt-seen", "1");
        lockScroll(false);
        setGone(true);
      },
    });
    tl.fromTo(q(".ld-card"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: "expo.out" })
      .to(q(".ld-char"), { opacity: 1, duration: 0.01, stagger: 0.045 }, "-=0.2")
      .fromTo(
        q(".ld-stamp"),
        { scale: 1.8, opacity: 0, rotate: -18 },
        { scale: 1, opacity: 1, rotate: -9, duration: 0.22, ease: "power4.in" },
        "+=0.15",
      )
      .to(q(".ld-card"), { y: -6, duration: 0.08, yoyo: true, repeat: 1, ease: "none" }, "<+0.2")
      .add(() => markReady(), "+=0.3")
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "<");
    return () => {
      tl.kill();
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="loader fixed inset-0 z-[150] flex items-end justify-center overflow-hidden bg-paper"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <noscript>
        <style>{`.loader{display:none}`}</style>
      </noscript>
      <div className="relative mb-[22vh] w-[min(86vw,26rem)]">
        <div style={{ transform: "translateY(115%)" }} className="ld-card catalogue-card aspect-[5/3] w-full rounded-[3px] px-6 pt-4 font-type text-cocoa">
          <div className="flex justify-between text-sm text-bark">
            <span>AI/ML Engineer</span>
            <span>Denton, TX</span>
          </div>
          <p className="mt-8 text-xl">
            {name.split("").map((c, i) => (
              <span key={i} className="ld-char opacity-0">
                {c}
              </span>
            ))}
          </p>
          <div className="ld-stamp stamp absolute bottom-8 right-6 px-2 py-1 text-sm opacity-0">
            <div className="text-[0.65rem]">RECEIVED</div>
            {date}
          </div>
        </div>
      </div>
      {/* Drawer front */}
      <div className="absolute inset-x-0 bottom-0 h-[22vh] border-t border-cocoa/20 bg-rule">
        <div className="mx-auto mt-6 h-10 w-36 rounded-sm border border-cocoa/30 bg-card/60" />
      </div>
    </div>
  );
}

function sessionStorageGet(k: string) {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
}
function sessionStorageSet(k: string, v: string) {
  try {
    sessionStorage.setItem(k, v);
  } catch {}
}
