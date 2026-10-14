"use client";

import { useEffect, useRef, useState } from "react";

// Wideo w tle: gra raz (najazd z obrotem), potem kadr zostaje i „oddycha”.
export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);

  // Start dopiero po zjechaniu kurtyny intro (atrybut data-ready na <html>)
  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const play = () => video.current?.play().catch(() => setEnded(true));
    if ("ready" in root.dataset) {
      play();
      return;
    }
    const observer = new MutationObserver(() => {
      if ("ready" in root.dataset) {
        observer.disconnect();
        play();
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-ready"] });
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={video}
      className={`absolute inset-0 h-full w-full object-cover object-[68%_center] md:object-left ${ended ? "breathe" : ""}`}
      poster="/hero-poster.jpg"
      muted
      playsInline
      preload="auto"
      onEnded={() => setEnded(true)}
    >
      <source src="/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
      <source src="/hero.mp4" type="video/mp4" />
    </video>
  );
}
