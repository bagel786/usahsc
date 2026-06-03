import type { Metadata } from "next";
import { Mail, ExternalLink } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/site/page-header";
import { getSettings } from "@/lib/content";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the USA High School Cricket League.",
};

export default async function ContactPage() {
  const s = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact Us"
        description="Questions about the league, fixtures or getting your school involved? Reach out."
      />
      <div className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <a
              href={`mailto:${s.contactEmail}`}
              className="card flex items-center gap-4 p-5 transition-colors hover:border-electric/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Mail size={22} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Email</p>
                <p className="font-semibold text-heading">{s.contactEmail}</p>
              </div>
            </a>

            <a
              href={s.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 p-5 transition-colors hover:border-electric/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <InstagramIcon size={22} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">Instagram</p>
                <p className="font-semibold text-heading">{s.instagramHandle}</p>
              </div>
            </a>

            <a
              href={s.cricclubsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 p-5 transition-colors hover:border-electric/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <ExternalLink size={22} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted">League hub</p>
                <p className="font-semibold text-heading">CricClubs</p>
              </div>
            </a>
          </div>

          <ContactForm />
        </div>
      </div>
    </>
  );
}
