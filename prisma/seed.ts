import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SETTING_DEFAULTS } from "../src/lib/content";

const prisma = new PrismaClient();

type TeamSeed = {
  slug: string;
  name: string;
  school: string;
  mascot?: string;
  logoUrl?: string | null;
  captain?: string;
  primaryColor: string;
  order: number;
};

const TEAMS: TeamSeed[] = [
  { slug: "cedar-ridge", name: "Cedar Ridge", school: "Cedar Ridge High School", mascot: "Raiders", logoUrl: "/teams/cedar-ridge.png", primaryColor: "#7c3aed", order: 1 },
  { slug: "westlake", name: "Westlake", school: "Westlake High School", mascot: "Chaparrals", logoUrl: "/teams/westlake.png", primaryColor: "#b91c1c", order: 2 },
  { slug: "round-rock", name: "Round Rock", school: "Round Rock High School", mascot: "Dragons", logoUrl: "/teams/round-rock.png", primaryColor: "#7b1e2b", order: 3 },
  { slug: "mcneil", name: "McNeil", school: "McNeil High School", mascot: "Mavericks", logoUrl: "/teams/mcneil.png", primaryColor: "#15803d", order: 4 },
  { slug: "leander", name: "Leander", school: "Leander High School", mascot: "Lions", logoUrl: "/teams/leander.png", primaryColor: "#1d4ed8", order: 5 },
  { slug: "westwood", name: "Westwood", school: "Westwood High School", mascot: "Warriors", logoUrl: "/teams/westwood.png", primaryColor: "#b45309", order: 6 },
  { slug: "legacy-ranch", name: "Legacy Ranch", school: "Legacy Ranch High School", mascot: "Mustangs", logoUrl: "/teams/legacy-ranch.png", primaryColor: "#0ea5e9", order: 7 },
  { slug: "vandegrift", name: "Vandegrift", school: "Vandegrift High School", mascot: "Vipers", logoUrl: "/teams/vandegrift.png", primaryColor: "#334155", order: 8 },
  { slug: "rouse", name: "Rouse", school: "Rouse High School", mascot: "Raiders", logoUrl: "/teams/rouse.png", primaryColor: "#ca8a04", order: 9 },
];

