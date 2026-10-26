"use client";

import { useEffect } from "react";

// Jeden obserwator dla całej strony: elementy z [data-reveal] dostają data-in, gdy wjadą w kadr.
// Obserwuje też elementy dodawane później (np. kolejne kroki kreatora na /konfigurator).
export function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    const obserwuj = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])").forEach((el) => io.observe(el));
    };
    obserwuj(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (!(n instanceof HTMLElement)) continue;
          if (n.matches("[data-reveal]:not([data-in])")) io.observe(n);
          obserwuj(n);
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
