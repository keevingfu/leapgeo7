#!/bin/bash

# LeapGEO7 - MCP 全能力快速启动脚本
# 用途: 一键启动所有 MCP 服务并配置自动化工作流
# 作者: Claude Code
# 日期: 2025-10-23

set -e  # 遇到错误立即退出

echo "🚀 LeapGEO7 - MCP 全能力启动程序"
echo "=================================="
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 辅助函数
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# 1. 检查环境配置
echo "📋 步骤 1/8: 检查环境配置..."
if [ ! -f .env.mcp ]; then
    print_warning ".env.mcp 文件不存在，从模板复制..."
    cp .env.mcp.example .env.mcp
    print_info "请编辑 .env.mcp 填入实际配置值"
    print_info "然后重新运行此脚本"
    exit 0
fi
print_success "环境配置文件已就绪"

# 加载环境变量
source .env.mcp
echo ""

# 2. 检查 Docker 服务
echo "🐳 步骤 2/8: 检查 Docker 服务..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker 未运行，请先启动 Docker Desktop"
    exit 1
fi
print_success "Docker 服务正常"
echo ""

# 3. 启动数据库容器
echo "💾 步骤 3/8: 启动数据库容器..."

# PostgreSQL
if ! docker ps | grep -q postgres-claude-mcp; then
    print_info "启动 PostgreSQL..."
    docker start postgres-claude-mcp 2>/dev/null || print_warning "PostgreSQL 容器不存在或已停止"
else
    print_success "PostgreSQL 已运行"
fi

# Neo4j
if ! docker ps | grep -q neo4j-claude-mcp; then
    print_info "启动 Neo4j..."
    docker start neo4j-claude-mcp 2>/dev/null || print_warning "Neo4j 容器不存在或已停止"
else
    print_success "Neo4j 已运行"
fi

# Redis
if ! docker ps | grep -q redis-claude-mcp; then
    print_info "启动 Redis..."
    docker start redis-claude-mcp 2>/dev/null || print_warning "Redis 容器不存在或已停止"
else
    print_success "Redis 已运行"
fi

# MongoDB
if ! docker ps | grep -q mongodb-claude-mcp; then
    print_info "启动 MongoDB..."
    docker start mongodb-claude-mcp 2>/dev/null || print_warning "MongoDB 容器不存在或已停止"
else
    print_success "MongoDB 已运行"
fi

# MinIO
if ! docker ps | grep -q minio-server; then
    print_info "启动 MinIO..."
    cd ~/minio-setup && docker compose up -d && cd - > /dev/null
else
    print_success "MinIO 已运行"
fi

echo ""

# 4. 启动 Firecrawl
echo "🕷️  步骤 4/8: 启动 Firecrawl..."
if ! docker ps | grep -q firecrawl-api; then
    print_info "启动 Firecrawl 服务..."
    cd ~/firecrawl && docker compose up -d && cd - > /dev/null
    sleep 5
fi
print_success "Firecrawl 已运行"
echo ""

# 5. 验证数据库连接
echo "🔌 步骤 5/8: 验证数据库连接..."

# PostgreSQL
if PGPASSWORD=claude_dev_2025 psql -h localhost -p 5437 -U claude -d claude_dev -c "SELECT 1" > /dev/null 2>&1; then
    print_success "PostgreSQL 连接成功"
else
    print_warning "PostgreSQL 连接失败，请检查配置"
fi

# Neo4j
if curl -s http://localhost:7475 > /dev/null; then
    print_success "Neo4j 连接成功"
else
    print_warning "Neo4j 连接失败，请检查配置"
fi

# Redis
if redis-cli -h localhost -p 6382 -a claude_redis_2025 ping > /dev/null 2>&1; then
    print_success "Redis 连接成功"
else
    print_warning "Redis 连接失败，请检查配置"
fi

echo ""

# 6. 启动 LeapGEO7 应用
echo "🌐 步骤 6/8: 启动 LeapGEO7 应用..."

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    print_info "安装前端依赖..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    print_info "安装后端依赖..."
    cd server && npm install && cd ..
fi

# 数据库迁移
print_info "执行数据库迁移..."
cd server && npx prisma migrate deploy && cd ..

# 启动前端（后台运行）
print_info "启动前端服务..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid

# 启动后端（后台运行）
print_info "启动后端服务..."
cd server && npm run start:dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../.backend.pid
cd ..

# 等待服务启动
sleep 10

print_success "LeapGEO7 应用已启动"
echo ""

# 7. 配置 n8n 工作流（如果 n8n 可用）
echo "🔄 步骤 7/8: 配置 n8n 工作流..."

if [ -n "$N8N_API_KEY" ] && [ "$N8N_API_KEY" != "your_n8n_api_key_here" ]; then
    if curl -s -X GET "$N8N_API_URL/workflows" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" > /dev/null 2>&1; then

        print_success "n8n 连接成功"

        # 检查是否已有 SweetNight 工作流
        WORKFLOW_EXISTS=$(curl -s -X GET "$N8N_API_URL/workflows" \
            -H "X-N8N-API-KEY: $N8N_API_KEY" | \
            grep -c "SweetNight GEO" || true)

        if [ "$WORKFLOW_EXISTS" -eq 0 ]; then
            print_info "首次运行，请手动在 n8n UI 中导入工作流模板"
            print_info "访问: http://localhost:5678"
        else
            print_success "SweetNight GEO 工作流已配置"
        fi
    else
        print_warning "n8n 连接失败，请检查配置"
    fi
else
    print_warning "n8n 未配置，跳过工作流设置"
    print_info "如需使用 n8n，请在 .env.mcp 中配置 N8N_API_KEY"
fi

echo ""

# 8. 健康检查
echo "🏥 步骤 8/8: 执行健康检查..."

sleep 5

# 前端健康检查
if curl -s http://localhost:${FRONTEND_PORT:-5173} > /dev/null; then
    print_success "前端服务健康 (http://localhost:${FRONTEND_PORT:-5173})"
else
    print_error "前端服务未响应"
fi

# 后端健康检查
if curl -s http://localhost:${BACKEND_PORT:-3001}/api > /dev/null; then
    print_success "后端服务健康 (http://localhost:${BACKEND_PORT:-3001})"
else
    print_error "后端服务未响应"
fi

# Firecrawl 健康检查
if curl -s http://localhost:3002/health > /dev/null; then
    print_success "Firecrawl 服务健康 (http://localhost:3002)"
else
    print_warning "Firecrawl 服务未响应"
fi

echo ""
echo "=================================="
echo -e "${GREEN}🎉 启动完成！${NC}"
echo "=================================="
echo ""
echo "📊 访问链接:"
echo "  • LeapGEO7 Dashboard: http://localhost:${FRONTEND_PORT:-5173}"
echo "  • API 文档: http://localhost:${BACKEND_PORT:-3001}/api/docs"
echo "  • Neo4j Browser: http://localhost:7475"
echo "  • MinIO Console: http://localhost:9001"
echo "  • Firecrawl Admin: http://localhost:3002/admin"
echo "  • n8n 工作流: http://localhost:5678"
echo ""
echo "📝 日志文件:"
echo "  • 前端: logs/frontend.log"
echo "  • 后端: logs/backend.log"
echo ""
echo "🛑 停止服务:"
echo "  bash scripts/mcp-stop.sh"
echo ""
echo "📚 查看完整文档:"
echo "  cat MCP-EMPOWERMENT-STRATEGY.md"
echo ""
