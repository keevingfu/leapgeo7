#!/bin/bash

# LeapGEO7 - MCP 服务停止脚本
# 用途: 安全停止所有 MCP 服务和 LeapGEO7 应用

set -e

echo "🛑 LeapGEO7 - 停止所有服务..."
echo "=================================="
echo ""

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. 停止 LeapGEO7 应用
echo "🌐 停止 LeapGEO7 应用..."

if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        rm .frontend.pid
        print_success "前端服务已停止"
    else
        print_warning "前端服务未运行"
        rm .frontend.pid
    fi
else
    print_warning "未找到前端 PID 文件"
fi

if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        rm .backend.pid
        print_success "后端服务已停止"
    else
        print_warning "后端服务未运行"
        rm .backend.pid
    fi
else
    print_warning "未找到后端 PID 文件"
fi

# 备用方案：强制杀死 node 和 vite 进程
pkill -f "vite" 2>/dev/null || true
pkill -f "nest start" 2>/dev/null || true

echo ""

# 2. 停止 Docker 容器（可选）
read -p "是否停止数据库容器? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💾 停止数据库容器..."

    docker stop postgres-claude-mcp 2>/dev/null && print_success "PostgreSQL 已停止" || print_warning "PostgreSQL 未运行"
    docker stop neo4j-claude-mcp 2>/dev/null && print_success "Neo4j 已停止" || print_warning "Neo4j 未运行"
    docker stop redis-claude-mcp 2>/dev/null && print_success "Redis 已停止" || print_warning "Redis 未运行"
    docker stop mongodb-claude-mcp 2>/dev/null && print_success "MongoDB 已停止" || print_warning "MongoDB 未运行"

    # MinIO
    if docker ps | grep -q minio-server; then
        cd ~/minio-setup && docker compose down && cd - > /dev/null
        print_success "MinIO 已停止"
    fi

    # Firecrawl
    if docker ps | grep -q firecrawl-api; then
        cd ~/firecrawl && docker compose down && cd - > /dev/null
        print_success "Firecrawl 已停止"
    fi
else
    print_warning "数据库容器保持运行状态"
fi

echo ""
echo "=================================="
echo "✅ 所有服务已停止"
echo "=================================="
echo ""
echo "💡 重新启动服务:"
echo "  bash scripts/mcp-quick-start.sh"
echo ""
