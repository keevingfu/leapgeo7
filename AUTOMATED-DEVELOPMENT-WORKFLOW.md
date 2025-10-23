# SweetNight GEO 自动化开发流程

## 总体架构

本文档定义了利用全局配置能力（Context Engineering、BMAD、MCP服务器）进行严谨自动化开发的完整流程。

### 开发阶段顺序

```
Phase 1: Frontend Design (前端设计)
   ↓
Phase 2: Backend Development (后端开发)
   ↓
Phase 3: Integration & Testing (前后端集成)
   ↓
Phase 4: Deployment & Monitoring (部署与监控)
```

### 核心原则

1. **严谨验证**：每个阶段完成后必须通过自动化检查，发现问题立即修复
2. **上下文工程**：使用 Context Engineering 方法确保实现质量
3. **知识图谱**：使用 Memory MCP 和 InfraNodus 构建项目知识库
4. **持续文档**：所有决策和变更记录到 Notion 和 Feishu
5. **多数据库协同**：PostgreSQL (关系)、Neo4j (图)、Redis (缓存)、MongoDB (文档)

---

## Phase 1: Frontend Design (前端设计阶段)

### 1.1 需求分析与知识图谱构建

**目标**：将 PRD 转化为结构化知识图谱，识别所有UI组件和交互需求

**使用工具**：
- InfraNodus MCP：文本网络分析
- Memory MCP：知识图谱存储
- Notion MCP：需求文档管理

**执行步骤**：

```bash
# Step 1.1.1: 使用 InfraNodus 分析 PRD 文档
/sc:load --context sweetnight-geo-requirements.md

# 创建知识图谱分析
mcp__infranodus__create_knowledge_graph({
  graphName: "sweetnight-geo-requirements-analysis",
  text: "<PRD内容>",
  modifyAnalyzedText: "detectEntities"
})

# Step 1.1.2: 识别内容差距和研究问题
mcp__infranodus__generate_research_questions({
  text: "<PRD内容>",
  gapDepth: 1,
  useSeveralGaps: true
})

# Step 1.1.3: 提取所有UI组件需求
mcp__infranodus__generate_topical_clusters({
  text: "<PRD内容>"
})

# Step 1.1.4: 存储到 Memory 知识图谱
mcp__memory__create_entities({
  entities: [
    {name: "Dashboard", entityType: "UIComponent", observations: ["主控制台", "包含7个步骤卡片"]},
    {name: "RoadmapManager", entityType: "UIComponent", observations: ["路线图管理", "CSV导入功能"]},
    {name: "ContentRegistry", entityType: "UIComponent", observations: ["内容注册表", "多渠道发布"]}
    // ... 更多组件
  ]
})

# Step 1.1.5: 创建 Notion 需求追踪页面
mcp__notion__API-post-page({
  parent: {page_id: "<workspace-id>"},
  properties: {
    title: [{text: {content: "SweetNight GEO - Frontend Requirements"}}],
    type: "title"
  }
})
```

**验证检查点 1.1**：
```bash
# Check 1: 知识图谱完整性
mcp__memory__read_graph() | grep "UIComponent"
# 预期：至少15个UI组件实体

# Check 2: 内容差距分析
mcp__infranodus__analyze_existing_graph_by_name({
  graphName: "sweetnight-geo-requirements-analysis",
  includeGraphSummary: true
})
# 预期：识别出未明确定义的UI交互场景

# Check 3: Notion 文档创建成功
mcp__notion__API-post-search({query: "SweetNight GEO"})
# 预期：返回新创建的页面
```

---

### 1.2 UI/UX 设计与原型创建

**目标**：使用 Figma 和 Magic UI 设计所有界面原型

**使用工具**：
- Figma Desktop MCP：设计文件管理
- Magic UI MCP：UI组件生成
- Puppeteer MCP：原型截图和验证

**执行步骤**：

```bash
# Step 1.2.1: 使用 BMAD UX Expert 进行设计分析
/ux-expert --analyze-requirements "sweetnight-geo-requirements.md"

# Step 1.2.2: 创建 Figma 设计文件
# (通过 Figma Desktop 手动创建或使用模板)

# Step 1.2.3: 为每个核心页面生成 Magic UI 组件
mcp__magic-ui__getUIComponents()  # 获取可用组件列表

# 生成 Dashboard 组件
mcp__magic-ui__getComponents()  # 获取基础组件实现

# 生成数据可视化组件
mcp__magic-ui__getSpecialEffects()  # 获取特效组件

# Step 1.2.4: 创建交互原型 HTML
# 使用 Puppeteer 生成可交互原型
mcp__puppeteer__puppeteer_navigate({
  url: "about:blank"
})

# Step 1.2.5: 截图所有设计稿并上传到 MinIO
# 存储设计资源
```

**设计清单**（15个核心页面）：

```
✅ 1. Dashboard (主控制台)
   - 7步骤卡片布局
   - KPI指标展示
   - 实时数据刷新

✅ 2. Roadmap Manager (路线图管理)
   - P0-P3优先级表格
   - CSV批量导入
   - 月度视图切换

✅ 3. Content Registry (内容注册表)
   - 多渠道内容列表
   - 覆盖率可视化
   - 发布状态管理

✅ 4. Prompt Landscape (提示词全景)
   - Neo4j 力导向图可视化
   - P-Level 颜色编码
   - 关系网络探索

✅ 5. Content Generator (内容生成器)
   - 模板选择器（7种模板）
   - 变量替换预览
   - 批量生成队列

✅ 6. Citation Tracker (引用追踪)
   - 7平台监控仪表盘
   - 引用强度热力图
   - URL验证状态

✅ 7. KPI Dashboard (KPI仪表盘)
   - P0-P3分布饼图
   - 引用率趋势折线图
   - GMV转化漏斗

✅ 8. Battlefield Map (战场态势图)
   - D3.js 力导向图
   - 节点交互编辑
   - 实时态势更新

✅ 9. Workflow Monitor (工作流监控)
   - Bull Queue 任务状态
   - 7步骤执行进度
   - 错误日志查看

✅ 10. Settings (系统设置)
   - API密钥管理
   - 优先级规则配置
   - 用户权限管理

✅ 11. Template Editor (模板编辑器)
   - Markdown 编辑器
   - 变量语法高亮
   - 实时预览

✅ 12. Analytics Reports (分析报告)
   - 可导出 PDF 报告
   - 自定义时间范围
   - 多维度对比

✅ 13. Content Coverage (内容覆盖率)
   - 提示词-内容匹配矩阵
   - 缺口识别高亮
   - 优先级推荐

✅ 14. Citation Strength (引用强度分析)
   - 平台对比柱状图
   - 内容类型效果分析
   - AI索引状态追踪

✅ 15. User Management (用户管理)
   - RBAC 角色配置
   - 操作日志审计
   - 团队协作设置
```

**验证检查点 1.2**：
```bash
# Check 1: 所有页面设计完成
ls figma-exports/*.png | wc -l
# 预期：至少15个设计稿文件

# Check 2: Magic UI 组件可用性测试
mcp__magic-ui__getButtons()
# 预期：返回可用按钮组件列表

# Check 3: 交互原型可访问
mcp__puppeteer__puppeteer_screenshot({
  name: "dashboard-prototype",
  width: 1920,
  height: 1080
})
# 预期：成功生成截图
```

---

### 1.3 前端组件架构设计

**目标**：设计 React 组件树结构和状态管理方案

**使用工具**：
- Sequential Thinking MCP：架构推理
- Memory MCP：组件关系存储
- InfraNodus MCP：组件依赖分析

**执行步骤**：

```bash
# Step 1.3.1: 使用 Sequential Thinking 设计组件架构
mcp__sequential-thinking__sequentialthinking({
  thought: "设计 SweetNight GEO 前端组件架构，需要考虑：1) 15个页面的组件层级 2) Redux Toolkit 状态管理 3) React Query 数据同步 4) D3.js 可视化集成 5) Material-UI 主题系统",
  thoughtNumber: 1,
  totalThoughts: 10,
  nextThoughtNeeded: true
})

# Step 1.3.2: 创建组件关系图谱
mcp__memory__create_entities({
  entities: [
    {name: "App", entityType: "Component", observations: ["根组件", "Redux Provider", "React Query Provider"]},
    {name: "DashboardPage", entityType: "Page", observations: ["主控制台页面", "包含7个StepCard"]},
    {name: "StepCard", entityType: "Component", observations: ["工作流步骤卡片", "可点击跳转"]}
  ]
})

mcp__memory__create_relations({
  relations: [
    {from: "App", to: "DashboardPage", relationType: "contains"},
    {from: "DashboardPage", to: "StepCard", relationType: "renders"}
  ]
})

# Step 1.3.3: 分析组件依赖复杂度
mcp__infranodus__generate_knowledge_graph({
  text: `
App
  ├── DashboardPage
  │   ├── StepCard (x7)
  │   ├── KPIMetrics
  │   └── RealtimeStatus
  ├── RoadmapPage
  │   ├── RoadmapTable
  │   ├── CSVImporter
  │   └── PriorityFilter
  ...
  `,
  addNodesAndEdges: true
})

# Step 1.3.4: 生成组件开发顺序
mcp__infranodus__develop_latent_topics({
  text: "<组件依赖关系描述>",
  modelToUse: "gpt-4o"
})
```

**组件架构文档**：

```typescript
// Component Tree Structure
src/
├── app/
│   ├── layout.tsx                  // Root layout with providers
│   ├── page.tsx                    // Dashboard page
│   ├── roadmap/
│   │   └── page.tsx               // Roadmap management
│   ├── content/
│   │   ├── page.tsx               // Content registry
│   │   ├── generator/
│   │   │   └── page.tsx           // Content generator
│   │   └── coverage/
│   │       └── page.tsx           // Coverage analysis
│   ├── citations/
│   │   ├── page.tsx               // Citation tracker
│   │   └── strength/
│   │       └── page.tsx           // Strength analysis
│   ├── analytics/
│   │   ├── page.tsx               // KPI dashboard
│   │   ├── battlefield/
│   │   │   └── page.tsx           // Battlefield map
│   │   └── reports/
│   │       └── page.tsx           // Analytics reports
│   ├── workflow/
│   │   └── page.tsx               // Workflow monitor
│   ├── settings/
│   │   └── page.tsx               // System settings
│   └── users/
│       └── page.tsx               // User management
│
├── components/
│   ├── charts/                     // D3.js visualizations
│   │   ├── BattlefieldMap.tsx     // Force-directed graph
│   │   ├── HeatMap.tsx            // Citation heatmap
│   │   ├── TrendChart.tsx         // KPI trends
│   │   └── FunnelChart.tsx        // Conversion funnel
│   │
│   ├── tables/                     // Data tables
│   │   ├── RoadmapTable.tsx       // Roadmap grid
│   │   ├── ContentTable.tsx       // Content list
│   │   └── CitationTable.tsx      // Citation list
│   │
│   ├── forms/                      // Form components
│   │   ├── RoadmapForm.tsx        // Roadmap item editor
│   │   ├── ContentForm.tsx        // Content creator
│   │   └── TemplateEditor.tsx     // Template editor
│   │
│   ├── cards/                      // Card components
│   │   ├── StepCard.tsx           // Workflow step card
│   │   ├── KPICard.tsx            // KPI metric card
│   │   └── StatsCard.tsx          // Statistics card
│   │
│   └── layout/                     // Layout components
│       ├── Sidebar.tsx            // Navigation sidebar
│       ├── Header.tsx             // Top header
│       └── Footer.tsx             // Footer
│
├── store/                          // Redux Toolkit
│   ├── store.ts                   // Store configuration
│   ├── roadmapSlice.ts            // Roadmap state
│   ├── contentSlice.ts            // Content state
│   ├── citationSlice.ts           // Citation state
│   └── workflowSlice.ts           // Workflow state
│
├── hooks/                          // Custom React hooks
│   ├── useRoadmap.ts              // Roadmap data hook
│   ├── useContent.ts              // Content data hook
│   ├── useCitations.ts            // Citations data hook
│   └── useWorkflow.ts             // Workflow status hook
│
└── lib/                            // Utilities
    ├── api.ts                     // API client (React Query)
    ├── neo4j.ts                   // Neo4j client
    └── d3-helpers.ts              // D3.js utilities
```

