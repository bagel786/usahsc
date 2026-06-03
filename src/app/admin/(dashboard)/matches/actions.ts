"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { str } from "@/lib/form";

function readMatch(form: FormData) {
  const homeTeamId = str(form, "homeTeamId");
  const awayTeamId = str(form, "awayTeamId");
  const dt = str(form, "dateTime");
  if (!homeTeamId || !awayTeamId) throw new Error("Both teams are required.");
  if (homeTeamId === awayTeamId) throw new Error("A team cannot play itself.");
  if (!dt) throw new Error("Date and time are required.");

  return {
    homeTeamId,
    awayTeamId,
    dateTime: new Date(dt),
    location: str(form, "location") ?? null,
    stage: str(form, "stage") ?? null,
    status: str(form, "status") ?? "upcoming",
    homeScore: str(form, "homeScore") ?? null,
    awayScore: str(form, "awayScore") ?? null,
    resultText: str(form, "resultText") ?? null,
    scorecardUrl: str(form, "scorecardUrl") ?? null,
  };
}

export async function createMatch(form: FormData) {
  await assertAdmin();
  await prisma.match.create({ data: readMatch(form) });
  revalidatePublic();
  redirect("/admin/matches");
}

export async function updateMatch(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Missing match id.");
  await prisma.match.update({ where: { id }, data: readMatch(form) });
  revalidatePublic();
  redirect("/admin/matches");
}

export async function deleteMatch(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Missing match id.");
  await prisma.match.delete({ where: { id } });
  revalidatePublic();
  redirect("/admin/matches");
}
