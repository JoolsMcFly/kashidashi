FROM php:8.3.12-fpm

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

RUN pecl install xdebug && docker-php-ext-enable xdebug

COPY php.ini /etc/php/7.4.30/php.ini
COPY php-fpm-pool.conf /etc/php/7.4.30/pool.d/www.conf

RUN curl -sSk https://getcomposer.org/installer | php -- --disable-tls && \
   mv composer.phar /usr/local/bin/composer

RUN groupadd dev -g 999 && \
    useradd dev -g dev -d /home/dev -m

RUN rm -rf /var/lib/apt/lists/* && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    echo "fr_FR.UTF-8 UTF-8" >> /etc/locale.gen && \
    locale-gen

RUN printf "memory_limit=4G\ndate.timezone = Europe/Paris\nmax_execution_time=300" > $PHP_INI_DIR/conf.d/extra-options.ini \
    && curl -sSk https://getcomposer.org/installer | php -- --disable-tls \
    && mv composer.phar /usr/local/bin/composer \
    && mkdir -p /home/dev/.composer && chown dev:1000 -R /home/dev \
    && touch /usr/local/etc/php/conf.d/uploads.ini \
    && echo "upload_max_filesize = 100M;" >> /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www/

EXPOSE 9000
CMD ["php-fpm"]
