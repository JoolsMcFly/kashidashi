alias pu='rm -rf var/cache/test;vendor/bin/phpunit'
alias pf='vendor/bin/phpunit --filter='
alias bc='bin/console'
alias xoff='export XDEBUG_TRIGGER=0 XDEBUG_MODE=off'
alias xon='export XDEBUG_TRIGGER=1 XDEBUG_MODE=develop,debug'
alias xprofile='export XDEBUG_TRIGGER=1 XDEBUG_MODE=profile'
export XDEBUG_TRIGGER=0 XDEBUG_MODE=off

echo "------------ Alias disponibles ------------------"
alias
echo "-------------------------------------------------"
