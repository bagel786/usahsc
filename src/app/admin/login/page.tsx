import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/brand/logo-square.png"
            alt="USAHSC"
            width={64}
            height={64}
            className="h-16 w-16 rounded-xl object-contain"
          />
          <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-heading">
            Admin Sign In
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage teams, matches, standings and content.
          </p>
        </div>

        <div className="card p-6 sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="hover:text-heading">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
