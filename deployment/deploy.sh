#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Deploy Application
#
# Purpose:
#   Deploy a new production release of the application.
#
# Environment:
#   PRODUCTION ONLY
#
# Responsibilities:
#   1. Validate the production server
#   2. Verify GitHub repository access
#   3. Clone a new release
#   4. Install production dependencies
#   5. Link production configuration
#   6. Run production database migrations
#   7. Activate the release
#   8. Restart systemd service
#   9. Verify application health
#  10. Remove old releases
#
# This script does NOT:
#   - Run unit tests
#   - Run integration tests
#   - Run API tests
#   - Seed a test database
#   - Configure CI
#   - Configure development environment
#
# Testing belongs to CI.
############################################################


############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"


############################################################
# Application
############################################################

APP_NAME="ecommerce-api"

APP_DIR="/opt/$APP_NAME"

RELEASES_DIR="$APP_DIR/releases"

CURRENT_LINK="$APP_DIR/current"

SHARED_DIR="$APP_DIR/shared"

ENV_FILE="$SHARED_DIR/.env"

RELEASE_DIR=""

DEPLOY_USER="deploy"

SERVICE_NAME="$APP_NAME"

REPO_URL="git@github.com:ajpadilla/shopcore-api.git"

KEEP_RELEASES=5

HEALTH_URL="http://localhost:3000/health"

TIMESTAMP="$(date +"%Y%m%d%H%M%S")"

RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"


############################################################
# State
############################################################

PREVIOUS_RELEASE=""

DEPLOYMENT_ACTIVATED=false


############################################################
# Cleanup
############################################################

cleanup_failed_release() {

    if [[ "$DEPLOYMENT_ACTIVATED" == "false" ]] &&
       [[ -n "$RELEASE_DIR" ]] &&
       [[ -d "$RELEASE_DIR" ]]; then

        warn "Deployment failed before release activation."

        warn "Removing incomplete release:"
        warn "$RELEASE_DIR"

        rm -rf "$RELEASE_DIR"
    fi
}


############################################################
# Error handler
############################################################

on_error() {

    local exit_code=$?

    echo

    error "Deployment failed."
    error "Exit code: $exit_code"

    cleanup_failed_release

    exit "$exit_code"
}


trap on_error ERR


############################################################
# Validation
############################################################

validate() {

    section "Validation"


    ########################################################
    # Root
    ########################################################

    require_root


    ########################################################
    # Deployment user
    ########################################################

    user_exists "$DEPLOY_USER"


    ########################################################
    # Application directories
    ########################################################

    require_directory "$APP_DIR"

    require_directory "$RELEASES_DIR"

    require_directory "$SHARED_DIR"


    ########################################################
    # Production environment
    ########################################################

    require_file "$ENV_FILE"


    ########################################################
    # Required commands
    ########################################################

    command -v git >/dev/null 2>&1 || \
        error_exit "git is not installed."

    command -v npm >/dev/null 2>&1 || \
        error_exit "npm is not installed."

    command -v curl >/dev/null 2>&1 || \
        error_exit "curl is not installed."

    command -v systemctl >/dev/null 2>&1 || \
        error_exit "systemctl is not available."


    ########################################################
    # Systemd service
    ########################################################

    systemctl cat "$SERVICE_NAME" >/dev/null 2>&1 || \
        error_exit "systemd service '$SERVICE_NAME' does not exist."


    success "Production environment validated."
}


############################################################
# Verify GitHub
############################################################

verify_github() {

    section "Verifying GitHub repository access"

    run sudo -H -u "$DEPLOY_USER" \
        git ls-remote \
        "$REPO_URL" \
        HEAD \
        >/dev/null

    success "GitHub repository access verified."
}


############################################################
# Prepare release directory
############################################################

prepare_release_directory() {

    section "Preparing release directory"

    if [[ -e "$RELEASE_DIR" ]]; then
        error_exit "Release directory already exists: $RELEASE_DIR"
    fi

    run mkdir -p "$RELEASE_DIR"

    run chown "$DEPLOY_USER:$DEPLOY_USER" "$RELEASE_DIR"

    success "Release directory prepared."
}


############################################################
# Clone repository
############################################################

clone_repository() {

    section "Cloning repository"

    run sudo -H -u "$DEPLOY_USER" \
        git clone \
        "$REPO_URL" \
        "$RELEASE_DIR"

    success "Repository cloned."
}


############################################################
# Install production dependencies
############################################################

install_dependencies() {

    section "Installing production dependencies"

    cd "$RELEASE_DIR"

    run sudo -H -u "$DEPLOY_USER" \
        npm ci \
        --omit=dev

    success "Production dependencies installed."
}


############################################################
# Link shared resources
############################################################

