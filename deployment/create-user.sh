#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Create Deploy User
#
# Purpose:
#   Create a Linux user for application deployments.
#
# Responsibilities:
#   - Create application group
#   - Create deploy user
#   - Configure home directory
#   - Configure SSH directory
#   - Optional sudo privileges
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/create-user.log"

APP_GROUP="ecommerce-api"

USERNAME="${1:-}"

############################################################
# Validation
############################################################

validate_input() {

    section "Validating input"

    require_root

    [[ -n "$USERNAME" ]] \
        || error "Usage: $0 <username>"

}

############################################################
# Create application group
############################################################

create_group() {

    section "Creating application group"

    if group_exists "$APP_GROUP"; then

        log "Group '$APP_GROUP' already exists."

        return
    fi

    run groupadd "$APP_GROUP"

    log "Group created successfully."

}

############################################################
# Create user
############################################################

create_user() {

    section "Creating user"

    if user_exists "$USERNAME"; then

        error "User '$USERNAME' already exists."

    fi

    run useradd \
        --create-home \
        --shell /bin/bash \
        "$USERNAME"

    log "User '$USERNAME' created."

}

############################################################
# Configure SSH
############################################################

configure_ssh() {

    section "Configuring SSH directory"

    local ssh_dir="/home/$USERNAME/.ssh"

    run mkdir -p "$ssh_dir"

    run touch "$ssh_dir/authorized_keys"

    run chmod 700 "$ssh_dir"

    run chmod 600 "$ssh_dir/authorized_keys"

    run chown -R "$USERNAME:$USERNAME" "$ssh_dir"

    log "SSH directory configured."

}

############################################################
# Add user to application group
############################################################

assign_group() {

    section "Assigning application group"

    run usermod -aG "$APP_GROUP" "$USERNAME"

    log "User added to '$APP_GROUP'."

}

############################################################
# Optional sudo access
############################################################

configure_sudo() {

    section "Sudo privileges"

    read -rp "Grant sudo privileges to '$USERNAME'? [y/N]: " answer

    if [[ "$answer" =~ ^[Yy]$ ]]; then

        run usermod -aG sudo "$USERNAME"

        log "Sudo privileges granted."

    else

        log "Skipping sudo configuration."

    fi

}

############################################################
# Verification
############################################################

verify() {

    section "Running verification"

    user_exists "$USERNAME" \
        || error "User verification failed."

    group_exists "$APP_GROUP" \
        || error "Group verification failed."

    id -nG "$USERNAME" | grep -qw "$APP_GROUP" \
        || error "User is not in '$APP_GROUP'."

    require_directory "/home/$USERNAME"

    require_directory "/home/$USERNAME/.ssh"

    require_file "/home/$USERNAME/.ssh/authorized_keys"

    log "Verification completed successfully."

}

############################################################
# Summary
############################################################

print_summary() {

    section "User Summary"

    echo "Username : $USERNAME"
    echo "Home     : /home/$USERNAME"
    echo "Shell    : /bin/bash"
    echo "Group    : $APP_GROUP"

    if id -nG "$USERNAME" | grep -qw sudo; then
        echo "Sudo     : Yes"
    else
        echo "Sudo     : No"
    fi

    success "User provisioning completed successfully."

}

############################################################
# Main
############################################################

main() {

    validate_input

    create_group

    create_user

    configure_ssh

    assign_group

    configure_sudo

    verify

    print_summary

}

main "$@"
