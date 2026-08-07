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
# Check Formatting
############################################################

section "Checking code formatting"

run npm run format:check

############################################################
# Run Linter
############################################################

section "Running linter"

run npm run lint

############################################################
# Prepare Database
############################################################

section "Preparing test database"

run npm run db:setup

############################################################
# Execute Tests
############################################################

section "Running unit and integration tests"

run npm test

############################################################
# Complete
############################################################

success "All tests passed successfully."
