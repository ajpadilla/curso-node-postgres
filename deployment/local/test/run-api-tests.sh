#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env.test"

source "$SCRIPT_DIR/../lib/common.sh"

############################################################
# Validation
############################################################

section "Validation"

require_directory "$PROJECT_ROOT"
require_file "$ENV_FILE"

require_command npm

############################################################
# Load Environment
############################################################

section "Loading test environment"

load_env "$ENV_FILE"

############################################################
# Install Dependencies
############################################################

section "Installing dependencies"

cd "$PROJECT_ROOT"

run npm ci

############################################################
# Prepare Database
############################################################

section "Preparing test database"

run npm run db:setup

############################################################
# Start Application
############################################################

section "Starting API"

log "The API must be running before executing API tests."

############################################################
# Execute API Tests
############################################################

section "Running API tests"

run npm run test:api

############################################################
# Complete
############################################################

success "API tests completed successfully."
