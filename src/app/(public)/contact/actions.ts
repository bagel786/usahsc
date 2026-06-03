"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type FormState = { ok?: boolean; error?: string };

const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(120),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(5, "Please enter a message.").max(2000),
});

export async function submitContact(
  _prev: FormState,
  form: FormData,
): Promise<FormState> {
  if (form.get("website")) return { ok: true }; // honeypot

  const ip = await clientIp();
  if (!rateLimit(`contact:${ip}`, 5, 60_000).ok) {
    return { error: "Too many messages. Please try again in a minute." };
  }

  const parsed = schema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    message: form.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    return { ok: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
