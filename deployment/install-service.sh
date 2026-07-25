#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Install Systemd Service
#
# Purpose:
#   Install the application systemd service.
#
# Responsibilities:
#   - Install service file
#   - Reload systemd
#   - Enable service
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/install-service.log"

APP_NAME="ecommerce-api"

SERVICE_NAME="${APP_NAME}.service"

SERVICE_TEMPLATE="$SCRIPT_DIR/templates/$SERVICE_NAME"

SERVICE_DESTINATION="/etc/systemd/system/$SERVICE_NAME"

DEPLOY_USER="deploy"

############################################################
# Validation
############################################################

validate() {

    section "Validation"

    require_root

    user_exists "$DEPLOY_USER" \
        || error "Deploy user does not exist."

    require_file "$SERVICE_TEMPLATE"

    require_directory "/opt/$APP_NAME"

}

############################################################
# Install service
############################################################

install_service() {

    section "Installing service"

    run cp \
        "$SERVICE_TEMPLATE" \
        "$SERVICE_DESTINATION"

    run chmod 644 "$SERVICE_DESTINATION"

}

############################################################
# Reload systemd
############################################################

reload_systemd() {

    section "Reloading systemd"

    run systemctl daemon-reload

}

############################################################
# Enable service
############################################################

enable_service() {

    section "Enabling service"

    run systemctl enable "$SERVICE_NAME"

}

############################################################
# Verification
############################################################

verify() {

    section "Verification"

    require_file "$SERVICE_DESTINATION"

    systemctl list-unit-files \
        | grep -q "^${SERVICE_NAME}"

    log "Service successfully installed."

}

############################################################
# Summary
############################################################

print_summary() {

    section "Summary"

    echo "Service : $SERVICE_NAME"

    echo "Installed at"

    echo "  $SERVICE_DESTINATION"

    echo

    success "Systemd service installed successfully."

}

############################################################
# Main
############################################################

main() {

    validate

    install_service

    reload_systemd

    enable_service

    verify

    print_summary

}

main "$@"
