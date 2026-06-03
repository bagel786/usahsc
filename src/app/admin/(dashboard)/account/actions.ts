"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { reqStr } from "@/lib/form";

export type AccountState = { ok?: boolean; error?: string };

export async function changePassword(
  _prev: AccountState,
  form: FormData,
): Promise<AccountState> {
  try {
    const sessionUser = await assertAdmin();
    const current = reqStr(form, "currentPassword");
    const next = reqStr(form, "newPassword");
    const confirm = reqStr(form, "confirmPassword");

    if (next.length < 8) return { error: "New password must be at least 8 characters." };
    if (next !== confirm) return { error: "New passwords do not match." };

    const user = await prisma.adminUser.findUnique({ where: { id: sessionUser.id } });
    if (!user) return { error: "Account not found." };

    const valid = await bcrypt.compare(current, user.passwordHash);
    if (!valid) return { error: "Current password is incorrect." };

    const passwordHash = await bcrypt.hash(next, 12);
    await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });

    return { ok: true };
  } catch {
    return { error: "Could not update password." };
  }
}
