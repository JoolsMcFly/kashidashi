.PHONY: help up down restart logs build build-staging rebuild fi bi fd bd be fe db seed

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
	docker compose run --user $$(id -u):$$(id -g) frontend npm run build
	docker compose run --user $$(id -u):$$(id -g) backend npm run build

build-staging: ## Build frontend & backend for staging
	docker compose run --user $$(id -u):$$(id -g) frontend npm run build-staging
	docker compose run --user $$(id -u):$$(id -g) backend npm run build

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
