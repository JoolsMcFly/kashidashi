php_command=docker compose exec -e XDEBUG_MODE=off -u dev php
php_command_husky=docker compose exec -e XDEBUG_MODE=off -T -u dev php
js_command=docker compose exec -T -u node node

p:
	${php_command} bash

phproot:
	docker compose exec -e XDEBUG_MODE=off php bash

node:
	docker compose exec -u node node /bin/ash

mysql:
	docker compose exec mysql bash

status:
	${php_command} bin/console doctrine:migrations:status

migrate:
	${php_command} bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

diff:
	${php_command} bin/console doctrine:migrations:diff

generate:
	${php_command} bin/console doctrine:migrations:generate

ci:
	${php_command} composer install

up:
	docker compose up -d

down:
	docker compose down

dbuild:
	docker compose up -d --build --remove-orphans

mig:
	${php_command} bin/console make:migration

test:
	${php_command} vendor/bin/phpunit

cc:
	${php_command} bin/console cache:clear
