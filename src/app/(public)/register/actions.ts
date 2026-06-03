"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type FormState = { ok?: boolean; error?: string };

const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  school: z.string().max(160).optional(),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().max(40).optional(),
  role: z.string().max(60).optional(),
  message: z.string().max(2000).optional(),
});

export async function submitRegistration(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  // Honeypot — bots fill hidden fields; humans never see this.
  if (form.get("website")) return { ok: true };

  const ip = await clientIp();
  if (!rateLimit(`register:${ip}`, 5, 60_000).ok) {
    return { error: "Too many submissions. Please try again in a minute." };
  }

  const parsed = schema.safeParse({
    name: form.get("name"),
    school: form.get("school") || undefined,
    email: form.get("email"),
    phone: form.get("phone") || undefined,
    role: form.get("role") || undefined,
    message: form.get("message") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await prisma.registration.create({ data: parsed.data });
    return { ok: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
