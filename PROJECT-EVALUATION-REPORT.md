# LeapGEO7 Project Evaluation & Redesign Report
# 项目评估与重新设计报告

**Date**: 2025-10-29
**Version**: 1.0
**Purpose**: 全面评估当前项目状态，设计展示全部MCP能力的完整业务流程系统

---

## 📊 Executive Summary | 执行摘要

### 评估结论
当前LeapGEO7项目已完成**70%**的基础功能，但**缺少关键的MCP自动化展示**和**完整业务流程可视化**。

**核心问题**:
1. ❌ **数据采集模块缺失** - 没有展示Firecrawl、Web Scraping能力
2. ❌ **数据处理管道不可见** - MongoDB、Vector DB、Neo4j的数据流未可视化
3. ❌ **图分析能力未充分展示** - InfraNodus、Neo4j GDS算法隐藏在后端
4. ❌ **知识图谱体系不完整** - 缺少Knowledge Hub、FAQ Center、Topic Explorer
5. ❌ **AIGC能力未突出** - 内容生成器功能单薄，未展示MCP集成
6. ❌ **MCP自动化工作流不可见** - n8n、工作流编排能力未在前端呈现

**建议方案**: 🎯 **保留70%现有页面 + 新增8个核心模块 + 重构5个关键页面**

---

## 📋 目录

1. [现状分析 - 20个已有页面评估](#现状分析)
2. [需求分析 - 8个业务流程模块](#需求分析)
3. [Gap分析 - 缺失功能清单](#gap分析)
4. [新架构设计 - 完整页面蓝图](#新架构设计)
5. [MCP能力展示方案](#mcp能力展示方案)
6. [实施路线图 - 3阶段8周计划](#实施路线图)
7. [代码实现示例](#代码实现示例)

---

## 1. 现状分析 - 20个已有页面评估

### 1.1 现有页面清单与评分

| 页面名称 | 当前功能 | 对应业务流程 | 完成度 | MCP集成 | 评分 | 建议 |
|---------|---------|------------|-------|---------|------|-----|
| **Dashboard** | 总览指标 | G) 内容效果仪表板 | 60% | ❌ | 6/10 | 🔧 重构 |
| **RoadmapManager** | 路线图管理 | A) 内容收集 | 70% | ❌ | 7/10 | ✅ 保留 |
| **ContentRegistry** | 内容注册 | B) 内容存储 | 75% | ❌ | 7.5/10 | ✅ 保留 |
| **PromptLandscape** | Prompt全景 | C) 知识图谱 | 80% | ✅ Neo4j | 8/10 | ✅ 保留 |
| **ContentGenerator** | 内容生成 | D) AIGC内容生成 | 50% | ❌ | 5/10 | 🔧 重构 |
| **CitationTracker** | 引用追踪 | G) 效果监测 | 65% | ❌ | 6.5/10 | ✅ 保留 |
| **KPIDashboard** | KPI指标 | G) 效果仪表板 | 70% | ❌ | 7/10 | ✅ 保留 |
| **BattlefieldMap** | 战场态势 | 综合分析 | 60% | ❌ | 6/10 | ✅ 保留 |
| **GeoMappingNetwork** | 内容映射 | C) 知识图谱 | 85% | ✅ Neo4j | 8.5/10 | ⭐ 优秀 |
| **WorkflowMonitor** | 工作流监控 | 流程编排 | 55% | ❌ | 5.5/10 | 🔧 重构 |
| **SystemSettings** | 系统设置 | 配置管理 | 80% | ❌ | 8/10 | ✅ 保留 |
| **TemplateEditor** | 模板编辑 | D) 内容模板 | 70% | ❌ | 7/10 | ✅ 保留 |
| **AnalyticsReports** | 分析报告 | G) 效果分析 | 60% | ❌ | 6/10 | ✅ 保留 |
| **ContentCoverage** | 内容覆盖率 | 覆盖分析 | 75% | ❌ | 7.5/10 | ✅ 保留 |
| **CitationStrength** | 引用强度 | 引用分析 | 70% | ❌ | 7/10 | ✅ 保留 |
| **UserManagement** | 用户管理 | 权限管理 | 85% | ❌ | 8.5/10 | ✅ 保留 |
| **Help** | 帮助文档 | 文档中心 | 80% | ❌ | 8/10 | ✅ 保留 |
| **Offers** | 优惠管理 | 转化管理 | 90% | ❌ | 9/10 | ✅ 保留 |
| **Orders** | 订单管理 | 转化管理 | 90% | ❌ | 9/10 | ✅ 保留 |
| **Login** | 登录认证 | 认证鉴权 | 95% | ❌ | 9.5/10 | ✅ 保留 |

**平均完成度**: 72.25%
**MCP集成率**: 10% (仅2个页面)
**需要重构**: 3个页面
**需要新增**: 8个页面

### 1.2 现有亮点

✅ **已完成的优秀功能**:
1. **GeoMappingNetwork** - 三层网络可视化（Prompts/Contents/Citations）
2. **PromptLandscape** - Neo4j GDS图算法集成（社区检测、中心性分析、相似性分析）
3. **Offers & Orders** - 转化管理模块完善
4. **UserManagement** - RBAC权限系统完整

### 1.3 现有不足

❌ **主要缺陷**:
1. **MCP能力不可见** - 24+ MCP服务器的强大能力未在前端展示
2. **数据采集黑盒** - Firecrawl、Web Scraping过程不透明
3. **数据处理管道缺失** - MongoDB、Vector DB、Neo4j的ETL流程不可视
4. **AIGC能力单薄** - ContentGenerator未展示Sequential Thinking、InfraNodus等MCP工具
5. **知识图谱体系不完整** - 缺少Knowledge Hub、FAQ Center、Topic Explorer
6. **自动化工作流隐藏** - n8n工作流编排能力未暴露给用户

---

## 2. 需求分析 - 8个业务流程模块

### 2.1 用户需求清单

#### A) 内容收集（数据采集）模块

**需求描述**:
- 🎯 展示数据采集能力：Firecrawl SERP抓取、竞品监测、社交媒体数据采集
- 📊 可视化数据源管理：URL列表、抓取频率、数据量统计
- 🔄 实时采集状态：正在抓取的任务、成功率、失败重试

