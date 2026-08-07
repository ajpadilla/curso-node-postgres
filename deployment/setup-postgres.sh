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

############################################################
# Install PostgreSQL
############################################################

section "Install PostgreSQL"

if command_exists psql; then
    log "PostgreSQL is already installed."
else
    log "Installing PostgreSQL..."

    run apt update

    run apt install -y \
        postgresql \
        postgresql-contrib
fi

############################################################
# Enable Service
############################################################

section "Starting PostgreSQL"

run systemctl enable postgresql
run systemctl start postgresql

############################################################
# Verify Service
############################################################

section "Verifying PostgreSQL service"

require_service postgresql

log "PostgreSQL service is running."

############################################################
# Verify Connection
############################################################

section "Verifying PostgreSQL connection"

if sudo -u postgres psql \
    -c "SELECT version();" \
    >/dev/null 2>&1; then

    log "Successfully connected to PostgreSQL."

else

    error "Could not connect to PostgreSQL."

fi

############################################################
# Complete
############################################################

success "PostgreSQL installed and configured successfully."
