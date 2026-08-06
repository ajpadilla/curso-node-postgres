#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Deploy Application
#
# Purpose:
#   Deploy a new application release.
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/deploy.log"

APP_NAME="ecommerce-api"

APP_DIR="/opt/$APP_NAME"

RELEASES_DIR="$APP_DIR/releases"

CURRENT_LINK="$APP_DIR/current"

SHARED_DIR="$APP_DIR/shared"

DEPLOY_USER="deploy"

SERVICE_NAME="$APP_NAME"

REPO_URL="git@github.com:ajpadilla/shopcore-api.git"

KEEP_RELEASES=5

TIMESTAMP=$(date +"%Y%m%d%H%M%S")

RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"

############################################################
# Validation
############################################################

validate() {

    section "Validation"

    require_root

    user_exists "$DEPLOY_USER"

    require_directory "$RELEASES_DIR"

    require_directory "$SHARED_DIR"

    require_file "$SHARED_DIR/.env"

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
# Clone repository
############################################################

clone_repository() {

    section "Cloning repository"

    run sudo -H -u "$DEPLOY_USER" \
        git clone \
        "$REPO_URL" \
        "$RELEASE_DIR"

}

############################################################
# Install dependencies
############################################################

install_dependencies() {

    section "Installing dependencies"

    cd "$RELEASE_DIR"

    run sudo -H -u "$DEPLOY_USER" npm ci

}

############################################################
# Run tests
############################################################

run_tests() {

    section "Running tests"

    cd "$RELEASE_DIR"

    run sudo -H -u "$DEPLOY_USER" npm test

}

############################################################
# Build application
############################################################

#build_application() {

#    section "Building application"

#    cd "$RELEASE_DIR"

#    if npm run | grep -q " build"; then

#        run sudo -H -u "$DEPLOY_USER" npm run build

#    else

#        warn "No build script found."

#    fi

#}

############################################################
# Production dependencies
############################################################

optimize_dependencies() {

    section "Removing development dependencies"

    cd "$RELEASE_DIR"

    run sudo -H -u "$DEPLOY_USER" \
        npm prune --omit=dev

}

############################################################
# Shared resources
############################################################

link_shared_resources() {

    section "Linking shared resources"

    ln -sfn \
        "$SHARED_DIR/.env" \
        "$RELEASE_DIR/.env"

    ln -sfn \
        "$SHARED_DIR/uploads" \
        "$RELEASE_DIR/uploads"

}

############################################################
# Activate release
############################################################

activate_release() {

    section "Activating release"

    ln -sfn \
        "$RELEASE_DIR" \
        "$CURRENT_LINK"

}

############################################################
# Restart application
############################################################

restart_service() {

    section "Restarting service"

    run systemctl restart "$SERVICE_NAME"

    require_service "$SERVICE_NAME"

}

############################################################
# Health check
############################################################

health_check() {

    section "Health check"

    sleep 3

    curl --fail \
        http://localhost:3000/health \
        >/dev/null

    log "Health check passed."

}

############################################################
# Cleanup
############################################################

#cleanup_releases() {

#    section "Removing old releases"

#    ls -dt "$RELEASES_DIR"/* \
#        | tail -n +$((KEEP_RELEASES + 1)) \
#       | xargs -r rm -rf

#}

############################################################
# Summary
############################################################

summary() {

    section "Deployment Summary"

    echo "Release : $TIMESTAMP"

    echo "Current : $CURRENT_LINK"

    success "Deployment completed successfully."

}

############################################################
# Main
############################################################

main() {

    validate

    verify_github

    clone_repository

    install_dependencies

    run_tests

    #build_application

    optimize_dependencies

    link_shared_resources

    activate_release

    restart_service

    health_check

    #cleanup_releases

    summary

}

main "$@"
