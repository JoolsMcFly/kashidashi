FROM php:7.4.30-fpm

RUN apt-get update \
    && apt-get install -y --no-install-recommends vim curl debconf subversion git apt-transport-https apt-utils \
    build-essential locales acl mailutils wget zip unzip libzip-dev zlib1g-dev \
    libpq-dev gnupg gnupg1 gnupg2 \
    libjpeg62-turbo-dev libfreetype6-dev libpng-dev \
    libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-configure pdo_mysql --with-pdo-mysql \
    && docker-php-ext-install -j$(nproc) pdo_mysql \
    && docker-php-ext-install -j$(nproc) zip

RUN pecl install xdebug-2.8.1 \
    && docker-php-ext-enable xdebug

ADD xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
COPY set_xdebug_vars.bash /home/dev/

COPY php.ini /etc/php/7.4.30/php.ini
COPY php-fpm-pool.conf /etc/php/7.4.30/pool.d/www.conf

RUN curl -sSk https://getcomposer.org/installer | php -- --disable-tls && \
   mv composer.phar /usr/local/bin/composer

RUN groupadd dev -g 999 && \
    useradd dev -g dev -d /home/dev -m && \
    chmod +x /home/dev/set_xdebug_vars.bash && bash /home/dev/set_xdebug_vars.bash

RUN rm -rf /var/lib/apt/lists/* && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen

WORKDIR /var/www/

EXPOSE 9000
CMD ["php-fpm"]
