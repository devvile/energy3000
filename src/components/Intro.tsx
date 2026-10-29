"use client";

import { useEffect } from "react";

// Start strony: od razu odblokowuje animacje wejścia (html[data-ready]) — hasło i magazyn widać w pierwszej sekundzie.
// Wcześniej był tu ekran „ładowania magazynu” 0 → 100% (2,2 s + kurtyna), który zasłaniał start strony; usunięty po audycie
// wyglądu 29.10 (ruch z reklam na telefonie nie czeka na licznik).
export function Intro() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.documentElement.dataset.ready = "";
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
