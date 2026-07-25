#!/usr/bin/env bash

############################################################
# Common Library
#
# Shared helper functions for deployment scripts.
#
# Every deployment script should source this file:
#
# source "$(dirname "$0")/lib/common.sh"
#
############################################################

set -o pipefail

############################################################
# Colors
############################################################

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m"

############################################################
# Logging
############################################################

LOG_FILE="${LOG_FILE:-/tmp/deployment.log}"

log() {

    printf "%b[%s] INFO%b %s\n" \
        "$GREEN" \
        "$(date '+%F %T')" \
        "$NC" \
        "$1" \
        | tee -a "$LOG_FILE"
}

warn() {

    printf "%b[%s] WARN%b %s\n" \
        "$YELLOW" \
        "$(date '+%F %T')" \
        "$NC" \
        "$1" \
        | tee -a "$LOG_FILE"
}

error() {

    printf "%b[%s] ERROR%b %s\n" \
        "$RED" \
        "$(date '+%F %T')" \
        "$NC" \
        "$1" \
        | tee -a "$LOG_FILE" >&2

    exit 1
}

############################################################
# Section titles
############################################################

section() {

    echo
    echo "=================================================="
    echo "$1"
    echo "=================================================="
    echo
}

############################################################
# Validation
############################################################

require_root() {

    [[ $EUID -eq 0 ]] \
        || error "This script must be executed as root."
}

require_non_root() {

    [[ $EUID -ne 0 ]] \
        || error "Do not execute this script as root."
}

############################################################
# Commands
############################################################

command_exists() {

    command -v "$1" >/dev/null 2>&1
}

require_command() {

    command_exists "$1" \
        || error "Required command '$1' was not found."
}

############################################################
# Services
############################################################

service_running() {

    systemctl is-active --quiet "$1"
}

require_service() {

    service_running "$1" \
        || error "Service '$1' is not running."
}

############################################################
# Users
############################################################

user_exists() {

    id "$1" >/dev/null 2>&1
}

group_exists() {

    getent group "$1" >/dev/null
}

############################################################
# Files
############################################################

require_file() {

    [[ -f "$1" ]] \
        || error "Missing file: $1"
}

require_directory() {

    [[ -d "$1" ]] \
        || error "Missing directory: $1"
}

############################################################
# Success message
############################################################

success() {

    echo
    printf "%b✔ %s%b\n" \
        "$GREEN" \
        "$1" \
        "$NC"
}

############################################################
# Execute commands
############################################################

run() {

    log "$*"

    "$@" || error "Command failed: $*"
}