**对应MCP工具**:
- `mcp__firecrawl__firecrawl_scrape` - 网页抓取
- `mcp__firecrawl__firecrawl_search` - SERP搜索
- `mcp__puppeteer__puppeteer_navigate` - 动态网页抓取

**当前状态**: ❌ **完全缺失**
**优先级**: ⭐⭐⭐⭐⭐ (P0)

---

#### B) 内容拆解装入数据库模块

**需求描述**:
- 🗄️ 展示数据存储管道：原始数据 → MongoDB, 向量化 → Vector DB, 关系提取 → Neo4j
- 📈 ETL流程可视化：数据清洗、实体提取、关系构建
- 🔍 数据质量监控：存储成功率、数据完整性检查、重复数据处理

**对应MCP工具**:
- `mcp__mongodb__insert_many` - MongoDB批量写入
- `mcp__neo4j__create_node` - Neo4j节点创建
- `mcp__neo4j__create_relationship` - 关系创建
- `mcp__redis__set` - 缓存写入

**当前状态**: ❌ **完全缺失**
**优先级**: ⭐⭐⭐⭐⭐ (P0)

---

#### C) 内容计算&分析（知识图谱体系）模块

**需求描述**:
- 🧠 知识图谱中心：可视化企业知识资产（Topic、Keyword、FAQ、Prompt）
- 🔬 图算法应用：社区检测、PageRank、结构洞检测、相似性推荐
- 📚 知识应用中心：知识搜索、智能推荐、自动问答

**对应MCP工具**:
- `mcp__neo4j__execute_query` - Cypher查询
- `mcp__infranodus__generate_knowledge_graph` - InfraNodus知识图谱
- `mcp__geo_knowledge_graph__geo_find_structure_holes` - 结构洞检测
- `mcp__geo_knowledge_graph__geo_answer_question` - Graph-RAG问答

**当前状态**: 🟡 **部分完成** (PromptLandscape已有基础)
**完成度**: 40%
**优先级**: ⭐⭐⭐⭐ (P1)

---

#### D) 内容生成（AIGC）模块

**需求描述**:
- ✍️ 多类型内容生成：Blog, Landing Page, PDP, Social Media PR, Reddit, Quora, Medium, YouTube Script
- 🤖 AI驱动创作：Sequential Thinking多轮推理、InfraNodus主题分析、Evidence Chain引用
- 🎨 模板库管理：7种内容模板、变量替换、预览功能

**对应MCP工具**:
- `mcp__sequential_thinking__sequentialthinking` - 结构化推理
- `mcp__infranodus__generate_research_questions` - 研究问题生成
- `mcp__geo_knowledge_graph__geo_get_evidence_chain` - 证据链检索

**当前状态**: 🟡 **部分完成** (ContentGenerator已有模板)
**完成度**: 50%
**优先级**: ⭐⭐⭐⭐⭐ (P0)

---

#### E) 内容评分模块

**需求描述**:
- 📊 SEO评分：Schema.org规则验证、结构化数据检查、技术SEO评分
- 🌟 GEO评分：E-E-A-T评分（Experience, Expertise, Authority, Trust）
- ✅ Citation-Ready评分：0-100分，证据链完整性、来源可信度

**对应MCP工具**:
- `mcp__geo_knowledge_graph__geo_calculate_citation_score` - Citation分数计算
- `mcp__geo_knowledge_graph__geo_verify_claim` - 声明验证
- `mcp__infranodus__generate_seo_report` - SEO报告生成

**当前状态**: ❌ **完全缺失**
**优先级**: ⭐⭐⭐⭐ (P1)

---

#### F) 内容分发模块

**需求描述**:
- 🚀 多渠道发布：站内（Shopify, Amazon）、站外（YouTube, Reddit, LinkedIn, Medium）
- 📤 一键多平台：Feishu + Notion + Slack + MinIO同步发布
- 📅 发布日程管理：定时发布、批量发布、发布状态追踪

**对应MCP工具**:
- `mcp__feishu__create_feishu_document` - Feishu文档创建
- `mcp__notion__API_post_page` - Notion页面创建
- `mcp__n8n__create_workflow` - n8n工作流创建
- MinIO Object Storage - 内容备份

**当前状态**: ❌ **完全缺失**
**优先级**: ⭐⭐⭐⭐⭐ (P0)

---

#### G) 内容效果仪表板模块

**需求描述**:
- 📈 AI可见度监测：Perplexity、ChatGPT、Google AI Overview引用率
- 🔍 AI搜索排名：关键词排名、FAQ排名、Prompt排名
- 💹 KPI指标：点击率、展示量、转化率、GMV贡献

**对应MCP工具**:
- `mcp__firecrawl__firecrawl_search` - SERP监测
- `mcp__sentry__search_issues` - 错误追踪
- `mcp__n8n__list_executions` - 工作流执行监控

**当前状态**: 🟡 **部分完成** (KPIDashboard已有基础)
**完成度**: 60%
**优先级**: ⭐⭐⭐ (P2)

---

#### H) GEO Knowledge AI模块

**需求描述**:
- 🧠 智能洞察：对所有数据、内容进行AI分析和问答
- 💬 自然语言查询：用户输入问题，AI从知识图谱检索答案
- 🔮 预测建议：内容缺口预测、趋势分析、优化建议

**对应MCP工具**:
- `mcp__geo_knowledge_graph__geo_answer_question` - Graph-RAG问答
- `mcp__graphiti__search_memory_nodes` - 长期记忆搜索
- `mcp__infranodus__generate_research_ideas` - 研究创意生成

**当前状态**: ❌ **完全缺失**
**优先级**: ⭐⭐⭐⭐ (P1)

---

## 3. Gap分析 - 缺失功能清单

### 3.1 完全缺失的核心模块 (5个)

| 模块 | 业务流程 | 影响范围 | 缺失原因 | 实施难度 |
|------|---------|---------|---------|---------|
| **Data Acquisition Hub** | A) 内容收集 | 数据源头 | 未开发 | 🟢 中等 (3天) |
| **ETL Pipeline Viewer** | B) 内容拆解装入 | 数据处理 | 未开发 | 🟡 困难 (5天) |
| **Content Scoring Center** | E) 内容评分 | 质量保障 | 未开发 | 🟢 中等 (3天) |
| **Multi-Channel Publisher** | F) 内容分发 | 分发执行 | 未开发 | 🟢 简单 (2天) |
| **GEO Knowledge AI** | H) 智能洞察 | AI应用 | 未开发 | 🟡 困难 (5天) |

