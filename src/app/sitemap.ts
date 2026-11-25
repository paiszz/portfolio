import type { MetadataRoute } from "next";
import { SECTOR_CATEGORIES } from "@/data/projects";
import { SITE_CONFIG } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const sectorEntries: MetadataRoute.Sitemap = SECTOR_CATEGORIES.map(
    (sector) => ({
      url: `${SITE_CONFIG.url}/projects/${sector.id.toLowerCase()}`,
      lastModified: new Date("2026-11-24T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  );

  return [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date("2026-11-24T00:00:00.000Z"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...sectorEntries,
  ];
}
