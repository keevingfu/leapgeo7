#!/bin/bash
# Master Validation Script - Run All Validation Checkpoints
# SweetNight GEO Project - Automated Validation System
# Version: 1.0

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."

# Report generation flag
GENERATE_REPORT=false
if [ "${1:-}" = "--report" ]; then
    GENERATE_REPORT=true
fi

# Validation results tracking (bash 3.2 compatible)
RESULT_PHASE1=""
RESULT_PHASE2=""
RESULT_PHASE3=""
RESULT_PHASE4=""
RESULT_PRIORITY=""
RESULT_PAGES=""

echo ""
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}   SweetNight GEO Project${NC}"
echo -e "${CYAN}   Complete Validation Suite${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""
echo "Start Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ====================
# Phase 1: Frontend Design
# ====================
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}Phase 1: Frontend Design${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if bash "$SCRIPT_DIR/phase-1-frontend.sh"; then
    RESULT_PHASE1="✅ PASSED"
else
    RESULT_PHASE1="❌ FAILED"
fi

echo ""
sleep 1

# ====================
# Project-Specific Validations
# ====================
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}Project-Specific Validations${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Priority System
echo -e "${BLUE}→ P0-P3 Priority System${NC}"
if bash "$SCRIPT_DIR/project-specific/priority-system.sh"; then
    RESULT_PRIORITY="✅ PASSED"
else
    RESULT_PRIORITY="❌ FAILED"
fi
echo ""

# 15 Core Pages
echo -e "${BLUE}→ 15 Core Pages${NC}"
if bash "$SCRIPT_DIR/project-specific/pages-15.sh"; then
    RESULT_PAGES="✅ PASSED"
else
    RESULT_PAGES="❌ FAILED"
fi
echo ""

# ====================
# Phase 2: Backend Development
# ====================
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}Phase 2: Backend Development${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "$SCRIPT_DIR/phase-2-backend.sh" ]; then
    if bash "$SCRIPT_DIR/phase-2-backend.sh"; then
        RESULT_PHASE2="✅ PASSED"
    else
        RESULT_PHASE2="❌ FAILED"
    fi
else
    echo -e "${YELLOW}⚠️  Phase 2 script not yet created (expected for later stages)${NC}"
    RESULT_PHASE2="⏭️  SKIPPED"
fi

echo ""

# ====================
# Phase 3: Integration & Testing
# ====================
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}Phase 3: Integration & Testing${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "$SCRIPT_DIR/phase-3-integration.sh" ]; then
    if bash "$SCRIPT_DIR/phase-3-integration.sh"; then
        RESULT_PHASE3="✅ PASSED"
    else
        RESULT_PHASE3="❌ FAILED"
    fi
else
    echo -e "${YELLOW}⚠️  Phase 3 script not yet created (expected for later stages)${NC}"
    RESULT_PHASE3="⏭️  SKIPPED"
fi

echo ""

# ====================
# Phase 4: Deployment & Monitoring
# ====================
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}Phase 4: Deployment & Monitoring${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -f "$SCRIPT_DIR/phase-4-deployment.sh" ]; then
    if bash "$SCRIPT_DIR/phase-4-deployment.sh"; then
        RESULT_PHASE4="✅ PASSED"
    else
        RESULT_PHASE4="❌ FAILED"
    fi
else
    echo -e "${YELLOW}⚠️  Phase 4 script not yet created (expected for later stages)${NC}"
    RESULT_PHASE4="⏭️  SKIPPED"
fi

echo ""

# ====================
# Final Summary
# ====================
echo -e "${CYAN}================================================${NC}"
echo -e "${CYAN}   COMPLETE VALIDATION SUMMARY${NC}"
echo -e "${CYAN}================================================${NC}"
echo ""
echo "End Time: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "Results by Phase:"
echo "  Phase 1 (Frontend):     $RESULT_PHASE1"
echo "  Phase 2 (Backend):      $RESULT_PHASE2"
echo "  Phase 3 (Integration):  $RESULT_PHASE3"
echo "  Phase 4 (Deployment):   $RESULT_PHASE4"
echo ""
echo "Project-Specific:"
echo "  Priority System (P0-P3):  $RESULT_PRIORITY"
echo "  Core Pages (15):          $RESULT_PAGES"
echo ""

