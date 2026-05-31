# Kashidashi

Book lending management system for tracking books, borrowers, and loans. Mobile-first web app.

- **Admins** upload XLSX files of borrowers and books, and run physical-inventory sessions.
- **Regular users** search the catalog and create/return loans.

## Tech Stack

- **Backend**: NestJS + TypeORM + MariaDB (Node.js 22)
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **XLSX parsing**: SheetJS

## Local Development

Local stack runs in Docker Compose behind a Caddy reverse proxy with auto-generated self-signed certs.

### One-time setup

Add to `/etc/hosts`:

```
127.0.0.1 kashidashi.local
127.0.0.1 api.kashidashi.local
127.0.0.1 phpmyadmin.kashidashi.local
```

### URLs

- `https://kashidashi.local` — Frontend (Vite, HMR enabled)
- `https://api.kashidashi.local` — Backend (NestJS, auto-reload)
- `https://phpmyadmin.kashidashi.local` — phpMyAdmin

### Services

| Service     | Container             | Notes                                                       |
| ----------- | --------------------- | ----------------------------------------------------------- |
| Caddy       | `kashidashi-caddy`    | Reverse proxy, ports 80/443, auto self-signed TLS           |
| MariaDB     | `kashidashi-db`       | MariaDB 11.4.9, exposed on `localhost:3306`                 |
| Backend     | `kashidashi-backend`  | Internal only — reached via `api.kashidashi.local`          |
| Frontend    | `kashidashi-frontend` | Internal only — reached via `kashidashi.local`              |
| phpMyAdmin  | `kashidashi-phpmyadmin` | Internal only                                             |

DB credentials: `kashidashi/kashidashi` (root password `root`). Persistent storage via Docker volume.

### Common commands

```bash
make up              # docker compose up -d
make down            # docker compose down
make logs            # docker compose logs -f
make rebuild         # docker compose up -d --build --remove-orphans

make be              # shell into backend container
make fe              # shell into frontend container
make db              # shell into database container

make bi DEP_NAME=foo # install backend dep
make fi DEP_NAME=foo # install frontend dep
make seed            # seed the database

make migrate         # run pending DB migrations
make migrate-show    # show migration status
make migrate-revert  # revert the last migration
```

After accepting the self-signed certs for each subdomain in the browser, visit `https://kashidashi.local`.

### Versioning

```bash
npm version patch    # 1.0.0 → 1.0.1 (run inside backend/ or frontend/)
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0
```

Restart the frontend container for version changes to be picked up: `docker compose restart frontend`.

## Data Model

```
borrowers          surname, katakana, frenchSurname
locations          name
books              title, code (unique business id), location, deleted
loans              borrower_id, book_id, started_at, stopped_at

inventory                     started_at, stopped_at, book_count,
                              available_book_count, missing_snapshot_at
inventory_item                inventory_id, book_id, found_at_id, belongs_at_id
inventory_missing_book        frozen snapshot of missing books, written on close

users              admin login
```

Notes:
- `book.code` is the human-facing identifier; XLSX upserts use it as the source of truth.
- `book.deleted` is a soft-delete flag (`0`/`1`).
- `inventory_missing_book` is a **denormalized snapshot** (stores title/location/borrower as strings) so the historical record survives later catalog edits.

## Deployment

Hosted on o2switch (cPanel). Frontend and backend each have their own subdomain / document root; deploys are automated through the Makefile via rsync over SSH.

### Target hosts

Currently a single deploy target — staging doubles as prod for beta testers.

- Frontend: `https://tosyo-staging.juliendephix.fr` → `~/tosyo-staging.juliendephix.fr`
- Backend:  `https://api.tosyo-staging.juliendephix.fr` → `~/api.tosyo-staging.juliendephix.fr`

SSH host/user and remote paths are configured at the top of [Makefile](Makefile). Override per-invocation if needed: `make deploy SSH_USER=... REMOTE_BACKEND_DIR=...`.

### Deploy commands

```bash
make build-staging   # build frontend (vite --mode staging) + backend (nest build)
make deploy          # build-staging + rsync frontend dist + rsync backend dist & manifests
make deploy-frontend # rsync only the frontend dist
make deploy-backend  # rsync only the backend dist + package.json + package-lock.json
make restart-api     # touch tmp/restart.txt to ask Passenger to reload
make deploy-ssh      # open an SSH shell on the host
```

`make deploy` does **not** restart the backend Node app. After deploying:

1. If `package.json` / `package-lock.json` changed → cPanel → "Setup Node.js App" → **Run NPM Install**.
2. cPanel → "Setup Node.js App" → **Restart** (or `make restart-api` if Passenger picks up the touch).

### Database migrations

Migrations are TypeORM-based, defined in [backend/src/migrations/](backend/src/migrations/) and tracked in the `migrations` SQL table. The backend runs pending migrations automatically on startup (`migrationsRun: true`, env-gated by `DB_RUN_MIGRATIONS` — set to `false` to skip).

To author a new migration, hand-write a file under `backend/src/migrations/<timestamp>-<Name>.ts` modeled on the existing one. Migrations must be **idempotent** (use `hasTable` / `hasColumn` guards) so they're safe against databases that were previously kept in sync via `synchronize`.

CLI scripts use [backend/src/data-source.ts](backend/src/data-source.ts):

```bash
make migrate         # docker compose exec backend npm run migration:run
make migrate-revert  # roll back the last migration
make migrate-show    # show migration status
```

### Web layer (Apache .htaccess)

- Frontend dist ships an `.htaccess` with SPA fallback to `index.html`.
- Backend `.htaccess` proxies to the Node.js app via `mod_proxy`. The Node port (default `3000`) must match the port cPanel assigns — check cPanel → "Setup Node.js App".
- Required Apache modules: `mod_rewrite`, `mod_proxy`, `mod_proxy_http`.

### Required prod environment variables

Set in the cPanel Node.js app's environment:

- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`

Never set `DB_SYNCHRONIZE=true` on prod. Migrations are the only thing that should change prod schema.
