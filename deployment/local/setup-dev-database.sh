#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/common.sh"

DEV_DB_NAME="my_store_development"
DEV_DB_USER="my_store_dev"
DEV_DB_PASSWORD="development_password"

TEST_DB_NAME="my_store_test"
TEST_DB_USER="my_store_test"
TEST_DB_PASSWORD="test_password"

############################################################
# Validation
############################################################

section "Validation"

require_root
require_command psql
require_command createdb
require_service postgresql

############################################################
# Helpers
############################################################

create_role() {
    local username="$1"
    local password="$2"

    log "Checking PostgreSQL role '${username}'"

    local exists

    exists="$(
        sudo -u postgres psql -tAc \
            "SELECT 1 FROM pg_roles WHERE rolname='${username}'"
    )"

    if [[ "$exists" == "1" ]]; then
        log "Role '${username}' already exists."
        return
    fi

    log "Creating role '${username}'..."

    sudo -u postgres psql <<SQL || error "Failed creating role '${username}'."
CREATE ROLE "${username}"
WITH LOGIN
PASSWORD '${password}';
SQL

    log "Role '${username}' created."
}

create_database() {
    local database="$1"
    local owner="$2"

    log "Checking database '${database}'"

    local exists

    exists="$(
        sudo -u postgres psql -tAc \
            "SELECT 1 FROM pg_database WHERE datname='${database}'"
    )"

    if [[ "$exists" == "1" ]]; then
        log "Database '${database}' already exists."
        return
    fi

    log "Creating database '${database}'..."

    run sudo -u postgres createdb \
        --owner="${owner}" \
        "${database}"

    log "Database '${database}' created."
}

############################################################
# Development Database
############################################################

section "Development Database"

create_role \
    "${DEV_DB_USER}" \
    "${DEV_DB_PASSWORD}"

create_database \
    "${DEV_DB_NAME}" \
    "${DEV_DB_USER}"

############################################################
# Test Database
############################################################

section "Test Database"

create_role \
    "${TEST_DB_USER}" \
    "${TEST_DB_PASSWORD}"

create_database \
    "${TEST_DB_NAME}" \
    "${TEST_DB_USER}"

############################################################
# Summary
############################################################

section "Summary"

log "Development database : ${DEV_DB_NAME}"
log "Development user     : ${DEV_DB_USER}"

log "Test database        : ${TEST_DB_NAME}"
log "Test user            : ${TEST_DB_USER}"

success "Development and test databases configured successfully."
