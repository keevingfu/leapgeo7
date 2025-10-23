#!/bin/bash

# LeapGEO7 Automated Deployment Script
# Automatically commits changes and pushes to GitHub, triggering Vercel deployment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
    exit 1
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository. Please run 'git init' first."
fi

# Check for uncommitted changes
if git diff-index --quiet HEAD --; then
    print_warning "No changes to commit. Exiting."
    exit 0
fi

print_info "Starting automated deployment process..."

# Run type-check
print_info "Running TypeScript type-check..."
if npm run type-check; then
    print_success "Type-check passed"
else
    print_error "Type-check failed. Please fix TypeScript errors before deploying."
fi

# Run build
print_info "Running production build..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed. Please fix build errors before deploying."
fi

# Get commit message from argument or use default
if [ -z "$1" ]; then
    print_info "No commit message provided. Using default message."
    COMMIT_MSG="chore: automated deployment - $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

# Stage all changes
print_info "Staging changes..."
git add -A

# Show what will be committed
print_info "Changes to be committed:"
git status --short

# Create commit
print_info "Creating commit..."
git commit -m "$(cat <<EOF
$COMMIT_MSG

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)" || {
    print_warning "Nothing to commit or commit failed"
    exit 0
}

print_success "Commit created successfully"

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
print_info "Current branch: $BRANCH"

# Push to GitHub
print_info "Pushing to GitHub..."
if git push origin "$BRANCH"; then
    print_success "Successfully pushed to GitHub"
else
    print_error "Failed to push to GitHub. Please check your credentials and network connection."
fi

# Get latest commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
print_success "Deployment initiated! Commit: $COMMIT_HASH"

print_info "Vercel will automatically detect this push and start deployment."
print_info "Check deployment status at: https://vercel.com/dashboard"

echo ""
print_success "🚀 Automated deployment completed successfully!"
echo ""
print_info "Next steps:"
echo "  1. Monitor deployment at Vercel Dashboard"
echo "  2. Verify application at your Vercel URL"
echo "  3. Check logs if any issues occur"
