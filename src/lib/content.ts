import { prisma } from "@/lib/db";

/**
 * All admin-editable site text lives here as key/value Settings.
 * Defaults below render the site even before the database is seeded,
 * and document every editable field for the admin Content editor.
 */
export const SETTING_DEFAULTS = {
  // Brand / global
  leagueName: "USA High School Cricket League",
  leagueShortName: "USAHSC",
  season: "2025/26 Season",

  // Hero
  heroTitle: "USA High School Cricket League",
  heroTagline: "Building the future of high-school cricket in Texas",
  heroSubtitle: "9 high school teams. 1 champion. One unforgettable season.",

  // Home highlights blurb
  highlightsTitle: "League Highlights",
  highlightsBody:
    "Follow the road to the USAHSC title — featured matchups, standout performances and the moments that define the season.",

  // About
  aboutMission:
    "USAHSC exists to give high-school students across Texas a competitive, well-organized stage to play the game they love. We bring schools together under one banner to grow cricket at the grassroots level.",
  aboutWhatWeDo:
    "We run a full inter-school season — fixtures, officiating, standings and statistics — so players, coaches and families can focus on cricket. From group-stage clashes to the championship final, every match is organized, scored and shared.",
  aboutWhyItMatters:
    "High-school cricket builds discipline, teamwork and belonging. For many students it is their first taste of representing their school. Giving that experience a real league — with records, rivalries and recognition — is how the sport grows in the United States.",
  leadershipTitle: "League Leadership",
  leadershipBody:
    "The USAHSC is run by a volunteer group of coaches, parents and cricket organizers dedicated to student athletes.",

  // Contact / social
  contactEmail: "info@usahsc.com",
  instagramUrl: "https://instagram.com/usahsc",
  instagramHandle: "@usahsc",
  cricclubsUrl: "https://cricclubs.com/USHSC",

  // Footer
  footerBlurb:
    "The official home of the USA High School Cricket League — Texas high-school cricket, done right.",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type SiteSettings = Record<SettingKey, string>;

/**
 * Load all settings merged over defaults. Resilient: if the DB is
 * unreachable (e.g. before first deploy) it returns the defaults so the
 * site still renders.
 */
export async function getSettings(): Promise<SiteSettings> {
  const merged: SiteSettings = { ...SETTING_DEFAULTS };
  try {
    const rows = await prisma.setting.findMany();
    for (const row of rows) {
      if (row.key in merged && row.value != null) {
        merged[row.key as SettingKey] = row.value;
      }
    }
  } catch {
    // DB not available yet — fall back to defaults.
  }
  return merged;
}
