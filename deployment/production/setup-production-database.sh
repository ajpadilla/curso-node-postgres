#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/common.sh"

############################################################
# Database Configuration
############################################################

DB_NAME="my_store"
DB_USER="deploy"
DB_PASSWORD="Heme19234099."

############################################################
# Validation
############################################################

section "Validation"

require_root
require_command psql
require_command createdb
require_service postgresql

############################################################
# Create Role
############################################################

section "Creating database role"

ROLE_EXISTS=$(
    sudo -u postgres psql -tAc \
        "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'"
)

if [[ "$ROLE_EXISTS" == "1" ]]; then
    log "Database role '${DB_USER}' already exists."
else
    log "Creating database role '${DB_USER}'..."

    run sudo -u postgres psql <<SQL
CREATE ROLE "${DB_USER}"
WITH LOGIN
PASSWORD '${DB_PASSWORD}';
SQL
fi

############################################################
# Create Database
############################################################

section "Creating database"

DATABASE_EXISTS=$(
    sudo -u postgres psql -tAc \
        "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'"
)

if [[ "$DATABASE_EXISTS" == "1" ]]; then
    log "Database '${DB_NAME}' already exists."
else
    log "Creating database '${DB_NAME}'..."

    run sudo -u postgres createdb \
        --owner="${DB_USER}" \
        "${DB_NAME}"
fi

############################################################
# Verification
############################################################

section "Verification"

run sudo -u postgres psql \
    -d "${DB_NAME}" \
    -c "SELECT current_database();"

success "Production database configured successfully."