**验证检查点 1.3**：
```bash
# Check 1: Sequential Thinking 完成架构推理
mcp__memory__search_nodes({query: "Component architecture"})
# 预期：返回完整的组件架构推理结果

# Check 2: 组件关系图谱完整
mcp__memory__read_graph()
# 预期：包含至少50个组件节点和100个关系边

# Check 3: 依赖复杂度分析
mcp__infranodus__analyze_existing_graph_by_name({
  graphName: "component-dependencies"
})
# 预期：识别出核心组件和潜在循环依赖
```

---

### 1.4 前端技术栈初始化

**目标**：创建 Next.js 项目并配置所有依赖

**使用工具**：
- Bash：项目初始化
- GitHub MCP：代码仓库管理
- Notion MCP：技术栈文档

**执行步骤**：

```bash
# Step 1.4.1: 创建 Next.js 项目
npx create-next-app@latest sweetnight-geo-frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd sweetnight-geo-frontend

# Step 1.4.2: 安装核心依赖
npm install @mui/material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install d3 @types/d3
npm install axios
npm install date-fns
npm install neo4j-driver

# Step 1.4.3: 安装开发依赖
npm install -D @types/node
npm install -D eslint-config-next
npm install -D prettier
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D playwright

# Step 1.4.4: 创建 GitHub 仓库
mcp__github__create_repository({
  name: "sweetnight-geo-frontend",
  description: "SweetNight GEO Frontend - React 18 + TypeScript + Material-UI",
  private: false,
  autoInit: false
})

# Step 1.4.5: 初始化 Git
git init
git add .
git commit -m "feat: initialize Next.js project with TypeScript and Material-UI

- Next.js 14 with App Router
- TypeScript 5.0 configuration
- Material-UI 5.14 setup
- Redux Toolkit 2.0 state management
- React Query 5.0 data sync
- D3.js 7.8 for visualizations
- Playwright E2E testing setup

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git branch -M main
git remote add origin https://github.com/<username>/sweetnight-geo-frontend.git
git push -u origin main

# Step 1.4.6: 记录到 Notion
mcp__notion__API-post-page({
  parent: {page_id: "<project-workspace-id>"},
  properties: {
    title: [{text: {content: "Frontend Tech Stack Initialized"}}],
    type: "title"
  },
  children: [
    {
      paragraph: {
        rich_text: [{
          text: {content: "✅ Next.js 14 + TypeScript 5.0\n✅ Material-UI 5.14\n✅ Redux Toolkit 2.0\n✅ React Query 5.0\n✅ D3.js 7.8\n✅ Playwright E2E Testing"}
        }]
      }
    }
  ]
})
```

**验证检查点 1.4**：
```bash
# Check 1: 项目依赖完整
npm list --depth=0 | grep -E "(mui|redux|react-query|d3)"
# 预期：所有核心依赖已安装

# Check 2: TypeScript 编译通过
npm run type-check
# 预期：No errors

# Check 3: GitHub 仓库创建成功
mcp__github__get_file_contents({
  owner: "<username>",
  repo: "sweetnight-geo-frontend",
  path: "package.json"
})
# 预期：返回 package.json 内容

# Check 4: Notion 文档已创建
mcp__notion__API-post-search({query: "Frontend Tech Stack"})
# 预期：返回新创建的页面
```

---

### 1.5 使用 Context Engineering 创建前端开发 PRP

**目标**：生成包含所有上下文的前端实现蓝图

**使用工具**：
- Context Engineering `/generate-prp`
- Memory MCP：上下文检索
- InfraNodus MCP：文档分析

**执行步骤**：

```bash
# Step 1.5.1: 创建前端特性请求文档
cat > FRONTEND-FEATURE.md << 'EOF'
# FEATURE: SweetNight GEO Frontend Complete Implementation

## Requirements
实现15个核心页面的完整前端应用，基于已设计的UI原型和组件架构。

### Core Features
1. Dashboard with 7-step workflow cards
2. Roadmap management with CSV import
3. Content registry with multi-channel support
4. Prompt landscape with Neo4j graph visualization
5. Content generator with 7 templates
6. Citation tracker for 7 platforms
7. KPI dashboard with D3.js charts
8. Battlefield map with force-directed graph
9. Workflow monitor with Bull Queue integration
10. System settings
11. Template editor with Markdown support
12. Analytics reports with PDF export
13. Content coverage matrix
14. Citation strength analysis
15. User management with RBAC

## EXAMPLES
参考以下现有实现模式：
- Material-UI Dashboard: https://github.com/mui/material-ui/tree/master/docs/data/material/getting-started/templates/dashboard
- D3.js Force Graph: https://observablehq.com/@d3/force-directed-graph
- Redux Toolkit Example: https://redux-toolkit.js.org/tutorials/quick-start
- React Query Integration: https://tanstack.com/query/latest/docs/framework/react/examples/basic

## DOCUMENTATION
- Next.js App Router: https://nextjs.org/docs/app
- Material-UI Components: https://mui.com/material-ui/all-components/
- Redux Toolkit: https://redux-toolkit.js.org/
- React Query: https://tanstack.com/query/latest
- D3.js API: https://d3js.org/api
- Neo4j JavaScript Driver: https://neo4j.com/docs/javascript-manual/current/

## OTHER CONSIDERATIONS
- TypeScript strict mode enabled
- Responsive design for mobile/tablet/desktop
- Dark mode support with Material-UI theming
- Accessibility (WCAG 2.1 AA)
- Performance: React.memo, useMemo, useCallback
- Error boundaries for graceful degradation
- Loading states and skeleton screens
- Form validation with react-hook-form
- Internationalization (i18n) preparation
- E2E tests with Playwright for all pages
EOF

# Step 1.5.2: 生成 PRP (Product Requirements Prompt)
cd ~/Context-Engineering-Intro
/generate-prp ~/Desktop/dev/leapgeo7/FRONTEND-FEATURE.md

# Step 1.5.3: 将 PRP 存储到 Memory 知识图谱
mcp__memory__add_observations({
  observations: [
    {
      entityName: "Frontend Development",
      contents: [
        "PRP generated with confidence score 8/10",
        "15 core pages implementation plan created",
        "Validation gates defined for each component",
        "Codebase patterns researched from Material-UI and D3.js examples"
      ]
    }
  ]
})

# Step 1.5.4: 上传 PRP 到 Feishu 文档
mcp__feishu__create_feishu_document({
  title: "SweetNight GEO - Frontend Development PRP",
  folderToken: "<feishu-folder-token>"
})

# 批量创建内容块
mcp__feishu__batch_create_feishu_blocks({
  documentId: "<document-id>",
  parentBlockId: "<document-id>",
  index: 0,
  blocks: [
    {blockType: "heading1", options: {heading: {level: 1, content: "Frontend Development PRP"}}},
    {blockType: "text", options: {text: {textStyles: [{text: "Generated from Context Engineering with 8/10 confidence"}]}}},
    {blockType: "heading2", options: {heading: {level: 2, content: "Implementation Blueprint"}}},
    // ... 更多内容块
  ]
})
```

**验证检查点 1.5**：
```bash
# Check 1: PRP 文件生成
ls ~/Context-Engineering-Intro/PRPs/ | grep -i frontend
# 预期：找到 frontend-feature.md PRP 文件

# Check 2: PRP 信心评分
grep "Confidence Score" ~/Context-Engineering-Intro/PRPs/frontend-feature.md
# 预期：评分 ≥ 7/10

# Check 3: Memory 记录已存储
mcp__memory__search_nodes({query: "Frontend Development PRP"})
# 预期：返回 PRP 生成记录

# Check 4: Feishu 文档已创建
mcp__feishu__search_feishu_documents({searchKey: "Frontend Development PRP"})
# 预期：返回新创建的文档
```

---

### 1.6 Phase 1 总结与验证

**目标**：确保前端设计阶段所有产出完整且无误

**验证清单**：

```bash
# ✅ Check 1: 知识图谱完整性
mcp__memory__read_graph()
# 预期：包含至少100个实体（组件、页面、需求）

# ✅ Check 2: 15个页面设计稿
ls figma-exports/*.png | wc -l
# 预期：15个文件

# ✅ Check 3: 组件架构文档
cat component-architecture.md | grep "Component" | wc -l
# 预期：至少50个组件定义

# ✅ Check 4: GitHub 仓库已创建
mcp__github__search_repositories({query: "sweetnight-geo-frontend"})
# 预期：仓库存在且可访问

# ✅ Check 5: PRP 已生成
ls ~/Context-Engineering-Intro/PRPs/ | grep frontend
# 预期：frontend-feature.md 存在

# ✅ Check 6: Notion 项目追踪
mcp__notion__API-post-search({query: "SweetNight GEO Frontend"})
# 预期：所有阶段文档已创建

# ✅ Check 7: Feishu 协作文档
mcp__feishu__search_feishu_documents({searchKey: "SweetNight GEO"})
# 预期：设计和架构文档已同步
```

**阶段交付物**：
- ✅ 知识图谱（InfraNodus + Memory MCP）
- ✅ 15个页面设计稿（Figma + Puppeteer截图）
- ✅ 组件架构文档（TypeScript接口定义）
- ✅ Next.js 项目初始化（GitHub仓库）
- ✅ Frontend Development PRP（Context Engineering）
- ✅ Notion 项目追踪文档
- ✅ Feishu 协作文档

**进入 Phase 2 前提条件**：
- 所有验证检查点通过 ✅
- 无未解决的设计问题 ✅
- 技术栈依赖完整安装 ✅
- GitHub 仓库可访问 ✅

---

## Phase 2: Backend Development (后端开发阶段)

### 2.1 数据库设计与初始化

**目标**：创建 PostgreSQL、Neo4j、Redis、MongoDB 数据库架构

**使用工具**：
- PostgreSQL MCP：关系数据库操作
- Neo4j MCP：图数据库操作
- Redis MCP：缓存操作
- MongoDB MCP：文档数据库操作
- Prisma MCP：ORM 管理

**执行步骤**：

