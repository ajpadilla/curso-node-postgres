#!/bin/bash

set -e

echo "======================================"
echo "Phase 1 - Bootstrap server"
echo "======================================"

sudo ./bootstrap-server.sh

echo ""
echo "======================================"
echo "Phase 2 - Create deploy user"
echo "======================================"

sudo ./create-user.sh deploy

echo ""
echo "======================================"
echo "Phase 3 - Manual GitHub setup required"
echo "======================================"

echo "Switch to deploy user:"
echo ""
echo "    sudo su - deploy"
echo ""
echo "Generate SSH key:"
echo ""
echo "    ssh-keygen -t ed25519 -C \"deploy-vm\""
echo ""
echo "Copy public key:"
echo ""
echo "    cat ~/.ssh/id_ed25519.pub"
echo ""
echo "Add the key to GitHub."
echo ""
echo "Verify access:"
echo ""
echo "    ssh -T git@github.com"
echo ""
echo "Then execute:"
echo ""
echo "    ./deploy.sh"