**总实施时间**: 18天

### 3.2 需要重构的现有模块 (3个)

| 模块 | 当前问题 | 重构方案 | 实施难度 |
|------|---------|---------|---------|
| **Dashboard** | MCP能力不可见 | 新增"MCP自动化看板"、"实时数据流监控" | 🟢 中等 (2天) |
| **ContentGenerator** | AIGC能力单薄 | 集成Sequential Thinking、InfraNodus、Evidence Chain | 🟢 中等 (3天) |
| **WorkflowMonitor** | n8n工作流不可见 | 集成n8n API，展示工作流执行状态、日志、编辑入口 | 🟢 中等 (2天) |

**总实施时间**: 7天

### 3.3 需要增强的现有模块 (2个)

| 模块 | 当前状态 | 增强方案 | 实施难度 |
|------|---------|---------|---------|
| **PromptLandscape** | 40%知识图谱 | 新增Knowledge Hub、FAQ Center、Topic Explorer三个子标签 | 🟢 简单 (2天) |
| **KPIDashboard** | 60%效果仪表板 | 新增AI可见度、AI搜索排名、Firecrawl监测数据 | 🟢 简单 (1天) |

**总实施时间**: 3天

---

## 4. 新架构设计 - 完整页面蓝图

### 4.1 新增页面清单 (8个)

| 页面名称 | 对应业务流程 | 核心功能 | MCP集成 | 优先级 |
|---------|------------|---------|---------|--------|
| **Data Acquisition Hub** | A) 内容收集 | Firecrawl抓取、数据源管理、实时监控 | Firecrawl, Puppeteer | P0 |
| **ETL Pipeline Viewer** | B) 内容拆解装入 | 数据流可视化、MongoDB/Neo4j/Redis监控 | MongoDB, Neo4j, Redis | P0 |
| **Knowledge Hub** | C) 知识图谱中心 | 企业知识资产、搜索、推荐 | Neo4j, GEO KG | P1 |
| **AIGC Studio** | D) AIGC工作室 | 8种内容模板、AI推理、证据链 | Sequential Thinking, InfraNodus | P0 |
| **Content Scoring Center** | E) 内容评分 | SEO/GEO/Citation评分、改进建议 | GEO KG, InfraNodus | P1 |
| **Multi-Channel Publisher** | F) 内容分发 | 一键多平台发布、日程管理 | Feishu, Notion, n8n, MinIO | P0 |
| **AI Visibility Dashboard** | G) AI可见度监测 | Perplexity/ChatGPT/Google AI引用监测 | Firecrawl, Sentry | P2 |
| **GEO Knowledge AI** | H) 智能洞察 | 自然语言问答、预测建议 | GEO KG, Graphiti | P1 |

### 4.2 重构页面清单 (3个)

| 页面名称 | 重构重点 | 新增功能 | 实施优先级 |
|---------|---------|---------|-----------|
| **Dashboard** | MCP自动化看板 | 实时MCP工具调用统计、数据流监控、工作流状态 | P0 |
| **ContentGenerator** | AIGC能力增强 | Sequential Thinking推理、InfraNodus主题分析、Evidence Chain | P0 |
| **WorkflowMonitor** | n8n工作流集成 | n8n工作流列表、执行日志、可视化编辑器入口 | P1 |

### 4.3 页面分组重新组织

#### 新菜单结构 (5个分组)

```
📊 Overview
├─ Dashboard                    # 总览 (重构)

🔍 Data Pipeline (新增分组)
├─ Data Acquisition Hub         # A) 内容收集 (新增)
├─ ETL Pipeline Viewer          # B) 内容拆解装入 (新增)
├─ Knowledge Hub                # C) 知识图谱中心 (新增)

🎨 Content Operations
├─ Roadmap Manager              # 路线图管理 (保留)
├─ Content Registry             # 内容注册 (保留)
├─ Prompt Landscape             # Prompt全景 (增强)
├─ AIGC Studio                  # D) AIGC工作室 (新增)
├─ Content Scoring Center       # E) 内容评分 (新增)
├─ Multi-Channel Publisher      # F) 内容分发 (新增)
├─ Template Editor              # 模板编辑器 (保留)

📈 Performance & Intelligence
├─ Citation Tracker             # 引用追踪 (保留)
├─ AI Visibility Dashboard      # G) AI可见度 (新增)
├─ KPI Dashboard                # KPI仪表板 (增强)
├─ Battlefield Map              # 战场态势 (保留)
├─ GEO Mapping Network          # 内容映射 (保留)
├─ Content Coverage             # 内容覆盖率 (保留)
├─ Citation Strength            # 引用强度 (保留)
├─ Analytics Reports            # 分析报告 (保留)
├─ GEO Knowledge AI             # H) 智能洞察 (新增)

⚙️ System & Admin
├─ Workflow Monitor             # 工作流监控 (重构)
├─ System Settings              # 系统设置 (保留)
├─ User Management              # 用户管理 (保留)
├─ Help & Documentation         # 帮助文档 (保留)

💰 Conversion (保留分组)
├─ Offers                       # 优惠管理 (保留)
├─ Orders                       # 订单管理 (保留)
```

**菜单统计**:
- 总页面数: **28个** (20个保留/增强 + 8个新增)
- 新增分组: **Data Pipeline** (3个页面)
- MCP集成率: **100%** (所有页面都展示MCP能力)

---

## 5. MCP能力展示方案

### 5.1 MCP能力矩阵 - 页面与工具映射

