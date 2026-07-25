#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Bootstrap Server
#
# Purpose:
#   Prepare a clean Ubuntu server to host applications.
#
# Responsibilities:
#   - Update the operating system
#   - Install base packages
#   - Install Node.js
#   - Configure SSH
#   - Configure Nginx
#   - Configure UFW
#
# This script DOES NOT:
#   - Create users
#   - Configure GitHub
#   - Deploy applications
#   - Install systemd services
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/bootstrap-server.log"

NODE_MAJOR_VERSION=22

PACKAGES=(
    git
    curl
    wget
    unzip
    ca-certificates
    gnupg
    lsb-release
    build-essential
    openssh-server
    nginx
    ufw
)

############################################################
# Update operating system
############################################################

update_system() {

    section "Updating operating system"

    run apt update

    run apt upgrade -y
}

############################################################
# Install required packages
############################################################

install_packages() {

    section "Installing required packages"

    run apt install -y "${PACKAGES[@]}"
}

############################################################
# Install Node.js
############################################################

install_node() {

    section "Installing Node.js"

    if command_exists node; then

        INSTALLED_MAJOR=$(node -v | cut -d '.' -f1 | tr -d 'v')

        if [[ "$INSTALLED_MAJOR" == "$NODE_MAJOR_VERSION" ]]; then

            log "Node.js v$NODE_MAJOR_VERSION already installed."

            return

        fi
    fi

    run bash -c \
        "curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR_VERSION}.x | bash -"

    run apt install -y nodejs

    require_command node

    require_command npm

    log "Installed Node.js $(node -v)"
}

############################################################
# Configure SSH
############################################################

configure_ssh() {

    section "Configuring SSH"

    run systemctl enable ssh

    run systemctl restart ssh

    require_service ssh
}

############################################################
# Configure Nginx
############################################################

configure_nginx() {

    section "Configuring Nginx"

    run systemctl enable nginx

    run systemctl restart nginx

    require_service nginx
}

############################################################
# Configure Firewall
############################################################

configure_firewall() {

    section "Configuring Firewall"

    run ufw allow OpenSSH

    run ufw allow 80/tcp

    run ufw allow 443/tcp

    run ufw --force enable
}

############################################################
# Verify installation
############################################################

verify_installation() {

    section "Running verification"

    require_command git
    require_command curl
    require_command node
    require_command npm
    require_command nginx
    require_command ssh
    require_command ufw

    require_service ssh
    require_service nginx

    log "Verification completed successfully."
}

############################################################
# Summary
############################################################

print_summary() {

    section "Bootstrap Summary"

    echo "Node.js : $(node -v)"
    echo "npm     : $(npm -v)"
    echo "SSH     : $(systemctl is-active ssh)"
    echo "Nginx   : $(systemctl is-active nginx)"

    success "Server bootstrap completed successfully."
}

############################################################
# Main
############################################################

main() {

    require_root

    touch "$LOG_FILE"

    log "Starting server bootstrap..."

    update_system

    install_packages

    install_node

    configure_ssh

    configure_nginx

    configure_firewall

    verify_installation

    print_summary
}

main "$@"
