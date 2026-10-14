"use client";

import { useEffect, useRef, useState } from "react";

// Telefon w pionie dostaje osobne wideo i poster 9:16
const PORTRAIT_PHONE = "(max-width: 767px) and (orientation: portrait)";

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

  // Zamiast atrybutu poster: <picture> pod wideo, żeby telefon dostał pionowy kadr.
  // Wideo bez wczytanej klatki jest przezroczyste, więc obraz prześwituje do startu.
  const cover = `absolute inset-0 h-full w-full object-cover object-center md:object-left ${ended ? "breathe" : ""}`;

  return (
    <>
      <picture>
        <source srcSet="/hero-poster-mobile.jpg" media={PORTRAIT_PHONE} />
        <img src="/hero-poster.jpg" alt="" className={cover} fetchPriority="high" />
      </picture>
      <video
        ref={video}
        className={cover}
        muted
        playsInline
        preload="auto"
        onEnded={() => setEnded(true)}
      >
        <source src="/hero-mobile.mp4" type="video/mp4" media={PORTRAIT_PHONE} />
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </>
  );
}