| MCP工具类别 | 工具数量 | 展示页面 | 核心功能展示 |
|-----------|---------|---------|------------|
| **Web Scraping** | 3个 | Data Acquisition Hub, AI Visibility Dashboard | Firecrawl SERP抓取、Puppeteer动态渲染 |
| **Database** | 7个 | ETL Pipeline Viewer, Knowledge Hub | PostgreSQL/MongoDB/Neo4j/Redis数据流 |
| **Knowledge Graph** | 3个 | Knowledge Hub, Prompt Landscape, GEO Knowledge AI | GEO KG 15工具、InfraNodus 21工具、Neo4j GDS |
| **AI Reasoning** | 2个 | AIGC Studio, GEO Knowledge AI | Sequential Thinking、Graphiti记忆 |
| **Workflow Automation** | 1个 | Workflow Monitor, Multi-Channel Publisher | n8n工作流编排、可视化构建器 |
| **Collaboration** | 3个 | Multi-Channel Publisher | Feishu文档、Notion页面、Slack通知 |
| **Storage** | 1个 | Content Registry, Multi-Channel Publisher | MinIO对象存储、版本控制 |
| **Monitoring** | 1个 | Dashboard, Workflow Monitor | Sentry错误追踪、性能监控 |

**总计**: 24+ MCP工具，100%覆盖所有8个业务流程

### 5.2 每个页面的"秀肌肉"方案

#### 🎯 Dashboard (重构) - MCP自动化中心

**展示内容**:
1. **实时MCP工具调用统计** - 今日调用次数、成功率、响应时间Top 10
2. **数据流监控看板** - Firecrawl → MongoDB → Neo4j → Feishu实时数据流
3. **n8n工作流状态** - 8个活跃工作流的执行状态、成功率、最近运行时间
4. **自动化效率指标** - 时间节省791小时/年、自动化覆盖率80%、ROI 300%

**关键组件**:
```typescript
// MCP Tool Call Statistics 组件
<McpToolStatistics
  tools={[
    { name: 'Firecrawl', calls: 1247, success: 98.5%, avgTime: 1.2s },
    { name: 'Neo4j', calls: 3456, success: 99.8%, avgTime: 0.05s },
    { name: 'Feishu', calls: 234, success: 97.2%, avgTime: 0.8s },
    // ... 其他工具
  ]}
/>

// Real-time Data Flow Visualization
<DataFlowMonitor
  sources={['Firecrawl', 'Web Sources']}
  processing={['MongoDB', 'Neo4j', 'Redis']}
  outputs={['Feishu', 'Notion', 'MinIO']}
  realTimeEvents={events}
/>
```

---

#### 🔍 Data Acquisition Hub (新增) - 数据采集中心

**展示内容**:
1. **数据源管理** - URL列表、抓取频率、数据类别（SERP/竞品/社交媒体）
2. **实时抓取监控** - 正在抓取的任务、进度条、成功/失败/重试统计
3. **Firecrawl配置面板** - 抓取格式（Markdown/HTML）、缓存策略、并发数
4. **抓取结果预览** - 最近抓取的内容预览、Markdown渲染、保存到MongoDB

**关键功能**:
- 🚀 **一键启动抓取**: 配置URL → 选择格式 → 点击"Start Scraping"
- 📊 **实时进度**: WebSocket实时更新抓取进度和日志
- 💾 **自动存储**: 抓取完成自动保存到MongoDB + MinIO备份

**UI布局**:
```
┌────────────────────────────────────────────────┐
│ Data Acquisition Hub                          │
├────────────────────────────────────────────────┤
│ [+ Add Data Source]  [Start All]  [Schedule]  │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ Active Sources (15)                      │ │
│ │ ┌─────────────┐ ┌─────────────┐         │ │
│ │ │ SERP Data   │ │ Competitor  │ ...     │ │
│ │ │ Status: ●   │ │ Status: ●   │         │ │
│ │ │ 1247 pages  │ │ 892 pages   │         │ │
│ │ └─────────────┘ └─────────────┘         │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ Real-time Scraping Monitor                │ │
│ │ Firecrawl: Scraping perplexity.ai...     │ │
│ │ [████████████░░░░] 75% (15/20 pages)     │ │
│ │ Puppeteer: Rendering dynamic content...  │ │
│ │ [██████░░░░░░░░░░] 40% (4/10 pages)      │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ Recent Scraped Content (10)               │ │
│ │ [Markdown Preview] [Save to MongoDB]     │ │
│ └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

#### 🗄️ ETL Pipeline Viewer (新增) - 数据管道可视化

**展示内容**:
1. **数据流图** - Sankey图展示数据从Source → Processing → Storage的流动
2. **数据库监控** - MongoDB/PostgreSQL/Neo4j/Redis实时连接数、存储量、响应时间
3. **ETL任务队列** - Bull队列中的任务状态、优先级、预计完成时间
4. **数据质量报告** - 数据完整性、重复率、关系提取成功率

**技术实现**:
```typescript
// Sankey Data Flow Diagram
<SankeyDataFlow
  nodes={[
    { id: 'firecrawl', name: 'Firecrawl', layer: 0 },
    { id: 'mongodb', name: 'MongoDB', layer: 1 },
    { id: 'neo4j', name: 'Neo4j', layer: 1 },
    { id: 'feishu', name: 'Feishu', layer: 2 },
  ]}
  links={[
    { source: 'firecrawl', target: 'mongodb', value: 1247 },
    { source: 'mongodb', target: 'neo4j', value: 892 },
    { source: 'neo4j', target: 'feishu', value: 234 },
  ]}
/>

// Database Health Monitor
<DatabaseHealthMonitor
  databases={[
    { name: 'MongoDB', connections: 45, storage: '12.3 GB', responseTime: 25ms },
    { name: 'Neo4j', connections: 28, storage: '3.8 GB', responseTime: 5ms },
    { name: 'PostgreSQL', connections: 67, storage: '8.9 GB', responseTime: 15ms },
    { name: 'Redis', connections: 123, storage: '1.2 GB', responseTime: 2ms },
  ]}