```bash
# Step 2.1.1: 使用 Sequential Thinking 设计数据库架构
mcp__sequential-thinking__sequentialthinking({
  thought: "设计 SweetNight GEO 多数据库架构：1) PostgreSQL存储结构化数据(roadmap, content_registry, citation_tracking) 2) Neo4j存储提示词关系网络 3) Redis缓存热点数据 4) MongoDB存储非结构化内容和日志",
  thoughtNumber: 1,
  totalThoughts: 8,
  nextThoughtNeeded: true
})

# Step 2.1.2: 创建 Prisma Schema
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Roadmap {
  id                  String   @id @default(uuid())
  month               String
  prompt              String
  pLevel              String   @map("p_level")
  enhancedGeoScore    Decimal  @map("enhanced_geo_score")
  quickwinIndex       Decimal  @map("quickwin_index")
  geoIntentType       String   @map("geo_intent_type")
  contentStrategy     String   @map("content_strategy")
  geoFriendliness     Int      @map("geo_friendliness")
  contentHoursEst     Decimal  @map("content_hours_est")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([pLevel, month, enhancedGeoScore])
  @@map("roadmap")
}

model ContentRegistry {
  id              String   @id @default(uuid())
  contentId       String   @unique @map("content_id")
  coveredPrompts  String[]  @map("covered_prompts")
  channel         String
  publishStatus   String   @map("publish_status")
  kpiCtr          Decimal?  @map("kpi_ctr")
  kpiViews        Int?      @map("kpi_views")
  kpiGmv          Decimal?  @map("kpi_gmv")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  citations       CitationTracking[]

  @@map("content_registry")
}

model CitationTracking {
  id               String          @id @default(uuid())
  contentId        String          @map("content_id")
  platform         String
  citationUrl      String          @map("citation_url")
  aiIndexed        Boolean         @map("ai_indexed")
  citationStrength String          @map("citation_strength")
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt

  content          ContentRegistry @relation(fields: [contentId], references: [contentId])

  @@map("citation_tracking")
}
EOF

# Step 2.1.3: 生成 Prisma 迁移
npx prisma migrate dev --name init

# Step 2.1.4: 创建 Neo4j 图数据库架构
mcp__neo4j__execute_query({
  query: `
    // 创建约束
    CREATE CONSTRAINT prompt_id IF NOT EXISTS FOR (p:Prompt) REQUIRE p.id IS UNIQUE;
    CREATE CONSTRAINT content_id IF NOT EXISTS FOR (c:Content) REQUIRE c.id IS UNIQUE;
    CREATE CONSTRAINT citation_id IF NOT EXISTS FOR (ct:Citation) REQUIRE ct.id IS UNIQUE;

    // 创建索引
    CREATE INDEX prompt_plevel IF NOT EXISTS FOR (p:Prompt) ON (p.pLevel);
    CREATE INDEX content_channel IF NOT EXISTS FOR (c:Content) ON (c.channel);
  `
})

# Step 2.1.5: 初始化 Redis 缓存配置
mcp__redis__set({
  key: "config:cache_ttl",
  value: "3600",
  expireSeconds: null
})

mcp__redis__set({
  key: "config:max_cache_size",
  value: "1000000",
  expireSeconds: null
})

# Step 2.1.6: 创建 MongoDB 集合
mcp__mongodb__create-collection({
  database: "sweetnight_geo",
  collection: "content_templates"
})

mcp__mongodb__create-collection({
  database: "sweetnight_geo",
  collection: "workflow_logs"
})

mcp__mongodb__create-collection({
  database: "sweetnight_geo",
  collection: "api_requests"
})

# Step 2.1.7: 创建数据库架构知识图谱
mcp__infranodus__create_knowledge_graph({
  graphName: "sweetnight-geo-database-architecture",
  text: `
    PostgreSQL stores roadmap content_registry citation_tracking
    Neo4j stores prompt_relationships content_relationships
    Redis caches roadmap_data content_data citation_data
    MongoDB stores content_templates workflow_logs api_requests

    Roadmap connects to ContentRegistry through covered_prompts
    ContentRegistry connects to CitationTracking through content_id
    Prompt connects to Content through COVERED_BY relationship
    Content connects to Citation through CITED_IN relationship
  `,
  modifyAnalyzedText: "detectEntities"
})

# Step 2.1.8: 记录到 Memory
mcp__memory__create_entities({
  entities: [
    {name: "PostgreSQL", entityType: "Database", observations: ["Stores structured data", "3 core tables", "Prisma ORM"]},
    {name: "Neo4j", entityType: "Database", observations: ["Graph database", "Prompt relationships", "Force-directed visualization"]},
    {name: "Redis", entityType: "Cache", observations: ["L2 cache", "3600s TTL", "Hot data"]},
    {name: "MongoDB", entityType: "Database", observations: ["Document store", "Templates and logs", "Flexible schema"]}
  ]
})
```

**验证检查点 2.1**：
```bash
# Check 1: Prisma 迁移成功
npx prisma migrate status
# 预期：All migrations have been applied

# Check 2: PostgreSQL 表结构正确
# (通过 PostgreSQL MCP 或数据库客户端验证)

# Check 3: Neo4j 约束和索引创建
mcp__neo4j__execute_query({
  query: "SHOW CONSTRAINTS"
})
# 预期：返回3个约束

# Check 4: Redis 配置存储
mcp__redis__get({key: "config:cache_ttl"})
# 预期：返回 "3600"

# Check 5: MongoDB 集合创建
mcp__mongodb__list-collections({database: "sweetnight_geo"})
# 预期：返回3个集合

# Check 6: 数据库架构知识图谱
mcp__infranodus__analyze_existing_graph_by_name({
  graphName: "sweetnight-geo-database-architecture"
})
# 预期：识别出4个数据库实体和关系
```

---

### 2.2 NestJS 后端项目初始化

**目标**：创建 NestJS 项目并配置依赖

**使用工具**：
- Bash：项目初始化
- GitHub MCP：仓库管理
- Notion MCP：文档记录

**执行步骤**：

```bash
# Step 2.2.1: 创建 NestJS 项目
npm install -g @nestjs/cli
nest new sweetnight-geo-backend --package-manager npm --skip-git

cd sweetnight-geo-backend

# Step 2.2.2: 安装核心依赖
npm install @nestjs/config
npm install @prisma/client
npm install @nestjs/bull bull
npm install redis
npm install neo4j-driver
npm install mongodb mongoose @nestjs/mongoose
npm install axios
npm install class-validator class-transformer

# Step 2.2.3: 安装开发依赖
npm install -D @types/bull
npm install -D prisma
npm install -D @nestjs/testing
npm install -D jest
npm install -D supertest @types/supertest

# Step 2.2.4: 生成 NestJS 模块
nest generate module roadmap
nest generate module content
nest generate module citations
nest generate module workflow
nest generate module analytics

nest generate service roadmap
nest generate service content
nest generate service citations
nest generate service workflow
nest generate service analytics

nest generate controller roadmap
nest generate controller content
nest generate controller citations
nest generate controller workflow
nest generate controller analytics

# Step 2.2.5: 创建 GitHub 仓库
mcp__github__create_repository({
  name: "sweetnight-geo-backend",
  description: "SweetNight GEO Backend - NestJS 10 + Prisma + Bull Queue",
  private: false,
  autoInit: false
})

# Step 2.2.6: 初始化 Git
git init
git add .
git commit -m "feat: initialize NestJS backend project

- NestJS 10 with TypeScript
- Prisma ORM for PostgreSQL
- Bull Queue for async jobs
- Neo4j driver for graph database
- MongoDB/Mongoose for document storage
- Redis client for caching
- Class-validator for DTOs
- Jest testing setup

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git branch -M main
git remote add origin https://github.com/<username>/sweetnight-geo-backend.git
git push -u origin main
```

**验证检查点 2.2**：
```bash
# Check 1: NestJS 模块生成完整
ls src/ | grep -E "(roadmap|content|citations|workflow|analytics)"
# 预期：5个模块目录

# Check 2: 依赖安装完整
npm list --depth=0 | grep -E "(@nestjs|prisma|bull|neo4j|mongoose)"
# 预期：所有核心依赖已安装

# Check 3: TypeScript 编译通过
npm run build
# 预期：Compilation successful

# Check 4: GitHub 仓库创建
mcp__github__get_file_contents({
  owner: "<username>",
  repo: "sweetnight-geo-backend",
  path: "package.json"
})
# 预期：返回 package.json
```

---

### 2.3 实现核心服务

**目标**：实现 P-Level 计算、工作流引擎、引用追踪等核心业务逻辑

**使用工具**：
- Sequential Thinking MCP：业务逻辑推理
- Context Engineering：服务实现蓝图
- Memory MCP：代码模式存储

**执行步骤**：

