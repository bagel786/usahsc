import type { Metadata } from "next";
import { Target, Trophy, GraduationCap, Users } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "The mission of the USA High School Cricket League and why high-school cricket matters.",
};

export default async function AboutPage() {
  const s = await getSettings();

  const blocks = [
    { icon: <Target size={22} />, title: "Our Mission", body: s.aboutMission },
    { icon: <Trophy size={22} />, title: "What We Do", body: s.aboutWhatWeDo },
    {
      icon: <GraduationCap size={22} />,
      title: "Why High-School Cricket Matters",
      body: s.aboutWhyItMatters,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="About the league"
        title="About USAHSC"
        description={s.heroTagline}
      />
      <div className="container-px py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {blocks.map((b) => (
            <article key={b.title} className="card p-6">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                {b.icon}
              </span>
              <h2 className="font-display text-xl font-bold uppercase tracking-wide text-heading">
                {b.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{b.body}</p>
            </article>
          ))}
        </div>

        <div className="card mt-10 flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:gap-8">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-electric/15 text-electric">
            <Users size={26} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-heading">
              {s.leadershipTitle}
            </h2>
            <p className="mt-2 max-w-2xl whitespace-pre-line text-muted">
              {s.leadershipBody}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