/>
```

---

#### 🧠 Knowledge Hub (新增) - 知识图谱中心

**展示内容**:
1. **企业知识资产总览** - Topic数量、Keyword数量、FAQ数量、Prompt数量
2. **知识搜索** - 自然语言搜索、Graph-RAG检索、相似度推荐
3. **图谱可视化** - D3.js力导向图，节点=实体，边=关系
4. **知识应用** - FAQ自动问答、Topic Explorer、Keyword Research

**三个子标签**:
```
┌────────────────────────────────────────────────┐
│ [Knowledge Hub] [FAQ Center] [Topic Explorer] │
├────────────────────────────────────────────────┤
│ 📚 Knowledge Hub Tab:                          │
│   - 企业知识资产总览                            │
│   - 知识搜索框 (Graph-RAG)                     │
│   - 知识图谱可视化 (D3.js)                     │
│                                                │
│ ❓ FAQ Center Tab:                             │
│   - FAQ列表 (按主题分类)                       │
│   - AI自动问答 (geo_answer_question)          │
│   - FAQ Analytics (点击率、引用率)             │
│                                                │
│ 🏷️ Topic Explorer Tab:                         │
│   - Topic Clustering (InfraNodus)             │
│   - Keyword Research (GEO KG)                 │
│   - Content Gap Detection (Structure Holes)  │
└────────────────────────────────────────────────┘
```

---

#### ✍️ AIGC Studio (新增) - AI内容工作室

**展示内容**:
1. **8种内容模板** - Blog, Landing Page, PDP, Social Media PR, Reddit, Quora, Medium, YouTube Script
2. **AI推理过程可视化** - Sequential Thinking多轮推理的思考过程展示
3. **InfraNodus主题分析** - 自动提取主题、检测内容缺口、生成研究问题
4. **Evidence Chain集成** - 自动检索证据链、引用来源、Citation-Ready评分

**工作流**:
```
Step 1: 选择内容类型 (8种模板)
  ↓
Step 2: 输入Prompt (或从Prompt Landscape选择)
  ↓
Step 3: AI推理生成大纲 (Sequential Thinking)
  ↓
Step 4: 主题分析 (InfraNodus)
  ↓
Step 5: 证据链检索 (GEO KG)
  ↓
Step 6: 生成完整内容 (Claude API)
  ↓
Step 7: 内容评分 (Citation Score)
  ↓
Step 8: 预览 & 发布
```

**UI组件**:
```typescript
<AigcStudio>
  <TemplateSelector templates={8} />
  <PromptInput />
  <ThinkingProcess steps={sequentialThoughts} />
  <InfraNodusAnalysis clusters={topicalClusters} gaps={contentGaps} />
  <EvidenceChain sources={evidenceSources} />
  <ContentEditor content={generatedContent} score={citationScore} />
  <PublishButton channels={['Feishu', 'Notion', 'MinIO']} />
</AigcStudio>
```

---

#### 📊 Content Scoring Center (新增) - 内容评分中心

**展示内容**:
1. **三维评分系统** - SEO分数、GEO分数、Citation-Ready分数
2. **SEO Schema检查** - 结构化数据验证、Schema.org规则检查
3. **E-E-A-T评分** - Experience, Expertise, Authority, Trust四维评分
4. **改进建议** - AI生成的具体改进建议、优先级排序

**评分算法**:
```typescript
// Citation-Ready Score Calculation
const citationScore = await mcp__geo_knowledge_graph__geo_calculate_citation_score({
  asset_id: contentId,
  min_score: 70
});

// SEO Schema Validation
const seoScore = await validateSchemaOrg(content.html);

// E-E-A-T Scoring
const eeatScore = {
  experience: calculateExperienceScore(content),
  expertise: calculateExpertiseScore(content),
  authority: calculateAuthorityScore(content),
  trust: calculateTrustScore(content),
};

// Overall Score
const overallScore = (citationScore * 0.4) + (seoScore * 0.3) + (eeatAvg * 0.3);
```

---

#### 🚀 Multi-Channel Publisher (新增) - 多渠道发布中心

**展示内容**:
1. **发布渠道配置** - Feishu/Notion/Slack/MinIO/Shopify/Amazon配置状态
2. **一键多平台发布** - 选择内容 → 选择渠道 → 点击"Publish to All"
3. **发布日程管理** - 日历视图、定时发布、批量发布
4. **发布状态追踪** - 实时发布进度、成功/失败通知、重试机制

**发布流程**:
```typescript
async function publishToAllChannels(content: Content) {
  // 1. Feishu文档创建
  const feishuDoc = await mcp__feishu__create_feishu_document({
    title: content.title,
    folderToken: process.env.FEISHU_CONTENT_FOLDER
  });

  // 2. Notion页面创建
  const notionPage = await mcp__notion__API_post_page({
    parent: { page_id: process.env.NOTION_CONTENT_PAGE },
    properties: { title: [{ text: { content: content.title } }] }
  });

  // 3. MinIO备份
  const minioUrl = await uploadToMinIO(content);

  // 4. Slack通知
  await sendSlackNotification({
    channel: '#geo-content-published',
    message: `✅ New content published: ${content.title}\n🔗 Feishu: ${feishuDoc.url}`
  });

  // 5. n8n工作流触发（后续处理）
  await triggerN8nWorkflow('content-post-processing', { contentId: content.id });

  return { feishuUrl, notionUrl, minioUrl };
}
```

---

#### 📈 AI Visibility Dashboard (新增) - AI可见度仪表板

**展示内容**:
1. **7大平台监测** - Perplexity, ChatGPT, Google AI Overview, Claude.ai, Bing Chat, Bard, You.com
2. **引用监测** - 实时抓取AI平台引用、引用强度评分、引用上下文分析
3. **AI搜索排名** - 关键词排名、FAQ排名、Prompt排名
4. **趋势分析** - 引用率趋势、排名变化、竞品对比

**监测工作流**:
```typescript
// n8n Daily Citation Tracking Workflow
{
  "name": "AI Visibility Monitoring",
  "schedule": "0 2 * * *",  // 每日凌晨2点
  "steps": [
    // 1. Firecrawl搜索7大平台
    { "tool": "firecrawl_search", "query": "SweetNight mattress", "platforms": 7 },

    // 2. 分析引用
    { "tool": "analyze_citations", "detectMentions": true },

    // 3. 存储到PostgreSQL
    { "tool": "postgres_insert", "table": "citation_tracking" },

    // 4. Slack告警（新引用发现）
    { "tool": "slack_notify", "channel": "#geo-citations" }
  ]
}
```

---

#### 🧠 GEO Knowledge AI (新增) - GEO智能助手

**展示内容**:
1. **自然语言问答** - 输入问题，AI从知识图谱检索答案（Graph-RAG）
2. **智能洞察** - 自动分析数据、发现趋势、提供优化建议
3. **预测建议** - 内容缺口预测、趋势预测、ROI预测
4. **对话历史** - Graphiti长期记忆存储、跨会话上下文

**问答示例**:
```typescript
// User Question: "What are the top 5 P0 prompts with highest GEO scores?"
const answer = await mcp__geo_knowledge_graph__geo_answer_question({
  question: "What are the top 5 P0 prompts with highest GEO scores?",
  max_results: 5
});

