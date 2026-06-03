import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["", "/about", "/teams", "/schedule", "/standings", "/stats", "/register", "/contact"];

  const staticPages: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));

  let teamPages: MetadataRoute.Sitemap = [];
  try {
    const teams = await prisma.team.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
    teamPages = teams.map((t) => ({
      url: `${base}/teams/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build — static routes still emitted.
  }

  return [...staticPages, ...teamPages];
}
