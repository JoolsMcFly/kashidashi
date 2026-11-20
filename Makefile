.PHONY: help up down restart logs build build-staging rebuild fi bi fd bd be fe db seed \
        migrate migrate-revert migrate-show \
        deploy deploy-staging deploy-frontend deploy-backend deploy-ssh \
        restart-api restart-api-staging check-deploy-env

# --- Deployment config (set in .env, or override via `make deploy VAR=value`) ---
# SSH_HOST, SSH_USER, PROD_DOMAIN, STAGING_DOMAIN — see .env.example
-include .env
DEPLOY_VARS = SSH_HOST SSH_USER PROD_DOMAIN STAGING_DOMAIN

# Remote target folders (o2switch: one subdomain = one document root)

# Default target is prod; staging targets override these per invocation
REMOTE_FRONTEND_DIR ?= ~/$(PROD_DOMAIN)
REMOTE_BACKEND_DIR  ?= ~/api.$(PROD_DOMAIN)
STAGING_DIRS = REMOTE_FRONTEND_DIR=~/$(STAGING_DOMAIN) REMOTE_BACKEND_DIR=~/api.$(STAGING_DOMAIN)

# rsync flags
RSYNC_DIST_FLAGS ?= -avz --delete --progress
RSYNC_FILE_FLAGS ?= -avz --progress

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

up: ## Start all services
	docker compose up -d

down: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

logs: ## Follow container logs
	docker compose logs -f

build: ## Build frontend & backend for production
	docker compose run --rm --user $$(id -u):$$(id -g) frontend npm run build
	docker compose run --rm --user $$(id -u):$$(id -g) backend npm run build

build-staging: ## Build frontend & backend for staging
	docker compose run --rm --user $$(id -u):$$(id -g) frontend npm run build-staging
	docker compose run --rm --user $$(id -u):$$(id -g) backend npm run build

rebuild: ## Rebuild Docker images
	docker compose up -d --build --remove-orphans

be: ## Shell into backend container
	docker compose exec backend sh

fe: ## Shell into frontend container
	docker compose exec frontend sh

db: ## Shell into database container
	docker compose exec db bash

fi: ## Install frontend dep (DEP_NAME=pkg)
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make fi DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec frontend npm install $(DEP_NAME)

fd: ## Install frontend dev dep (DEP_NAME=pkg)
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make fd DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec frontend npm install --save-dev $(DEP_NAME)

bi: ## Install backend dep (DEP_NAME=pkg)
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make bi DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec backend npm install $(DEP_NAME)

bd: ## Install backend dev dep (DEP_NAME=pkg)
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make bd DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec backend npm install --save-dev $(DEP_NAME)

seed: ## Seed the database
	docker compose exec backend npm run seed

migrate: ## Run pending DB migrations (inside backend container)
	docker compose exec backend npm run migration:run

migrate-revert: ## Revert the last DB migration
	docker compose exec backend npm run migration:revert

migrate-show: ## Show migration status
	docker compose exec backend npm run migration:show

deploy: check-deploy-env build deploy-frontend deploy-backend ## Build (prod) + push frontend & backend to prod
	@$(MAKE) --no-print-directory deploy-done DOMAIN=$(PROD_DOMAIN) RESTART=restart-api

deploy-staging: check-deploy-env build-staging ## Build (staging) + push frontend & backend to staging
	@$(MAKE) --no-print-directory deploy-frontend deploy-backend $(STAGING_DIRS)
	@$(MAKE) --no-print-directory deploy-done DOMAIN=$(STAGING_DOMAIN) RESTART=restart-api-staging

check-deploy-env:
	@$(foreach v,$(DEPLOY_VARS),test -n "$($(v))" || { echo "$(v) is not set — add it to .env (see .env.example)"; exit 1; };)

deploy-done:
	@echo ""
	@echo "Deploy complete."
	@echo "  - Frontend: https://$(DOMAIN)"
	@echo "  - Backend:  https://api.$(DOMAIN)"
	@echo ""
	@echo "If backend dependencies changed, click 'Run NPM Install' in the cPanel Node.js app,"
	@echo "then restart the app (or run: make $(RESTART))."
	@echo "Pending DB migrations run automatically on backend startup (DB_RUN_MIGRATIONS=false to skip)."

deploy-frontend: check-deploy-env ## Sync the built frontend to REMOTE_FRONTEND_DIR (prod by default)
	@test -d frontend/dist || { echo "frontend/dist missing — run 'make build' first"; exit 1; }
	rsync $(RSYNC_DIST_FLAGS) \
		frontend/dist/ \
		$(SSH_USER)@$(SSH_HOST):$(REMOTE_FRONTEND_DIR)/

deploy-backend: check-deploy-env ## Sync the built backend to REMOTE_BACKEND_DIR (prod by default)
	@test -d backend/dist || { echo "backend/dist missing — run 'make build' first"; exit 1; }
	rsync $(RSYNC_DIST_FLAGS) --exclude 'node_modules' \
		backend/dist/ \
		$(SSH_USER)@$(SSH_HOST):$(REMOTE_BACKEND_DIR)/dist/
	rsync $(RSYNC_FILE_FLAGS) \
		backend/package.json backend/package-lock.json \
		$(SSH_USER)@$(SSH_HOST):$(REMOTE_BACKEND_DIR)/

restart-api: check-deploy-env ## Try to restart the prod backend via Passenger (touch tmp/restart.txt)
	ssh $(SSH_USER)@$(SSH_HOST) "mkdir -p $(REMOTE_BACKEND_DIR)/tmp && touch $(REMOTE_BACKEND_DIR)/tmp/restart.txt"
	@echo "Touched $(REMOTE_BACKEND_DIR)/tmp/restart.txt — if your cPanel Node.js app uses Passenger this triggers a reload."
	@echo "If it does not reload, open cPanel > Setup Node.js App and click Restart."

restart-api-staging: ## Try to restart the staging backend via Passenger
	@$(MAKE) --no-print-directory restart-api $(STAGING_DIRS)

deploy-ssh: check-deploy-env ## Open an SSH shell on the o2switch host
	ssh $(SSH_USER)@$(SSH_HOST)
