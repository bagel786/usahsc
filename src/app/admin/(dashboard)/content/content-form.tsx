"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { Field, Input, Textarea } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/submit-button";
import type { SiteSettings, SettingKey } from "@/lib/content";
import { saveContent, type ContentState } from "./actions";

type FieldDef = { key: SettingKey; label: string; multiline?: boolean };

const GROUPS: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Brand",
    fields: [
      { key: "leagueName", label: "League name" },
      { key: "leagueShortName", label: "Short name (logo/nav)" },
      { key: "season", label: "Season label" },
    ],
  },
  {
    title: "Homepage hero",
    fields: [
      { key: "heroTitle", label: "Hero title" },
      { key: "heroTagline", label: "Hero tagline" },
      { key: "heroSubtitle", label: "Hero subtitle" },
    ],
  },
  {
    title: "Homepage highlights",
    fields: [
      { key: "highlightsTitle", label: "Highlights title" },
      { key: "highlightsBody", label: "Highlights body", multiline: true },
    ],
  },
  {
    title: "About page",
    fields: [
      { key: "aboutMission", label: "Mission", multiline: true },
      { key: "aboutWhatWeDo", label: "What we do", multiline: true },
      { key: "aboutWhyItMatters", label: "Why it matters", multiline: true },
      { key: "leadershipTitle", label: "Leadership title" },
      { key: "leadershipBody", label: "Leadership body", multiline: true },
    ],
  },
  {
    title: "Contact & social",
    fields: [
      { key: "contactEmail", label: "Contact email" },
      { key: "instagramUrl", label: "Instagram URL" },
      { key: "instagramHandle", label: "Instagram handle" },
      { key: "cricclubsUrl", label: "CricClubs URL" },
    ],
  },
  {
    title: "Footer",
    fields: [{ key: "footerBlurb", label: "Footer blurb", multiline: true }],
  },
];

export function ContentForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction] = useActionState<ContentState, FormData>(
    saveContent,
    {},
  );

  return (
    <form action={formAction} className="space-y-8">
      {GROUPS.map((group) => (
        <section key={group.title} className="card p-6">
          <h2 className="mb-5 font-display text-lg font-bold uppercase tracking-wide text-white">
            {group.title}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {group.fields.map((f) => (
              <Field
                key={f.key}
                label={f.label}
                htmlFor={f.key}
                className={f.multiline ? "sm:col-span-2" : ""}
              >
                {f.multiline ? (
                  <Textarea id={f.key} name={f.key} defaultValue={settings[f.key]} />
                ) : (
                  <Input id={f.key} name={f.key} defaultValue={settings[f.key]} />
                )}
              </Field>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex items-center gap-4 rounded-xl border border-line bg-ink-2/95 p-4 backdrop-blur">
        <SubmitButton>Save all content</SubmitButton>
        {state.ok && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">
            <Check size={16} /> Saved
          </span>
        )}
        {state.error && (
          <span className="text-sm font-semibold text-brand-light">{state.error}</span>
        )}
      </div>
    </form>
  );
}
