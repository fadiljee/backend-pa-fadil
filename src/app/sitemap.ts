import type { MetadataRoute } from "next";
import { env } from "@/lib/config/env";
import { ANNOUNCEMENTS_LIST } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.APP_URL.replace(/\/+$/, "");
  const now = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...ANNOUNCEMENTS_LIST.map((item) => ({
      url: `${baseUrl}/pengumuman/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
