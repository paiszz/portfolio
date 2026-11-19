import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date("2026-11-20T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