link_shared_resources() {

    section "Linking shared production resources"


    ########################################################
    # Environment
    ########################################################

    run ln -sfn \
        "$ENV_FILE" \
        "$RELEASE_DIR/.env"


    ########################################################
    # Uploads
    #
    # Only create the link if the shared directory exists.
    ########################################################

    if [[ -d "$SHARED_DIR/uploads" ]]; then

        run ln -sfn \
            "$SHARED_DIR/uploads" \
            "$RELEASE_DIR/uploads"

    fi


    success "Shared resources linked."
}


############################################################
# Run production migrations
############################################################

run_migrations() {

    section "Running production database migrations"

    cd "$RELEASE_DIR"

    run sudo -H -u "$DEPLOY_USER" \
        npm run db:migrate

    success "Production database migrations completed."
}


############################################################
# Capture current release
############################################################

capture_previous_release() {

    section "Capturing current release"

    if [[ -L "$CURRENT_LINK" ]]; then

        PREVIOUS_RELEASE="$(readlink -f "$CURRENT_LINK")"

        log "Current release: $PREVIOUS_RELEASE"

    else

        log "No previous release found."

        PREVIOUS_RELEASE=""

    fi
}


############################################################
# Activate release
############################################################

activate_release() {

    section "Activating release"

    run ln -sfn \
        "$RELEASE_DIR" \
        "$CURRENT_LINK"

    DEPLOYMENT_ACTIVATED=true

    success "Release activated."

    log "Current release: $CURRENT_LINK"
    log "Release target: $RELEASE_DIR"
}


############################################################
# Restart application
############################################################

restart_service() {

    section "Restarting application"

    run systemctl restart "$SERVICE_NAME"

    require_service "$SERVICE_NAME"

    success "Application service restarted."
}


############################################################
# Health check
############################################################

health_check() {

    section "Health check"

    log "Checking: $HEALTH_URL"

    local attempts=0
    local max_attempts=15

    while (( attempts < max_attempts )); do

        if curl \
            --silent \
            --show-error \
            --fail \
            "$HEALTH_URL" \
            >/dev/null; then

            success "Health check passed."

            return 0
        fi

        attempts=$((attempts + 1))

        log "Health check attempt $attempts/$max_attempts failed."

        sleep 2
    done


    error_exit \
        "Health check failed after $max_attempts attempts."
}


############################################################
# Cleanup old releases
# Release Cleanup
#
# Removes old application releases while preserving:
#
# - Current active release
# - Previous release (rollback target)
# - Configured number of recent releases
#
# This is part of the release retention strategy.
#
# Currently disabled because manual deployment testing
# does not require release rotation yet.
#
# Enable this after implementing:
#
# - releases/ directory structure
# - current symlink switching
# - rollback workflow
#
############################################################

# cleanup_releases() {
#
#     section "Cleaning old releases"
#
#     local releases=()
#
#     while IFS= read -r release; do
#         releases+=("$release")
#     done < <(
#         find "$RELEASES_DIR" \
#             -mindepth 1 \
#             -maxdepth 1 \
#             -type d \
#             -printf '%T@ %p\n' \
#             | sort -nr \
#             | cut -d' ' -f2-
#     )
#
#     local total=${#releases[@]}
#
#     if (( total <= KEEP_RELEASES )); then
#         log "Nothing to clean."
#         return 0
#     fi
#
#     local index
#
#     for (( index=KEEP_RELEASES; index<total; index++ )); do
#
#         local old_release="${releases[$index]}"
#
#         if [[ "$old_release" == "$RELEASE_DIR" ]]; then
#             continue
#         fi
#
#         if [[ -n "$PREVIOUS_RELEASE" ]] &&
#            [[ "$old_release" == "$PREVIOUS_RELEASE" ]]; then
#
#             log "Keeping previous release: $old_release"
#             continue
#         fi
#
#         log "Removing old release: $old_release"
#
#         run rm -rf "$old_release"
#
#     done
#
#     success "Old releases cleaned."
# }


############################################################
# Deployment summary
############################################################

summary() {

    section "Deployment Summary"

    echo "Application : $APP_NAME"
    echo "Release     : $TIMESTAMP"
    echo "Release dir : $RELEASE_DIR"
    echo "Current     : $CURRENT_LINK"
    echo "Service     : $SERVICE_NAME"
    echo "Health URL  : $HEALTH_URL"

    echo

    if [[ -L "$CURRENT_LINK" ]]; then

        echo "Active release:"
        readlink "$CURRENT_LINK"

    fi

    echo

    success "Deployment completed successfully."
}


############################################################
# Main
############################################################

main() {

    validate

    verify_github

    prepare_release_directory

    clone_repository

    install_dependencies

    link_shared_resources

    capture_previous_release

    run_migrations

    activate_release

    restart_service

    health_check

    #cleanup_releases

    summary
}


############################################################
# Execute
############################################################

main "$@"
