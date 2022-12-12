#!/bin/bash

HOST=$(printf "%d.%d.%d.%d" $(awk '$2 == 00000000 && $7 == 00000000 { for (i = 8; i >= 2; i=i-2) { print "0x" substr($3, i-1, 2) } }' /proc/net/route))
XDEBUG_CONFIG="idekey=PHPSTORM remote_host=${HOST} remote_port=9000 remote_autostart=1 auto_trace=1 remote_enable=1"

echo "export XDEBUG_CONFIG='$XDEBUG_CONFIG'" > /home/dev/.bashrc
