import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <Image
        src="/brand/logo.jpg"
        alt="USAHSC"
        width={72}
        height={72}
        className="h-18 w-18 rounded-xl object-cover"
      />
      <p className="mt-6 font-display text-6xl font-bold text-brand">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted">
        The page you&apos;re looking for has been moved or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-brand px-6 py-3 font-display font-semibold uppercase tracking-wide text-white hover:bg-brand-light"
      >
        Back to home
      </Link>
    </div>
  );
}
