#!/bin/bash
# Phase 1: Frontend Design Validation Script
# SweetNight GEO Project - Automated Validation System
# Version: 1.0

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/helpers/mcp-tools.sh"

# Project root
PROJECT_ROOT="$SCRIPT_DIR/../.."
cd "$PROJECT_ROOT"

# Validation counters
TOTAL_CHECKS=0
PASSED_CHECKS=0

echo "=============================================="
echo "  Phase 1: Frontend Design Validation"
echo "  SweetNight GEO Project"
echo "=============================================="
echo ""

# ====================
# Checkpoint 1.1: Requirements Analysis & Knowledge Graph
# ====================
echo "📋 Checkpoint 1.1: Requirements Analysis & Knowledge Graph"
echo "----------------------------------------------"

# Check 1.1.1: UI Component Knowledge Graph Completeness
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.1.1: UI Component entities (expect 15)"
if check_memory_entities "UIComponent" 15; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# Check 1.1.2: InfraNodus Topical Clusters
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.1.2: InfraNodus topical clusters (expect 8)"
if check_infranodus_clusters "sweetnight-geo-requirements-analysis" 8; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

# Check 1.1.3: Notion Documentation Structure
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.1.3: Notion page exists"
if check_notion_page "SweetNight GEO"; then
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

echo ""

# ====================
# Checkpoint 1.2: UI/UX Design & Prototypes
# ====================
echo "🎨 Checkpoint 1.2: UI/UX Design & Prototypes"
echo "----------------------------------------------"

# Check 1.2.1: 15 Core Pages Design Completed
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.2.1: Design files for 15 pages"
if [ -d "figma-exports" ]; then
    # Accept both .png (design images) and .md (design specification documents)
    design_count=$(count_files_in_directory "figma-exports" "*.png" "*.md")
    if [ "$design_count" -ge 15 ]; then
        log_success "Found $design_count design files (>= 15)"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_warning "Found only $design_count design files (expected >= 15)"
    fi
else
    log_warning "figma-exports directory not found (design phase may not have started)"
fi

# Check 1.2.2: P0-P3 Visual Encoding
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.2.2: Priority color encoding"
if [ -d "src/theme" ] || [ -d "design-system" ]; then
    log_success "Design system directory exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Design system not yet implemented"
fi

# Check 1.2.3: 7-Step Workflow Visualization
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.2.3: Workflow visualization components"
if [ -d "src/components/workflow" ] || [ -f "src/components/WorkflowStepper.tsx" ]; then
    log_success "Workflow components exist"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "Workflow components not yet implemented"
fi

echo ""

# ====================
# Checkpoint 1.3: Frontend Architecture Design
# ====================
echo "🏗️  Checkpoint 1.3: Frontend Architecture Design"
echo "----------------------------------------------"

# Check 1.3.1: Component Architecture Completeness
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.3.1: Page components (expect >= 15)"
if [ -d "src/pages" ]; then
    page_count=$(count_files_in_directory "src/pages" "*.tsx")
    if [ "$page_count" -ge 15 ]; then
        log_success "Found $page_count page components (>= 15)"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_warning "Found only $page_count page components (expected >= 15)"
    fi
else
    log_warning "src/pages directory not found"
fi

# Check 1.3.2: State Management Architecture
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.3.2: Redux slices or state management"
if [ -d "src/store" ] || [ -d "src/state" ]; then
    log_success "State management structure exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "State management not yet implemented"
fi

# Check 1.3.3: API Client Architecture
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.3.3: API services"
if [ -d "src/services/api" ] || [ -d "src/api" ]; then
    log_success "API services structure exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "API services not yet implemented"
fi

echo ""

# ====================
# Checkpoint 1.4: Project Initialization
# ====================
echo "⚙️  Checkpoint 1.4: Project Initialization"
echo "----------------------------------------------"

# Check 1.4.1: Core Dependencies
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.4.1: npm dependencies"
if [ -f "package.json" ]; then
    log_success "package.json exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_error "package.json not found"
fi

# Check 1.4.2: Environment Configuration
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.4.2: Environment files"
if [ -f ".env" ] || [ -f ".env.example" ]; then
    log_success "Environment configuration exists"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    log_warning "No environment configuration found"
fi

echo ""

# ====================
# Checkpoint 1.5: Context Engineering PRP Generation
# ====================
echo "📝 Checkpoint 1.5: Context Engineering PRP"
echo "----------------------------------------------"

# Check 1.5.1: PRP File Completeness
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
log_info "Check 1.5.1: PRP files"
PRP_DIR="$HOME/Context-Engineering-Intro/PRPs"
if [ -d "$PRP_DIR" ]; then
    prp_count=$(find "$PRP_DIR" -name "*sweetnight*" -o -name "*frontend*" | wc -l | tr -d ' ')
    if [ "$prp_count" -gt 0 ]; then
        log_success "Found $prp_count PRP files"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        log_warning "No SweetNight PRP files found"
    fi
else
    log_warning "Context Engineering PRPs directory not found"
fi

echo ""

# ====================
# Summary
# ====================
print_validation_summary "Phase 1: Frontend Design" "$PASSED_CHECKS" "$TOTAL_CHECKS"

exit_code=$?
if [ $exit_code -eq 0 ]; then
    exit 0
else
    exit 1
fi