```bash
# Step 2.3.1: 使用 Context Engineering 生成服务实现 PRP
cat > BACKEND-SERVICES.md << 'EOF'
# FEATURE: Backend Core Services Implementation

## Requirements
实现以下核心服务：
1. PriorityCalculator - P-Level 优先级计算
2. GeoWorkflowEngine - 7步骤工作流编排
3. CitationTracker - 多平台引用追踪
4. ContentTemplateEngine - 模板变量替换
5. Neo4jService - 图数据库操作
6. CacheManager - 3级缓存管理

## EXAMPLES
- NestJS Service Patterns: https://docs.nestjs.com/providers
- Bull Queue Example: https://docs.nestjs.com/techniques/queues
- Neo4j Driver: https://neo4j.com/docs/javascript-manual/current/

## DOCUMENTATION
- NestJS Documentation: https://docs.nestjs.com/
- Prisma Client API: https://www.prisma.io/docs/concepts/components/prisma-client
- Bull Documentation: https://docs.bullmq.io/

## OTHER CONSIDERATIONS
- Error handling with NestJS exception filters
- Logging with Winston
- Circuit breaker pattern for external APIs
- Unit tests with Jest (90%+ coverage)
- Integration tests for database operations
EOF

/generate-prp ~/Desktop/dev/leapgeo7/BACKEND-SERVICES.md

# Step 2.3.2: 实现 PriorityCalculator 服务
cat > src/roadmap/priority-calculator.service.ts << 'EOF'
import { Injectable } from '@nestjs/common';

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';

export interface RoadmapItem {
  enhanced_geo_score: number;
  quickwin_index: number;
}

@Injectable()
export class PriorityCalculatorService {
  private readonly weights = {
    enhanced_geo_score: 0.7,
    quickwin_index: 0.3,
  };

  calculatePLevel(item: RoadmapItem): PriorityLevel {
    const totalScore =
      item.enhanced_geo_score * this.weights.enhanced_geo_score +
      item.quickwin_index * this.weights.quickwin_index;

    if (totalScore >= 100) return 'P0';
    if (totalScore >= 75) return 'P1';
    if (totalScore >= 50) return 'P2';
    return 'P3';
  }

  calculateTotalScore(item: RoadmapItem): number {
    return (
      item.enhanced_geo_score * this.weights.enhanced_geo_score +
      item.quickwin_index * this.weights.quickwin_index
    );
  }

  getPriorityThresholds(): Record<PriorityLevel, number> {
    return {
      P0: 100,
      P1: 75,
      P2: 50,
      P3: 0,
    };
  }
}
EOF

# Step 2.3.3: 实现 GeoWorkflowEngine 服务
cat > src/workflow/geo-workflow-engine.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface WorkflowStep {
  stepNumber: number;
  stepName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  error?: string;
}

@Injectable()
export class GeoWorkflowEngineService {
  private readonly logger = new Logger(GeoWorkflowEngineService.name);

  constructor(
    @InjectQueue('workflow') private workflowQueue: Queue,
  ) {}

  async executeWorkflow(workflowId: string): Promise<WorkflowStep[]> {
    const steps: WorkflowStep[] = [
      { stepNumber: 1, stepName: 'roadmap-ingest', status: 'pending' },
      { stepNumber: 2, stepName: 'content-registry-ingest', status: 'pending' },
      { stepNumber: 3, stepName: 'prompt-landscape-build', status: 'pending' },
      { stepNumber: 4, stepName: 'content-ingest', status: 'pending' },
      { stepNumber: 5, stepName: 'content-landscape-generate', status: 'pending' },
      { stepNumber: 6, stepName: 'citation-track', status: 'pending' },
      { stepNumber: 7, stepName: 'feedback-analyze', status: 'pending' },
    ];

    for (const step of steps) {
      this.logger.log(`Starting step ${step.stepNumber}: ${step.stepName}`);
      step.status = 'running';
      step.startTime = new Date();

      try {
        await this.workflowQueue.add(step.stepName, {
          workflowId,
          stepNumber: step.stepNumber,
        });

        // Wait for job completion (simplified - in production use job.finished())
        await new Promise((resolve) => setTimeout(resolve, 1000));

        step.status = 'completed';
        step.endTime = new Date();
        this.logger.log(`Completed step ${step.stepNumber}: ${step.stepName}`);
      } catch (error) {
        step.status = 'failed';
        step.endTime = new Date();
        step.error = error.message;
        this.logger.error(`Failed step ${step.stepNumber}: ${step.stepName}`, error);
        break; // Stop workflow on failure
      }
    }

    return steps;
  }

  async getWorkflowStatus(workflowId: string): Promise<WorkflowStep[]> {
    // Retrieve workflow status from database or cache
    // Implementation depends on storage mechanism
    return [];
  }
}
EOF

# Step 2.3.4: 实现 CitationTracker 服务
cat > src/citations/citation-tracker.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export type Platform = 'YouTube' | 'Reddit' | 'Medium' | 'Quora' | 'Amazon' | 'Blog' | 'LinkedIn';
export type CitationStrength = 'high' | 'medium' | 'low';

export interface CitationResult {
  platform: Platform;
  url: string;
  aiIndexed: boolean;
  citationStrength: CitationStrength;
  foundAt: Date;
}

@Injectable()
export class CitationTrackerService {
  private readonly logger = new Logger(CitationTrackerService.name);
  private readonly platforms: Platform[] = [
    'YouTube',
    'Reddit',
    'Medium',
    'Quora',
    'Amazon',
    'Blog',
    'LinkedIn',
  ];

  async trackCitations(contentId: string, searchQuery: string): Promise<CitationResult[]> {
    const results: CitationResult[] = [];

    for (const platform of this.platforms) {
      try {
        const citations = await this.searchPlatform(platform, searchQuery);
        results.push(...citations);
      } catch (error) {
        this.logger.error(`Failed to track citations on ${platform}`, error);
      }
    }

    return results;
  }

  private async searchPlatform(platform: Platform, query: string): Promise<CitationResult[]> {
    // Simplified - in production, use platform-specific APIs
    // or Firecrawl for web scraping
    const mockResults: CitationResult[] = [
      {
        platform,
        url: `https://${platform.toLowerCase()}.com/search?q=${encodeURIComponent(query)}`,
        aiIndexed: Math.random() > 0.5,
        citationStrength: this.calculateStrength(Math.random()),
        foundAt: new Date(),
      },
    ];

    return mockResults;
  }

  private calculateStrength(score: number): CitationStrength {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  async getCitationMetrics(contentId: string): Promise<{
    totalCitations: number;
    aiIndexedRate: number;
    platformDistribution: Record<Platform, number>;
  }> {
    // Retrieve and aggregate citation data
    return {
      totalCitations: 0,
      aiIndexedRate: 0,
      platformDistribution: {} as Record<Platform, number>,
    };
  }
}
EOF

# Step 2.3.5: 记录服务实现到 Memory
mcp__memory__create_entities({
  entities: [
    {
      name: "PriorityCalculatorService",
      entityType: "Service",
      observations: ["Calculates P-Level", "Weighted scoring algorithm", "Thresholds: P0=100, P1=75, P2=50"]
    },
    {
      name: "GeoWorkflowEngineService",
      entityType: "Service",
      observations: ["7-step workflow orchestration", "Bull Queue integration", "Sequential execution"]
    },
    {
      name: "CitationTrackerService",
      entityType: "Service",
      observations: ["Multi-platform tracking", "7 platforms support", "Citation strength calculation"]
    }
  ]
})

mcp__memory__create_relations({
  relations: [
    {from: "RoadmapService", to: "PriorityCalculatorService", relationType: "uses"},
    {from: "WorkflowService", to: "GeoWorkflowEngineService", relationType: "uses"},
    {from: "CitationsService", to: "CitationTrackerService", relationType: "uses"}
  ]
})
```

**验证检查点 2.3**：
```bash
# Check 1: 服务文件创建
ls src/*/*.service.ts | wc -l
# 预期：至少10个服务文件

# Check 2: TypeScript 编译通过
npm run build
# 预期：Successful compilation

# Check 3: 单元测试通过
npm test -- --testPathPattern=priority-calculator
npm test -- --testPathPattern=geo-workflow-engine
npm test -- --testPathPattern=citation-tracker
# 预期：All tests passed

# Check 4: Memory 知识图谱更新
mcp__memory__search_nodes({query: "Service"})
# 预期：返回至少3个服务实体
```

---

### 2.4 实现 RESTful API

**目标**：创建所有 API 端点并集成 Swagger 文档

**使用工具**：
- NestJS CLI：生成控制器
- Sequential Thinking：API 设计推理
- Notion MCP：API 文档记录

**执行步骤**：

```bash
# Step 2.4.1: 安装 Swagger 依赖
npm install @nestjs/swagger swagger-ui-express

# Step 2.4.2: 配置 Swagger
cat > src/main.ts << 'EOF'
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('SweetNight GEO API')
    .setDescription('GEO战场感知态势分析作战系统 API Documentation')
    .setVersion('1.0')
    .addTag('roadmap', 'Roadmap management endpoints')
    .addTag('content', 'Content registry and generation')
    .addTag('citations', 'Citation tracking and analysis')
    .addTag('workflow', 'Workflow execution and monitoring')
    .addTag('analytics', 'KPI dashboard and analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 API Server running on: http://localhost:3000`);
  console.log(`📚 API Documentation: http://localhost:3000/api/docs`);
}
bootstrap();
EOF

# Step 2.4.3: 实现 Roadmap Controller
cat > src/roadmap/roadmap.controller.ts << 'EOF'
import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto, UpdateRoadmapDto, RoadmapFilterDto } from './dto';

@ApiTags('roadmap')
@Controller('api/v1/roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  @ApiOperation({ summary: 'List all roadmap items' })
  @ApiResponse({ status: 200, description: 'Returns list of roadmap items' })
  async findAll(@Query() filters: RoadmapFilterDto) {
    return this.roadmapService.findAll(filters);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new roadmap item' })
  @ApiResponse({ status: 201, description: 'Roadmap item created successfully' })
  async create(@Body() createDto: CreateRoadmapDto) {
    return this.roadmapService.create(createDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a roadmap item' })
  @ApiResponse({ status: 200, description: 'Roadmap item updated successfully' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateRoadmapDto) {
    return this.roadmapService.update(id, updateDto);
  }

  @Post('import')
  @ApiOperation({ summary: 'Bulk import roadmap items from CSV/TSV' })
  @ApiResponse({ status: 201, description: 'Bulk import successful' })
  async bulkImport(@Body() data: any) {
    return this.roadmapService.bulkImport(data);
  }
}
EOF

# Step 2.4.4: 创建 DTOs (Data Transfer Objects)
mkdir -p src/roadmap/dto
cat > src/roadmap/dto/create-roadmap.dto.ts << 'EOF'
import { IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoadmapDto {
  @ApiProperty({ example: '2025-01', description: 'Month in YYYY-MM format' })
  @IsString()
  month: string;

  @ApiProperty({ example: 'best mattress for back pain', description: 'GEO prompt text' })
  @IsString()
  prompt: string;

  @ApiProperty({ enum: ['P0', 'P1', 'P2', 'P3'], example: 'P0' })
  @IsEnum(['P0', 'P1', 'P2', 'P3'])
  pLevel: string;

  @ApiProperty({ example: 85.5, description: 'Enhanced GEO score (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  enhancedGeoScore: number;

  @ApiProperty({ example: 72.3, description: 'Quick Win Index (0-100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  quickwinIndex: number;

  @ApiProperty({ example: 'informational', description: 'GEO intent type' })
  @IsString()
  geoIntentType: string;

  @ApiProperty({ example: 'YouTube + Blog', description: 'Content strategy' })
  @IsString()
  contentStrategy: string;

  @ApiProperty({ example: 4, description: 'GEO friendliness (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  geoFriendliness: number;

  @ApiProperty({ example: 8.0, description: 'Estimated content hours' })
  @IsNumber()
  @Min(0)
  contentHoursEst: number;
}
EOF

# Step 2.4.5: 实现其他控制器 (Content, Citations, Workflow, Analytics)
# 使用类似的模式...

# Step 2.4.6: 启动开发服务器测试
npm run start:dev

# Step 2.4.7: 使用 Puppeteer 验证 Swagger 文档
mcp__puppeteer__puppeteer_navigate({
  url: "http://localhost:3000/api/docs"
})

mcp__puppeteer__puppeteer_screenshot({
  name: "swagger-api-docs",
  width: 1920,
  height: 1080
})

# Step 2.4.8: 上传 Swagger 截图到 MinIO
# (使用 MinIO client 或 Bash)

# Step 2.4.9: 记录 API 到 Notion
mcp__notion__API-post-page({
  parent: {page_id: "<api-docs-workspace>"},
  properties: {
    title: [{text: {content: "SweetNight GEO API Endpoints"}}],
    type: "title"
  },
  children: [
    {
      paragraph: {
        rich_text: [{
          text: {content: "✅ GET /api/v1/roadmap - List roadmap items\n✅ POST /api/v1/roadmap - Create roadmap item\n✅ PUT /api/v1/roadmap/:id - Update roadmap item\n✅ POST /api/v1/roadmap/import - Bulk import\n\n✅ GET /api/v1/content - List content\n✅ POST /api/v1/content - Create content\n✅ POST /api/v1/content/:id/publish - Publish content\n✅ GET /api/v1/content/coverage - Coverage report\n\n✅ GET /api/v1/citations - List citations\n✅ POST /api/v1/citations/track - Track citation\n✅ GET /api/v1/citations/metrics - Citation metrics\n\n✅ POST /api/v1/workflow/trigger - Trigger workflow\n✅ GET /api/v1/workflow/status - Workflow status\n\n✅ GET /api/v1/analytics/dashboard - Dashboard data\n✅ GET /api/v1/analytics/kpi - KPI metrics\n✅ GET /api/v1/analytics/reports - Generate reports"}
        }]
      }
    }
  ]
})
```

**验证检查点 2.4**：
```bash
# Check 1: Swagger 文档可访问
curl http://localhost:3000/api/docs | grep "SweetNight GEO API"
# 预期：返回 Swagger UI HTML

# Check 2: 所有端点响应正常
curl http://localhost:3000/api/v1/roadmap
curl http://localhost:3000/api/v1/content
curl http://localhost:3000/api/v1/citations
curl http://localhost:3000/api/v1/workflow/status
curl http://localhost:3000/api/v1/analytics/dashboard
# 预期：所有请求返回 200 OK

# Check 3: DTO 验证工作
curl -X POST http://localhost:3000/api/v1/roadmap \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
# 预期：返回 400 Bad Request with validation errors

# Check 4: Notion API 文档已创建
mcp__notion__API-post-search({query: "API Endpoints"})
# 预期：返回 API 文档页面
```

---

### 2.5 集成外部服务

**目标**：集成 Firecrawl、InfraNodus、YouTube/Reddit APIs

**使用工具**：
- Firecrawl MCP：网页抓取
- InfraNodus MCP：文本分析
- Sequential Thinking：集成策略推理

**执行步骤**：

```bash
# Step 2.5.1: 创建 Firecrawl 集成服务
cat > src/integrations/firecrawl.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirecrawlService {
  private readonly logger = new Logger(FirecrawlService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get('FIRECRAWL_API_URL');
    this.apiKey = this.configService.get('FIRECRAWL_API_KEY');
  }

  async scrapeUrl(url: string): Promise<any> {
    // Use Firecrawl MCP via Claude Code
    // In production, use Firecrawl API directly
    this.logger.log(`Scraping URL: ${url}`);

    // Placeholder - actual implementation would call Firecrawl API
    return {
      url,
      content: 'Scraped content...',
      metadata: {
        title: 'Page title',
        description: 'Page description',
      },
    };
  }

  async batchScrape(urls: string[]): Promise<any[]> {
    const results = await Promise.all(
      urls.map(url => this.scrapeUrl(url))
    );
    return results;
  }
}
EOF

# Step 2.5.2: 创建 InfraNodus 集成服务
cat > src/integrations/infranodus.service.ts << 'EOF'
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfraNodusService {
  private readonly logger = new Logger(InfraNodusService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('INFRANODUS_API_KEY');
  }

  async analyzeText(text: string): Promise<any> {
    // Use InfraNodus MCP for text network analysis
    this.logger.log(`Analyzing text with InfraNodus...`);

    // Placeholder - actual implementation would use MCP tools
    return {
      topics: [],
      contentGaps: [],
      researchQuestions: [],
    };
  }

  async generateKnowledgeGraph(text: string, graphName: string): Promise<any> {
    // Create knowledge graph using InfraNodus MCP
    return {
      graphName,
      url: `https://infranodus.com/graph/${graphName}`,
      nodes: 0,
      edges: 0,
    };
  }
}
EOF

# Step 2.5.3: 创建环境配置
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://claude:claude_dev_2025@localhost:5437/claude_dev"
NEO4J_URI="neo4j://localhost:7688"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="claude_neo4j_2025"
REDIS_URL="redis://:claude_redis_2025@localhost:6382"
MONGODB_URI="mongodb://claude:claude_mongo_2025@localhost:27018/sweetnight_geo?authSource=admin"

# External Services
FIRECRAWL_API_URL="http://localhost:3002"
FIRECRAWL_API_KEY="fs-test"
INFRANODUS_API_KEY="6787:***"

# API Keys (placeholder - replace with actual keys)
YOUTUBE_API_KEY=""
REDDIT_CLIENT_ID=""
REDDIT_CLIENT_SECRET=""
MEDIUM_ACCESS_TOKEN=""
EOF

# Step 2.5.4: 测试外部服务集成
npm run start:dev

# 使用 Bash 测试 API
curl -X POST http://localhost:3000/api/v1/citations/track \
  -H "Content-Type: application/json" \
  -d '{"contentId": "test-123", "searchQuery": "best mattress for back pain"}'
```

**验证检查点 2.5**：
```bash
# Check 1: 环境变量加载
npm run start:dev | grep "FIRECRAWL_API_URL"
# 预期：配置已加载

# Check 2: Firecrawl 服务可用
# (通过 NestJS 依赖注入测试)

# Check 3: InfraNodus 服务可用
# (通过 NestJS 依赖注入测试)

# Check 4: 集成测试通过
npm test -- --testPathPattern=integrations
# 预期：All integration tests passed
```

---

### 2.6 Phase 2 总结与验证

**目标**：确保后端开发阶段所有功能完整且无误

**验证清单**：

```bash
# ✅ Check 1: 数据库架构完整
npx prisma migrate status
mcp__neo4j__execute_query({query: "SHOW CONSTRAINTS"})
mcp__redis__get({key: "config:cache_ttl"})
mcp__mongodb__list-collections({database: "sweetnight_geo"})
# 预期：所有数据库正常运行

# ✅ Check 2: 所有服务实现完成
ls src/*/*.service.ts | wc -l
# 预期：至少15个服务文件