async function main() {
  // --- Admin user -------------------------------------------------------
  const email = process.env.ADMIN_EMAIL ?? "admin@usahsc.com";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2026";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "USAHSC Admin" },
  });
  console.log(`✓ Admin user ready: ${email}`);

  // --- Editable site settings ------------------------------------------
  for (const [key, value] of Object.entries(SETTING_DEFAULTS)) {
    await prisma.setting.upsert({
      where: { key },
      update: {}, // don't overwrite admin edits on re-seed
      create: { key, value },
    });
  }
  console.log(`✓ Seeded ${Object.keys(SETTING_DEFAULTS).length} settings`);

  // --- Teams ------------------------------------------------------------
  const teamIds: Record<string, string> = {};
  for (const t of TEAMS) {
    const team = await prisma.team.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        school: t.school,
        mascot: t.mascot,
        logoUrl: t.logoUrl,
        primaryColor: t.primaryColor,
        displayOrder: t.order,
      },
      create: {
        slug: t.slug,
        name: t.name,
        school: t.school,
        mascot: t.mascot,
        logoUrl: t.logoUrl,
        primaryColor: t.primaryColor,
        displayOrder: t.order,
        captain: t.captain,
      },
    });
    teamIds[t.slug] = team.id;
  }
  console.log(`✓ Seeded ${TEAMS.length} teams`);

  // --- Sample standings (placeholder numbers, fully editable) ----------
  const standingSeed: Array<[string, number, number, number, number]> = [
    // slug, played, wins, losses, nrr
    ["westlake", 4, 4, 0, 1.82],
    ["leander", 4, 3, 1, 0.94],
    ["vandegrift", 4, 3, 1, 0.61],
    ["mcneil", 4, 2, 2, 0.12],
    ["cedar-ridge", 4, 2, 2, -0.08],
    ["round-rock", 4, 2, 2, -0.21],
    ["rouse", 4, 1, 3, -0.55],
    ["legacy-ranch", 4, 1, 3, -0.88],
    ["westwood", 4, 0, 4, -1.74],
  ];
  for (const [slug, played, wins, losses, nrr] of standingSeed) {
    await prisma.standing.upsert({
      where: { teamId: teamIds[slug] },
      update: { played, wins, losses, points: wins * 2, netRunRate: nrr },
      create: {
        teamId: teamIds[slug],
        played,
        wins,
        losses,
        points: wins * 2,
        netRunRate: nrr,
      },
    });
  }
  console.log("✓ Seeded standings");

  // --- Sample matches ---------------------------------------------------
  await prisma.match.deleteMany();
  const day = (offset: number, hour = 18) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    d.setHours(hour, 0, 0, 0);
    return d;
  };
  await prisma.match.createMany({
    data: [
      {
        homeTeamId: teamIds["westlake"],
        awayTeamId: teamIds["westwood"],
        dateTime: day(-12),
        location: "Round Rock Multipurpose Complex",
        stage: "Group Stage",
        status: "completed",
        homeScore: "168/4 (20)",
        awayScore: "121/9 (20)",
        resultText: "Westlake won by 47 runs",
      },
      {
        homeTeamId: teamIds["leander"],
        awayTeamId: teamIds["rouse"],
        dateTime: day(-9),
        location: "Brushy Creek Sports Park",
        stage: "Group Stage",
        status: "completed",
        homeScore: "142/6 (20)",
        awayScore: "138/8 (20)",
        resultText: "Leander won by 4 runs",
      },
      {
        homeTeamId: teamIds["vandegrift"],
        awayTeamId: teamIds["cedar-ridge"],
        dateTime: day(-5),
        location: "Old Settlers Park, Field 4",
        stage: "Group Stage",
        status: "completed",
        homeScore: "154/7 (20)",
        awayScore: "150/9 (20)",
        resultText: "Vandegrift won by 4 runs",
      },
      {
        homeTeamId: teamIds["mcneil"],
        awayTeamId: teamIds["round-rock"],
        dateTime: day(3),
        location: "Old Settlers Park, Field 2",
        stage: "Group Stage",
        status: "upcoming",
      },
      {
        homeTeamId: teamIds["westlake"],
        awayTeamId: teamIds["leander"],
        dateTime: day(5),
        location: "Brushy Creek Sports Park",
        stage: "Top of the Table",
        status: "upcoming",
      },
      {
        homeTeamId: teamIds["legacy-ranch"],
        awayTeamId: teamIds["vandegrift"],
        dateTime: day(7),
        location: "Old Settlers Park, Field 4",
        stage: "Group Stage",
        status: "upcoming",
      },
    ],
  });
  console.log("✓ Seeded matches");

  // --- Sample stat leaders ---------------------------------------------
  await prisma.statLeader.deleteMany();
  await prisma.statLeader.createMany({
    data: [
      { category: "batting", playerName: "Arjun Patel", teamId: teamIds["westlake"], value: "241 runs", detail: "Avg 60.3 · SR 142", rank: 1 },
      { category: "batting", playerName: "Rohan Mehta", teamId: teamIds["leander"], value: "208 runs", detail: "Avg 52.0 · SR 131", rank: 2 },
      { category: "batting", playerName: "Daniel Cruz", teamId: teamIds["vandegrift"], value: "189 runs", detail: "Avg 47.3 · SR 128", rank: 3 },
      { category: "bowling", playerName: "Sahil Khan", teamId: teamIds["vandegrift"], value: "11 wkts", detail: "Econ 5.2 · Best 4/14", rank: 1 },
      { category: "bowling", playerName: "Ethan Wright", teamId: teamIds["westlake"], value: "10 wkts", detail: "Econ 5.8 · Best 3/9", rank: 2 },
      { category: "bowling", playerName: "Vikram Rao", teamId: teamIds["mcneil"], value: "9 wkts", detail: "Econ 6.0 · Best 3/21", rank: 3 },
      { category: "mvp", playerName: "Arjun Patel", teamId: teamIds["westlake"], value: "241 runs · 6 wkts", detail: "Player of the Tournament race", rank: 1 },
      { category: "mvp", playerName: "Sahil Khan", teamId: teamIds["vandegrift"], value: "11 wkts · 96 runs", detail: "All-round impact", rank: 2 },
      { category: "mvp", playerName: "Rohan Mehta", teamId: teamIds["leander"], value: "208 runs · 4 wkts", detail: "Consistent match-winner", rank: 3 },
    ],
  });
  console.log("✓ Seeded stat leaders");

  console.log("\n🏏 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
