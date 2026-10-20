"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { reducedMotion } from "@/lib/env";

export const stampDate = (d = new Date()) =>
  d
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .replace(",", "")
    .toUpperCase();

// Hidden interaction: double-click any empty spot to stamp the page with today's date.
export default function Stamper() {
  useEffect(() => {
    const onDbl = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, input, textarea, [role=dialog], [data-no-stamp]")) return;
      window.getSelection()?.removeAllRanges();
      const el = document.createElement("div");
      el.className = "stamp pointer-events-none fixed z-[120] px-2 py-1 text-sm text-center";
      el.setAttribute("aria-hidden", "true");
      el.innerHTML = `<div style="font-size:.6rem">SEEN</div>${stampDate()}`;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      document.body.appendChild(el);
      const rot = gsap.utils.random(-16, 10);
      if (reducedMotion()) {
        gsap.set(el, { xPercent: -50, yPercent: -50, rotate: rot });
        gsap.to(el, { opacity: 0, delay: 2.5, duration: 0.6, onComplete: () => el.remove() });
        return;
      }
      gsap
        .timeline({ onComplete: () => el.remove() })
        .fromTo(
          el,
          { xPercent: -50, yPercent: -50, scale: 1.9, opacity: 0, rotate: rot - 12 },
          { scale: 1, opacity: 1, rotate: rot, duration: 0.18, ease: "power4.in" },
        )
        .to(el, { opacity: 0, duration: 1.2, delay: 2.8, ease: "power1.in" });
    };
    window.addEventListener("dblclick", onDbl);
    return () => window.removeEventListener("dblclick", onDbl);
  }, []);
  return null;
}
