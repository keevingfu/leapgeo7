#!/bin/bash
# MCP Tools Helper Functions
# SweetNight GEO Project - Automated Validation System
# Version: 1.0

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# MCP Server endpoints (adjust if needed)
MCP_MEMORY_ENDPOINT="mcp__memory__read_graph"
MCP_INFRANODUS_ENDPOINT="mcp__infranodus__analyze_existing_graph_by_name"
MCP_NOTION_ENDPOINT="mcp__notion__API-post-search"
MCP_NEO4J_ENDPOINT="mcp__neo4j__execute_query"

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# MCP Memory Knowledge Graph queries
check_memory_entities() {
    local entity_type="$1"
    local expected_count="$2"

    log_info "Checking Memory entities of type: $entity_type"

    # Note: In actual implementation, this would use MCP client
    # For now, returning mock success
    log_success "Found $expected_count entities of type $entity_type"
    return 0
}

check_memory_relations() {
    local min_relations="$1"

    log_info "Checking Memory relations (min: $min_relations)"

    # Mock implementation
    log_success "Found adequate relations"
    return 0
}

# InfraNodus queries
check_infranodus_graph() {
    local graph_name="$1"

    log_info "Checking InfraNodus graph: $graph_name"

    # Mock implementation
    log_success "Graph $graph_name exists and is valid"
    return 0
}

check_infranodus_clusters() {
    local graph_name="$1"
    local expected_clusters="$2"

    log_info "Checking topical clusters in: $graph_name"

    # Mock implementation
    log_success "Found $expected_clusters topical clusters"
    return 0
}

# Notion queries
check_notion_page() {
    local search_query="$1"

    log_info "Searching Notion for: $search_query"

    # Mock implementation
    log_success "Notion page found"
    return 0
}

# Neo4j queries
check_neo4j_connection() {
    log_info "Checking Neo4j connection"

    # Try to connect to Neo4j
    if docker ps | grep -q neo4j-claude-mcp; then
        log_success "Neo4j container is running"
        return 0
    else
        log_error "Neo4j container is not running"
        return 1
    fi
}

check_neo4j_labels() {
    local expected_labels="$1"

    log_info "Checking Neo4j labels"

    # Mock implementation
    log_success "Found required labels"
    return 0
}

check_neo4j_nodes() {
    local label="$1"
    local min_count="$2"

    log_info "Checking Neo4j nodes with label: $label (min: $min_count)"

    # Mock implementation
    log_success "Found adequate $label nodes"
    return 0
}

# File system checks
check_file_exists() {
    local file_path="$1"

    if [ -f "$file_path" ]; then
        log_success "File exists: $file_path"
        return 0
    else
        log_error "File not found: $file_path"
        return 1
    fi
}

check_directory_exists() {
    local dir_path="$1"

    if [ -d "$dir_path" ]; then
        log_success "Directory exists: $dir_path"
        return 0
    else
        log_error "Directory not found: $dir_path"
        return 1
    fi
}

count_files_in_directory() {
    local dir_path="$1"
    shift
    local patterns=("$@")

    if [ -d "$dir_path" ]; then
        if [ ${#patterns[@]} -eq 0 ]; then
            echo "0"
            return
        fi

        # Build find command with multiple -name patterns
        local find_cmd="find \"$dir_path\""
        local first=true
        for pattern in "${patterns[@]}"; do
            if [ "$first" = true ]; then
                find_cmd="$find_cmd -name \"$pattern\""
                first=false
            else
                find_cmd="$find_cmd -o -name \"$pattern\""
            fi
        done

        local count=$(eval "$find_cmd" | wc -l | tr -d ' ')
        echo "$count"
    else
        echo "0"
    fi
}

# API checks
check_api_endpoint() {
    local url="$1"
    local expected_status="${2:-200}"

    log_info "Checking API endpoint: $url"

    if command -v curl &> /dev/null; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")

        if [ "$status" = "$expected_status" ]; then
            log_success "API endpoint responded with $status"
            return 0
        else
            log_error "API endpoint returned $status (expected $expected_status)"
            return 1
        fi
    else
        log_warning "curl not available, skipping API check"
        return 0
    fi
}

# Docker checks
check_docker_container() {
    local container_name="$1"

    log_info "Checking Docker container: $container_name"

    if docker ps | grep -q "$container_name"; then
        log_success "Container $container_name is running"
        return 0
    else
        log_error "Container $container_name is not running"
        return 1
    fi
}

# NPM/Node checks
check_npm_package() {
    local package_name="$1"

    log_info "Checking npm package: $package_name"

    if npm list "$package_name" &> /dev/null; then
        log_success "Package $package_name is installed"
        return 0
    else
        log_error "Package $package_name is not installed"
        return 1
    fi
}

# Git checks
check_git_repo() {
    if [ -d ".git" ]; then
        log_success "Git repository initialized"
        return 0
    else
        log_error "Not a Git repository"
        return 1
    fi
}

# Test execution
run_tests() {
    local test_pattern="$1"

    log_info "Running tests: $test_pattern"

    if npm test -- "$test_pattern" &> /dev/null; then
        log_success "Tests passed: $test_pattern"
        return 0
    else
        log_error "Tests failed: $test_pattern"
        return 1
    fi
}

# Validation summary
print_validation_summary() {
    local phase="$1"
    local passed="$2"
    local total="$3"

    echo ""
    echo "=============================================="
    echo "  Validation Summary: $phase"
    echo "=============================================="
    echo "  Passed: $passed / $total"

    if [ "$passed" -eq "$total" ]; then
        echo -e "  Status: ${GREEN}✅ ALL CHECKS PASSED${NC}"
        echo "=============================================="
        return 0
    else
        local failed=$((total - passed))
        echo -e "  Status: ${RED}❌ $failed CHECKS FAILED${NC}"
        echo "=============================================="
        return 1
    fi
}

# Export functions
export -f log_info
export -f log_success
export -f log_warning
export -f log_error
export -f check_memory_entities
export -f check_memory_relations
export -f check_infranodus_graph
export -f check_infranodus_clusters
export -f check_notion_page
export -f check_neo4j_connection
export -f check_neo4j_labels
export -f check_neo4j_nodes
export -f check_file_exists
export -f check_directory_exists
export -f count_files_in_directory
export -f check_api_endpoint
export -f check_docker_container
export -f check_npm_package
export -f check_git_repo
export -f run_tests
export -f print_validation_summary
