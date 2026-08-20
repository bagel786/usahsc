import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/teams", "/schedule", "/standings", "/stats", "/register", "/contact"];

  const staticPages: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE_URL}${r}`,
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
      url: `${SITE_URL}/teams/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build — static routes still emitted.
  }

  return [...staticPages, ...teamPages];
}