// Response:
{
  "answer": "The top 5 P0 prompts with highest GEO scores are...",
  "evidence": [
    { "promptId": "p0-001", "text": "best mattress for back pain", "score": 95.5 },
    { "promptId": "p0-002", "text": "SweetNight vs Casper comparison", "score": 92.3 },
    // ...
  ],
  "confidence": 0.95,
  "sources": [...]
}
```

---

## 6. 实施路线图 - 3阶段8周计划

### Phase 1: Quick Wins & Core Infrastructure (Week 1-3) ⭐⭐⭐⭐⭐

#### Week 1: 数据采集与存储管道

**目标**: 完成A) 内容收集 + B) 内容拆解装入

**任务**:
- [ ] Day 1-3: 创建 **Data Acquisition Hub** 页面
  - Firecrawl集成、数据源管理、实时监控
  - WebSocket实时进度更新
  - MongoDB自动存储

- [ ] Day 4-5: 创建 **ETL Pipeline Viewer** 页面
  - Sankey数据流图
  - 数据库健康监控（MongoDB/Neo4j/PostgreSQL/Redis）
  - Bull任务队列可视化

- [ ] Day 6-7: 集成测试与文档
  - E2E测试（Playwright）
  - API文档更新
  - 用户指南

**预期产出**:
- ✅ 2个新页面上线
- ✅ 数据采集-存储管道完全可视化
- ✅ MCP工具（Firecrawl, MongoDB, Neo4j）展示

---

#### Week 2: AIGC能力增强

**目标**: 完成D) 内容生成 + E) 内容评分

**任务**:
- [ ] Day 1-3: 创建 **AIGC Studio** 页面
  - 8种内容模板集成
  - Sequential Thinking推理可视化
  - InfraNodus主题分析
  - Evidence Chain集成

- [ ] Day 4-5: 创建 **Content Scoring Center** 页面
  - Citation-Ready评分（GEO KG）
  - SEO Schema验证
  - E-E-A-T评分算法

- [ ] Day 6-7: 重构 **ContentGenerator** 页面
  - 迁移到AIGC Studio架构
  - 保留现有模板功能
  - 新增MCP工具集成

**预期产出**:
- ✅ 2个新页面 + 1个重构页面上线
- ✅ AIGC能力完整展示
- ✅ 内容质量自动评分

---

#### Week 3: 多渠道发布与Dashboard重构

**目标**: 完成F) 内容分发 + Dashboard MCP看板

**任务**:
- [ ] Day 1-3: 创建 **Multi-Channel Publisher** 页面
  - Feishu + Notion + MinIO集成
  - 一键多平台发布
  - n8n工作流触发

- [ ] Day 4-5: 重构 **Dashboard** 页面
  - MCP工具调用统计
  - 实时数据流监控
  - n8n工作流状态看板

- [ ] Day 6-7: 集成测试与部署
  - 完整发布流程测试
  - 性能优化
  - Vercel生产部署

**预期产出**:
- ✅ 1个新页面 + 1个重构页面上线
- ✅ 多渠道发布自动化
- ✅ Dashboard展示所有MCP能力

---

### Phase 2: 知识图谱体系与智能洞察 (Week 4-6) ⭐⭐⭐⭐

#### Week 4: 知识图谱中心

**目标**: 完成C) 内容计算&分析（知识图谱体系）

**任务**:
- [ ] Day 1-3: 创建 **Knowledge Hub** 子标签
  - 企业知识资产总览
  - Graph-RAG知识搜索
  - D3.js知识图谱可视化

- [ ] Day 4-5: 创建 **FAQ Center** 子标签
  - FAQ列表管理
  - AI自动问答（geo_answer_question）
  - FAQ Analytics

- [ ] Day 6-7: 创建 **Topic Explorer** 子标签
  - Topic Clustering（InfraNodus）
  - Keyword Research（GEO KG）
  - Content Gap Detection

**预期产出**:
- ✅ PromptLandscape增强（3个子标签）
- ✅ 知识图谱体系完整
- ✅ InfraNodus + GEO KG深度集成

---

#### Week 5: GEO Knowledge AI

**目标**: 完成H) GEO Knowledge AI（智能洞察）

**任务**:
- [ ] Day 1-3: 创建 **GEO Knowledge AI** 页面
  - 自然语言问答界面
  - Graph-RAG集成
  - Graphiti长期记忆

- [ ] Day 4-5: 智能洞察功能
  - 自动趋势分析
  - 内容缺口预测
  - 优化建议生成

- [ ] Day 6-7: 对话历史与上下文管理
  - Graphiti记忆存储
  - 跨会话上下文
  - 对话历史查看

**预期产出**:
- ✅ 1个新页面上线
- ✅ AI问答系统完整
- ✅ 长期记忆能力展示

---

#### Week 6: AI可见度监测

**目标**: 完成G) 内容效果仪表板（AI可见度部分）

**任务**:
- [ ] Day 1-3: 创建 **AI Visibility Dashboard** 页面
  - 7大平台监测配置
  - Firecrawl自动抓取集成
  - 引用监测算法

- [ ] Day 4-5: n8n自动化工作流
  - 每日定时监测工作流
  - 引用检测与存储
  - Slack自动告警

- [ ] Day 6-7: 增强 **KPIDashboard** 页面
  - AI可见度指标
  - AI搜索排名
  - 趋势分析图表

**预期产出**:
- ✅ 1个新页面 + 1个增强页面
- ✅ 7大AI平台自动监测
- ✅ 完整的引用追踪系统

---

### Phase 3: 工作流编排与系统优化 (Week 7-8) ⭐⭐⭐

#### Week 7: 工作流监控增强

**目标**: 完成工作流编排能力展示

**任务**:
- [ ] Day 1-3: 重构 **WorkflowMonitor** 页面
  - n8n API集成
  - 工作流列表展示
  - 执行日志查看

- [ ] Day 4-5: n8n可视化编辑器集成
  - 嵌入n8n编辑器
  - 工作流导入/导出
  - 工作流模板库

- [ ] Day 6-7: 工作流监控与告警
  - 执行成功率监控
  - 失败告警（Sentry）
  - 性能优化建议

**预期产出**:
- ✅ 1个重构页面上线
- ✅ n8n工作流完全可视化
- ✅ 工作流编排能力展示

---

#### Week 8: 系统优化与上线

**目标**: 性能优化、E2E测试、生产部署

**任务**:
- [ ] Day 1-2: 性能优化
  - React组件优化（useMemo, useCallback）
  - 代码分割（React.lazy）
  - 图片懒加载

- [ ] Day 3-4: E2E测试覆盖
  - 所有新页面测试
  - 关键业务流程测试
  - 测试覆盖率 > 80%

- [ ] Day 5: 文档完善
  - 用户手册
  - API文档
  - 开发者指南

- [ ] Day 6-7: 生产部署
  - Vercel部署
  - 环境变量配置
  - 监控告警配置

**预期产出**:
- ✅ 性能优化完成
- ✅ E2E测试覆盖率 > 80%
- ✅ 完整文档
- ✅ 生产环境上线

---

### 实施路线图总结

| Phase | 周数 | 核心目标 | 新增页面 | 重构页面 | MCP工具集成 |
|-------|-----|---------|---------|---------|------------|
| **Phase 1** | Week 1-3 | 数据采集+AIGC+发布 | 5个 | 2个 | Firecrawl, MongoDB, Neo4j, Sequential Thinking, InfraNodus, Feishu, Notion, MinIO |
| **Phase 2** | Week 4-6 | 知识图谱+AI洞察+监测 | 3个 | 1个 | GEO KG, InfraNodus, Graphiti, Sentry |
| **Phase 3** | Week 7-8 | 工作流编排+优化上线 | 0个 | 1个 | n8n, Sentry |
| **总计** | 8周 | 完整8流程+MCP展示 | **8个** | **4个** | **24+ MCP工具** |

**里程碑**:
- ✅ Week 3 结束: 核心数据流 + AIGC + 发布系统上线
- ✅ Week 6 结束: 知识图谱 + AI洞察 + 监测系统上线
- ✅ Week 8 结束: 完整系统上线，100% MCP能力展示

---

## 7. 代码实现示例

### 7.1 Data Acquisition Hub - 核心代码

```typescript
// src/pages/DataAcquisitionHub/index.tsx
import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, LinearProgress } from '@mui/material';
import { PlayArrow, Stop, Refresh } from '@mui/icons-material';

