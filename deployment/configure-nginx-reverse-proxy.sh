#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Configure Nginx Reverse Proxy
#
# Purpose:
#   Configure Nginx as a reverse proxy for ecommerce-api.
#
# Request flow:
#
#   Client
#      |
#      | HTTP :80
#      v
#   Nginx
#      |
#      | proxy_pass
#      v
#   Node.js :3000
#
# This script:
#   1. Validates Nginx
#   2. Creates the Nginx server configuration
#   3. Enables the site
#   4. Disables the default site
#   5. Validates the Nginx configuration
#   6. Reloads Nginx
#
# This script DOES NOT:
#   - Install Nginx
#   - Configure SSL/TLS
#   - Deploy the application
#   - Start the Node.js application
#
############################################################


############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/configure-nginx-reverse-proxy.log"

APP_NAME="ecommerce-api"

APP_PORT="3000"

NGINX_SITE_NAME="$APP_NAME"

NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"

NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

NGINX_CONFIG="$NGINX_SITES_AVAILABLE/$NGINX_SITE_NAME"

NGINX_ENABLED_CONFIG="$NGINX_SITES_ENABLED/$NGINX_SITE_NAME"

SERVER_NAME="_"


############################################################
# Validation
############################################################

validate() {

    section "Validation"

    require_root

    require_command nginx

    require_service nginx

    require_directory "$NGINX_SITES_AVAILABLE"

    require_directory "$NGINX_SITES_ENABLED"

    success "Nginx environment validated."
}


############################################################
# Create Nginx configuration
############################################################

create_nginx_config() {

    section "Creating Nginx reverse proxy configuration"

    log "Application : $APP_NAME"
    log "Backend     : 127.0.0.1:$APP_PORT"
    log "Server name : $SERVER_NAME"
    log "Config file : $NGINX_CONFIG"

    cat > "$NGINX_CONFIG" <<EOF
server {

    listen 80;

    server_name $SERVER_NAME;

    location / {

        proxy_pass http://127.0.0.1:$APP_PORT;

        proxy_http_version 1.1;

        proxy_set_header Host \$host;

        proxy_set_header X-Real-IP \$remote_addr;

        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;

        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    success "Nginx reverse proxy configuration created."
}


############################################################
# Enable site
############################################################

enable_site() {

    section "Enabling Nginx site"

    if [[ -L "$NGINX_ENABLED_CONFIG" ]]; then

        log "Nginx site is already enabled."

    else

        run ln -s \
            "$NGINX_CONFIG" \
            "$NGINX_ENABLED_CONFIG"

        log "Enabled site: $NGINX_SITE_NAME"

    fi

    success "Nginx site enabled."
}


############################################################
# Disable default site
############################################################

disable_default_site() {

    section "Disabling default Nginx site"

    local default_site="$NGINX_SITES_ENABLED/default"

    if [[ -L "$default_site" ]]; then

        run rm "$default_site"

        log "Default Nginx site disabled."

    else

        log "Default Nginx site is already disabled."

    fi

    success "Default Nginx site handled."
}


############################################################
# Test Nginx configuration
############################################################

test_nginx() {

    section "Testing Nginx configuration"

    run nginx -t

    success "Nginx configuration is valid."
}


############################################################
# Reload Nginx
############################################################

reload_nginx() {

    section "Reloading Nginx"

    run systemctl reload nginx

    require_service nginx

    success "Nginx reloaded successfully."
}


############################################################
# Verify reverse proxy
############################################################

verify_configuration() {

    section "Verifying reverse proxy configuration"

    require_file "$NGINX_CONFIG"

    if [[ -L "$NGINX_ENABLED_CONFIG" ]]; then

        log "Site enabled:"
        log "$NGINX_ENABLED_CONFIG"

    else

        error "Nginx site is not enabled."
    fi

    log "Reverse proxy:"
    log "http://localhost:80 -> http://127.0.0.1:$APP_PORT"

    success "Reverse proxy configuration verified."
}


############################################################
# Summary
############################################################

summary() {

    section "Nginx Reverse Proxy Summary"

    echo "Application : $APP_NAME"
    echo "Listen      : 80"
    echo "Backend     : 127.0.0.1:$APP_PORT"
    echo "Server name : $SERVER_NAME"
    echo "Config      : $NGINX_CONFIG"
    echo "Enabled     : $NGINX_ENABLED_CONFIG"

    echo

    success "Nginx reverse proxy configured successfully."
}


############################################################
# Main
############################################################

main() {

    require_root

    touch "$LOG_FILE"

    log "Starting Nginx reverse proxy configuration..."

    validate

    create_nginx_config

    enable_site

    disable_default_site

    test_nginx

    reload_nginx

    verify_configuration

    summary
}


############################################################
# Execute
############################################################

main "$@"
