php_command=docker-compose exec -u dev php

php:
	${php_command} bash

node:
	docker-compose exec -u node node bash

status:
	${php_command} bin/console doctrine:migrations:status

migrate:
	${php_command} bin/console doctrine:migrations:migrate

diff:
	${php_command} bin/console doctrine:migrations:diff

generate:
	${php_command} bin/console doctrine:migrations:generate

ci:
	${php_command} composer install

require:
	${php_command} composer require ${NAME}

up:
	docker-compose up -d

down:
	docker-compose down

jsrouting:
	${php_command} bin/console fos:js-routing:dump --format=json --target=public/js/fos_js_routes.json
