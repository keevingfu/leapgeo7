#!/bin/bash

# Health check script - Verify deployment readiness

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
}

ERRORS=0

print_info "Running deployment health checks..."
echo ""

# Check Node.js
print_info "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js not found"
    ERRORS=$((ERRORS + 1))
fi

# Check npm
print_info "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm not found"
    ERRORS=$((ERRORS + 1))
fi

# Check Git
print_info "Checking Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    print_success "Git installed: $GIT_VERSION"
else
    print_error "Git not found"
    ERRORS=$((ERRORS + 1))
fi

# Check if in Git repository
print_info "Checking Git repository..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    print_success "Git repository initialized"

    # Check remote
    if git remote | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        print_success "Remote 'origin' configured: $REMOTE_URL"
    else
        print_warning "No remote 'origin' configured"
    fi
else
    print_error "Not a Git repository"
    ERRORS=$((ERRORS + 1))
fi

# Check package.json
print_info "Checking package.json..."
if [ -f "package.json" ]; then
    print_success "package.json found"
else
    print_error "package.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Check dependencies
print_info "Checking node_modules..."
if [ -d "node_modules" ]; then
    print_success "Dependencies installed"
else
    print_warning "Dependencies not installed. Run 'npm install'"
fi

# Check TypeScript config
print_info "Checking TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
    print_success "tsconfig.json found"
else
    print_warning "tsconfig.json not found"
fi

# Check Vite config
print_info "Checking Vite configuration..."
if [ -f "vite.config.ts" ]; then
    print_success "vite.config.ts found"
else
    print_warning "vite.config.ts not found"
fi

# Check Vercel config
print_info "Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    print_success "vercel.json found"
else
    print_warning "vercel.json not found (optional)"
fi

# Check for uncommitted changes
print_info "Checking working directory..."
if git diff-index --quiet HEAD -- 2>/dev/null; then
    print_success "Working directory clean"
else
    print_warning "Uncommitted changes detected"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
    print_success "All critical checks passed! ✨"
    echo ""
    print_info "System ready for automated deployment"
    exit 0
else
    print_error "Found $ERRORS critical error(s)"
    echo ""
    print_info "Please resolve errors before deploying"
    exit 1
fi
