ARG PHP_VERSION=7.4

FROM php:$PHP_VERSION-fpm

COPY php.ini /etc/php/$PHP_VERSION/php.ini
COPY php-fpm-pool.conf /etc/php/$PHP_VERSION/pool.d/www.conf
COPY .bashrc /home/dev/.bashrc

RUN apt-get update && apt-get install -y libssl-dev zlib1g-dev libpng-dev libzip-dev unzip zlib1g-dev && \
    docker-php-ext-configure ftp --with-openssl-dir=/usr && \
    docker-php-ext-install ftp && \
    docker-php-ext-configure gd --enable-gd && \
    docker-php-ext-install -j$(nproc) gd zip && \
    docker-php-ext-configure pdo_mysql --with-pdo-mysql && \
    docker-php-ext-install -j$(nproc) pdo_mysql

RUN groupadd dev -g 999 && \
    useradd dev -g dev -d /home/dev -m && \
    printf "memory_limit=4G\ndate.timezone = Europe/Paris\nmax_execution_time=300" > $PHP_INI_DIR/conf.d/extra-options.ini && \
    curl -sSk https://getcomposer.org/installer | php -- --disable-tls && \
    mv composer.phar /usr/local/bin/composer && \
    mkdir -p /home/dev/.composer && chown dev:1000 -R /home/dev && \
    touch /usr/local/etc/php/conf.d/uploads.ini && \
    echo "upload_max_filesize = 100M;" >> /usr/local/etc/php/conf.d/uploads.ini && \
    apt-get purge -y --auto-remove build-essential gnupg && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /var/www/html

EXPOSE 9000 5432

CMD ["php-fpm"]
