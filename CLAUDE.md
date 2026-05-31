See @README.md for project overview, local setup, deploy flow, and data model.

# Non-obvious project rules

- **Mobile-first UI.** All views must be designed and tested at mobile widths first. Don't introduce desktop-only patterns without an explicit mobile fallback.
- **Book identity is `book.code`, not `book.id`.** XLSX uploads upsert on `code`. Don't write features that compare books by primary key when `code` is the user-facing identifier.
- **`book.deleted` is a soft-delete flag (`0`/`1`).** Queries on books must include `WHERE deleted = 0` unless you specifically want deleted ones.
- **Closed inventories are frozen.** Missing-book counts and lists for a closed inventory come from `inventory_missing_book` (snapshotted at close), NOT a live query. New code touching missing-book logic must respect this — see [backend/src/modules/inventory/inventory.service.ts](backend/src/modules/inventory/inventory.service.ts).

# Database migrations

- TypeORM migrations live in [backend/src/migrations/](backend/src/migrations/) and run automatically on backend startup (`migrationsRun: true`).
- **New migrations must be idempotent** — guard with `hasTable` / `hasColumn`. Dev DBs may already have the schema from `synchronize=true`.
- Local dev runs with `DB_SYNCHRONIZE=true` (set in [docker-compose.yml](docker-compose.yml)); prod runs with it unset. Never enable synchronize on prod.

# Deploy gotchas

- `make deploy` does NOT restart the backend Node app. After deploying, restart via cPanel "Setup Node.js App" → Restart (or `make restart-api`).
- Staging (`tosyo-staging.juliendephix.fr`) currently points at the **prod database** for beta testers. Treat any deploy as prod-affecting.
- If `package.json` / `package-lock.json` changed, run NPM Install in cPanel before restarting.

# Commands worth knowing

```bash
make migrate          # run pending DB migrations
make migrate-show     # show migration status
make build-staging    # build frontend (vite --mode staging) + backend
make deploy           # build-staging + rsync to o2switch (still need to restart in cPanel)
docker compose run --rm --user $(id -u):$(id -g) backend npm test
```

# When uncertain

- Routine bug fixes / small features → just edit the code.
- New entity, schema change, deploy flow change → write a migration; check README.md for the deploy/migration sections.
- Anything touching production data or external services → confirm with the user before acting.
