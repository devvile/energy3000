import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Wersje konfiguratora do porównań (/konfigurator, /konfigurator-3d) mają noindex w swoich metadanych — nie blokujemy
// ich tutaj, bo zablokowana strona nie pokaże Google swojego noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
