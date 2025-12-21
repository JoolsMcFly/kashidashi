# Claude Notes - Kashidashi v2

## Project Context

Book lending management system for tracking books, borrowers, and loans.

## Key Requirements

- **Mobile-first** responsive design
- **Admin users**: Upload XLSX files for borrowers and books
- **Regular users**: Search and manage loans
- **Borrower search**: By katakana or frenchSurname
- **Book search**: By code with autocomplete
- **Loan tracking**: History with start and return dates
- **Book upsert**: Use `code` field as truth when uploading XLSX

## Data Model

```
borrowers (individuals/families)
  - firstname, lastname, katakana, frenchSurname

books
  - title, code (unique identifier), location, deleted

loans
  - borrower_id, book_id, start_date, return_date
```

## Tech Stack

- Backend: NestJS + TypeORM + MariaDB
- Frontend: React + TypeScript + Vite + TailwindCSS
- XLSX: SheetJS
- Node.js: v22

## Docker Compose

The project uses Docker Compose for local development with Caddy as a reverse proxy.

### Local Development URL

**https://kashidashi.local** with the following routes:
- `/app` - Frontend (React/Vite)
- `/api` - Backend API (NestJS)
- `/phpmyadmin` - Database management interface

### Services

- **Caddy (Reverse Proxy)**: Ports 80/443
  - Container: `kashidashi-caddy`
  - Auto-generates self-signed SSL certificate
  - Routes traffic to frontend/backend/phpMyAdmin

- **Database (MariaDB 11.4.9)**: Port 3306
  - Container: `kashidashi-db`
  - Credentials: kashidashi/kashidashi
  - Root password: root
  - Persistent storage via Docker volume
  - Direct access on localhost:3306

- **Backend (NestJS)**: Internal only
  - Container: `kashidashi-backend`
  - Auto-reloads on code changes (dev mode)
  - Waits for database health check before starting
  - Accessible via https://kashidashi.local/api

- **Frontend (React/Vite)**: Internal only
  - Container: `kashidashi-frontend`
  - Hot module replacement enabled
  - Accessible via https://kashidashi.local/app

- **phpMyAdmin**: Internal only
  - Container: `kashidashi-phpmyadmin`
  - Accessible via https://kashidashi.local/phpmyadmin

### Setup

1. Add to `/etc/hosts`:
   ```
   127.0.0.1 kashidashi.local
   ```

2. Start services:
   ```bash
   docker compose up
   ```

3. Accept the self-signed certificate warning in your browser

4. Access the app at https://kashidashi.local

### Commands

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# Stop services
docker compose down

# Rebuild containers
docker compose up --build
```

## Deployment

The application is deployed with the following structure:

- **Frontend**: sub.mydomain.com/app (static files)
  - Served via Apache with SPA routing
  - `.htaccess` configured with RewriteBase `/app`

- **Backend**: sub.mydomain.com/api (Node.js proxy)
  - Apache proxies requests to Node.js backend (default port 3000)
  - `.htaccess` configured to proxy all `/api` requests
  - Update port in backend/.htaccess if web host assigns different port

### Deployment Notes

- Backend `.htaccess` requires `mod_proxy` and `mod_rewrite` enabled
- Update Node.js port in backend/.htaccess to match web host configuration
- Frontend built files go to `frontend/dist` and deploy to `/app` directory
- Backend runs as Node.js application on assigned port

## Current Status

Most features are implemented. Some tweaks will be needed in the inventory.
