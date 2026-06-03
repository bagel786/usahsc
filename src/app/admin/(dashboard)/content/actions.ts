"use server";

import { prisma } from "@/lib/db";
import { assertAdmin } from "@/lib/auth-guard";
import { revalidatePublic } from "@/lib/revalidate";
import { SETTING_DEFAULTS, type SettingKey } from "@/lib/content";

export type ContentState = { ok?: boolean; error?: string };

export async function saveContent(
  _prev: ContentState,
  form: FormData,
): Promise<ContentState> {
  try {
    await assertAdmin();
    const keys = Object.keys(SETTING_DEFAULTS) as SettingKey[];

    await prisma.$transaction(
      keys.map((key) => {
        const raw = form.get(key);
        const value = (typeof raw === "string" ? raw : "").trim();
        return prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }),
    );

    revalidatePublic();
    return { ok: true };
  } catch {
    return { error: "Could not save. Please try again." };
  }
}
