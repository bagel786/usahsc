# USA High School Cricket League (USAHSC)

Premium, mobile-first website for the USA High School Cricket League — public
pages for teams, schedule/results, standings and stats, plus a secure,
no-code **admin panel** so organizers can update everything without touching
code. Full statistics link out to the league's [CricClubs](https://cricclubs.com/USHSC) hub.

## Tech stack

- **Next.js 16** (App Router, TypeScript) — public site + admin + API in one app
- **PostgreSQL** + **Prisma** ORM
- **Auth.js (NextAuth v5)** — credentials login, bcrypt-hashed passwords, JWT sessions
- **Tailwind CSS v4** — dark navy/red premium theme
- **Zod** validation, honeypot + rate-limiting on public forms

## Local development

```bash
# 1. Install deps
npm install

# 2. Configure env (copy and edit)
cp .env.example .env          # set DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL/PASSWORD

# 3. Create the database schema + seed data (9 teams, sample fixtures, admin user)
npm run db:migrate:dev
npm run db:seed

# 4. Run
npm run dev                   # http://localhost:3000
```

Admin panel: **http://localhost:3000/admin** — sign in with `ADMIN_EMAIL` /
`ADMIN_PASSWORD` from your `.env`. Change the password from **Account** after
first login.

### Useful scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Start the production server |
| `npm run db:migrate:dev` | Create/apply a migration locally |
| `npm run db:migrate` | Apply migrations in production (`migrate deploy`) |
| `npm run db:seed` | Seed teams, sample data and the admin user |
| `npm run db:studio` | Open Prisma Studio to inspect data |

## What admins can edit (no code)

- **Teams** — name, school, mascot, captain, colors, CricClubs/Instagram links,
  **logo upload**, display order, active/hidden, and the full **roster**
- **Schedule** — fixtures and results, scores, status, and CricClubs scorecard links
- **Standings** — per-team P/W/L/Pts/NRR
- **Stats** — batting, bowling and MVP leaders
- **Site Content** — every piece of text on the public site (hero, about,
  contact details, social links, footer)
- **Registrations** and **Messages** inboxes (with CSV export)
- **Account** — change the admin password

## Deploying to Railway

1. Create a new Railway project and add a **PostgreSQL** plugin. Railway exposes
   `DATABASE_URL` automatically.
2. Deploy this repo as a service. Railway uses `railway.json`:
   - Build: `npm run build`
   - Start: `npx prisma migrate deploy && npm run start` (migrations run on every deploy)
3. Set service **Variables**:
   - `AUTH_SECRET` — `openssl rand -base64 32`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` — first admin credentials
   - `NEXT_PUBLIC_SITE_URL` — your public URL (e.g. `https://usahsc.up.railway.app`)
   - `UPLOADS_DIR` — `/app/public/uploads`
4. Add a **Volume** mounted at `/app/public/uploads` so uploaded team logos
   survive redeploys.
5. After the first deploy, seed once (creates the admin user + sample data):
   ```bash
   railway run npm run db:seed
   ```
6. Visit `/admin`, sign in, and change the password under **Account**.

When you move to a custom domain later, update `NEXT_PUBLIC_SITE_URL` and point
DNS at the Railway service.

## Security notes

- Passwords are bcrypt-hashed; sessions are signed HTTP-only cookies (Auth.js).
- Every admin page (`requireAdmin`) and every mutation (`assertAdmin`) verifies
  the session **server-side** — middleware is only an optimistic redirect.
- Public forms use Zod validation, a honeypot field and per-IP rate limiting.
- Secrets live only in environment variables, never in client code.
- Security headers (HSTS, X-Frame-Options, nosniff, etc.) are set in `next.config.ts`.

## Notes on CricClubs

CricClubs has no public API and blocks automated requests, so data is entered in
the admin panel and the site **deep-links** to CricClubs for full scorecards and
statistics. Round Rock currently shows an initials placeholder until a logo is
uploaded in the admin.
