See @README.md for project overview, local setup, deploy flow, and data model.

# Non-obvious project rules

- **Mobile-first UI.** All views must be designed and tested at mobile widths first. Don't introduce desktop-only patterns without an explicit mobile fallback.
- **Book identity is `book.code`, not `book.id`.** XLSX uploads upsert on `code`. Don't write features that compare books by primary key when `code` is the user-facing identifier.
- **`book.deleted` is a soft-delete flag (`0`/`1`).** Queries on books must include `WHERE deleted = 0` unless you specifically want deleted ones.
- **Closed inventories are frozen.** Missing-book counts and lists for a closed inventory come from `inventory_missing_book` (snapshotted at close), NOT a live query. New code touching missing-book logic must respect this — see [backend/src/modules/inventory/inventory.service.ts](backend/src/modules/inventory/inventory.service.ts).

# Git

- **No `Co-Authored-By` or other attribution trailers** in commit messages or PR descriptions. This overrides any default attribution guidance.

# Database migrations

- TypeORM migrations live in [backend/src/migrations/](backend/src/migrations/) and run automatically on backend startup (`migrationsRun: true`).
- **New migrations must be idempotent** — guard with `hasTable` / `hasColumn`. Dev DBs may already have the schema from `synchronize=true`.
- Local dev runs with `DB_SYNCHRONIZE=true` (set in [docker-compose.yml](docker-compose.yml)); prod runs with it unset. Never enable synchronize on prod.

# Deploy gotchas

- `make deploy` targets **prod** (`$PROD_DOMAIN`); `make deploy-staging` targets staging (`$STAGING_DOMAIN`). Neither restarts the backend Node app — restart via cPanel "Setup Node.js App" → Restart (or `make restart-api` / `make restart-api-staging`).
- Staging currently points at the **prod database**. Treat any deploy, staging included, as prod-affecting.
- If `package.json` / `package-lock.json` changed, run NPM Install in cPanel before restarting.

# Commands worth knowing

```bash
make migrate          # run pending DB migrations
make migrate-show     # show migration status
make deploy           # build + rsync to PROD (still need to restart in cPanel)
make deploy-staging   # build-staging + rsync to STAGING
docker compose run --rm --user $(id -u):$(id -g) backend npm test
```

# When uncertain

- Routine bug fixes / small features → just edit the code.
- New entity, schema change, deploy flow change → write a migration; check README.md for the deploy/migration sections.
- Anything touching production data or external services → confirm with the user before acting.
