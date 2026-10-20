"use client";

import Lenis from "lenis";

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// One Lenis instance for the page, set by <SmoothScroll />.
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => (lenis = l);

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  else el.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
  // Move keyboard focus with the scroll so screen readers follow.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export const lockScroll = (on: boolean) => {
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? "hidden" : "";
};

// The loader resolves this so the hero can start its entrance.
let resolveReady: () => void = () => {};
export const ready = new Promise<void>((r) => (resolveReady = r));
export const markReady = () => resolveReady();
