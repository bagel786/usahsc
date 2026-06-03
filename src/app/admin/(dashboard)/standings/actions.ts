"use server";

import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { str, num } from "@/lib/form";

export async function saveStanding(form: FormData) {
  await assertAdmin();
  const teamId = str(form, "teamId");
  if (!teamId) throw new Error("Missing team id.");

  const data = {
    played: num(form, "played"),
    wins: num(form, "wins"),
    losses: num(form, "losses"),
    tiesNr: num(form, "tiesNr"),
    points: num(form, "points"),
    netRunRate: num(form, "netRunRate"),
  };

  await prisma.standing.upsert({
    where: { teamId },
    update: data,
    create: { teamId, ...data },
  });

  revalidatePublic();
}
