# AGENTS.md

## Cursor Cloud specific instructions

This is the **World Espresso Championship (WEC)** website: a single full-stack app where the
frontend (React 19 + Vite) and backend (Hono + tRPC) run together in **one process**. Data is
stored in **MySQL** via Drizzle ORM. See `README.md`, `DEPLOYMENT_GUIDE.md`, and `package.json`
scripts for standard commands.

### Node version
- The VM's default `node` (`/exec-daemon/node`) is v22 and shadows nvm on `PATH`. The project
  declares `engines.node: 20.x`, but everything (install, dev, build, tests) works on the default
  v22, so no PATH juggling is required.

### Database: use MySQL, NOT MariaDB (non-obvious)
- `drizzle-kit push` emits `serial AUTO_INCREMENT` column definitions that **fail to parse on
  MariaDB** (`ER_PARSE_ERROR`). You must use real **MySQL 8** (the documented/PlanetScale target).
- MySQL is not managed by systemd here. Start it manually if it isn't already running:
  ```bash
  sudo mkdir -p /var/run/mysqld && sudo chown mysql:mysql /var/run/mysqld
  sudo bash -c 'nohup mysqld --user=mysql > /var/log/mysql/manual.out 2>&1 &'
  sudo mysqladmin ping   # -> "mysqld is alive"
  ```
- Local dev DB/credentials (already provisioned; matches `.env`): database `wec`, user
  `wec` / password `wecpass`, on `127.0.0.1:3306`.

### Environment variables
- `.env` is git-ignored and already present locally. Drizzle commands throw without `DATABASE_URL`
  (`drizzle.config.ts`), and `api/lib/env.ts` only throws for other missing vars when
  `NODE_ENV=production`. In dev, Stripe / Resend / Kimi OAuth are **optional** and degrade
  gracefully (payments run in mock mode, emails are logged to console, auth/admin are simply
  unavailable). If `.env` is missing, recreate it from `.env.example` with at minimum
  `DATABASE_URL=mysql://wec:wecpass@127.0.0.1:3306/wec`.

### Schema & seed (no committed migrations)
- `db/migrations/` is intentionally empty; schema is synced with `npm run db:push` (not
  `db:migrate`). Seed data with `npx tsx db/seed.ts` (idempotent — it skips tables that already
  have rows). Only needed on a fresh/empty database.

### Run / lint / test / build
- Dev server (frontend + API together): `npm run dev` → http://localhost:3000 (tRPC at
  `/api/trpc/*`).
- Tests: `npm run test` (vitest). Build: `npm run build`. Lint: `npm run lint`.
  Type-check: `npm run check`.
- Note: `npm run lint` and `npm run check` currently report **pre-existing** issues in app code
  and a `baseUrl` deprecation in `tsconfig.*.json`. These are not environment problems.
