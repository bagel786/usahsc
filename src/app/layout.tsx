import type { Metadata } from "next";
import { Geist, Oswald } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "USA High School Cricket League",
    template: "%s · USAHSC",
  },
  description:
    "Building the future of high-school cricket in Texas. Schedules, results, standings, stats and teams for the USA High School Cricket League.",
  openGraph: {
    title: "USA High School Cricket League",
    description: "Building the future of high-school cricket in Texas.",
    images: ["/brand/logo-square.png"],
    type: "website",
    siteName: "USAHSC",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SportsOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "USA High School Cricket League",
      alternateName: "USAHSC",
      url: `${SITE_URL}/`,
      description:
        "A high-school cricket league organizing fixtures, standings, statistics, playoffs, and championship competition in Texas.",
      sameAs: ["https://cricclubs.com/USHSC", "https://instagram.com/usahsc"],
      member: { "@id": "https://safiullahbaig.com/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://safiullahbaig.com/#person",
      name: "Safiullah Baig",
      url: "https://safiullahbaig.com/",
      jobTitle: "President and Coordinating Officer",
      memberOf: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
