import Link from "next/link";
import Image from "next/image";
import { Mail, ExternalLink } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { NAV_LINKS } from "@/lib/nav";
import type { SiteSettings } from "@/lib/content";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-20 border-t border-line/70 bg-ink-2">
      <div className="container-px grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-square.png"
              alt={settings.leagueShortName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-md object-contain"
            />
            <span className="font-display text-lg font-bold uppercase tracking-wide text-heading">
              {settings.leagueShortName}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            {settings.footerBlurb}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-heading">
            Explore
          </h3>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-heading"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-heading">
            Connect
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${settings.contactEmail}`}
                className="flex items-center gap-2 text-muted transition-colors hover:text-heading"
              >
                <Mail size={16} /> {settings.contactEmail}
              </a>
            </li>
            <li>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted transition-colors hover:text-heading"
              >
                <InstagramIcon size={16} /> {settings.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={settings.cricclubsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted transition-colors hover:text-heading"
              >
                <ExternalLink size={16} /> CricClubs
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.leagueName}. All rights reserved.
          </p>
          <p>{settings.season}</p>
        </div>
      </div>
    </footer>
  );
}
