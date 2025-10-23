#!/bin/bash

# Setup Git configuration for automated deployment

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_info "Setting up Git configuration..."

# Set Git user (if not already set)
if [ -z "$(git config user.name)" ]; then
    print_info "Setting default Git user name..."
    git config user.name "Claude Code"
fi

if [ -z "$(git config user.email)" ]; then
    print_info "Setting default Git user email..."
    git config user.email "noreply@anthropic.com"
fi

# Configure Git to use SSH or HTTPS
if [ ! -z "$GITHUB_TOKEN" ]; then
    print_info "GitHub token detected. Configuring HTTPS authentication..."
    git config --global credential.helper store
fi

# Set default branch to main
git config --global init.defaultBranch main

# Enable color UI
git config --global color.ui auto

# Set push default
git config --global push.default current

print_success "Git configuration completed!"

echo ""
echo "Current Git configuration:"
echo "  Name:  $(git config user.name)"
echo "  Email: $(git config user.email)"
echo "  Branch: $(git config init.defaultBranch)"
