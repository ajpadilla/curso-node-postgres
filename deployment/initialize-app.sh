#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Initialize Application
#
# Purpose:
#   Prepare the application directory structure.
#
# Responsibilities:
#   - Create application directories
#   - Configure permissions
#   - Create shared resources
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/initialize-app.log"

APP_NAME="ecommerce-api"

DEPLOY_USER="deploy"

DEPLOY_GROUP="ecommerce-api"

APP_DIR="/opt/$APP_NAME"

############################################################
# Validation
############################################################

validate() {

    section "Validation"

    require_root

    user_exists "$DEPLOY_USER" \
        || error "Deploy user '$DEPLOY_USER' does not exist."

    group_exists "$DEPLOY_GROUP" \
        || error "Group '$DEPLOY_GROUP' does not exist."

}

############################################################
# Create directory structure
############################################################

create_directories() {

    section "Creating directory structure"

    run mkdir -p "$APP_DIR"

    run mkdir -p "$APP_DIR/releases"

    run mkdir -p "$APP_DIR/shared"

    run mkdir -p "$APP_DIR/tmp"

    run mkdir -p "$APP_DIR/shared/uploads"

    run mkdir -p "$APP_DIR/shared/logs"

    run mkdir -p "$APP_DIR/shared/backups"

}

############################################################
# Create .env
############################################################

create_environment_file() {

    section "Creating environment file"

    if [[ -f "$APP_DIR/shared/.env" ]]; then

        log ".env already exists."

        return

    fi

    run touch "$APP_DIR/shared/.env"

    log "Edit the following file before deploying:"
    log "  $APP_DIR/shared/.env"

}

############################################################
# Configure ownership
############################################################

configure_permissions() {

    section "Configuring permissions"

    run chown -R "$DEPLOY_USER:$DEPLOY_GROUP" "$APP_DIR"

    run chmod -R 755 "$APP_DIR"

    run chmod 700 "$APP_DIR/shared"

    run chmod 600 "$APP_DIR/shared/.env"

}

############################################################
# Verification
############################################################

verify() {

    section "Verification"

    require_directory "$APP_DIR"

    require_directory "$APP_DIR/releases"

    require_directory "$APP_DIR/shared"

    require_directory "$APP_DIR/shared/uploads"

    require_directory "$APP_DIR/shared/logs"

    require_directory "$APP_DIR/shared/backups"

    require_file "$APP_DIR/shared/.env"

    log "Application initialized successfully."

}

############################################################
# Summary
############################################################

print_summary() {

    section "Summary"

    echo "Application : $APP_NAME"

    echo "Directory   : $APP_DIR"

    echo

    tree "$APP_DIR" || true

    echo

    success "Application initialization completed."

}

############################################################
# Main
############################################################

main() {

    validate

    create_directories

    create_environment_file

    configure_permissions

    verify

    print_summary

}

main "$@"
