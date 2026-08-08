#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Create Production Environment
#
# Purpose:
#   Create the production .env file used by ecommerce-api.
#
# This script:
#   1. Validates the server environment
#   2. Creates the shared directory if necessary
#   3. Creates the production .env file
#   4. Configures ownership
#   5. Restricts permissions
#
# Usage:
#   sudo ./create-production-env.sh
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/create-production-env.log"

APP_NAME="ecommerce-api"

APP_DIR="/opt/$APP_NAME"

SHARED_DIR="$APP_DIR/shared"

ENV_FILE="$SHARED_DIR/.env"

DEPLOY_USER="deploy"

DEPLOY_GROUP="ecommerce-api"


############################################################
# Validation
############################################################

validate() {

    section "Validation"

    require_root

    require_directory "$APP_DIR"

    user_exists "$DEPLOY_USER" \
        || error "User '$DEPLOY_USER' does not exist."

    group_exists "$DEPLOY_GROUP" \
        || error "Group '$DEPLOY_GROUP' does not exist."

    success "Production environment validated."
}


############################################################
# Create shared directory
############################################################

create_shared_directory() {

    section "Creating shared directory"

    if [[ ! -d "$SHARED_DIR" ]]; then

        run mkdir -p "$SHARED_DIR"

        log "Created: $SHARED_DIR"

    else

        log "Shared directory already exists: $SHARED_DIR"

    fi

    success "Shared directory ready."
}


############################################################
# Create production environment
############################################################

create_environment_file() {

    section "Creating production environment"

    if [[ -f "$ENV_FILE" ]]; then

        warn "Production environment file already exists:"
        warn "$ENV_FILE"

        read -r -p "Overwrite existing .env? [y/N]: " answer

        if [[ ! "$answer" =~ ^[Yy]$ ]]; then

            error "Operation cancelled. Existing .env was preserved."

        fi

    fi

    cat > "$ENV_FILE" <<'EOF'
NODE_ENV=production

PORT=3000

DB_USER=deploy
DB_PASSWORD=Heme19234099.
DB_HOST=localhost
DB_NAME=my_store
DB_PORT=5432

API_KEY=333224

JWT_SECRET=hj1Wc7HDrQOILqkAg68yuZEawzeNMsRF
EOF

    success "Production environment file created."
}


############################################################
# Configure permissions
############################################################

configure_permissions() {

    section "Configuring environment permissions"

    run chown "$DEPLOY_USER:$DEPLOY_GROUP" "$ENV_FILE"

    run chmod 600 "$ENV_FILE"

    success "Environment permissions configured."
}


############################################################
# Verify environment
############################################################

verify_environment() {

    section "Verifying production environment"

    require_file "$ENV_FILE"

    log "Environment file: $ENV_FILE"

    log "Ownership:"
    ls -l "$ENV_FILE" | tee -a "$LOG_FILE"

    log "Permissions:"
    stat -c "%A" "$ENV_FILE" | tee -a "$LOG_FILE"

    success "Production environment verified."
}


############################################################
# Summary
############################################################

summary() {

    section "Production Environment Summary"

    echo "Application : $APP_NAME"
    echo "Shared dir  : $SHARED_DIR"
    echo "Environment : $ENV_FILE"
    echo "Owner       : $DEPLOY_USER:$DEPLOY_GROUP"
    echo "Permissions : 600"

    echo

    success "Production environment configuration completed."
}


############################################################
# Main
############################################################

main() {

    validate

    create_shared_directory

    create_environment_file

    configure_permissions

    verify_environment

    summary
}


############################################################
# Execute
############################################################

main "$@"

