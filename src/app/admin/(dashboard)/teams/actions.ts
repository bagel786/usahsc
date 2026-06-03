"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { saveUpload } from "@/lib/upload";
import { revalidatePublic } from "@/lib/revalidate";
import { str, num, bool, slugify } from "@/lib/form";

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "team";
  let slug = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.team.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${++n}`;
  }
}

function readTeamFields(form: FormData) {
  return {
    name: str(form, "name") ?? "",
    school: str(form, "school") ?? "",
    mascot: str(form, "mascot") ?? null,
    captain: str(form, "captain") ?? null,
    primaryColor: str(form, "primaryColor") ?? "#e11d2a",
    cricclubsUrl: str(form, "cricclubsUrl") ?? null,
    instagramUrl: str(form, "instagramUrl") ?? null,
    bio: str(form, "bio") ?? null,
    displayOrder: num(form, "displayOrder", 0),
    isActive: bool(form, "isActive"),
  };
}

export async function createTeam(form: FormData) {
  await assertAdmin();
  const fields = readTeamFields(form);
  if (!fields.name || !fields.school) throw new Error("Name and school are required.");

  const logoUrl = await saveUpload(form.get("logo") as File | null);
  const slug = await uniqueSlug(str(form, "slug") ?? fields.name);

  await prisma.team.create({
    data: { ...fields, slug, logoUrl: logoUrl ?? undefined },
  });

  revalidatePublic();
  redirect("/admin/teams");
}

export async function updateTeam(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Missing team id.");

  const fields = readTeamFields(form);
  const logoUrl = await saveUpload(form.get("logo") as File | null);
  const slug = await uniqueSlug(str(form, "slug") ?? fields.name, id);

  await prisma.team.update({
    where: { id },
    data: { ...fields, slug, ...(logoUrl ? { logoUrl } : {}) },
  });

  revalidatePublic();
  redirect("/admin/teams");
}

export async function deleteTeam(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Missing team id.");
  await prisma.team.delete({ where: { id } });
  revalidatePublic();
  redirect("/admin/teams");
}

/* ----------------------------- Roster ----------------------------------- */

export async function addPlayer(form: FormData) {
  await assertAdmin();
  const teamId = str(form, "teamId");
  const name = str(form, "name");
  if (!teamId || !name) throw new Error("Missing player name.");

  await prisma.player.create({
    data: {
      teamId,
      name,
      role: str(form, "role") ?? null,
      jerseyNumber: form.get("jerseyNumber") ? num(form, "jerseyNumber") : null,
      isCaptain: bool(form, "isCaptain"),
      order: num(form, "order", 0),
    },
  });

  const team = await prisma.team.findUnique({ where: { id: teamId } });
  if (team) revalidatePath(`/teams/${team.slug}`);
  revalidatePath(`/admin/teams/${teamId}`);
}

export async function deletePlayer(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  const teamId = str(form, "teamId");
  if (!id) throw new Error("Missing player id.");
  await prisma.player.delete({ where: { id } });
  if (teamId) revalidatePath(`/admin/teams/${teamId}`);
  revalidatePublic();
}
