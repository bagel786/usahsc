import { prisma } from "@/lib/db";

/** All query helpers degrade gracefully to empty results if the DB is
 *  unreachable, so public pages still render before the first deploy. */

export async function getTeams() {
  try {
    return await prisma.team.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      include: { standing: true, _count: { select: { players: true } } },
    });
  } catch {
    return [];
  }
}

export async function getTeamBySlug(slug: string) {
  try {
    return await prisma.team.findUnique({
      where: { slug },
      include: {
        standing: true,
        players: { orderBy: [{ order: "asc" }, { name: "asc" }] },
      },
    });
  } catch {
    return null;
  }
}

const matchInclude = { homeTeam: true, awayTeam: true } as const;

export async function getUpcomingMatches(limit?: number) {
  try {
    return await prisma.match.findMany({
      where: { status: { in: ["upcoming", "live"] } },
      orderBy: { dateTime: "asc" },
      include: matchInclude,
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getResults(limit?: number) {
  try {
    return await prisma.match.findMany({
      where: { status: "completed" },
      orderBy: { dateTime: "desc" },
      include: matchInclude,
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getMatchesForTeam(teamId: string) {
  try {
    return await prisma.match.findMany({
      where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
      orderBy: { dateTime: "asc" },
      include: matchInclude,
    });
  } catch {
    return [];
  }
}

export async function getStandings() {
  try {
    const rows = await prisma.standing.findMany({
      include: { team: true },
    });
    return rows.sort(
      (a, b) => b.points - a.points || b.netRunRate - a.netRunRate,
    );
  } catch {
    return [];
  }
}

export async function getStatLeaders(category: "batting" | "bowling" | "mvp") {
  try {
    return await prisma.statLeader.findMany({
      where: { category },
      orderBy: { rank: "asc" },
      include: { team: true },
    });
  } catch {
    return [];
  }
}