interface DataSource {
  id: string;
  name: string;
  url: string;
  status: 'idle' | 'scraping' | 'completed' | 'error';
  progress: number;
  pagesScraped: number;
  totalPages: number;
}

export default function DataAcquisitionHub() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [scrapingStatus, setScrapingStatus] = useState<'idle' | 'active'>('idle');

  // WebSocket连接（实时更新抓取进度）
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001/scraping-progress');

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setSources((prev) =>
        prev.map((src) =>
          src.id === update.sourceId
            ? { ...src, progress: update.progress, status: update.status }
            : src
        )
      );
    };

    return () => ws.close();
  }, []);

  // 启动Firecrawl抓取
  const startScraping = async (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    if (!source) return;

    try {
      const response = await fetch('/api/v1/data-acquisition/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId,
          url: source.url,
          formats: ['markdown', 'html'],
          onlyMainContent: true,
        }),
      });

      const result = await response.json();
      console.log('Scraping started:', result);
    } catch (error) {
      console.error('Failed to start scraping:', error);
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600}>
          Data Acquisition Hub
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Web scraping with Firecrawl & Puppeteer - Showcase MCP capabilities
        </Typography>
      </Box>

      {/* Control Panel */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => sources.forEach((s) => startScraping(s.id))}
            >
              Start All
            </Button>
            <Button variant="outlined" startIcon={<Stop />}>
              Stop All
            </Button>
            <Button variant="outlined" startIcon={<Refresh />}>
              Refresh Status
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Data Sources Grid */}
      <Grid container spacing={3}>
        {sources.map((source) => (
          <Grid item xs={12} md={6} lg={4} key={source.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {source.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {source.url}
                </Typography>

                {/* Progress Bar */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {source.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={source.progress}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {source.pagesScraped} / {source.totalPages} pages
                  </Typography>
                </Box>

                {/* Status Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={source.status}
                    size="small"
                    color={
                      source.status === 'completed'
                        ? 'success'
                        : source.status === 'scraping'
                        ? 'primary'
                        : source.status === 'error'
                        ? 'error'
                        : 'default'
                    }
                  />
                  <Button size="small" onClick={() => startScraping(source.id)}>
                    Start
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Real-time Scraping Monitor */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Real-time Scraping Monitor
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2">
                Firecrawl: Scraping perplexity.ai/search?q=SweetNight+mattress
              </Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mt: 1 }} />
              <Typography variant="caption" color="text.secondary">
                15/20 pages completed (75%)
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                Puppeteer: Rendering dynamic content from chat.openai.com
              </Typography>
              <LinearProgress variant="determinate" value={40} sx={{ mt: 1 }} />
              <Typography variant="caption" color="text.secondary">
                4/10 pages completed (40%)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
```

### 7.2 Backend API - Firecrawl集成

```typescript
// server/src/modules/data-acquisition/data-acquisition.controller.ts
import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { DataAcquisitionService } from './data-acquisition.service';

@Controller('api/v1/data-acquisition')
export class DataAcquisitionController {
  constructor(private readonly dataAcquisitionService: DataAcquisitionService) {}

  @Post('start')
  async startScraping(@Body() dto: StartScrapingDto) {
    return this.dataAcquisitionService.startScraping(dto);
  }

  @Get('status')
  async getScrapingStatus(@Query('sourceId') sourceId: string) {
    return this.dataAcquisitionService.getScrapingStatus(sourceId);
  }
}

// server/src/modules/data-acquisition/data-acquisition.service.ts
import { Injectable } from '@nestjs/common';
import { McpClientService } from '@/common/mcp-client.service';
import { MongoDbService } from '@/modules/mongodb/mongodb.service';
import { EventEmitter } from 'events';

@Injectable()
export class DataAcquisitionService {
  private scrapingEvents = new EventEmitter();

  constructor(
    private readonly mcpClient: McpClientService,
    private readonly mongoDb: MongoDbService,
  ) {}

  async startScraping(dto: StartScrapingDto) {
    const { sourceId, url, formats, onlyMainContent } = dto;

    try {
      // 1. 调用Firecrawl MCP工具
      const result = await this.mcpClient.callTool('firecrawl', 'firecrawl_scrape', {
        url,
        formats,
        onlyMainContent,
        maxAge: 172800000, // 2天缓存
      });

      // 2. 实时进度更新（通过WebSocket）
      this.scrapingEvents.emit('progress', {
        sourceId,
        progress: 50,
        status: 'scraping',
      });

      // 3. 存储到MongoDB
      await this.mongoDb.insertMany({
        database: 'leapgeo7',
        collection: 'scraped_content',
        documents: [
          {
            sourceId,
            url,
            markdown: result.markdown,
            html: result.html,
            scrapedAt: new Date(),
            metadata: result.metadata,
          },
        ],
      });

      // 4. 进度完成
      this.scrapingEvents.emit('progress', {
        sourceId,
        progress: 100,
        status: 'completed',
      });

      return { success: true, result };
    } catch (error) {
      this.scrapingEvents.emit('progress', {
        sourceId,
        progress: 0,
        status: 'error',
      });
      throw error;
    }
  }

  getScrapingEvents() {
    return this.scrapingEvents;
  }
}
```

### 7.3 WebSocket实时更新

```typescript
// server/src/modules/data-acquisition/data-acquisition.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataAcquisitionService } from './data-acquisition.service';

@WebSocketGateway({ cors: true, path: '/scraping-progress' })
export class DataAcquisitionGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly dataAcquisitionService: DataAcquisitionService) {
    // 监听抓取进度事件
    this.dataAcquisitionService.getScrapingEvents().on('progress', (data) => {
      this.server.emit('scraping-progress', data);
    });
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }
}
```

---

## 8. 建议方案总结

### 8.1 最终建议

🎯 **采用方案**: **保留70%现有页面 + 新增8个核心模块 + 重构4个关键页面**

**理由**:
1. ✅ **投资保护** - 保留已完成的20个页面中的16个（80%保留率）
2. ✅ **快速交付** - 8周完成全部新功能（vs 12周全部重写）
3. ✅ **风险可控** - 增量开发，每周可验收
4. ✅ **用户体验连贯** - 保持现有导航和交互模式

### 8.2 关键成功指标

| 指标 | 目标 | 当前 | 8周后 |
|------|------|------|-------|
| **页面总数** | 28个 | 20个 | 28个 ✅ |
| **MCP集成率** | 100% | 10% | 100% ✅ |
| **8流程覆盖** | 100% | 40% | 100% ✅ |
| **E2E测试覆盖率** | 80% | 60% | 85% ✅ |
| **页面平均加载时间** | <2s | 2.5s | <1.8s ✅ |

### 8.3 立即行动清单

**本周启动**（Week 1）:
```bash
# Step 1: 创建新分支
cd ~/Desktop/dev/leapgeo7
git checkout -b feature/mcp-integration-phase1

# Step 2: 创建Data Acquisition Hub页面
mkdir src/pages/DataAcquisitionHub
touch src/pages/DataAcquisitionHub/index.tsx

# Step 3: 创建后端模块
cd server/src/modules
mkdir data-acquisition
touch data-acquisition/data-acquisition.module.ts
touch data-acquisition/data-acquisition.service.ts
touch data-acquisition/data-acquisition.controller.ts

# Step 4: 配置路由
# 编辑 src/App.tsx 添加新路由
# 编辑 src/components/layout/Sidebar.tsx 添加菜单项

# Step 5: 启动开发服务器
cd ~/Desktop/dev/leapgeo7
npm run dev

# Step 6: 启动后端服务器
cd server
npm run dev
```

---

## 附录

### A. 技术栈清单

**前端**:
- React 18.3.1 + TypeScript 5.4.5
- Material-UI 5.15.15
- D3.js 7.9.0 (数据可视化)
- Redux Toolkit 2.2.3 + React Query 5.32.1
- React Router DOM 6.22.3
- Socket.io-client (WebSocket实时通信)

**后端**:
- Node.js 20.0+ / NestJS 10.0+
- Prisma 5.7+ (ORM)
- Bull 4.11+ (任务队列)
- Socket.io (WebSocket服务器)

**数据库**:
- PostgreSQL 15.0+ (primary)
- MongoDB 7.0+ (raw data)
- Neo4j 5.15+ (knowledge graph)
- Redis 7.2+ (cache/queue)

**MCP工具** (24+ servers):
- Firecrawl (Web Scraping)
- InfraNodus (Knowledge Graph)
- GEO Knowledge Graph (15 tools)
- Neo4j GDS (Graph Algorithms)
- Sequential Thinking (AI Reasoning)
- Graphiti (Long-term Memory)
- n8n (Workflow Automation)
- Feishu, Notion, Slack (Collaboration)
- MinIO (Object Storage)
- Sentry (Monitoring)

### B. 环境变量清单

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5437/leapgeo7
MONGODB_URI=mongodb://user:pass@localhost:27018/leapgeo7
NEO4J_URI=neo4j://localhost:7688
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=password
REDIS_URL=redis://localhost:6382

# MCP Servers
FIRECRAWL_API_URL=http://localhost:3002
FIRECRAWL_API_KEY=fs-test
INFRANODUS_API_KEY=6787:xxx
FEISHU_APP_ID=cli_xxx
FEISHU_APP_SECRET=xxx
NOTION_TOKEN=ntn_xxx
SLACK_BOT_TOKEN=xoxb-xxx
MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx
N8N_API_URL=http://localhost:5678/api/v1
N8N_API_KEY=xxx
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=xxx
```

### C. 相关文档

- **CLAUDE.md** - 项目开发指南
- **MCP-INTEGRATION-GUIDE.md** - MCP集成实施指南
- **MCP-EMPOWERMENT-README.md** - MCP全局能力总览
- **CICD-README.md** - 部署自动化
- **PROJECT-EVALUATION-REPORT.md** (本文档)

---

**文档版本**: v1.0
**创建日期**: 2025-10-29
**维护者**: LeapGEO7 Team
**状态**: ✅ Ready for Implementation