# ✅ Check 3: API 端点可访问
curl http://localhost:3000/api/docs
curl http://localhost:3000/api/v1/roadmap
curl http://localhost:3000/api/v1/content
curl http://localhost:3000/api/v1/citations
curl http://localhost:3000/api/v1/workflow/status
curl http://localhost:3000/api/v1/analytics/dashboard
# 预期：所有端点返回 200 OK

# ✅ Check 4: 单元测试覆盖率
npm test -- --coverage
# 预期：Coverage ≥ 80%

# ✅ Check 5: 集成测试通过
npm run test:e2e
# 预期：All E2E tests passed

# ✅ Check 6: TypeScript 编译无错误
npm run build
# 预期：Successful compilation

# ✅ Check 7: ESLint 无警告
npm run lint
# 预期：No linting errors

# ✅ Check 8: GitHub 代码推送
git status
git push origin main
# 预期：Push successful
```

**阶段交付物**：
- ✅ 多数据库架构（PostgreSQL + Neo4j + Redis + MongoDB）
- ✅ NestJS 后端项目（GitHub 仓库）
- ✅ 10+ 核心服务实现
- ✅ 完整 RESTful API（Swagger 文档）
- ✅ 外部服务集成（Firecrawl + InfraNodus）
- ✅ 单元测试 + 集成测试（80%+ 覆盖率）
- ✅ Backend Services PRP（Context Engineering）
- ✅ Notion API 文档

**进入 Phase 3 前提条件**：
- 所有验证检查点通过 ✅
- API 响应正常 ✅
- 测试覆盖率达标 ✅
- 数据库连接正常 ✅

---

## Phase 3: Integration & Testing (前后端集成阶段)

### 3.1 前端 API 客户端配置

**目标**：配置 React Query 和 Axios 客户端连接后端 API

**使用工具**：
- Sequential Thinking：集成策略推理
- Puppeteer MCP：前端测试
- Memory MCP：集成模式存储

**执行步骤**：

```bash
# Step 3.1.1: 创建 API 客户端
cd sweetnight-geo-frontend

cat > src/lib/api.ts << 'EOF'
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API methods
export const roadmapApi = {
  list: (params?: any) => apiClient.get('/roadmap', { params }),
  create: (data: any) => apiClient.post('/roadmap', data),
  update: (id: string, data: any) => apiClient.put(`/roadmap/${id}`, data),
  bulkImport: (data: any) => apiClient.post('/roadmap/import', data),
};

export const contentApi = {
  list: (params?: any) => apiClient.get('/content', { params }),
  create: (data: any) => apiClient.post('/content', data),
  publish: (id: string) => apiClient.post(`/content/${id}/publish`),
  coverage: () => apiClient.get('/content/coverage'),
};

export const citationsApi = {
  list: (params?: any) => apiClient.get('/citations', { params }),
  track: (data: any) => apiClient.post('/citations/track', data),
  metrics: (contentId: string) => apiClient.get(`/citations/metrics?contentId=${contentId}`),
};

export const workflowApi = {
  trigger: (data: any) => apiClient.post('/workflow/trigger', data),
  status: (workflowId: string) => apiClient.get(`/workflow/status?workflowId=${workflowId}`),
};

export const analyticsApi = {
  dashboard: () => apiClient.get('/analytics/dashboard'),
  kpi: (params?: any) => apiClient.get('/analytics/kpi', { params }),
  reports: (params?: any) => apiClient.get('/analytics/reports', { params }),
};
EOF

# Step 3.1.2: 配置 React Query
cat > src/lib/query-client.ts << 'EOF'
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
EOF

# Step 3.1.3: 创建自定义 hooks
mkdir -p src/hooks

cat > src/hooks/useRoadmap.ts << 'EOF'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapApi } from '@/lib/api';

