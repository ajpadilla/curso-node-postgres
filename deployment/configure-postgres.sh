#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib/common.sh"

############################################################
# Validation
############################################################

section "Validation"

require_root
require_command find
require_command sed
require_service postgresql

############################################################
# Locate Configuration
############################################################

section "Locating PostgreSQL configuration"

PG_CONF="$(find /etc/postgresql -name postgresql.conf | head -n 1)"

[[ -n "$PG_CONF" ]] \
    || error "Could not locate postgresql.conf"

log "Using configuration file:"
log "  ${PG_CONF}"

############################################################
# Configure listen_addresses
############################################################

section "Configuring listen_addresses"

if grep -q "^#listen_addresses" "$PG_CONF"; then

    run sed -i \
        "s/^#listen_addresses.*/listen_addresses = 'localhost'/" \
        "$PG_CONF"

elif grep -q "^listen_addresses" "$PG_CONF"; then

    run sed -i \
        "s/^listen_addresses.*/listen_addresses = 'localhost'/" \
        "$PG_CONF"

else

    log "Adding listen_addresses"

    echo "listen_addresses = 'localhost'" \
        >> "$PG_CONF"

fi

############################################################
# Restart PostgreSQL
############################################################

section "Restarting PostgreSQL"

run systemctl restart postgresql

############################################################
# Verification
############################################################

section "Verification"

require_service postgresql

success "PostgreSQL configured successfully."
