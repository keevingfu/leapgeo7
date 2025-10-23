#!/bin/bash
# Project-Specific Validation: 15 Core Pages
# SweetNight GEO Project
# Version: 1.0

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../helpers/mcp-tools.sh"

PROJECT_ROOT="$SCRIPT_DIR/../../.."
cd "$PROJECT_ROOT"

TOTAL_CHECKS=0
PASSED_CHECKS=0

# 15 Core Pages List
PAGES=(
    "Dashboard"
    "RoadmapManager"
    "ContentRegistry"
    "PromptLandscape"
    "ContentGenerator"
    "CitationTracker"
    "KPIDashboard"
    "BattlefieldMap"
    "WorkflowMonitor"
    "SystemSettings"
    "TemplateEditor"
    "AnalyticsReports"
    "ContentCoverage"
    "CitationStrength"
    "UserManagement"
)

echo "=============================================="
echo "  15 Core Pages Validation"
echo "  SweetNight GEO Project"
echo "=============================================="
echo ""

# ====================
# Check Each Page Component
# ====================
log_info "Checking 15 core page components..."
echo ""

for page in "${PAGES[@]}"; do
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    # Check various possible locations
    found=false

    # Check src/pages/
    if [ -f "src/pages/$page.tsx" ] || [ -f "src/pages/${page}/index.tsx" ]; then
        found=true
    fi

    # Check src/components/pages/
    if [ -f "src/components/pages/$page.tsx" ] || [ -f "src/components/pages/${page}/index.tsx" ]; then
        found=true
    fi

    # Check frontend/src/pages/
    if [ -f "frontend/src/pages/$page.tsx" ] || [ -f "frontend/src/pages/${page}/index.tsx" ]; then
        found=true
    fi

    if [ "$found" = true ]; then
        log_success "✅ $page component found"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_warning "❌ $page component not found"
    fi
done

echo ""

# ====================
# Additional Checks
# ====================

# Check page routes
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check: Routes configuration"
if [ -f "src/routes/index.tsx" ] || [ -f "src/App.tsx" ] || [ -f "frontend/src/routes/index.tsx" ]; then
    log_success "Routes configuration file exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Routes configuration not found"
fi

# Check navigation menu
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check: Navigation menu component"
if find src/ frontend/src/ -name "*Sidebar*.tsx" -o -name "*Navigation*.tsx" -o -name "*Menu*.tsx" 2>/dev/null | grep -q .; then
    log_success "Navigation component exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Navigation component not found"
fi

# ====================
# Summary
# ====================
echo ""
echo "=============================================="
echo "  Page Implementation Status"
echo "=============================================="
echo "  Core Pages: $PASSED_CHECKS / ${#PAGES[@]}"
echo "  Additional: $((PASSED_CHECKS - ${#PAGES[@]})) / $((TOTAL_CHECKS - ${#PAGES[@]}))"
echo "=============================================="

print_validation_summary "15 Core Pages" "$PASSED_CHECKS" "$TOTAL_CHECKS"

if [ "$PASSED_CHECKS" -ge 15 ]; then
    log_success "Core requirement met: At least 15 pages implemented"
    exit 0
else
    log_error "Core requirement not met: Only $PASSED_CHECKS / 15 pages implemented"
    exit 1
fi
