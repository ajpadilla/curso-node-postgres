#!/usr/bin/env bash

set -Eeuo pipefail

############################################################
# Setup GitHub SSH Access
#
# Purpose:
#   Configure SSH authentication for GitHub.
#
# Responsibilities:
#   - Generate SSH key
#   - Configure SSH client
#   - Display public key
#   - Verify GitHub access
#
############################################################

############################################################
# Configuration
############################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "$SCRIPT_DIR/lib/common.sh"

LOG_FILE="/var/log/setup-github.log"

USERNAME="${1:-deploy}"

SSH_DIR="/home/$USERNAME/.ssh"

PRIVATE_KEY="$SSH_DIR/id_ed25519"

PUBLIC_KEY="$PRIVATE_KEY.pub"

############################################################
# Validation
############################################################

validate() {

    section "Validation"

    require_root

    user_exists "$USERNAME" \
        || error "User '$USERNAME' does not exist."

}

############################################################
# Create SSH directory
############################################################

prepare_ssh_directory() {

    section "Preparing SSH directory"

    run mkdir -p "$SSH_DIR"

    run chmod 700 "$SSH_DIR"

    run chown -R "$USERNAME:$USERNAME" "$SSH_DIR"

}

############################################################
# Generate SSH key
############################################################

generate_key() {

    section "Generating SSH key"

    if [[ -f "$PRIVATE_KEY" ]]; then

        log "SSH key already exists."

        return

    fi

    run sudo -u "$USERNAME" ssh-keygen \
        -t ed25519 \
        -C "${USERNAME}@$(hostname)" \
        -f "$PRIVATE_KEY" \
        -N ""

    log "SSH key generated."

}

############################################################
# Configure SSH client
############################################################

configure_ssh() {

    section "Configuring SSH"

    cat > "$SSH_DIR/config" <<EOF
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF

    run chmod 600 "$SSH_DIR/config"

    run chown "$USERNAME:$USERNAME" "$SSH_DIR/config"

}

############################################################
# Display public key
############################################################

show_public_key() {

    section "GitHub Public Key"

    echo
    cat "$PUBLIC_KEY"
    echo

    echo "------------------------------------------------------"
    echo "Copy the public key above."
    echo
    echo "GitHub"
    echo
    echo "Settings"
    echo "  → SSH and GPG keys"
    echo "      → New SSH Key"
    echo
    echo "Paste the key and save it."
    echo "------------------------------------------------------"
    echo

}

############################################################
# Wait for user
############################################################

wait_for_confirmation() {

    read -rp "Press ENTER after adding the key to GitHub..."
}

############################################################
# Verify GitHub access
############################################################

verify_connection() {

    section "Testing GitHub connection"

    sudo -u "$USERNAME" \
        ssh \
        -T \
        -o StrictHostKeyChecking=accept-new \
        git@github.com || true

    echo

    read -rp "Did GitHub authentication succeed? [y/N]: " answer

    [[ "$answer" =~ ^[Yy]$ ]] \
        || error "GitHub authentication failed."

}

############################################################
# Summary
############################################################

print_summary() {

    section "GitHub Setup Summary"

    echo "User       : $USERNAME"
    echo "SSH Folder : $SSH_DIR"
    echo "Private Key: $PRIVATE_KEY"
    echo "Public Key : $PUBLIC_KEY"

    success "GitHub SSH configured successfully."

}

############################################################
# Main
############################################################

main() {

    validate

    prepare_ssh_directory

    generate_key

    configure_ssh

    show_public_key

    wait_for_confirmation

    verify_connection

    print_summary

}

main "$@"
