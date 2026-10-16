import type { CSSProperties, ElementType, ReactNode } from "react";

// Nagłówek, którego słowa wjeżdżają po kolei spod maski (styl w globals.css: [data-reveal="mask"])
export function Words({
  as: Tag = "h2",
  text,
  className,
  delay = 0,
  accent,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  delay?: number;
  accent?: string; // słowa zapisane kursywą szeryfową
}) {
  const accentWords = new Set(accent?.split(" "));
  let i = 0;
  const lines = text.split("\n");

  return (
    <Tag data-reveal="mask" className={className} style={{ "--d": `${delay}ms` } as CSSProperties}>
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.split(" ").map((word, wi): ReactNode => {
            const idx = i++;
            const isAccent = accentWords.has(word.replace(/[.,!?]/g, ""));
            return (
              <span key={wi}>
                <span className="w">
                  <span
                    style={{ "--i": idx } as CSSProperties}
                    className={isAccent ? "font-serif font-normal italic tracking-[-0.01em]" : undefined}
                  >
                    {word}
                  </span>
                </span>{" "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
