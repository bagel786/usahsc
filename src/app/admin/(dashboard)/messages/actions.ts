"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { str } from "@/lib/form";

export async function setMessageStatus(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  const status = str(form, "status");
  if (!id || !status) throw new Error("Missing data.");
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(form: FormData) {
  await assertAdmin();
  const id = str(form, "id");
  if (!id) throw new Error("Missing id.");
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