# Count results
total_phases=0
passed_phases=0

for result in "$RESULT_PHASE1" "$RESULT_PHASE2" "$RESULT_PHASE3" "$RESULT_PHASE4" "$RESULT_PRIORITY" "$RESULT_PAGES"; do
    total_phases=$((total_phases + 1))
    if echo "$result" | grep -q "PASSED"; then
        passed_phases=$((passed_phases + 1))
    fi
done

echo -e "${CYAN}================================================${NC}"
if [ "$passed_phases" -eq "$total_phases" ]; then
    echo -e "${GREEN}  ✅ ALL VALIDATIONS PASSED! ($passed_phases/$total_phases)${NC}"
    echo -e "${CYAN}================================================${NC}"
    exit_code=0
else
    echo -e "${RED}  ❌ SOME VALIDATIONS FAILED ($passed_phases/$total_phases passed)${NC}"
    echo -e "${CYAN}================================================${NC}"
    exit_code=1
fi

# Generate HTML report if requested
if [ "$GENERATE_REPORT" = true ]; then
    echo ""
    echo "Generating HTML validation report..."

    REPORT_FILE="validation-report-$(date '+%Y%m%d-%H%M%S').html"

    cat > "$REPORT_FILE" <<EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SweetNight GEO - Validation Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #1976D2; border-bottom: 3px solid #FF6B35; padding-bottom: 10px; }
        .timestamp { color: #666; font-size: 14px; margin-bottom: 30px; }
        .phase { margin: 20px 0; padding: 15px; border-left: 4px solid #ddd; background: #fafafa; }
        .passed { border-left-color: #4CAF50; }
        .failed { border-left-color: #F44336; }
        .skipped { border-left-color: #FFC107; }
        .status { font-weight: bold; font-size: 18px; }
        .status.pass { color: #4CAF50; }
        .status.fail { color: #F44336; }
        .status.skip { color: #FFC107; }
        .summary { background: #E3F2FD; padding: 20px; border-radius: 4px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 SweetNight GEO - Validation Report</h1>
        <div class="timestamp">Generated: $(date '+%Y-%m-%d %H:%M:%S')</div>

        <h2>Phase Results</h2>

        <div class="phase $(echo "$RESULT_PHASE1" | grep -q "PASSED" && echo "passed" || echo "failed")">
            <strong>Phase 1: Frontend Design</strong><br>
            <span class="status $(echo "$RESULT_PHASE1" | grep -q "PASSED" && echo "pass" || echo "fail")">$RESULT_PHASE1</span>
        </div>

        <div class="phase $(echo "$RESULT_PHASE2" | grep -q "PASSED" && echo "passed" || (echo "$RESULT_PHASE2" | grep -q "SKIPPED" && echo "skipped" || echo "failed"))">
            <strong>Phase 2: Backend Development</strong><br>
            <span class="status $(echo "$RESULT_PHASE2" | grep -q "PASSED" && echo "pass" || (echo "$RESULT_PHASE2" | grep -q "SKIPPED" && echo "skip" || echo "fail"))">$RESULT_PHASE2</span>
        </div>

        <div class="phase $(echo "$RESULT_PRIORITY" | grep -q "PASSED" && echo "passed" || echo "failed")">
            <strong>Priority System (P0-P3)</strong><br>
            <span class="status $(echo "$RESULT_PRIORITY" | grep -q "PASSED" && echo "pass" || echo "fail")">$RESULT_PRIORITY</span>
        </div>

        <div class="phase $(echo "$RESULT_PAGES" | grep -q "PASSED" && echo "passed" || echo "failed")">
            <strong>15 Core Pages</strong><br>
            <span class="status $(echo "$RESULT_PAGES" | grep -q "PASSED" && echo "pass" || echo "fail")">$RESULT_PAGES</span>
        </div>

        <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Phases/Checks:</strong> $total_phases</p>
            <p><strong>Passed:</strong> $passed_phases</p>
            <p><strong>Failed/Skipped:</strong> $((total_phases - passed_phases))</p>
        </div>
    </div>
</body>
</html>
EOF

    echo -e "${GREEN}✅ Report generated: $REPORT_FILE${NC}"
fi

echo ""
exit $exit_code
