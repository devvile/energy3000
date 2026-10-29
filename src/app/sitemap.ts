import type { MetadataRoute } from "next";
import { PORADNIKI } from "@/components/Poradnik";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...PORADNIKI.map((p) => ({ url: `${SITE_URL}${p.href}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: `${SITE_URL}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
