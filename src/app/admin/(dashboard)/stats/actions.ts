"use server";

import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { str, num } from "@/lib/form";

const CATEGORIES = ["batting", "bowling", "mvp"];

export async function addStatLeader(form: FormData) {
  await assertAdmin();
  const category = str(form, "category");
  const playerName = str(form, "playerName");
  const value = str(form, "value");
  if (!category || !CATEGORIES.includes(category)) throw new Error("Invalid category.");
  if (!playerName || !value) throw new Error("Player name and value are required.");

  await prisma.statLeader.create({
    data: {
      category,
      playerName,
      value,
      teamId: str(form, "teamId") ?? null,
      detail: str(form, "detail") ?? null,
      rank: num(form, "rank", 0),
    },
  });
  revalidatePublic();
}

export async function deleteStatLeader(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Missing id.");
  await prisma.statLeader.delete({ where: { id } });
  revalidatePublic();
}
