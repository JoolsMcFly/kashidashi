.PHONY: up down restart logs fi bi fd bd be fe db seed

# Docker Compose commands
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

build:
	docker compose up -d --build --remove-orphans

# Shell access
be:
	docker compose exec backend sh

fe:
	docker compose exec frontend sh

db:
	docker compose exec db bash

# Frontend dependency management
fi:
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make fi DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec frontend npm install $(DEP_NAME)

fd:
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make fd DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec frontend npm install --save-dev $(DEP_NAME)

# Backend dependency management
bi:
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make bi DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec backend npm install $(DEP_NAME)

bd:
	@if [ -z "$(DEP_NAME)" ]; then \
		echo "Usage: make bd DEP_NAME=<package-name>"; \
		exit 1; \
	fi
	docker compose exec backend npm install --save-dev $(DEP_NAME)

# Database seeding
seed:
	docker compose exec backend npm run seed
