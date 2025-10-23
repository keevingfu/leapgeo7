#!/bin/bash
# Project-Specific Validation: P0-P3 Priority System
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

echo "=============================================="
echo "  Priority System Validation (P0-P3)"
echo "  SweetNight GEO Project"
echo "=============================================="
echo ""

# ====================
# Check 1: Priority Configuration File
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1: prioritization_rules.json exists"
if check_file_exists "config/prioritization_rules.json"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# ====================
# Check 2: Priority Calculator Service
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 2: PriorityCalculator service"
if [ -f "src/services/PriorityCalculator.ts" ] || [ -f "backend/src/services/PriorityCalculator.ts" ]; then
    log_success "PriorityCalculator service exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "PriorityCalculator service not found"
fi

# ====================
# Check 3: Priority Calculation Formula
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 3: Priority calculation formula"
# Formula: totalScore = (enhanced_geo_score * 0.7) + (quickwin_index * 0.3)
if grep -r "0.7.*enhanced_geo_score.*0.3.*quickwin_index" src/ backend/src/ 2>/dev/null | grep -q .; then
    log_success "Priority calculation formula found"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Priority calculation formula not implemented yet"
fi

# ====================
# Check 4: P-Level Database Schema
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 4: P-Level in database schema"
if [ -f "prisma/schema.prisma" ]; then
    if grep -q "p_level" prisma/schema.prisma; then
        log_success "p_level field in Prisma schema"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_warning "p_level field not in schema yet"
    fi
else
    log_warning "Prisma schema not found"
fi

# ====================
# Check 5: Priority UI Components
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 5: Priority badge/tag component"
if find src/ -name "*Priority*.tsx" -o -name "*priority*.tsx" 2>/dev/null | grep -q .; then
    log_success "Priority UI component exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Priority UI component not implemented yet"
fi

# ====================
# Check 6: P0-P3 Color Encoding
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 6: P0-P3 color definitions"
# Expected colors: P0=red, P1=orange, P2=yellow, P3=green
if [ -d "src/theme" ] || [ -d "src/styles" ]; then
    if grep -r "P0.*red\|P1.*orange\|P2.*yellow\|P3.*green" src/theme/ src/styles/ 2>/dev/null | grep -q .; then
        log_success "Priority color encoding defined"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_warning "Priority color encoding not defined yet"
    fi
else
    log_warning "Theme directory not found"
fi

# ====================
# Check 7: Priority API Endpoints
# ====================
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 7: Priority filter API"
if grep -r "p_level\|priority" backend/src/routes/ src/api/ 2>/dev/null | grep -q .; then
    log_success "Priority API endpoints defined"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Priority API endpoints not implemented yet"
fi

# ====================
# Summary
# ====================
echo ""
print_validation_summary "Priority System (P0-P3)" "$PASSED_CHECKS" "$TOTAL_CHECKS"

if [ "$PASSED_CHECKS" -eq "$TOTAL_CHECKS" ]; then
    exit 0
else
    exit 1
fi
