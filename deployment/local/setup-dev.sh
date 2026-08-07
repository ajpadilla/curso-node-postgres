#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../lib/common.sh"

DEV_DB_NAME="my_store_development"
TEST_DB_NAME="my_store_test"

############################################################
# Validation
############################################################

section "Validation"

require_root
require_file "$SCRIPT_DIR/setup-postgres.sh"
require_file "$SCRIPT_DIR/setup-dev-database.sh"

############################################################
# Install PostgreSQL
############################################################

section "Installing PostgreSQL"

run "$SCRIPT_DIR/setup-postgres.sh"

############################################################
# Create Development Databases
############################################################

section "Creating development databases"

run "$SCRIPT_DIR/setup-dev-database.sh"

############################################################
# Verification
############################################################

section "Verifying databases"

run sudo -u postgres psql \
    -d "${DEV_DB_NAME}" \
    -c "SELECT current_database();"

run sudo -u postgres psql \
    -d "${TEST_DB_NAME}" \
    -c "SELECT current_database();"

############################################################
# Summary
############################################################

section "Summary"

log "Development database : ${DEV_DB_NAME}"
log "Test database        : ${TEST_DB_NAME}"

log "Next step:"
log "  ./deployment/local/run-tests.sh"

success "Development environment is ready."
