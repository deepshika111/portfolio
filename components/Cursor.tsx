"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { finePointer, reducedMotion } from "@/lib/env";

// An ink-dot cursor. Elements can set data-cursor="Label" to show a word in the ring.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!finePointer()) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const lag = reducedMotion() ? 0.01 : 0.45;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: lag, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: lag, ease: "power3" });

    let last: Element | null = null;
    let seen = false;
    const move = (e: PointerEvent) => {
      if (!seen) {
        seen = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = (e.target as Element).closest("[data-cursor], a, button, input, [role=button]");
      if (t === last) return;
      last = t;
      const text = t?.getAttribute("data-cursor") ?? "";
      setLabel(text);
      gsap.to(ring.current, {
        scale: text ? 2.6 : t ? 1.6 : 1,
        backgroundColor: text ? "rgba(94,99,48,0.92)" : "rgba(94,99,48,0)",
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.2 });
    };
    const hide = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const show = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });
    const press = () => gsap.to(ring.current, { scale: "-=0.25", duration: 0.12, yoyo: true, repeat: 1 });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", hide);
    document.addEventListener("pointerenter", show);
    window.addEventListener("pointerdown", press);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("pointerenter", show);
      window.removeEventListener("pointerdown", press);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[160] ${on ? "" : "hidden"}`}>
      <div
        ref={ring}
        className="absolute left-0 top-0 -ml-5 -mt-5 flex opacity-0 h-10 w-10 items-center justify-center rounded-full border border-olive"
      >
        <span className="font-type text-[0.32rem] font-bold text-card">{label}</span>
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-[4px] -mt-[4px] opacity-0 h-2 w-2 rounded-full bg-cocoa" />
    </div>
  );
}