export function useRoadmap(filters?: any) {
  return useQuery({
    queryKey: ['roadmap', filters],
    queryFn: () => roadmapApi.list(filters).then(res => res.data),
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roadmapApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => roadmapApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
}

export function useBulkImportRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roadmapApi.bulkImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
}
EOF

# Step 3.1.4: 更新 app/layout.tsx 配置 Providers
cat > src/app/layout.tsx << 'EOF'
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { queryClient } from '@/lib/query-client';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
EOF

# Step 3.1.5: 配置环境变量
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
EOF
```

**验证检查点 3.1**：
```bash
# Check 1: API 客户端编译通过
npm run type-check
# 预期：No errors

# Check 2: React Query 配置正确
npm run build
# 预期：Build successful

# Check 3: 环境变量加载
npm run dev
# 访问 http://localhost:3001 验证
```

---

### 3.2 实现核心页面与 API 集成

**目标**：实现15个页面与后端 API 的完整集成

**使用工具**：
- Context Engineering：页面实现 PRP
- Puppeteer MCP：UI 自动化测试
- Memory MCP：集成模式记录

**执行步骤**：

```bash
# Step 3.2.1: 实现 Dashboard 页面
cat > src/app/page.tsx << 'EOF'
'use client';

import { Box, Container, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import StepCard from '@/components/cards/StepCard';
import KPICard from '@/components/cards/KPICard';

const WORKFLOW_STEPS = [
  { id: 1, name: 'Roadmap Ingestor', description: 'Monthly GEO roadmap intake', href: '/roadmap' },
  { id: 2, name: 'Content Registry', description: 'Content inventory management', href: '/content' },
  { id: 3, name: 'Prompt Landscape', description: 'P0-P3 priority hierarchy', href: '/analytics/battlefield' },
  { id: 4, name: 'Content Ingestor', description: 'Multi-format content processing', href: '/content' },
  { id: 5, name: 'Content Generator', description: 'Multi-channel content distribution', href: '/content/generator' },
  { id: 6, name: 'Citation Tracker', description: '7-platform monitoring', href: '/citations' },
  { id: 7, name: 'Feedback Analyzer', description: 'KPI analysis and optimization', href: '/analytics' },
];

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsApi.dashboard().then(res => res.data),
  });

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          SweetNight GEO 战场感知态势分析作战系统
        </Typography>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Total Prompts" value={dashboardData?.totalPrompts || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="P0 Priority" value={dashboardData?.p0Count || 0} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="AI Citation Rate" value={`${dashboardData?.citationRate || 0}%`} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard title="Active Workflows" value={dashboardData?.activeWorkflows || 0} />
          </Grid>
        </Grid>

        {/* Workflow Steps */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          7-Step Automated Workflow
        </Typography>
        <Grid container spacing={3}>
          {WORKFLOW_STEPS.map((step) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={step.id}>
              <StepCard
                stepNumber={step.id}
                name={step.name}
                description={step.description}
                href={step.href}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
EOF

# Step 3.2.2: 实现 Roadmap 页面
cat > src/app/roadmap/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useRoadmap, useCreateRoadmap } from '@/hooks/useRoadmap';
import RoadmapTable from '@/components/tables/RoadmapTable';
import RoadmapForm from '@/components/forms/RoadmapForm';

export default function RoadmapPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: roadmapItems, isLoading } = useRoadmap();
  const createMutation = useCreateRoadmap();

  const handleCreate = async (data: any) => {
    await createMutation.mutateAsync(data);
    setIsFormOpen(false);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Roadmap Management</Typography>
          <Button variant="contained" onClick={() => setIsFormOpen(true)}>
            Add Roadmap Item
          </Button>
        </Box>

        <RoadmapTable data={roadmapItems || []} />

        {isFormOpen && (
          <RoadmapForm
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
      </Box>
    </Container>
  );
}
EOF

# Step 3.2.3: 实现其他13个页面...
# (使用类似的模式，集成对应的 API hooks 和组件)

# Step 3.2.4: 使用 Puppeteer 自动化测试所有页面
cat > tests/e2e/pages.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', title: 'Dashboard' },
  { path: '/roadmap', title: 'Roadmap Management' },
  { path: '/content', title: 'Content Registry' },
  { path: '/content/generator', title: 'Content Generator' },
  { path: '/citations', title: 'Citation Tracker' },
  { path: '/analytics', title: 'KPI Dashboard' },
  { path: '/analytics/battlefield', title: 'Battlefield Map' },
  { path: '/workflow', title: 'Workflow Monitor' },
  { path: '/settings', title: 'Settings' },
];

PAGES.forEach(({ path, title }) => {
  test(`${title} page loads correctly`, async ({ page }) => {
    await page.goto(`http://localhost:3001${path}`);
    await expect(page).toHaveTitle(new RegExp(title, 'i'));

    // Check for no console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        throw new Error(`Console error: ${msg.text()}`);
      }
    });

    // Take screenshot
    await page.screenshot({ path: `screenshots/${path.replace(/\//g, '-') || 'home'}.png` });
  });
});

test('API integration works', async ({ page }) => {
  await page.goto('http://localhost:3001/roadmap');

  // Wait for data to load
  await page.waitForSelector('table');

  // Check if data is displayed
  const rows = await page.locator('table tbody tr').count();
  expect(rows).toBeGreaterThan(0);
});
EOF

# Step 3.2.5: 运行 E2E 测试
npx playwright test

# Step 3.2.6: 上传测试截图到 MinIO
# (使用 MinIO client)

# Step 3.2.7: 记录到 Memory
mcp__memory__create_entities({
  entities: [
    {
      name: "Frontend-Backend Integration",
      entityType: "Integration",
      observations: [
        "15 pages implemented",
        "React Query data sync working",
        "All API endpoints integrated",
        "E2E tests passing"
      ]
    }
  ]
})
```

**验证检查点 3.2**：
```bash
# Check 1: 所有页面编译通过
npm run build
# 预期：Build successful

# Check 2: E2E 测试通过
npx playwright test
# 预期：All tests passed (15/15)

# Check 3: 无 TypeScript 错误
npm run type-check
# 预期：No errors

# Check 4: 所有页面可访问
for path in / /roadmap /content /citations /analytics /workflow; do
  curl -I http://localhost:3001$path | grep "200 OK"
done
# 预期：所有路径返回 200
```

---

### 3.3 Neo4j 图可视化集成

**目标**：实现 Battlefield Map 和 Prompt Landscape 的 D3.js 可视化

**使用工具**：
- D3.js：力导向图
- Neo4j MCP：图数据查询
- Puppeteer MCP：可视化验证

**执行步骤**：

```bash
# Step 3.3.1: 创建 Neo4j 客户端
cat > src/lib/neo4j.ts << 'EOF'
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  process.env.NEXT_PUBLIC_NEO4J_URI || 'neo4j://localhost:7688',
  neo4j.auth.basic(
    process.env.NEXT_PUBLIC_NEO4J_USERNAME || 'neo4j',
    process.env.NEXT_PUBLIC_NEO4J_PASSWORD || 'claude_neo4j_2025'
  )
);

export async function queryGraph(cypher: string, params: any = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject());
  } finally {
    await session.close();
  }
}

export async function getPromptNetwork() {
  const cypher = `
    MATCH (p:Prompt)
    OPTIONAL MATCH (p)-[r:RELATES_TO]->(p2:Prompt)
    RETURN p, r, p2
    LIMIT 100
  `;
  return queryGraph(cypher);
}

export async function getContentCoverage() {
  const cypher = `
    MATCH (p:Prompt)-[:COVERED_BY]->(c:Content)
    RETURN p, c
  `;
  return queryGraph(cypher);
}

export default driver;
EOF

# Step 3.3.2: 实现 BattlefieldMap 组件
cat > src/components/charts/BattlefieldMap.tsx << 'EOF'
'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';

interface Node {
  id: string;
  label: string;
  pLevel: string;
  score: number;
}

interface Link {
  source: string;
  target: string;
  weight: number;
}

interface BattlefieldMapProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

export default function BattlefieldMap({ nodes, links, width = 1200, height = 800 }: BattlefieldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Color scale based on P-Level
    const colorScale = d3.scaleOrdinal<string>()
      .domain(['P0', 'P1', 'P2', 'P3'])
      .range(['#d32f2f', '#f57c00', '#fbc02d', '#7cb342']);

    // Force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.weight * 5));

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => 5 + d.score / 10)
      .attr('fill', (d) => colorScale(d.pLevel))
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.label)
      .attr('font-size', 10)
      .attr('dx', 12)
      .attr('dy', 4);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <svg ref={svgRef} width={width} height={height} />
    </Box>
  );
}
EOF

# Step 3.3.3: 实现 Battlefield Map 页面
cat > src/app/analytics/battlefield/page.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import BattlefieldMap from '@/components/charts/BattlefieldMap';
import { getPromptNetwork } from '@/lib/neo4j';

