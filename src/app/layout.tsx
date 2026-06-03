import type { Metadata } from "next";
import { Geist, Oswald } from "next/font/google";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
