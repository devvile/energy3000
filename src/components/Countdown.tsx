"use client";

import { useEffect, useState } from "react";

// Start naboru PME2: 20.10.2026, godz. 9:00 czasu polskiego
const TARGET = new Date("2026-10-20T09:00:00+02:00").getTime();

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setLeft(Math.max(TARGET - Date.now(), 0));
    const first = setTimeout(update, 0);
    const id = setInterval(update, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  if (left === 0) {
    return <span className="text-sun">Nabór trwa</span>;
  }

  const s = Math.floor((left ?? 0) / 1000);
  const parts = [
    [Math.floor(s / 86400), "d"],
    [Math.floor((s % 86400) / 3600), "h"],
    [Math.floor((s % 3600) / 60), "m"],
    [s % 60, "s"],
  ] as const;

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {parts.map(([value, unit]) => (
        <span key={unit} className="mr-2 last:mr-0">
          {left === null ? "--" : pad(value)}
          <span className="text-foreground/40">{unit}</span>
        </span>
      ))}
    </span>
  );
}