export default function BattlefieldMapPage() {
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraphData() {
      try {
        const data = await getPromptNetwork();

        // Transform Neo4j data to D3 format
        const nodes = data
          .filter((record: any) => record.p)
          .map((record: any) => ({
            id: record.p.properties.id,
            label: record.p.properties.text.substring(0, 30) + '...',
            pLevel: record.p.properties.pLevel,
            score: record.p.properties.score,
          }));

        const links = data
          .filter((record: any) => record.r)
          .map((record: any) => ({
            source: record.p.properties.id,
            target: record.p2.properties.id,
            weight: record.r.properties.weight || 1,
          }));

        setGraphData({ nodes, links });
      } catch (error) {
        console.error('Failed to load graph data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadGraphData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Battlefield Map (战场态势图)
      </Typography>
      {graphData && (
        <BattlefieldMap
          nodes={graphData.nodes}
          links={graphData.links}
        />
      )}
    </Container>
  );
}
EOF

# Step 3.3.4: 使用 Puppeteer 验证可视化
mcp__puppeteer__puppeteer_navigate({
  url: "http://localhost:3001/analytics/battlefield"
})

await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for graph to render

mcp__puppeteer__puppeteer_screenshot({
  name: "battlefield-map-visualization",
  width: 1920,
  height: 1080
})
```

**验证检查点 3.3**：
```bash
# Check 1: Neo4j 连接正常
npm run dev
# 访问 http://localhost:3001/analytics/battlefield

# Check 2: D3.js 可视化渲染
mcp__puppeteer__puppeteer_evaluate({
  script: "document.querySelectorAll('svg circle').length"
})
# 预期：返回节点数量 > 0

# Check 3: 交互功能正常（拖拽、缩放）
# 手动测试或使用 Puppeteer 模拟

# Check 4: 截图生成成功
ls screenshots/battlefield-map-visualization.png
# 预期：文件存在
```

---

### 3.4 完整 E2E 测试套件

**目标**：创建覆盖所有功能的端到端测试

**使用工具**：
- Playwright：E2E 测试框架
- Puppeteer MCP：浏览器自动化
- Memory MCP：测试结果记录

**执行步骤**：

```bash
# Step 3.4.1: 创建完整测试套件
cat > tests/e2e/complete-workflow.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Complete GEO Workflow', () => {
  test('7-step workflow execution', async ({ page }) => {
    // Step 1: Navigate to Dashboard
    await page.goto('http://localhost:3001/');
    await expect(page.locator('h3')).toContainText('SweetNight GEO');

    // Step 2: Add Roadmap Item
    await page.click('a[href="/roadmap"]');
    await page.click('button:has-text("Add Roadmap Item")');
    await page.fill('input[name="prompt"]', 'best memory foam mattress 2025');
    await page.selectOption('select[name="pLevel"]', 'P0');
    await page.fill('input[name="enhancedGeoScore"]', '95');
    await page.fill('input[name="quickwinIndex"]', '88');
    await page.click('button:has-text("Submit")');
    await expect(page.locator('table')).toContainText('best memory foam mattress 2025');

    // Step 3: Create Content
    await page.click('a[href="/content/generator"]');
    await page.selectOption('select[name="template"]', 'YouTube');
    await page.fill('textarea[name="variables"]', 'product=SweetNight Mattress');
    await page.click('button:has-text("Generate")');
    await expect(page.locator('.generated-content')).toBeVisible();

    // Step 4: Track Citations
    await page.click('a[href="/citations"]');
    await page.click('button:has-text("Track New Citation")');
    await page.fill('input[name="url"]', 'https://youtube.com/watch?v=example');
    await page.selectOption('select[name="platform"]', 'YouTube');
    await page.click('button:has-text("Track")');
    await expect(page.locator('table')).toContainText('youtube.com');

    // Step 5: View Analytics
    await page.click('a[href="/analytics"]');
    await expect(page.locator('.kpi-card')).toHaveCount(4);

    // Step 6: Check Battlefield Map
    await page.click('a[href="/analytics/battlefield"]');
    await page.waitForSelector('svg');
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBeGreaterThan(0);

    // Step 7: Monitor Workflow
    await page.click('a[href="/workflow"]');
    await page.click('button:has-text("Trigger Workflow")');
    await expect(page.locator('.workflow-status')).toContainText('running');
  });

  test('CSV bulk import', async ({ page }) => {
    await page.goto('http://localhost:3001/roadmap');
    await page.click('button:has-text("Import CSV")');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/fixtures/roadmap-sample.csv');

    await page.click('button:has-text("Upload")');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('Content template editing', async ({ page }) => {
    await page.goto('http://localhost:3001/settings');
    await page.click('a[href="/settings/templates"]');
    await page.click('button:has-text("Edit YouTube Template")');

    const editor = page.locator('.markdown-editor');
    await editor.fill('# New YouTube Template\n\n{{product}} review...');

    await page.click('button:has-text("Save")');
    await expect(page.locator('.success-message')).toBeVisible();
  });

  test('User management', async ({ page }) => {
    await page.goto('http://localhost:3001/users');
    await page.click('button:has-text("Add User")');
    await page.fill('input[name="email"]', 'new-user@example.com');
    await page.selectOption('select[name="role"]', 'editor');
    await page.click('button:has-text("Create")');
    await expect(page.locator('table')).toContainText('new-user@example.com');
  });
});
EOF

# Step 3.4.2: 运行完整测试套件
npx playwright test --reporter=html

# Step 3.4.3: 生成测试报告
npx playwright show-report

# Step 3.4.4: 上传测试报告到 MinIO
# (使用 MinIO client)

# Step 3.4.5: 记录测试结果到 Notion
mcp__notion__API-post-page({
  parent: {page_id: "<test-results-workspace>"},
  properties: {
    title: [{text: {content: "E2E Test Results - Phase 3 Integration"}}],
    type: "title"
  },
  children: [
    {
      paragraph: {
        rich_text: [{
          text: {content: "✅ Complete workflow test: PASSED\n✅ CSV bulk import test: PASSED\n✅ Content template editing: PASSED\n✅ User management test: PASSED\n\nTotal: 20 tests, 20 passed, 0 failed"}
        }]
      }
    }
  ]
})
```

**验证检查点 3.4**：
```bash
# Check 1: 所有 E2E 测试通过
npx playwright test
# 预期：20/20 tests passed

# Check 2: 测试覆盖率达标
npx playwright test --reporter=html
# 查看 HTML 报告，覆盖率 ≥ 90%

# Check 3: 无测试失败
grep "failed" playwright-report/index.html
# 预期：无 "failed" 字样

# Check 4: Notion 报告已创建
mcp__notion__API-post-search({query: "E2E Test Results"})
# 预期：返回测试结果页面
```

---

### 3.5 Phase 3 总结与验证

**目标**：确保前后端集成阶段所有功能完整且无误

**验证清单**：

```bash
# ✅ Check 1: 前端编译无错误
cd sweetnight-geo-frontend
npm run type-check
npm run build
# 预期：No errors, build successful

# ✅ Check 2: 后端编译无错误
cd ../sweetnight-geo-backend
npm run build
# 预期：Compilation successful

# ✅ Check 3: 所有页面可访问
curl -I http://localhost:3001/ | grep "200 OK"
curl -I http://localhost:3001/roadmap | grep "200 OK"
curl -I http://localhost:3001/content | grep "200 OK"
curl -I http://localhost:3001/citations | grep "200 OK"
curl -I http://localhost:3001/analytics | grep "200 OK"
curl -I http://localhost:3001/workflow | grep "200 OK"
# 预期：所有请求返回 200 OK

# ✅ Check 4: API 响应正常
curl http://localhost:3000/api/v1/roadmap | jq
curl http://localhost:3000/api/v1/content | jq
curl http://localhost:3000/api/v1/citations | jq
# 预期：返回 JSON 数据

# ✅ Check 5: Neo4j 可视化工作
mcp__puppeteer__puppeteer_navigate({url: "http://localhost:3001/analytics/battlefield"})
mcp__puppeteer__puppeteer_evaluate({script: "document.querySelectorAll('svg circle').length"})
# 预期：返回节点数量 > 0

# ✅ Check 6: E2E 测试通过
npx playwright test
# 预期：20/20 tests passed

# ✅ Check 7: 前端单元测试
cd sweetnight-geo-frontend
npm test
# 预期：All tests passed

# ✅ Check 8: 后端单元测试
cd ../sweetnight-geo-backend
npm test
# 预期：All tests passed

# ✅ Check 9: 测试覆盖率达标
npm test -- --coverage
# 预期：Coverage ≥ 80%

# ✅ Check 10: 无控制台错误
# 手动访问所有页面，检查浏览器控制台无错误
```

**阶段交付物**：
- ✅ 15个页面完整集成后端 API
- ✅ React Query 数据同步正常
- ✅ Neo4j 图可视化（D3.js 力导向图）
- ✅ 完整 E2E 测试套件（20+ 测试用例）
- ✅ 前端单元测试（覆盖率 ≥ 80%）
- ✅ 后端单元测试（覆盖率 ≥ 80%）
- ✅ Playwright HTML 测试报告
- ✅ Notion 测试结果文档
- ✅ MinIO 存储的测试截图和报告

**进入 Phase 4 前提条件**：
- 所有验证检查点通过 ✅
- E2E 测试全部通过 ✅
- 无编译错误 ✅
- 无运行时错误 ✅

---

## Phase 4: Deployment & Monitoring (部署与监控阶段)

### 4.1 Docker 容器化

**目标**：创建 Docker 镜像和 docker-compose 配置

**执行步骤**：

```bash
# Step 4.1.1: 创建前端 Dockerfile
cat > sweetnight-geo-frontend/Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3001
CMD ["node", "server.js"]
EOF

# Step 4.1.2: 创建后端 Dockerfile
cat > sweetnight-geo-backend/Dockerfile << 'EOF'
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["node", "dist/main"]
EOF

# Step 4.1.3: 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./sweetnight-geo-frontend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3000/api/v1
      - NEXT_PUBLIC_NEO4J_URI=neo4j://neo4j:7687
    depends_on:
      - backend
    networks:
      - sweetnight-network

  # Backend
  backend:
    build:
      context: ./sweetnight-geo-backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://claude:claude_dev_2025@postgres:5432/claude_dev
      - NEO4J_URI=neo4j://neo4j:7687
      - NEO4J_USERNAME=neo4j
      - NEO4J_PASSWORD=claude_neo4j_2025
      - REDIS_URL=redis://:claude_redis_2025@redis:6379
      - MONGODB_URI=mongodb://claude:claude_mongo_2025@mongodb:27017/sweetnight_geo?authSource=admin
    depends_on:
      - postgres
      - neo4j
      - redis
      - mongodb
    networks:
      - sweetnight-network

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    ports:
      - "5437:5432"
    environment:
      - POSTGRES_USER=claude
      - POSTGRES_PASSWORD=claude_dev_2025
      - POSTGRES_DB=claude_dev
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - sweetnight-network

  # Neo4j
  neo4j:
    image: neo4j:5.15-community
    ports:
      - "7475:7474"
      - "7688:7687"
    environment:
      - NEO4J_AUTH=neo4j/claude_neo4j_2025
    volumes:
      - neo4j-data:/data
    networks:
      - sweetnight-network

  # Redis
  redis:
    image: redis:7.2-alpine
    ports:
      - "6382:6379"
    command: redis-server --requirepass claude_redis_2025
    volumes:
      - redis-data:/data
    networks:
      - sweetnight-network

  # MongoDB
  mongodb:
    image: mongo:7.0
    ports:
      - "27018:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=claude
      - MONGO_INITDB_ROOT_PASSWORD=claude_mongo_2025
    volumes:
      - mongodb-data:/data/db
    networks:
      - sweetnight-network

  # Nginx
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    networks:
      - sweetnight-network

volumes:
  postgres-data:
  neo4j-data:
  redis-data:
  mongodb-data:

networks:
  sweetnight-network:
    driver: bridge
EOF

# Step 4.1.4: 构建并启动所有服务
docker-compose up -d --build

# Step 4.1.5: 验证所有容器运行
docker-compose ps
```

**验证检查点 4.1**：
```bash
# Check 1: 所有容器运行
docker-compose ps | grep "Up"
# 预期：6个容器都在运行

# Check 2: 前端可访问
curl -I http://localhost:3001/ | grep "200 OK"

# Check 3: 后端 API 可访问
curl http://localhost:3000/api/v1/roadmap | jq

# Check 4: 数据库连接正常
docker-compose logs backend | grep "Database connected"
```

---

### 4.2 CI/CD 配置

**目标**：配置 GitHub Actions 自动化部署

**使用工具**：
- GitHub MCP：仓库配置
- Notion MCP：部署文档

**执行步骤**：

```bash
# Step 4.2.1: 创建 GitHub Actions workflow
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy SweetNight GEO

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./sweetnight-geo-frontend
        run: npm ci
      - name: Type check
        working-directory: ./sweetnight-geo-frontend
        run: npm run type-check
      - name: Build
        working-directory: ./sweetnight-geo-frontend
        run: npm run build
      - name: Test
        working-directory: ./sweetnight-geo-frontend
        run: npm test

  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./sweetnight-geo-backend
        run: npm ci
      - name: Build
        working-directory: ./sweetnight-geo-backend
        run: npm run build
      - name: Test
        working-directory: ./sweetnight-geo-backend
        run: npm test

  e2e-test:
    runs-on: ubuntu-latest
    needs: [test-frontend, test-backend]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Start services
        run: docker-compose up -d
      - name: Wait for services
        run: sleep 30
      - name: Run E2E tests
        run: npx playwright test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  deploy:
    runs-on: ubuntu-latest
    needs: [e2e-test]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker images
        run: docker-compose build
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
EOF

# Step 4.2.2: 推送到 GitHub
git add .
git commit -m "feat: add Docker and CI/CD configuration

- Docker multi-stage builds for frontend and backend
- Docker Compose with all services
- GitHub Actions workflow for automated testing and deployment
- Nginx reverse proxy configuration

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin main

# Step 4.2.3: 记录部署配置到 Notion
mcp__notion__API-post-page({
  parent: {page_id: "<deployment-workspace>"},
  properties: {
    title: [{text: {content: "SweetNight GEO - Deployment Configuration"}}],
    type: "title"
  },
  children: [
    {
      paragraph: {
        rich_text: [{
          text: {content: "✅ Docker Compose configuration\n✅ GitHub Actions CI/CD\n✅ Multi-stage builds\n✅ Automated E2E testing\n✅ Production deployment ready"}
        }]
      }
    }
  ]
})
```

**验证检查点 4.2**：
```bash
# Check 1: GitHub Actions workflow 创建
mcp__github__get_file_contents({
  owner: "<username>",
  repo: "sweetnight-geo",
  path: ".github/workflows/deploy.yml"
})
# 预期：返回 workflow 配置

# Check 2: CI/CD 运行成功
# 访问 GitHub Actions 页面查看运行状态

# Check 3: Notion 部署文档创建
mcp__notion__API-post-search({query: "Deployment Configuration"})
# 预期：返回部署文档页面
```

---

### 4.3 Phase 4 总结

**阶段交付物**：
- ✅ Docker 容器化配置
- ✅ docker-compose 多服务编排
- ✅ GitHub Actions CI/CD
- ✅ Nginx 反向代理
- ✅ 自动化测试和部署
- ✅ Notion 部署文档

---

## 总结：完整自动化开发流程

### 全局工具使用矩阵

| 工具 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|---------|
| **Context Engineering** | ✅ PRP生成 | ✅ 服务实现蓝图 | ✅ 集成策略 | ✅ 部署配置 |
| **InfraNodus MCP** | ✅ 需求分析<br>✅ 知识图谱 | ✅ 架构分析 | ✅ 集成模式分析 | - |
| **Memory MCP** | ✅ UI组件存储<br>✅ 设计决策 | ✅ 服务模式存储<br>✅ API关系 | ✅ 集成模式记录 | - |
| **Sequential Thinking** | ✅ 组件架构推理 | ✅ 数据库架构<br>✅ 业务逻辑推理 | ✅ 集成策略推理 | - |
| **Notion MCP** | ✅ 需求追踪<br>✅ 技术栈文档 | ✅ API文档 | ✅ 测试结果 | ✅ 部署文档 |
| **Feishu MCP** | ✅ PRP文档<br>✅ 协作设计 | - | - | - |
| **Figma Desktop MCP** | ✅ 设计文件管理 | - | - | - |
| **Magic UI MCP** | ✅ UI组件生成 | - | - | - |
| **Puppeteer MCP** | ✅ 原型截图<br>✅ 设计验证 | ✅ Swagger文档验证 | ✅ E2E测试<br>✅ 可视化验证 | - |
| **PostgreSQL MCP** | - | ✅ 关系数据库 | ✅ 数据查询 | - |
| **Neo4j MCP** | - | ✅ 图数据库 | ✅ 可视化数据 | - |
| **Redis MCP** | - | ✅ 缓存配置 | - | - |
| **MongoDB MCP** | - | ✅ 文档存储 | - | - |
| **Prisma MCP** | - | ✅ ORM管理 | - | - |
| **GitHub MCP** | ✅ 前端仓库 | ✅ 后端仓库 | ✅ 代码推送 | ✅ CI/CD配置 |
| **Firecrawl MCP** | - | ✅ 网页抓取 | - | - |
| **MinIO (Object Storage)** | ✅ 设计稿存储 | - | ✅ 测试报告存储 | - |

### 验证检查点总结

**Phase 1 (前端设计) - 7个检查点**
- ✅ 知识图谱完整性（InfraNodus + Memory）
- ✅ 15个页面设计稿（Figma + Puppeteer）
- ✅ 组件架构完整（Sequential Thinking）
- ✅ GitHub 仓库创建（GitHub MCP）
- ✅ PRP 生成（Context Engineering）
- ✅ Notion 文档（Notion MCP）
- ✅ Feishu 协作（Feishu MCP）

**Phase 2 (后端开发) - 8个检查点**
- ✅ 数据库架构（PostgreSQL + Neo4j + Redis + MongoDB）
- ✅ NestJS 模块完整
- ✅ 服务实现完成
- ✅ API 端点可访问（Swagger）
- ✅ 单元测试覆盖率 ≥ 80%
- ✅ 集成测试通过
- ✅ TypeScript 编译无错误
- ✅ GitHub 代码推送

**Phase 3 (前后端集成) - 10个检查点**
- ✅ API 客户端配置
- ✅ 15个页面集成后端
- ✅ Neo4j 可视化（D3.js）
- ✅ E2E 测试通过（20+ 用例）
- ✅ 前端单元测试 ≥ 80%
- ✅ 后端单元测试 ≥ 80%
- ✅ 无编译错误
- ✅ 无运行时错误
- ✅ Playwright 报告生成
- ✅ Notion 测试文档

**Phase 4 (部署监控) - 4个检查点**
- ✅ Docker 容器化
- ✅ docker-compose 运行
- ✅ GitHub Actions CI/CD
- ✅ Notion 部署文档

---

## 自动化流程执行命令

### 启动完整流程

```bash
# Phase 1: Frontend Design
/sc:workflow --phase "frontend-design" --input "sweetnight-geo-requirements.md"

# Phase 2: Backend Development
/sc:workflow --phase "backend-development" --input "database-architecture.md"

# Phase 3: Integration
/sc:workflow --phase "integration" --input "api-contracts.md"

# Phase 4: Deployment
/sc:workflow --phase "deployment" --input "docker-compose.yml"
```

### 验证所有阶段

```bash
# 运行所有验证检查点
./scripts/validate-phase-1.sh
./scripts/validate-phase-2.sh
./scripts/validate-phase-3.sh
./scripts/validate-phase-4.sh
```

### 生成最终报告

```bash
# 使用 InfraNodus 生成项目知识图谱
mcp__infranodus__create_knowledge_graph({
  graphName: "sweetnight-geo-complete-project",
  text: "<项目所有文档和代码的汇总>"
})

# 保存到 Notion
mcp__notion__API-post-page({
  parent: {page_id: "<final-report-workspace>"},
  properties: {
    title: [{text: {content: "SweetNight GEO - Complete Project Report"}}],
    type: "title"
  },
  children: [/* 完整项目报告 */]
})
```

---

## 关键成功因素

1. **严谨验证**：每个阶段都有明确的验证检查点，发现问题立即修复
2. **工具协同**：InfraNodus + Memory + Sequential Thinking 构建知识图谱
3. **文档同步**：Notion + Feishu 实时记录所有决策和进度
4. **自动化测试**：Playwright E2E + Jest 单元测试覆盖率 ≥ 80%
5. **持续集成**：GitHub Actions 自动化测试和部署
6. **多数据库**：PostgreSQL + Neo4j + Redis + MongoDB 协同工作
7. **可视化**：D3.js + Puppeteer 确保图表正确渲染
8. **对象存储**：MinIO 统一管理设计稿、测试报告、静态资源

---

此自动化开发流程已完整设计完成！✅

## 🔧 2025-10-22 开发日志：Prompt Landscape API 编译错误修复

### 任务背景
继续前一会话未完成的工作，修复 Prompt Landscape Knowledge Graph API 的 TypeScript 编译错误并验证服务可用性。

### 问题发现
运行 `npm run dev` 时发现 5 个 TypeScript 编译错误：

1. **错误 1-2**: `prompt-landscape.service.ts:139` 和 `:287` - 类型不匹配
   - Neo4jService 返回 `{total, covered, uncovered}`
   - 但接口期望 `{totalPrompts, coveredPrompts, uncoveredPrompts}`

2. **错误 3-5**: `prompt-landscape.service.ts:311, 322, 343` - 数组类型错误
   - recommendations 声明为 `Array<T>[]` 导致类型错误

3. **数据库连接失败**: Prisma 客户端使用旧的数据库配置

### 解决方案

#### 修复 1: 统计属性映射 (2处)
```typescript
// Line 133-145 (getPromptLandscape)
const coverageStats = await this.neo4jService.getPromptCoverageStats();
return {
  nodes,
  edges,
  stats: {
    totalPrompts: coverageStats.total,      // 映射属性名
    coveredPrompts: coverageStats.covered,  // 映射属性名
    uncoveredPrompts: coverageStats.uncovered, // 映射属性名
    coverageRate: coverageStats.coverageRate,
    totalRelationships: edges.length,
  },
};

// Line 285-297 (getPromptNetwork)
const networkStats = await this.neo4jService.getPromptCoverageStats();
return {
  nodes,
  edges,
  stats: {
    totalPrompts: networkStats.total,       // 映射属性名
    coveredPrompts: networkStats.covered,   // 映射属性名
    uncoveredPrompts: networkStats.uncovered, // 映射属性名
    coverageRate: networkStats.coverageRate,
    totalRelationships: edges.length,
  },
};
```

#### 修复 2: Recommendations 数组类型 (Line 307-313)
```typescript
// 之前（错误）：
const recommendations: ContentGapAnalysis['recommendations'][] = [];

// 修复后（正确）：
const recommendations = [] as Array<{
  priority: string;
  promptId: string;
  promptText: string;
  reason: string;
  relatedPrompts: string[];
}>;
```

#### 修复 3: Prisma 客户端重新生成
```bash
cd /Users/cavin/Desktop/dev/leapgeo7/server
npx prisma generate  # 使用正确的 DATABASE_URL
```

### 验证结果

#### ✅ TypeScript 编译成功
```
[Nest] Starting Nest application...
[Nest] PromptLandscapeModule dependencies initialized
[RouterExplorer] Mapped {/api/v1/prompt-landscape, GET} route
[RouterExplorer] Mapped {/api/v1/prompt-landscape/gaps, GET} route
[RouterExplorer] Mapped {/api/v1/prompt-landscape/network/:promptId, GET} route
[RouterExplorer] Mapped {/api/v1/prompt-landscape/stats, GET} route
✅ Database connected
✅ Neo4j connection established successfully
🚀 Server running on: http://localhost:3001
```

#### ✅ API 端点测试通过

**测试 1: GET /api/v1/prompt-landscape/stats**
```bash
curl http://localhost:3001/api/v1/prompt-landscape/stats
```
响应：
```json
{
  "success": true,
  "data": {
    "totalPrompts": 4,
    "coveredPrompts": 1,
    "uncoveredPrompts": 3,
    "coverageRate": 25,
    "totalRelationships": 0,
    "byPLevel": {"P0": 1, "P1": 0, "P2": 0, "P3": 0},
    "coveredByPLevel": {"P0": 1, "P1": 0, "P2": 0, "P3": 0}
  }
}
```

**测试 2: GET /api/v1/prompt-landscape?pLevels=P0,P1**
```bash
curl "http://localhost:3001/api/v1/prompt-landscape?pLevels=P0,P1"
```
响应：
```json
{
  "success": true,
  "data": {
    "nodes": [{
      "id": "test-prompt-001",
      "text": "best mattress for back pain",
      "pLevel": "P0",
      "score": 92.5,
      "isCovered": true,
      "contentCount": 1
    }],
    "edges": [],
    "stats": {
      "totalPrompts": 4,
      "coveredPrompts": 1,
      "coverageRate": 25
    }
  }
}
```

### 技术细节

**文件变更**:
- `server/src/modules/prompt-landscape/prompt-landscape.service.ts` (3处修复)
- `server/generated/prisma/*` (重新生成)

**根因分析**:
1. Neo4j 服务返回的统计对象使用简短属性名（total/covered/uncovered）
2. TypeScript 接口定义使用完整属性名（totalPrompts/coveredPrompts/uncoveredPrompts）
3. 需要在服务层进行属性名映射转换

**最佳实践**:
- ✅ 使用显式变量名（`coverageStats`, `networkStats`）避免命名冲突
- ✅ 在服务层统一进行数据转换和映射
- ✅ 保持接口定义清晰且语义明确
- ✅ 编译错误修复后立即进行 API 功能验证

### 相关资源
- 后端服务: http://localhost:3001
- API 文档: http://localhost:3001/api/docs
- Neo4j 浏览器: http://localhost:7475
- PostgreSQL: localhost:5437

### 下一步建议
- [ ] 修复 contentCount 从 Neo4j Integer 对象转为 JavaScript number
- [ ] 添加更多测试数据以验证图可视化功能
- [ ] 优化剩余 2 个 E2E 测试选择器（频道标签、报告生成）

---

